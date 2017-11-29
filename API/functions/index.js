// BEGIN: Global Variables------------------------------------------------------
const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
firebase.initializeApp({
    apiKey: functions.config().sdk.apikey,
    authDomain: functions.config().sdk.authdomain,
    databaseURL: functions.config().sdk.databaseurl,
    projectId: functions.config().sdk.projectid,
    storageBucket: functions.config().sdk.storagebucket,
    messagingSenderId: functions.config().sdk.messagesenderid
});
const ref = admin.database().ref();

const cors = require('cors')({origin: true});
const archiver = require('archiver');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: functions.config().nodemailer.email,
        clientId: functions.config().nodemailer.clientid,
        clientSecret: functions.config().nodemailer.clientsecret,
        refreshToken: functions.config().nodemailer.refreshtoken
    }
});

const weekday = new Array(7);
weekday[0] = 'sunday';
weekday[1] = 'monday';
weekday[2] = 'tuesday';
weekday[3] = 'wednesday';
weekday[4] = 'thursday';
weekday[5] = 'friday';
weekday[6] = 'saturday';
// END: Global Variables--------------------------------------------------------

// BEGIN: Global Functions------------------------------------------------------
function getTime(date) {
    var retVal = {
        "yearMonth": null,
        "weekday": null,
        "datestamp": null,
        "weekstamps": null,
        "formattedDate": null,
        "year": null,
        "weekLater": null,
        "weekInterval": null
    }

    if(date) {
        var day = new Date(parseInt(date.substring(0,4)), parseInt(date.substring(4,6))-1, parseInt(date.substring(6,8)));
        var time = moment(day);
    } else {
        var time = moment().tz("America/New_York");
    }

    retVal.yearMonth = time.format("YYYYMM");
    retVal.weekday = time.format("dddd").toLowerCase();
    retVal.datestamp = time.format("YYYYMMDD");
    retVal.formattedDate = time.format("MM/DD/YYYY");
    retVal.year = time.format("YYYY");

    var weekstamps = [];
    var offset = parseInt(time.format("e"));
    time.subtract(offset, 'days');
    var weekstamp = time.format("YYYYMMDD");
    weekstamps.push(weekstamp);

    for(var i = 0; i < 6; i++) {
        time.add(1, 'days');
        weekstamp = time.format("YYYYMMDD");
        weekstamps.push(weekstamp);
    }

    retVal.weekstamps = weekstamps;

    time.add(1, 'days');
    retVal.weekLater = time.format("YYYYMMDD");

    retVal.weekInterval = `${weekstamps[0]}-${weekstamps[6]}`;

    return retVal;
}

function getMonthDays() {
    var time = moment().tz("America/New_York");

    var monthDays = [];

    monthDays.push(time.format("MMM D, YYYY"));

    for(var i = 0; i < 29; i++) {
        time.add(1, 'days');
        monthDays.push(time.format("MMM D, YYYY"));
    }

    return monthDays;
}

function getAllReports(year, callback) {
    ref.child('/').once('value', function(snap) {
        var root = snap.val();
        var intervals = root.forms.intervals;
        var results = root.forms.results;
        var templates = root.forms.templates;
        var inventory = root.inventory;
        var users = root.users;
        var forms = Object.keys(intervals);
        var time = getTime(`${year}0101`);

        var retVal = {
            "reports": []
        };

        for(var h = 0; h < 54; h++) {
            for(var i = 0; i < Object.keys(inventory).length; i++) {
                var itemType = Object.keys(inventory)[i];
                for(var j = 0; j < Object.keys(inventory[itemType]).length; j++) {
                    var itemKey = Object.keys(inventory[itemType])[j];
                    if(inventory[itemType][itemKey].compartments) {
                        var compartments = inventory[itemType][itemKey].compartments;
                        var name = inventory[itemType][itemKey].name;
                        var schedule;
                        var status = "Complete";
                        var completedTimestamp = null;
                        var id = itemKey;
                        var days = {
                            sunday: false,
                            monday: false,
                            tuesday: false,
                            wednesday: false,
                            thursday: false,
                            friday: false,
                            saturday: false
                        };
                        var data = {
                            "rows": []
                        };
                        var offset = 0;

                        for(var k = 0; k < Object.keys(compartments).length; k++) {
                            var formId = compartments[Object.keys(compartments)[k]].formId;
                            var frequency = intervals[formId].frequency;
                            var itemCount = templates[formId].inputElements.length;
                            schedule = frequency;

                            for(var m = 0; m < templates[formId].inputElements.length; m++) {
                                data.rows.push({
                                    "compartment": templates[formId].title,
                                    "item": templates[formId].inputElements[m].caption
                                });
                            }

                            if(results && results[formId]) {
                                var timestamps = Object.keys(results[formId]);

                                if(frequency == "Daily") {
                                    for(var m = 0; m < time.weekstamps.length; m++) {
                                        if(!timestamps.includes(time.weekstamps[m])) {
                                            status = "Incomplete";
                                        } else {
                                            days[weekday[m]] = true;
                                            for(var n = 0; n < results[formId][time.weekstamps[m]].results.length; n++) {
                                                var result = results[formId][time.weekstamps[m]].results[n].result;
                                                if(result == "Repairs Needed") {
                                                    data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
												} else if(result == "Missing" && results[formId][time.weekstamps[m]].results[n].note) {
													data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                } else {
                                                    data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                }
                                            }
                                        }
                                    }
                                } else if(frequency == "Weekly") {
                                    var complete = false;
                                    for(var m = 0; m < time.weekstamps.length; m++) {
                                        if(timestamps.includes(time.weekstamps[m])) {
                                            days[weekday[m]] = true;
                                            complete = true;
                                            for(var n = 0; n < results[formId][time.weekstamps[m]].results.length; n++) {
                                                var result = results[formId][time.weekstamps[m]].results[n].result;
                                                if(result == "Repairs Needed") {
                                                    data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
												} else if(result == "Missing" && results[formId][time.weekstamps[m]].results[n].note) {
													data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                } else {
                                                    data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                }
                                            }
                                        }
                                    }

                                    if(!complete) {
                                        status = "Incomplete";
                                    }
                                } else if(frequency == "Monthly") {
                                    for(var m = 0; m < time.weekstamps.length; m++) {
                                        if(!timestamps.includes(time.weekstamps[m])) {
                                            var complete = false;
                                            for(var n = 0; n < timestamps.length; n++) {
                                                if(timestamps[n].substring(0,6) == time.yearMonth) {
                                                    complete = true;
                                                    completedTimestamp = timestamps[n];
                                                    for(var o = 0; o < results[formId][completedTimestamp].results.length; o++) {
                                                        var result = results[formId][completedTimestamp].results[o].result;
                                                        if(result == "Repairs Needed") {
                                                            data.rows[offset+o][weekday[m]] = {
                                                                result: result,
                                                                note: results[formId][completedTimestamp].results[o].note,
                                                                completedBy: results[formId][completedTimestamp].completedBy
                                                            };
														} else if(result == "Missing" && results[formId][completedTimestamp].results[o].note) {
															data.rows[offset+o][weekday[m]] = {
                                                                result: result,
                                                                note: results[formId][completedTimestamp].results[o].note,
                                                                completedBy: results[formId][completedTimestamp].completedBy
                                                            };
                                                        } else {
                                                            data.rows[offset+o][weekday[m]] = {
                                                                result: result,
                                                                completedBy: results[formId][completedTimestamp].completedBy
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            if(!complete) {
                                                status = "Incomplete";
                                            }
                                        } else {
                                            days[weekday[m]] = true;
                                            for(var n = 0; n < results[formId][time.weekstamps[m]].results.length; n++) {
                                                var result = results[formId][time.weekstamps[m]].results[n].result;
                                                if(result == "Repairs Needed") {
                                                    data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
												} else if(result == "Missing" && results[formId][time.weekstamps[m]].results[n].note) {
													data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                } else {
                                                    data.rows[offset+n][weekday[m]] = {
                                                        result: result,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                status = "Incomplete";
                            }

                            offset += itemCount;
                        }

                        if(completedTimestamp) {
                            const completeTime = getTime(completedTimestamp);
                            days[completeTime.weekday] = true;
                        }

                        retVal.reports.push({
                            "name": name,
                            "schedule": schedule,
                            "status": status,
                            "id": id,
                            "days": days,
                            "data": data,
                            "folder": time.weekInterval
                        });

                    } else {
                        var formId = inventory[itemType][itemKey].formId;
                        var frequency = intervals[formId].frequency;

                        var name = templates[formId].title;
                        var schedule = frequency;
                        var status = "Complete";
                        var completedTimestamp = null;
                        var id = formId;
                        var days = {
                            sunday: false,
                            monday: false,
                            tuesday: false,
                            wednesday: false,
                            thursday: false,
                            friday: false,
                            saturday: false
                        };
                        var data = {
                            "rows": []
                        };

                        if(templates[formId].inputElements) {
                            for(var m = 0; m < templates[formId].inputElements.length; m++) {
                                data.rows.push({
                                    "compartment": "Main",
                                    "item": templates[formId].inputElements[m].caption
                                });
                            }

                            if(results && results[formId]) {
                                var timestamps = Object.keys(results[formId]);

                                if(frequency == "Daily") {
                                    for(var m = 0; m < time.weekstamps.length; m++) {
                                        if(!timestamps.includes(time.weekstamps[m])) {
                                            status = "Incomplete";
                                        } else {
                                            days[weekday[m]] = true;
                                            for(var n = 0; n < results[formId][time.weekstamps[m]].results.length; n++) {
                                                var result = results[formId][time.weekstamps[m]].results[n].result;
                                                if(result == "Repairs Needed") {
                                                    data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
												} else if(result == "Missing" && results[formId][time.weekstamps[m]].results[n].note) {
													data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                } else {
                                                    data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                }
                                            }
                                        }
                                    }
                                } else if(frequency == "Weekly") {
                                    var complete = false;
                                    for(var m = 0; m < time.weekstamps.length; m++) {
                                        if(timestamps.includes(time.weekstamps[m])) {
                                            days[weekday[m]] = true;
                                            complete = true;
                                            for(var n = 0; n < results[formId][time.weekstamps[m]].results.length; n++) {
                                                var result = results[formId][time.weekstamps[m]].results[n].result;
                                                if(result == "Repairs Needed") {
                                                    data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
												} else if(results == "Missing" && results[formId][time.weekstamps[m]].results[n].note) {
													data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                } else {
                                                    data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                }
                                            }
                                        }
                                    }

                                    if(!complete) {
                                        status = "Incomplete";
                                    }
                                } else if(frequency == "Monthly") {
                                    for(var m = 0; m < time.weekstamps.length; m++) {
                                        if(!timestamps.includes(time.weekstamps[m])) {
                                            var complete = false;
                                            for(var n = 0; n < timestamps.length; n++) {
                                                if(timestamps[n].substring(0,6) == time.yearMonth) {
                                                    complete = true;
                                                    completedTimestamp = timestamps[n];
                                                    for(var o = 0; o < results[formId][completedTimestamp].results.length; o++) {
                                                        var result = results[formId][completedTimestamp].results[o].result;
                                                        if(result == "Repairs Needed") {
                                                            data.rows[o][weekday[m]] = {
                                                                result: result,
                                                                note: results[formId][completedTimestamp].results[o].note,
                                                                completedBy: results[formId][completedTimestamp].completedBy
                                                            };
														} else if(result == "Missing" && results[formId][completedTimestamp].results[o].note) {
															data.rows[o][weekday[m]] = {
                                                                result: result,
                                                                note: results[formId][completedTimestamp].results[o].note,
                                                                completedBy: results[formId][completedTimestamp].completedBy
                                                            };
                                                        } else {
                                                            data.rows[o][weekday[m]] = {
                                                                result: result,
                                                                completedBy: results[formId][completedTimestamp].completedBy
                                                            };
                                                        }
                                                    }
                                                }
                                            }

                                            if(!complete) {
                                                status = "Incomplete";
                                            }
                                        } else {
                                            days[weekday[m]] = true;
                                            for(var n = 0; n < results[formId][time.weekstamps[m]].results.length; n++) {
                                                var result = results[formId][time.weekstamps[m]].results[n].result;
                                                if(result == "Repairs Needed") {
                                                    data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
												} else if(result == "Missing" && results[formId][time.weekstamps[m]].results[n].note) {
													data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        note: results[formId][time.weekstamps[m]].results[n].note,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                } else {
                                                    data.rows[n][weekday[m]] = {
                                                        result: result,
                                                        completedBy: results[formId][time.weekstamps[m]].completedBy
                                                    };
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                status = "Incomplete";
                            }
                        } else {
                            var offset = 0;
                            for(var m = 0; m < templates[formId].subSections.length; m++) {
                                var itemCount = templates[formId].subSections[m].inputElements.length;
                                for(var n = 0; n < templates[formId].subSections[m].inputElements.length; n++) {
                                    data.rows.push({
                                        "compartment": templates[formId].subSections[m].title,
                                        "item": templates[formId].subSections[m].inputElements[n].caption
                                    });
                                }

                                if(results && results[formId]) {
                                    var timestamps = Object.keys(results[formId]);

                                    if(frequency == "Daily") {
                                        for(var n = 0; n < time.weekstamps.length; n++) {
                                            if(!timestamps.includes(time.weekstamps[n])) {
                                                status = "Incomplete";
                                            } else {
                                                days[weekday[n]] = true;
                                                for(var o = 0; o < results[formId][time.weekstamps[n]].results[m].results.length; o++) {
                                                    var result = results[formId][time.weekstamps[n]].results[m].results[o].result;
                                                    if(result == "Repairs Needed") {
                                                        data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            note: results[formId][time.weekstamps[n]].results[m].results[o].note,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
													} else if(result == "Missing" && results[formId][time.weekstamps[n]].results[m].results[o].note) {
														data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            note: results[formId][time.weekstamps[n]].results[m].results[o].note,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
                                                    } else {
                                                        data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
                                                    }
                                                }
                                            }
                                        }
                                    } else if(frequency == "Weekly") {
                                        var complete = false;
                                        for(var n = 0; n < time.weekstamps.length; n++) {
                                            if(timestamps.includes(time.weekstamps[n])) {
                                                days[weekday[n]] = true;
                                                complete = true;
                                                for(var o = 0; o < results[formId][time.weekstamps[n]].results[m].results.length; o++) {
                                                    var result = results[formId][time.weekstamps[n]].results[m].results[o].result;
                                                    if(result == "Repairs Needed") {
                                                        data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            note : results[formId][time.weekstamps[n]].results[m].results[o].note,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
													} else if(result == "Missing" && results[formId][time.weekstamps[n]].results[m].results[o].note) {
														data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            note : results[formId][time.weekstamps[n]].results[m].results[o].note,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
                                                    } else {
                                                        data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
                                                    }
                                                }
                                            }
                                        }

                                        if(!complete) {
                                            status = "Incomplete";
                                        }
                                    } else if(frequency == "Monthly") {
                                        for(var n = 0; n < time.weekstamps.length; n++) {
                                            if(!timestamps.includes(time.weekstamps[n])) {
                                                var complete = false;
                                                for(var o = 0; o < timestamps.length; o++) {
                                                    if(timestamps[o].substring(0,6) == time.yearMonth) {
                                                        complete = true;
                                                        completedTimestamp = timestamps[o];
                                                        for(var p = 0; p < results[formId][completedTimestamp].results[m].results.length; p++) {
                                                            var result = results[formId][completedTimestamp].results[m].results[p].result;
                                                            if(result == "Repairs Needed") {
                                                                data.rows[offset+p][weekday[n]] = {
                                                                    result: result,
                                                                    note: results[formId][completedTimestamp].results[m].results[p].note,
                                                                    completedBy: results[formId][completedTimestamp].completedBy
                                                                };
															} else if(result == "Missing" && results[formId][completedTimestamp].results[m].results[p].note) {
																data.rows[offset+p][weekday[n]] = {
                                                                    result: result,
                                                                    note: results[formId][completedTimestamp].results[m].results[p].note,
                                                                    completedBy: results[formId][completedTimestamp].completedBy
                                                                };
                                                            } else {
                                                                data.rows[offset+p][weekday[n]] = {
                                                                    result: result,
                                                                    completedBy: results[formId][completedTimestamp].completedBy
                                                                };
                                                            }
                                                        }
                                                    }
                                                }

                                                if(!complete) {
                                                    status = "Incomplete";
                                                }
                                            } else {
                                                days[weekday[n]] = true;
                                                for(var o = 0; o < results[formId][time.weekstamps[n]].results[m].results.length; o++) {
                                                    var result = results[formId][time.weekstamps[n]].results[m].results[o].result;
                                                    if(result == "Repairs Needed") {
                                                        data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            note: results[formId][time.weekstamps[n]].results[m].results[o].note,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
													} else if(result == "Missing" && results[formId][time.weekstamps[n]].results[m].results[o].note) {
														data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            note: results[formId][time.weekstamps[n]].results[m].results[o].note,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
                                                    } else {
                                                        data.rows[offset+o][weekday[n]] = {
                                                            result: result,
                                                            completedBy: results[formId][time.weekstamps[n]].completedBy
                                                        };
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    status = "Incomplete";
                                }

                                offset += itemCount;
                            }
                        }

                        if(completedTimestamp) {
                            const completeTime = getTime(completedTimestamp);
                            days[completeTime.weekday] = true;
                        }

                        retVal.reports.push({
                            "name": name,
                            "schedule": schedule,
                            "status": status,
                            "id": id,
                            "days": days,
                            "data": data,
                            "folder": time.weekInterval
                        });
                    }
                }
            }

            time = getTime(time.weekLater);
            if(time.weekstamps[0].substring(0,4) != year) {
                break;
            }
        }

        callback(retVal, root);
    }).catch(err => {
        cors(req, res, () => {
            res.status(400).send(err);
        });
    });
}

function generateCSV(report) {
    var completedDays = [];
    var csvReport = `"Compartment","Caption"`;

    for(var i = 0; i < Object.keys(report.days).length; i++) {
        if(report.days[Object.keys(report.days)[i]]) {
            completedDays.push(Object.keys(report.days)[i]);
            csvReport+=`,"${Object.keys(report.days)[i].charAt(0).toUpperCase() + Object.keys(report.days)[i].slice(1)}"`;
        }
    }

    for(var i = 0; i < report.data.rows.length; i++) {
        csvReport += `\n"${report.data.rows[i].compartment}","${report.data.rows[i].item}"`;

        for(var j = 0; j < completedDays.length; j++) {
            if(report.data.rows[i][completedDays[j]]) {
                csvReport += `,"'${report.data.rows[i][completedDays[j]].result}' ${report.data.rows[i][completedDays[j]].completedBy}"`;
            } else {
                csvReport += `,""`;
            }
        }
    }

    return csvReport;
}

function sortByRank(a, b) {
    if(a.rank < b.rank)
        return -1;
    if(a.rank > b.rank)
        return 1;
    return 0;
}
// END: Global Functions--------------------------------------------------------

// BEGIN: API App Functions-----------------------------------------------------
exports.activeVehicles = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            ref.child('inventory/vehicles').once('value').then(vehiclesSnap => {
                                var retVal = { list: [] };

                                vehiclesSnap.forEach(vehicleSnap => {
                                    retVal.list.push({
                                        id: vehicleSnap.key,
                                        name: vehicleSnap.child('name').val(),
                                        rank: vehicleSnap.child('rank').val()
                                    });
                                });

                                retVal.list.sort(sortByRank);

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.checkCompletion = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid && req.query.formId) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            ref.child(`forms/templates/${req.query.formId}`).once('value').then(templateSnap => {
                                const template = templateSnap.val();

                                if(template) {
                                    ref.child(`forms/results/${req.query.formId}`).once('value').then(resultSnap => {
                                        var completed = false;
                                        const result = resultSnap.val();

                                        if(result) {
                                            ref.child(`forms/intervals/${req.query.formId}/frequency`).once('value').then(frequencySnap => {
                                                const time = getTime();
                                                const frequency = frequencySnap.val();

                                                if(frequency == "Daily" && result[time.datestamp]) {
                                                    completed = true;
                                                } else if(frequency == "Weekly") {
                                                    const lastTimestamp = Object.keys(result)[Object.keys(result).length-1];

                                                    if(time.weekstamps.includes(lastTimestamp)) {
                                                        completed = true;
                                                    }
                                                } else if(frequency == "Monthly") {
                                                    const lastTimestamp = Object.keys(result)[Object.keys(result).length-1];

                                                    if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                        completed = true;
                                                    }
                                                }

                                                cors(req, res, () => {
                                                    res.status(200).send(completed);
                                                });
                                            }).catch(err => {
                                                cors(req, res, () => {
                                                    res.status(400).send(err);
                                                });
                                            });
                                        } else {
                                            cors(req, res, () => {
                                                res.status(200).send(completed);
                                            });
                                        }
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                } else {
                                    cors(req, res, () => {
                                        res.status(400).send(`Template for '${req.query.formId}' does not exist.`);
                                    });
                                }
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, formId");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.form = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid && req.query.formId) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            const formPr = ref.child(`forms/templates/${req.query.formId}`).once('value');
                            const prevResultPr = ref.child(`forms/results/${req.query.formId}`).orderByKey().limitToLast(1).once('value');

                            Promise.all([formPr, prevResultPr]).then(response => {
                                const form = response[0].val();
                                const prevResult = response[1].val();

                                if(form) {
                                    if(prevResult) {
                                        var clearPrev = false;
                                        const prevResultDatestamp = Object.keys(prevResult)[0];
                                        form.prevCompletedBy = prevResult[prevResultDatestamp].completedBy;
                                        form.prevDate = `${prevResultDatestamp.substring(4,6)}/${prevResultDatestamp.substring(6,8)}/${prevResultDatestamp.substring(0,4)}`;

                                        if(form.inputElements) {
                                            for(var i = 0; i < form.inputElements.length; i++) {
                                                if(form.inputElements[i].caption != prevResult[prevResultDatestamp].results[i].caption) {
                                                    clearPrev = true;
                                                    break;
                                                } else if(prevResult[prevResultDatestamp].results[i].result == "Repairs Needed") {
                                                    form.inputElements[i].prev = prevResult[prevResultDatestamp].results[i].result;
                                                    form.inputElements[i].prevNote = prevResult[prevResultDatestamp].results[i].note;
												} else if(prevResult[prevResultDatestamp].results[i].result == "Missing" && prevResult[prevResultDatestamp].results[i].note) {
													form.inputElements[i].prev = prevResult[prevResultDatestamp].results[i].result;
                                                    form.inputElements[i].prevNote = prevResult[prevResultDatestamp].results[i].note;
                                                } else {
                                                    form.inputElements[i].prev = prevResult[prevResultDatestamp].results[i].result;
                                                }
                                            }

                                            if(clearPrev) {
                                                delete form.prevCompletedBy;
                                                delete form.prevDate;
                                                for(var i = 0; i < form.inputElements.length; i++) {
                                                    delete form.inputElements[i].prev;
                                                }
                                            }
                                        } else {
                                            for(var i = 0; i < form.subSections.length; i++) {
                                                for(var j = 0; j < form.subSections[i].inputElements.length; j++) {
                                                    if(form.subSections[i].inputElements[j].caption != prevResult[prevResultDatestamp].results[i].results[j].caption) {
                                                        clearPrev = true;
                                                        break;
                                                    } else if(prevResult[prevResultDatestamp].results[i].results[j].result == "Repairs Needed"){
                                                        form.subSections[i].inputElements[j].prev = prevResult[prevResultDatestamp].results[i].results[j].result;
                                                        form.subSections[i].inputElements[j].prevNote = prevResult[prevResultDatestamp].results[i].results[j].note;
													} else if(prevResult[prevResultDatestamp].results[i].results[j].result == "Missing" && prevResult[prevResultDatestamp].results[i].results[j].note) {
														form.subSections[i].inputElements[j].prev = prevResult[prevResultDatestamp].results[i].results[j].result;
                                                        form.subSections[i].inputElements[j].prevNote = prevResult[prevResultDatestamp].results[i].results[j].note;
                                                    } else {
                                                        form.subSections[i].inputElements[j].prev = prevResult[prevResultDatestamp].results[i].results[j].result;
                                                    }
                                                }

                                                if(clearPrev) {
                                                    break;
                                                }
                                            }

                                            if(clearPrev) {
                                                delete form.prevCompletedBy;
                                                delete form.prevDate;
                                                for(var i = 0; i < form.subSections.length; i++) {
                                                    for(var j = 0; j < form.subSections[i].inputElements.length; j++) {
                                                        delete form.subSections[i].inputElements[j].prev;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    cors(req, res, () => {
                                        res.status(200).send(form);
                                    });
                                } else {
                                    cors(req, res, () => {
                                        res.status(400).send(`Template for '${req.query.formId}' does not exist`);
                                    });
                                }
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, formId");
                });
            }
            break;
        case "POST":
            if(req.body.uid && req.body.formId && req.body.results) {
                ref.child(`users/${req.body.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            const usersPr = ref.child(`users`).once('value');
                            const templatesPr = ref.child(`forms/templates`).once('value');

                            Promise.all([usersPr, templatesPr]).then(response => {
                                const time = getTime();
                                const users = response[0].val();
                                const templates = response[1].val();

                                ref.child(`forms/results/${req.body.formId}/${time.datestamp}`).set({
                                    completedBy: `${users[req.body.uid].firstName} ${users[req.body.uid].lastName}`,
                                    results: req.body.results
                                }).then(() => {
                                    var postError = false;
                                    var repairItems = [];
                                    var missingItems = [];
                                    var failItems = [];
                                    var emails = [];

                                    Object.keys(users).forEach(user => {
                                        if(users[user].alert) {
                                            emails.push(users[user].email);
                                        }
                                    });

                                    for(var i = 0; i < req.body.results.length; i++) {
                                        if(req.body.results[i].result) {
                                            var failureCheck = false;
                                            var statType;
                                            var alertType;;

                                            if(req.body.results[i].result == "Repairs Needed") {
                                                failureCheck = true;
                                                statType = "repairsNeeded";
                                                alertType = "repairItems";
                                                repairItems.push(`${req.body.results[i].caption}: ${req.body.results[i].note}`);
                                            } else if(req.body.results[i].result == "Missing") {
                                                failureCheck = true;
                                                statType = "missing";
                                                alertType = "missingItems";
												if(req.body.results[i].note) {
													missingItems.push(`${req.body.results[i].caption}: ${req.body.results[i].note}`);
												} else {
                                                	missingItems.push(req.body.results[i].caption);
												}
                                            } else if(req.body.results[i].result == "Failed") {
                                                failureCheck = true;
                                                statType = "failed";
                                                alertType = "failItems";
                                                failItems.push(req.body.results[i].caption);
                                            } else if(req.body.results[i].type == "date") {
                                                ref.child(`dates/${templates[req.body.formId].title}${req.body.results[i].caption}`).set({
                                                    alert: `'${req.body.results[i].caption}' from '${templates[req.body.formId].title}' expires on ${req.body.results[i].result}`,
                                                    date: req.body.results[i].result
                                                });
                                            }

                                            if(failureCheck) {
                                                ref.child(`statistics/${req.body.formId}/title`).set(templates[req.body.formId].title).catch(err => {
                                                    postError = true;
                                                    cors(req, res, () => {
                                                        res.status(400).send(err);
                                                    });
                                                });
                                                ref.child(`statistics/${req.body.formId}/${time.yearMonth}/${req.body.results[i].caption}/${statType}`).push().set(0).catch(err => {
                                                    postError = true;
                                                    cors(req, res, () => {
                                                        res.status(400).send(err);
                                                    });
                                                });
                                                ref.child(`alerts/${alertType}`).push().set(`${time.formattedDate}: '${req.body.results[i].caption}' from '${templates[req.body.formId].title}'`).catch(err => {
                                                    postError = true;
                                                    cors(req, res, () => {
                                                        res.status(400).send(err);
                                                    });
                                                });
                                            }
                                        } else {
                                            for(var j = 0; j < req.body.results[i].results.length; j++) {
                                                var failureCheck = false;
                                                var statType;
                                                var alertType;

                                                if(req.body.results[i].results[j].result == "Repairs Needed") {
                                                    failureCheck = true;
                                                    statType = "repairsNeeded";
                                                    alertType = "repairItems";
                                                    repairItems.push(`${req.body.results[i].title} - ${req.body.results[i].results[j].caption}: ${req.body.results[i].results[j].note}`);
                                                } else if(req.body.results[i].results[j].result == "Missing") {
                                                    failureCheck = true;
                                                    statType = "missing";
                                                    alertType = "missingItems";
													if(req.body.results[i].results[j].note) {
														missingItems.push(`${req.body.results[i].title} - ${req.body.results[i].results[j].caption}: ${req.body.results[i].results[j].note}`);
													} else {
                                                    	missingItems.push(`${req.body.results[i].title} - ${req.body.results[i].results[j].caption}`);
													}
                                                } else if(req.body.results[i].results[j].result == "Failed") {
                                                    failureCheck = true;
                                                    statType = "failed";
                                                    alertType = "failItems";
                                                    failItems.push(`${req.body.results[i].title} - ${req.body.results[i].results[j].caption}`);
                                                } else if(req.body.results[i].results[j].type == "date") {
                                                    ref.child(`dates/${templates[req.body.formId].title}${req.body.results[i].title}${req.body.results[i].results[j].caption}`).set({
                                                        alert: `${req.body.results[i].title} - ${req.body.results[i].results[j].caption} expires on ${req.body.results[i].results[j].result}`,
                                                        date: req.body.results[i].results[j].result
                                                    });
                                                }

                                                if(failureCheck) {
                                                    ref.child(`statistics/${req.body.formId}/title`).set(templates[req.body.formId].title).catch(err => {
                                                        postError = true;
                                                        cors(req, res, () => {
                                                            res.status(400).send(err);
                                                        });
                                                    });
                                                    ref.child(`statistics/${req.body.formId}/${time.yearMonth}/${req.body.results[i].title}: ${req.body.results[i].results[j].caption}/${statType}`).push().set(0).catch(err => {
                                                        postError = true;
                                                        cors(req, res, () => {
                                                            res.status(400).send(err);
                                                        });
                                                    });
                                                    ref.child(`alerts/${alertType}`).push().set(`${time.formattedDate}: '${req.body.results[i].results[j].caption}' from '${templates[req.body.formId].title}'`).catch(err => {
                                                        postError = true;
                                                        cors(req, res, () => {
                                                            res.status(400).send(err);
                                                        });
                                                    });
                                                }

                                                if(postError) {
                                                    break;
                                                }
                                            }
                                        }

                                        if(postError) {
                                            break;
                                        }
                                    }

                                    if(!postError) {
                                        if(emails.length > 0) {
                                            var mailOptions = {
                                                from: '"Oviedo Fire" <oviedofiresd@gmail.com>',
                                                bcc: emails.join(),
                                                subject: `${time.formattedDate}: ${templates[req.body.formId].title}`,
                                                text: ''
                                            };

                                            if(repairItems.length > 0) {
                                                mailOptions.text  += `The following item(s) need(s) repair:\n`;

                                                for(var i = 0; i< repairItems.length; i++) {
                                                    mailOptions.text += `\n\t${repairItems[i]}`;
                                                }

                                                mailOptions.text += '\n\n';
                                            }

                                            if(missingItems.length > 0) {
                                                mailOptions.text  += `The following item(s) is/are missing:\n`;

                                                for(var i = 0; i< missingItems.length; i++) {
                                                    mailOptions.text += `\n\t${missingItems[i]}`;
                                                }

                                                mailOptions.text += '\n\n';
                                            }

                                            if(failItems.length > 0) {
                                                mailOptions.text  += `The following item(s) has/have failed:\n`;

                                                for(var i = 0; i< failItems.length; i++) {
                                                    mailOptions.text += `\n\t${failItems[i]}`;
                                                }

                                                mailOptions.text += '\n\n';
                                            }

                                            if(mailOptions.text != '') {
                                                mailOptions.text += `Reported By: ${users[req.body.uid].firstName} ${users[req.body.uid].lastName}\n`;
                                                mailOptions.text += `Form: ${templates[req.body.formId].title}`;

                                                mailTransport.sendMail(mailOptions).then(() => {
                                                    cors(req, res, () => {
                                                        res.sendStatus(200);
                                                    });
                                                }).catch(err => {
                                                    cors(req, res, () => {
                                                        res.status(400).send(err);
                                                    });
                                                });
                                            } else {
                                                cors(req, res, () => {
                                                    res.sendStatus(200);
                                                });
                                            }
                                        } else {
                                            cors(req, res, () => {
                                                res.sendStatus(200);
                                            });
                                        }
                                    }
                                }).catch(err => {
                                    cors(req, res, () => {
                                        res.status(400).send(err);
                                    });
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, formId, results");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.ladders = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            const ppePr = ref.child('inventory/ppe').once('value');
                            const intervalsPr = ref.child('forms/intervals').once('value');
                            const resultsPr = ref.child('forms/results').once('value');

                            Promise.all([ppePr, intervalsPr, resultsPr]).then(response => {
                                var retVal = { list: [] };
                                const time = getTime();
                                const ppe = response[0].val();
                                const intervals = response[1].val();
                                const results = response[2].val();

                                Object.keys(ppe).forEach(ppeKey => {
                                    var completedBy = 'nobody';
                                    const formId = ppe[ppeKey].formId;

                                    if(results && results[formId]) {
                                        const frequency = intervals[formId].frequency;

                                        if(frequency == "Daily" && results[formId][time.datestamp]) {
                                            completedBy = results[formId][time.datestamp].completedBy;
                                        } else if(frequency == "Weekly") {
                                            const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                            if(time.weekstamps.includes(lastTimestamp)) {
                                                completedBy = results[formId][lastTimestamp].completedBy;
                                            }
                                        } else if(frequency == "Monthly") {
                                            const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                            if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                completedBy = results[formId][lastTimestamp].completedBy;
                                            }
                                        }
                                    }

                                    retVal.list.push({
                                        name: ppe[ppeKey].name,
                                        formId: formId,
                                        completedBy: completedBy,
                                        rank: ppe[ppeKey].rank
                                    });
                                });

                                retVal.list.sort(sortByRank);

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.misc = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            const miscPr = ref.child('inventory/miscellaneous').once('value');
                            const intervalsPr = ref.child('forms/intervals').once('value');
                            const resultsPr = ref.child('forms/results').once('value');

                            Promise.all([miscPr, intervalsPr, resultsPr]).then(response => {
                                var retVal = { list: [] };
                                const time = getTime();
                                const misc = response[0].val();
                                const intervals = response[1].val();
                                const results = response[2].val();

                                Object.keys(misc).forEach(miscKey => {
                                    var completedBy = 'nobody';
                                    const formId = misc[miscKey].formId;

                                    if(results && results[formId]) {
                                        const frequency = intervals[formId].frequency;

                                        if(frequency == "Daily" && results[formId][time.datestamp]) {
                                            completedBy = results[formId][time.datestamp].completedBy;
                                        } else if(frequency == "Weekly") {
                                            const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                            if(time.weekstamps.includes(lastTimestamp)) {
                                                completedBy = results[formId][lastTimestamp].completedBy;
                                            }
                                        } else if(frequency == "Monthly") {
                                            const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                            if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                completedBy = results[formId][lastTimestamp].completedBy;
                                            }
                                        }
                                    }

                                    retVal.list.push({
                                        name: misc[miscKey].name,
                                        formId: formId,
                                        completedBy: completedBy,
                                        rank: misc[miscKey].rank
                                    });
                                });

                                retVal.list.sort(sortByRank);

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.results = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid && req.query.formId) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            const titlePr = ref.child(`forms/templates/${req.query.formId}/title`).once('value');
                            const resultPr = ref.child(`forms/results/${req.query.formId}`).orderByKey().limitToLast(1).once('value');

                            Promise.all([titlePr, resultPr]).then(response => {
                                const title = response[0].val();
                                const result = response[1].val();
                                const datestamp = Object.keys(result)[0];

                                cors(req, res, () => {
                                    res.status(200).send({
                                        completedBy: result[datestamp].completedBy,
                                        datestamp: `${datestamp.substring(4,6)}/${datestamp.substring(6,8)}/${datestamp.substring(0,4)}`,
                                        results: result[datestamp].results,
                                        title: title,
                                    });
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, formId");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.scbas = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            const toolsPr = ref.child('inventory/tools').once('value');
                            const intervalsPr = ref.child('forms/intervals').once('value');
                            const resultsPr = ref.child('forms/results').once('value');

                            Promise.all([toolsPr, intervalsPr, resultsPr]).then(response => {
                                var retVal = { list: [] };
                                const time = getTime();
                                const tools = response[0].val();
                                const intervals = response[1].val();
                                const results = response[2].val();

                                Object.keys(tools).forEach(toolKey => {
                                    var completedBy = 'nobody';
                                    const formId = tools[toolKey].formId;

                                    if(results && results[formId]) {
                                        const frequency = intervals[formId].frequency;

                                        if(frequency == "Daily" && results[formId][time.datestamp]) {
                                            completedBy = results[formId][time.datestamp].completedBy;
                                        } else if(frequency == "Weekly") {
                                            const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                            if(time.weekstamps.includes(lastTimestamp)) {
                                                completedBy = results[formId][lastTimestamp].completedBy;
                                            }
                                        } else if(frequency == "Monthly") {
                                            const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                            if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                completedBy = results[formId][lastTimestamp].completedBy;
                                            }
                                        }
                                    }

                                    retVal.list.push({
                                        name: tools[toolKey].name,
                                        formId: formId,
                                        completedBy: completedBy,
                                        rank: tools[toolKey].rank
                                    });
                                });

                                retVal.list.sort(sortByRank);

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.stretchers = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            const emsPr = ref.child('inventory/ems').once('value');
                            const intervalsPr = ref.child('forms/intervals').once('value');
                            const resultsPr = ref.child('forms/results').once('value');

                            Promise.all([emsPr, intervalsPr, resultsPr]).then(response => {
                                var retVal = { list: [] };
                                const time = getTime();
                                const ems = response[0].val();
                                const intervals = response[1].val();
                                const results = response[2].val();

                                Object.keys(ems).forEach(emsKey => {
                                    var completedBy = 'nobody';
                                    const formId = ems[emsKey].formId;

                                    if(results && results[formId]) {
                                        const frequency = intervals[formId].frequency;

                                        if(frequency == "Daily" && results[formId][time.datestamp]) {
                                            completedBy = results[formId][time.datestamp].completedBy;
                                        } else if(frequency == "Weekly") {
                                            const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                            if(time.weekstamps.includes(lastTimestamp)) {
                                                completedBy = results[formId][lastTimestamp].completedBy;
                                            }
                                        } else if(frequency == "Monthly") {
                                            const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                            if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                completedBy = results[formId][lastTimestamp].completedBy;
                                            }
                                        }
                                    }

                                    retVal.list.push({
                                        name: ems[emsKey].name,
                                        formId: formId,
                                        completedBy: completedBy,
                                        rank: ems[emsKey].rank
                                    });
                                });

                                retVal.list.sort(sortByRank);

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.toDoList = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            const inventoryPr = ref.child('inventory').once('value');
                            const intervalsPr = ref.child('forms/intervals').once('value');
                            const resultsPr = ref.child('forms/results').once('value');

                            Promise.all([inventoryPr, intervalsPr, resultsPr]).then(response => {
                                var retVal = { list: [] };
                                const time = getTime();
                                const inventory = response[0].val();
                                const intervals = response[1].val();
                                const results = response[2].val();
                                var forms = [];

                                Object.keys(inventory).forEach(itemType => {
                                    Object.keys(inventory[itemType]).forEach(item => {
                                        if(itemType == "vehicles") {
                                            Object.keys(inventory[itemType][item].compartments).forEach(compartment => {
                                                forms.push({
                                                    name: `${inventory[itemType][item].name}-${inventory[itemType][item].compartments[compartment].name}`,
                                                    formId: inventory[itemType][item].compartments[compartment].formId
                                                });
                                            });
                                        } else {
                                            forms.push({
                                                name: inventory[itemType][item].name,
                                                formId: inventory[itemType][item].formId
                                            });
                                        }
                                    });
                                });

                                for(var i = 0; i < forms.length; i++) {
                                    const frequency = intervals[forms[i].formId].frequency;
                                    var complete = false;

                                    if(results && results[forms[i].formId]) {
                                        if(frequency == "Daily" && results[forms[i].formId][time.datestamp]) {
                                            complete = true;
                                        } else if(frequency == "Weekly") {
                                            const lastTimestamp = Object.keys(results[forms[i].formId])[Object.keys(results[forms[i].formId]).length-1];

                                            if(time.weekstamps.includes(lastTimestamp)) {
                                                complete = true;
                                            }
                                        } else if(frequency == "Monthly") {
                                            const lastTimestamp = Object.keys(results[forms[i].formId])[Object.keys(results[forms[i].formId]).length-1];

                                            if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                complete = true;
                                            }
                                        }
                                    }

                                    if(!complete) {
                                        var completeBy;
                                        if(frequency == "Daily") {
                                            completeBy = "End of Day";
                                        } else if(frequency == "Weekly") {
                                            completeBy = "End of Week";
                                        } else {
                                            completeBy = "End of Month";
                                        }

                                        retVal.list.push({
                                            name: forms[i].name,
                                            formId: forms[i].formId,
                                            completeBy: completeBy
                                        });
                                    }
                                }

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.userInfo = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            ref.child(`users/${req.query.uid}`).once('value').then(userSnap => {
                                cors(req, res, () => {
                                    res.status(200).send(userSnap.val());
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.vehicleCompartments = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid && req.query.vehicleId) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0 || auth == 1) {
                            ref.child(`inventory/vehicles/${req.query.vehicleId}/compartments`).once('value').then(compartmentsSnap => {
                                const compartments = compartmentsSnap.val();

                                if(compartments) {
                                    const intervalsPr = ref.child('forms/intervals').once('value');
                                    const resultsPr = ref.child('forms/results').once('value');

                                    Promise.all([intervalsPr, resultsPr]).then(response => {
                                        var retVal = { list: [] };
                                        const time = getTime();
                                        const intervals = response[0].val();
                                        const results = response[1].val();

                                        retVal.list.length = Object.keys(compartments).length;
                                        Object.keys(compartments).forEach(compartmentKey => {
                                            var completedBy = 'nobody';
                                            const formId = compartments[compartmentKey].formId;

                                            if(results && results[formId]) {
                                                const frequency = intervals[req.query.vehicleId].frequency;

                                                if(frequency == "Daily" && results[formId][time.datestamp]) {
                                                    completedBy = results[formId][time.datestamp].completedBy;
                                                } else if(frequency == "Weekly") {
                                                    const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                    if(time.weekstamps.includes(lastTimestamp)) {
                                                        completedBy = results[formId][lastTimestamp].completedBy;
                                                    }
                                                } else if(frequency == "Monthly") {
                                                    const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                    if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                        completedBy = results[formId][lastTimestamp].completedBy;
                                                    }
                                                }
                                            }

                                            retVal.list[compartments[compartmentKey].rank] = {
                                                name: compartments[compartmentKey].name,
                                                formId: formId,
                                                completedBy: completedBy
                                            };
                                        });

                                        cors(req, res, () => {
                                            res.status(200).send(retVal);
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                } else {
                                    cors(req, res, () => {
                                        res.status(400).send(`Compartments for '${req.query.vehicleId}' do not exist`);
                                    });
                                }
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, vehicleId");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});
// END: API App Functions-------------------------------------------------------

// BEGIN: API Admin Portal Functions--------------------------------------------
exports.availableYears = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            ref.child('forms/results').once('value').then(resultsSnap => {
                                var retVal = [];
                                var years = {};
                                const results = resultsSnap.val();

                                if(results) {
                                    resultsSnap.forEach(formResultsSnap => {
                                        formResultsSnap.forEach(datestampSnap => {
                                            years[datestampSnap.key.substring(0,4)] = true;
                                        });
                                    });

                                    Object.keys(years).forEach(year => {
                                        retVal.push(year);
                                    });
                                }

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.clearReports = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'DELETE':
            if(req.body.uid) {
                ref.child(`users/${req.body.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            ref.child('forms/results').set(null).then(() => {
                                ref.child('statistics').set(null).then(() => {
                                    ref.child('alerts').set(null).then(() => {
                                        ref.child('dates').set(null).then(() => {
                                            cors(req, res, () => {
                                                res.sendStatus(200);
                                            });
                                        }).catch(err => {
                                            cors(req, res, () => {
                                                res.status(400).send(err);
                                            });
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                }).catch(err => {
                                    cors(req, res, () => {
                                        res.status(400).send(err);
                                    });
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.dismissAlert = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'POST':
            if(req.query.uid && req.query.type && req.query.key) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            ref.child(`alerts/${req.query.type}/${req.query.key}`).set(null).then(() => {
                                cors(req, res, () => {
                                    res.sendStatus(200);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, type, key");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.home = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            const usersPr = ref.child('users').once('value');
                            const alertsPr = ref.child('alerts').once('value');
                            const inventoryPr = ref.child('inventory').once('value');
                            const resultsPr = ref.child('forms/results').once('value');
                            const intervalsPr = ref.child('forms/intervals').once('value');

                            Promise.all([usersPr, alertsPr, inventoryPr, resultsPr, intervalsPr]).then(response => {
                                const time = getTime();
                                var retVal = {
                                    totalUsers: response[0].numChildren(),
                                    alerts: response[1].val(),
                                    totalReports: 0,
                                    reportsToDo: 0,
                                    toDoList: []
                                };
                                const inventory = response[2].val();
                                const results = response[3].val();
                                const intervals = response[4].val();

                                Object.keys(inventory).forEach(itemType => {
                                    Object.keys(inventory[itemType]).forEach(item => {
                                        if(intervals[item].days[time.weekday]) {
                                            retVal.totalReports++;

                                            if(itemType == "vehicles") {
                                                var complete = true;

                                                Object.keys(inventory[itemType][item].compartments).forEach(compartment => {
                                                    if(complete) {
                                                        const formId = inventory[itemType][item].compartments[compartment].formId;
                                                        const frequency = intervals[formId].frequency;

                                                        if(results && results[formId]) {
                                                            if(frequency == "Daily" && !Object.keys(results[formId]).includes(time.datestamp)) {
                                                                complete = false;
                                                            } else if(frequency == "Weekly") {
                                                                const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                                if(!time.weekstamps.includes(lastTimestamp)) {
                                                                    complete = false;
                                                                }
                                                            } else if(frequency == "Monthly") {
                                                                const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                                if(lastTimestamp.substring(0,6) != time.yearMonth) {
                                                                    complete = false;
                                                                }
                                                            }
                                                        } else {
                                                            complete = false;
                                                        }
                                                    }
                                                });

                                                if(!complete) {
                                                    retVal.reportsToDo++;
                                                }

                                                retVal.toDoList.push({
                                                    title: inventory[itemType][item].name,
                                                    complete: complete
                                                });
                                            } else {
                                                const formId = inventory[itemType][item].formId;
                                                const frequency = intervals[formId].frequency;
                                                var complete = false;

                                                if(results && results[formId]) {
                                                    if(frequency == "Daily" && results[formId][time.datestamp]) {
                                                        complete = true;
                                                    } else if(frequency == "Weekly") {
                                                        const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                        if(time.weekstamps.includes(lastTimestamp)) {
                                                            complete = true;
                                                        }
                                                    } else if(frequency == "Monthly") {
                                                        const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                        if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                            complete = true;
                                                        }
                                                    }
                                                }

                                                if(!complete) {
                                                    retVal.reportsToDo++;
                                                }

                                                retVal.toDoList.push({
                                                    title: inventory[itemType][item].name,
                                                    complete: complete
                                                });
                                            }
                                        }
                                    });
                                });

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.resetPassword = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'POST':
            if(req.body.uid && req.body.user) {
                ref.child(`users/${req.body.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            firebase.auth().sendPasswordResetEmail(req.body.user.email).then(() => {
                                cors(req, res, () => {
                                    res.sendStatus(200);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, user");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.users = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            ref.child('users').once('value').then(usersSnap => {
                                var retVal = { list:[] };

                                usersSnap.forEach(userSnap => {
                                    var user = userSnap.val();

                                    user.uid = userSnap.key;
                                    if(user.authentication == 0) {
                                        user.type = "administrator";
                                    } else {
                                        user.type = "user";
                                    }

                                    delete user.authentication;

                                    retVal.list.push(user);
                                });

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        case 'POST':
            if(req.body.uid && req.body.user) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            var user = req.body.user;
                            admin.auth().getUser(user.uid).then(userRecord => {
                                if(user.email != userRecord.email) {
                                    admin.auth().updateUser(user.uid, {
                                        email: user.email
                                    }).then(() => {
                                        const uid = user.uid;

                                        if(user.type == "administrator") {
                                            user.authentication = 0;
                                        } else {
                                            user.authentication = 1;
                                        }
                                        delete user.type;
                                        delete user.uid;

                                        ref.child(`users/${uid}`).set(user).then(() => {
                                            cors(req, res, () => {
                                                res.sendStatus(200);
                                            });
                                        }).catch(err => {
                                            cors(req, res, () => {
                                                res.status(400).send(err);
                                            });
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                } else {
                                    const uid = user.uid;

                                    if(user.type == "administrator") {
                                        user.authentication = 0;
                                    } else {
                                        user.authentication = 1;
                                    }
                                    delete user.type;
                                    delete user.uid;

                                    ref.child(`users/${uid}`).set(user).then(() => {
                                        cors(req, res, () => {
                                            res.sendStatus(200);
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                }
                            }).catch(() => {
                                admin.auth().getUserByEmail(user.email).then(() => {
                                    cors(req, res, () => {
                                        res.status(400).send("The email provided already exists.");
                                    });
                                }).catch(() => {
                                    admin.auth().createUser({
                                        email: user.email,
                                        emailVerified: true
                                    }).then(userRecord => {
                                        firebase.auth().sendPasswordResetEmail(user.email).then(() => {
                                            if(user.type == "administrator") {
                                                user.authentication = 0;
                                            } else {
                                                user.authentication = 1;
                                            }
                                            delete user.type;

                                            ref.child(`users/${userRecord.uid}`).set(user).then(() => {
                                                cors(req, res, () => {
                                                    res.sendStatus(200);
                                                });
                                            }).catch(err => {
                                                cors(req, res, () => {
                                                    res.status(400).send(err);
                                                });
                                            });
                                        }).catch(err => {
                                            cors(req, res, () => {
                                                res.status(400).send(err);
                                            });
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, user");
                });
            }
            break;
        case 'DELETE':
            if(req.body.uid && req.body.user) {
                ref.child(`users/${req.body.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            var user = req.body.user;
                            admin.auth().getUser(user.uid).then(userRecord => {
                                admin.auth().deleteUser(user.uid).then(() => {
                                    ref.child(`users/${user.uid}`).set(null).then(() => {
                                        cors(req, res, () => {
                                            res.sendStatus(200);
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                }).catch(err => {
                                    cors(req, res, () => {
                                        res.status(400).send(err);
                                    });
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, user");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.reports = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            const usersPr = ref.child('users').once('value');
                            const inventoryPr = ref.child('inventory').once('value');
                            const resultsPr = ref.child('forms/results').once('value');
                            const intervalsPr = ref.child('forms/intervals').once('value');
							const templatesPr = ref.child('forms/templates').once('value');

                            Promise.all([usersPr, inventoryPr, resultsPr, intervalsPr, templatesPr]).then(response => {
                                const time = getTime(req.query.date);
                                var retVal = {
                                    reports: []
                                };
								var formCount = 0;
								var lookupTable = {};
                                const inventory = response[1].val();
                                const results = response[2].val();
                                const intervals = response[3].val();
								const templates = response[4].val();

                                Object.keys(inventory).forEach(itemType => {
                                    Object.keys(inventory[itemType]).forEach(item => {
										var report = {
                                            name: null,
											schedule: null,
                                            status: null,
											id: null,
											days: {
												sunday: false,
												monday: false,
												tuesday: false,
												wednesday: false,
												thursday: false,
												friday: false,
												saturday: false
											},
											data: {
												rows: []
											}
                                        };
										var itemCount = 0;

                                        if(itemType == "vehicles") {
                                            var status = "Complete";
											const frequency = intervals[item].frequency;

                                            Object.keys(inventory[itemType][item].compartments).forEach(compartment => {
												const formId = inventory[itemType][item].compartments[compartment].formId;
												lookupTable[formId] = {};

												for(var i = 0; i < templates[formId].inputElements.length; i++) {
													report.data.rows.push({
														compartment: templates[formId].title,
														item: templates[formId].inputElements[i].caption
													});
													lookupTable[formId].id = formCount;
													lookupTable[formId][templates[formId].inputElements[i].caption] = itemCount;
													itemCount++;
												}

                                                if(status == "Complete") {
                                                    if(results && results[formId]) {
														const timestamps = Object.keys(results[formId]);

                                                        if(frequency == "Daily") {
															for(var i = 0; i < time.weekstamps.length; i++) {
																if(!timestamps.includes(time.weekstamps[i])) {
	                                                            	status = "Incomplete";
																}
															}
                                                        } else if(frequency == "Weekly") {
															status = "Incomplete";

                                                            for(var i = 0; i < time.weekstamps.length; i++) {
																if(timestamps.includes(time.weekstamps[i])) {
																	status = "Complete";
																	break;
																}
															}
                                                        } else if(frequency == "Monthly") {
															status = "Incomplete";

                                                            for(var i = 0; i < timestamps.length; i++) {
																if(timestamps[i].substring(0,6) == time.yearMonth) {
																	status = "Complete";
																	break;
																}
															}
                                                        }
                                                    } else {
                                                        status = "Incomplete";
                                                    }
                                                }
                                            });

											report.name = inventory[itemType][item].name;
											report.schedule = frequency;
											report.status = status;
											report.id = item

                                            retVal.reports.push(report);
											formCount++;
                                        } else {
                                            const formId = inventory[itemType][item].formId;
											lookupTable[formId] = {};
											lookupTable[formId].id = formCount;
                                            const frequency = intervals[formId].frequency;

											for(var i = 0; i < templates[formId].subSections.length; i++) {
												for(var j = 0; j < templates[formId].subSections[i].inputElements.length; j++) {
													report.data.rows.push({
														compartment: templates[formId].subSections[i].title,
														item: templates[formId].subSections[i].inputElements[j].caption
													});
													lookupTable[formId][templates[formId].subSections[i].title + templates[formId].subSections[i].inputElements[j].caption] = itemCount;
													itemCount++;
												}
											}

                                            var status = "Complete";

                                            if(results && results[formId]) {
												const timestamps = Object.keys(results[formId]);

                                                if(frequency == "Daily") {
                                                    for(var i = 0; i < time.weekstamps.length; i++) {
														if(!timestamps.includes(time.weekstamps[i])) {
                                                        	status = "Incomplete";
														}
													}
                                                } else if(frequency == "Weekly") {
                                                    status = "Incomplete";

                                                    for(var i = 0; i < time.weekstamps.length; i++) {
														if(timestamps.includes(time.weekstamps[i])) {
															status = "Complete";
															break;
														}
													}
                                                } else if(frequency == "Monthly") {
                                                    status = "Incomplete";

                                                    for(var i = 0; i < timestamps.length; i++) {
														if(timestamps[i].substring(0,6) == time.yearMonth) {
															status = "Complete";
															break;
														}
													}
                                                }
                                            } else {
												status = "Incomplete";
											}

											report.name = inventory[itemType][item].name;
											report.schedule = frequency;
											report.status = status;
											report.id = formId;

                                            retVal.reports.push(report);
											formCount++;
                                        }
                                    });
                                });

								Object.keys(results).forEach(formId => {
									Object.keys(results[formId]).forEach(datestamp => {
										if(time.weekstamps.includes(datestamp)) {
											const day = weekday[time.weekstamps.indexOf(datestamp)];
											if(lookupTable[formId]) {
												retVal.reports[lookupTable[formId].id].days[day] = true;

												for(var i = 0; i < results[formId][datestamp].results.length; i++) {
													if(results[formId][datestamp].results[i].results) {
														for(var j = 0; j < results[formId][datestamp].results[i].results.length; j++) {
															if(lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption] != null) {
																if(results[formId][datestamp].results[i].results[j].note) {
																	retVal.reports[lookupTable[formId].id].data.rows[lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption]][day] = {
																		result: results[formId][datestamp].results[i].results[j].result,
																		note: results[formId][datestamp].results[i].results[j].note,
																		completedBy: results[formId][datestamp].completedBy
																	};
																} else {
																	retVal.reports[lookupTable[formId].id].data.rows[lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption]][day] = {
																		result: results[formId][datestamp].results[i].results[j].result,
																		completedBy: results[formId][datestamp].completedBy
																	};
																}
															} else {
																retVal.reports[lookupTable[formId].id].data.rows.push({
																	compartment: results[formId][datestamp].results[i].title,
																	item: results[formId][datestamp].results[i].results[j].caption
																});
																lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption] = retVal.reports[lookupTable[formId].id].data.rows.length - 1;
																if(results[formId][datestamp].results[i].results[j].note) {
																	retVal.reports[lookupTable[formId].id].data.rows[lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption]][day] = {
																		result: results[formId][datestamp].results[i].results[j].result,
																		note: results[formId][datestamp].results[i].results[j].note,
																		completedBy: results[formId][datestamp].completedBy
																	};
																} else {
																	retVal.reports[lookupTable[formId].id].data.rows[lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption]][day] = {
																		result: results[formId][datestamp].results[i].results[j].result,
																		completedBy: results[formId][datestamp].completedBy
																	};
																}
															}
														}
													} else {
														if(lookupTable[formId][results[formId][datestamp].results[i].caption] != null) {
															if(results[formId][datestamp].results[i].note) {
																retVal.reports[lookupTable[formId].id].data.rows[lookupTable[formId][results[formId][datestamp].results[i].caption]][day] = {
																	result: results[formId][datestamp].results[i].result,
																	note: results[formId][datestamp].results[i].note,
																	completedBy: results[formId][datestamp].completedBy
																};
															} else {
																retVal.reports[lookupTable[formId].id].data.rows[lookupTable[formId][results[formId][datestamp].results[i].caption]][day] = {
																	result: results[formId][datestamp].results[i].result,
																	completedBy: results[formId][datestamp].completedBy
																};
															}
														} else {
															retVal.reports[lookupTable[formId].id].data.rows.push({
																compartment: `${retVal.reports[lookupTable[formId].id].name} - Deprecated`,
																item: results[formId][datestamp].results[i].caption
															});
															lookupTable[formId][results[formId][datestamp].results[i].caption] = retVal.reports[lookupTable[formId].id].data.rows.length - 1;
															if(results[formId][datestamp].results[i].note) {
																retVal.reports[lookupTable[formId].id].data.rows[lookupTable[formId][results[formId][datestamp].results[i].caption]][day] = {
																	result: results[formId][datestamp].results[i].result,
																	note: results[formId][datestamp].results[i].note,
																	completedBy: results[formId][datestamp].completedBy
																};
															} else {
																retVal.reports[lookupTable[formId].id].data.rows[lookupTable[formId][results[formId][datestamp].results[i].caption]][day] = {
																	result: results[formId][datestamp].results[i].result,
																	completedBy: results[formId][datestamp].completedBy
																};
															}
														}
													}
												}
											} else {
												lookupTable[formId] = {};
												lookupTable[formId].id = retVal.reports.length;

												var report = {
		                                            name: null,
													schedule: null,
		                                            status: null,
													id: null,
													days: {
														sunday: false,
														monday: false,
														tuesday: false,
														wednesday: false,
														thursday: false,
														friday: false,
														saturday: false
													},
													data: {
														rows: []
													}
		                                        };

												report.name = formId;
												report.schedule = "N/A";
												report.status = "Complete";
												report.id = formId;
												report.days[day] = true;

												var itemCount = 0;
												for(var i = 0; i < results[formId][datestamp].results.length; i++) {
													if(results[formId][datestamp].results[i].results) {
														for(var j = 0; j < results[formId][datestamp].results[i].results.length; j++) {
															report.data.rows.push({
																compartment: results[formId][datestamp].results[i].title,
																item: results[formId][datestamp].results[i].results[j].caption
															});
															lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption] = itemCount;
															itemCount++;

															if(results[formId][datestamp].results[i].results[j].note) {
																report.data.rows[lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption]][day] = {
																	result: results[formId][datestamp].results[i].results[j].result,
																	note: results[formId][datestamp].results[i].results[j].note,
																	completedBy: results[formId][datestamp].completedBy
																};
															} else {
																report.data.rows[lookupTable[formId][results[formId][datestamp].results[i].title + results[formId][datestamp].results[i].results[j].caption]][day] = {
																	result: results[formId][datestamp].results[i].results[j].result,
																	completedBy: results[formId][datestamp].completedBy
																};
															}
														}
													} else {
														report.data.rows.push({
															compartment: `${report.name} - Deprecated`,
															item: results[formId][datestamp].results[i].caption
														});
														lookupTable[formId][results[formId][datestamp].results[i].caption] = itemCount;
														itemCount++;

														if(results[formId][datestamp].results[i].note) {
															report.data.rows[lookupTable[formId][results[formId][datestamp].results[i].caption]][day] = {
																result: results[formId][datestamp].results[i].result,
																note: results[formId][datestamp].results[i].note,
																completedBy: results[formId][datestamp].completedBy
															};
														} else {
															report.data.rows[lookupTable[formId][results[formId][datestamp].results[i].caption]][day] = {
																result: results[formId][datestamp].results[i].result,
																completedBy: results[formId][datestamp].completedBy
															};
														}
													}
												}

												retVal.reports.push(report);
											}
										}
									});
								});

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.downloadReport = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'POST':
            if(req.body.uid && req.body.report) {
                ref.child(`users/${req.body.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            cors(req, res, () => {
                                res.status(200).send(generateCSV(req.body.report));
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, report");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.downloadReports = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid && req.query.year) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            getAllReports(req.query.year, (reports, root) => {
                                cors(req, res, () => {
                                    res.writeHead(200, {
                                        'Content-Type': 'application/zip',
                                        'Content-disposition': `attachment; filename=${req.query.year}.zip`
                                    });

                                    var zip = archiver('zip');
                                    zip.pipe(res);

                                    zip.append(JSON.stringify(root), { name: 'Database/firebase.json' });

                                    for(var i = 0; i < reports.reports.length; i++) {
                                        var name;

                                        if(reports.reports[i].name.includes('/')) {
                                            name = `${reports.reports[i].folder}/${reports.reports[i].name.substring(0,reports.reports[i].name.indexOf('/'))}.csv`;
                                        } else {
                                            name = `${reports.reports[i].folder}/${reports.reports[i].name}.csv`;
                                        }

                                        zip.append(generateCSV(reports.reports[i]), { name: name });
                                    }

                                    zip.finalize();
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, year");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.listReports = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            ref.child('/').once('value', function(snap) {
                                var root = snap.val();
                                var templates = root.forms.templates;
                                var intervals = root.forms.intervals;
                                var inventory = root.inventory;

                                var reportsList = {
                                    "list": []
                                }

                                for(var i = 0; i < Object.keys(inventory).length; i++) {
                                    var itemType = Object.keys(inventory)[i];
                                    for(var j = 0; j < Object.keys(inventory[itemType]).length; j++) {
                                        var itemKey = Object.keys(inventory[itemType])[j];

                                        if(inventory[itemType][itemKey].compartments) {
                                            var listItem = {
                                                "id": itemKey,
                                                "itemCategory": itemType,
                                                "interval": intervals[itemKey],
                                                "template": {
                                                    "title": inventory[itemType][itemKey].name,
                                                    "subSections": []
                                                }
                                            };

                                            listItem.rank = inventory[itemType][itemKey].rank;
                                            listItem.template.subSections.length = Object.keys(inventory[itemType][itemKey].compartments).length;
                                            for(var k = 0; k < Object.keys(inventory[itemType][itemKey].compartments).length; k++) {
                                                var compartmentKey = Object.keys(inventory[itemType][itemKey].compartments)[k];
                                                var formId = inventory[itemType][itemKey].compartments[compartmentKey].formId;
                                                templates[formId].id = formId;
                                                listItem.template.subSections[inventory[itemType][itemKey].compartments[compartmentKey].rank] = templates[formId];
                                                if(templates[formId].alert) {
                                                    listItem.template.alert = templates[formId].alert;
                                                }
                                            }

                                            reportsList.list.push(listItem);
                                        } else {
                                            var formId = inventory[itemType][itemKey].formId;

                                            reportsList.list.push({
                                                "id": formId,
                                                "itemCategory": itemType,
                                                "interval": intervals[formId],
                                                "template": templates[formId],
                                                "rank": inventory[itemType][itemKey].rank
                                            });
                                        }
                                    }
                                }

                                reportsList.list.sort(sortByRank);

                                cors(req, res, () => {
                                    res.status(200).send(reportsList);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        case 'POST':
            if(req.body.uid && req.body.report) {
                ref.child(`users/${req.body.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            const report = req.body.report;

                            if(report.template.alert) {
                                if(report.template.alert == "") {
                                    report.template.alert = null;
                                }
                            } else {
                                report.template.alert = null;
                            }

                            if(report.template.inputElements) {
                                if(report.id) {
                                    ref.child(`forms/intervals/${report.id}`).set(report.interval).then(() => {
                                        ref.child(`forms/templates/${report.id}`).set(report.template).then(() => {
                                            ref.child(`inventory/${report.itemCategory}/${report.id}/name`).set(report.template.title).then(() => {
                                                cors(req, res, () => {
                                                    res.sendStatus(200);
                                                });
                                            }).catch(err => {
                                                cors(req, res, () => {
                                                    res.status(400).send(err);
                                                });
                                            });
                                        }).catch(err => {
                                            cors(req, res, () => {
                                                res.status(400).send(err);
                                            });
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                }
                            } else if(report.itemCategory == "vehicles") {
                                if(report.id) {
                                    ref.child(`forms/intervals/${report.id}`).set(report.interval).then(() => {
                                        ref.child(`inventory/vehicles/${report.id}/compartments`).once('value').then(compartmentSnap => {
                                            ref.child(`inventory/${report.itemCategory}/${report.id}/name`).set(report.template.title);
                                            var compartments = Object.keys(compartmentSnap.val());
                                            var oldCompartments = {};

                                            compartments.forEach(key => {
                                                oldCompartments[key] = true;
                                            });

                                            for(var i = 0; i < report.template.subSections.length; i++) {
                                                if(report.template.subSections[i].id) {
                                                    oldCompartments[report.template.subSections[i].id] = false;
                                                    ref.child(`forms/intervals/${report.template.subSections[i].id}`).set(report.interval);
                                                    ref.child(`forms/templates/${report.template.subSections[i].id}`).set({
                                                        inputElements: report.template.subSections[i].inputElements,
                                                        title: `${report.template.title} - ${report.template.subSections[i].title}`,
                                                        alert: report.template.alert
                                                    });
                                                    ref.child(`inventory/${report.itemCategory}/${report.id}/compartments/${report.template.subSections[i].id}/name`).set(report.template.subSections[i].title);
                                                    ref.child(`inventory/${report.itemCategory}/${report.id}/compartments/${report.template.subSections[i].id}/rank`).set(i);
                                                } else {
                                                    var newKey = ref.child(`forms/intervals`).push().key;

                                                    if(newKey) {
                                                        ref.child(`forms/intervals/${newKey}`).set(report.interval);
                                                        ref.child(`forms/templates/${newKey}`).set({
                                                            inputElements: report.template.subSections[i].inputElements,
                                                            title: `${report.template.title} - ${report.template.subSections[i].title}`,
                                                            alert: report.template.alert
                                                        });
                                                        ref.child(`inventory/vehicles/${report.id}/compartments/${newKey}`).set({
                                                            formId: [newKey],
                                                            name: report.template.subSections[i].title,
                                                            rank: i
                                                        });
                                                    }
                                                }
                                            }

                                            Object.keys(oldCompartments).forEach(formId => {
                                                if(oldCompartments[formId]) {
                                                    ref.child(`forms/intervals/${formId}`).set(null);
                                                    ref.child(`forms/templates/${formId}`).set(null);
                                                    ref.child(`inventory/vehicles/${report.id}/compartments/${formId}`).set(null);
                                                }
                                            });

                                            cors(req, res, () => {
                                                res.sendStatus(200);
                                            });
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                } else {
                                    var newVehicleKey = ref.child('inventory/vehicles').push().key;
                                    report.id = newVehicleKey;

                                    if(newVehicleKey) {
                                        ref.child(`inventory/vehicles/${newVehicleKey}`).set({
                                            name: report.template.title
                                        }).then(() => {
                                            ref.child(`forms/intervals/${newVehicleKey}`).set(report.interval).then(() => {
                                                for(var i = 0; i < report.template.subSections.length; i++) {
                                                    var newKey = ref.child(`inventory/vehicles/${newVehicleKey}`).push().key;
                                                    report.template.subSections[i].id = newKey;

                                                    if(newKey) {
                                                        ref.child(`inventory/vehicles/${newVehicleKey}/compartments/${newKey}`).set({
                                                            formId: newKey,
                                                            name: report.template.subSections[i].title,
                                                            rank: i
                                                        });
                                                        ref.child(`forms/intervals/${newKey}`).set(report.interval);
                                                        ref.child(`forms/templates/${newKey}`).set({
                                                            inputElements: report.template.subSections[i].inputElements,
                                                            title: `${report.template.title} - ${report.template.subSections[i].title}`,
                                                            alert: report.template.alert
                                                        });
                                                    }
                                                }

                                                cors(req, res, () => {
                                                    res.status(200).send(report);
                                                });
                                            });
                                        });
                                    }
                                }
                            } else {
                                if(report.id) {
                                    ref.child(`forms/intervals/${report.id}`).set(report.interval).then(() => {
                                        ref.child(`forms/templates/${report.id}`).set(report.template).then(() => {
                                            ref.child(`inventory/${report.itemCategory}/${report.id}/name`).set(report.template.title).then(() => {
                                                cors(req, res, () => {
                                                    res.sendStatus(200);
                                                });
                                            }).catch(err => {
                                                cors(req, res, () => {
                                                    res.status(400).send(err);
                                                });
                                            });
                                        }).catch(err => {
                                            cors(req, res, () => {
                                                res.status(400).send(err);
                                            });
                                        });
                                    }).catch(err => {
                                        cors(req, res, () => {
                                            res.status(400).send(err);
                                        });
                                    });
                                } else {
                                    var newKey = ref.child('forms/intervals').push().key;
                                    report.id = newKey;

                                    if(newKey) {
                                        ref.child(`forms/intervals/${newKey}`).set(report.interval).then(() => {
                                            ref.child(`forms/templates/${newKey}`).set(report.template).then(() => {
                                                ref.child(`inventory/${report.itemCategory}/${newKey}`).set({
                                                    formId: newKey,
                                                    name: report.template.title
                                                }).then(() => {
                                                    cors(req, res, () => {
                                                        res.status(200).send(report);
                                                    });
                                                }).catch(err => {
                                                    cors(req, res, () => {
                                                        res.status(400).send(err);
                                                    });
                                                });
                                            }).catch(err => {
                                                cors(req, res, () => {
                                                    res.status(400).send(err);
                                                });
                                            });
                                        }).catch(err => {
                                            cors(req, res, () => {
                                                res.status(400).send(err);
                                            });
                                        });
                                    }
                                }
                            }
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, report");
                });
            }
            break;
        case 'DELETE':
            if(req.body.uid && req.body.id && req.body.itemCategory) {
                ref.child(`users/${req.body.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            if(req.body.itemCategory == "vehicles") {
                                ref.child(`inventory/vehicles/${req.body.id}/compartments`).once('value').then(compartmentsSnap => {
                                    var compartments = compartmentsSnap.val();

                                    for(var i = 0; i < Object.keys(compartments).length; i++) {
                                        var formId = compartments[Object.keys(compartments)[i]].formId[0];

                                        ref.child(`forms/intervals/${formId}`).set(null);
                                        ref.child(`forms/templates/${formId}`).set(null);
                                    }

                                    ref.child(`forms/intervals/${req.body.id}`).set(null);
                                    ref.child(`inventory/vehicles/${req.body.id}`).set(null);

                                    cors(req, res, () => {
                                        res.sendStatus(200);
                                    });
                                });
                            } else {
                                ref.child(`inventory/${req.body.itemCategory}/${req.body.id}`).set(null);
                                ref.child(`forms/intervals/${req.body.id}`).set(null);
                                ref.child(`forms/templates/${req.body.id}`).set(null);

                                cors(req, res, () => {
                                    res.sendStatus(200);
                                });
                            }
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, id, itemCategory");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.statistics = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            if(req.query.uid) {
                ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            ref.child('statistics').once('value').then(statsSnap => {
                                var retVal = {results: [] };
                                const stats = statsSnap.val();

                                if(stats) {
                                    Object.keys(stats).forEach(form => {
                                        var formStat = {
                                            title: stats[form].title,
                                            details: []
                                        };

                                        Object.keys(stats[form]).forEach(month => {
                                            if(month != "title") {
                                                const stamp = `${month.substring(4,6)}/${month.substring(0,4)}`;
                                                formStat.details.push(stamp);
                                                formStat[stamp] = {
                                                    data: [
                                                        {
                                                            label: "Needed Repair",
                                                            data: []
                                                        },
                                                        {
                                                            label: "Missing",
                                                            data: []
                                                        },
                                                        {
                                                            label: "Failed",
                                                            data: []
                                                        }
                                                    ]
                                                };

                                                var labels = [];
                                                var itemNum = 0;
                                                Object.keys(stats[form][month]).forEach(item => {
                                                    labels.push(item);

                                                    formStat[stamp].data[0].data.push(0);
                                                    formStat[stamp].data[1].data.push(0);
                                                    formStat[stamp].data[2].data.push(0);

                                                    if(stats[form][month][item].repairsNeeded) {
                                                        formStat[stamp].data[0].data[itemNum] = Object.keys(stats[form][month][item].repairsNeeded).length;
                                                    } else if(stats[form][month][item].missing) {
                                                        formStat[stamp].data[1].data[itemNum] = Object.keys(stats[form][month][item].missing).length;
                                                    } else if(stats[form][month][item].failed) {
                                                        formStat[stamp].data[2].data[itemNum] = Object.keys(stats[form][month][item].failed).length;
                                                    }

                                                    itemNum++;
                                                });

                                                formStat[stamp].labels = labels;
                                            }
                                        });

                                        retVal.results.push(formStat);
                                    });
                                }

                                cors(req, res, () => {
                                    res.status(200).send(retVal);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.orderReports = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'POST':
            if(req.body.uid && req.body.list) {
                ref.child(`users/${req.body.uid}/authentication`).once('value').then(authSnap => {
                    const auth = authSnap.val();
                    if(auth !== null) {
                        if(auth == 0) {
                            const list = req.body.list;
                            var postError = false;

                            for(var i = 0; i < list.length; i++) {
                                ref.child(`inventory/${list[i].itemCategory}/${list[i].id}/rank`).set(i).catch(err => {
                                    postError = true;
                                });
                            }

                            if(postError) {
                                cors(req, res, () => {
                                    res.sendStatus(400);
                                });
                            } else {
                                cors(req, res, () => {
                                    res.sendStatus(200);
                                });
                            }
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send("The user is not authorized for access");
                        });
                    }
                }).catch(err => {
                    cors(req, res, () => {
                        res.status(400).send(err);
                    });
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid");
                });
            }
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});
// END: API Admin Portal Functions----------------------------------------------

// BEGIN: API Automated Functions-----------------------------------------------
exports.checkDateItems = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            ref.child('dates').once('value').then(datesSnap => {
                dates = datesSnap.val();
                const monthDays = getMonthDays();

                if(dates) {
                    Object.keys(dates).forEach(dateKey => {
                        if(monthDays.includes(dates[dateKey].date)) {
                            ref.child(`alerts/dateItems`).push().set(dates[dateKey].alert).then(() => {
                                cors(req, res, () => {
                                    res.sendStatus(200);
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        }
                    });
                } else {
                    cors(req, res, () => {
                        res.sendStatus(200);
                    });
                }
            });
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});

exports.sendIncompleteFormsEmail = functions.https.onRequest((req, res) => {
    switch(req.method) {
        case 'GET':
            ref.child('users').once('value').then(usersSnap => {
                var emails = [];

                usersSnap.forEach(userSnap => {
                    const user = userSnap.val();
                    if(user.alert) {
                        emails.push(user.email);
                    }
                });

                if(emails.length > 0) {
                    const inventoryPr = ref.child('inventory').once('value');
                    const resultsPr = ref.child('forms/results').once('value');
                    const intervalsPr = ref.child('forms/intervals').once('value');

                    Promise.all([inventoryPr, resultsPr, intervalsPr]).then(response => {
                        var toDoList = [];
                        const time = getTime();
                        const inventory = response[0].val();
                        const results = response[1].val();
                        const intervals = response[2].val();

                        Object.keys(inventory).forEach(itemType => {
                            Object.keys(inventory[itemType]).forEach(item => {
                                if(intervals[item].days[time.weekday]) {
                                    if(itemType == "vehicles") {
                                        var complete = true;

                                        Object.keys(inventory[itemType][item].compartments).forEach(compartment => {
                                            if(complete) {
                                                const formId = inventory[itemType][item].compartments[compartment].formId;
                                                const frequency = intervals[formId].frequency;

                                                if(results && results[formId]) {
                                                    if(frequency == "Daily" && !Object.keys(results[formId]).includes(time.datestamp)) {
                                                        complete = false;
                                                    } else if(frequency == "Weekly") {
                                                        const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                        if(!time.weekstamps.includes(lastTimestamp)) {
                                                            complete = false;
                                                        }
                                                    } else if(frequency == "Monthly") {
                                                        const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                        if(lastTimestamp.substring(0,6) != time.yearMonth) {
                                                            complete = false;
                                                        }
                                                    }
                                                } else {
                                                    complete = false;
                                                }
                                            }
                                        });

                                        if(!complete) {
                                            toDoList.push(inventory[itemType][item].name);
                                        }
                                    } else {
                                        const formId = inventory[itemType][item].formId;
                                        const frequency = intervals[formId].frequency;
                                        var complete = false;

                                        if(results && results[formId]) {
                                            if(frequency == "Daily" && results[formId][time.datestamp]) {
                                                complete = true;
                                            } else if(frequency == "Weekly") {
                                                const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                if(time.weekstamps.includes(lastTimestamp)) {
                                                    complete = true;
                                                }
                                            } else if(frequency == "Monthly") {
                                                const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

                                                if(lastTimestamp.substring(0,6) == time.yearMonth) {
                                                    complete = true;
                                                }
                                            }
                                        }

                                        if(!complete) {
                                            toDoList.push(inventory[itemType][item].name);
                                        }
                                    }
                                }
                            });
                        });

                        if(toDoList.length > 0) {
                            var mailOptions = {
                                from: '"Oviedo Fire" <oviedofiresd@gmail.com>',
                                bcc: emails.join(),
                                subject: `${time.formattedDate}: Incomplete Forms`,
                                text: `The following form(s) are incomplete for ${time.formattedDate}:\n`
                            };

                            for(var i = 0; i < toDoList.length; i++) {
                                if(i == toDoList.length - 1) {
                                    mailOptions.text += `\n\t${toDoList[i]}`;
                                } else {
                                    mailOptions.text += `\n\t${toDoList[i]}, `;
                                }
                            }

                            mailTransport.sendMail(mailOptions).then(() => {
                                ref.child('alerts/incompleteForms').push().set(mailOptions.text).then(() => {
                                    cors(req, res, () => {
                                        res.sendStatus(200);
                                    });
                                }).catch(err => {
                                    cors(req, res, () => {
                                        res.status(400).send(err);
                                    });
                                });
                            }).catch(err => {
                                cors(req, res, () => {
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.sendStatus(200);
                            });
                        }
                    });
                } else {
                    cors(req, res, () => {
                        res.sendStatus(200);
                    });
                }
            }).catch(err => {
                cors(req, res, () => {
                    res.status(400).send(err);
                });
            });
            break;
        default:
            cors(req, res, () => {
                res.sendStatus(404);
            });
            break;
    }
});
// END: API Automated Functions-------------------------------------------------
