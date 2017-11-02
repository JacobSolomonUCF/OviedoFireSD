// OviedoFireSD Project

// ----------------------BEGIN: Global API Variables----------------------------
// setup firebase
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

// setup external dependencies
const cors = require('cors')({origin: true});
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

// setup variables
const weekday = new Array(7);
weekday[0] = 'sunday';
weekday[1] = 'monday';
weekday[2] = 'tuesday';
weekday[3] = 'wednesday';
weekday[4] = 'thursday';
weekday[5] = 'friday';
weekday[6] = 'saturday';
// ------------------------END: Global API Variables----------------------------

// -------------------------BEGIN: Global API Functions-------------------------
// returns user's authentication level
function getAuth(uid, callback) {
	admin.database().ref('/users/' + uid + '/authentication').once('value', function(snap) {
		if(snap.val() || snap.val() == 0) {
			callback(snap.val());
		} else {
			callback(401);
		}
	});
}

// return information related to time
function getTime(date) {
	var retVal = {
		"yearMonth": null,
		"weekday": null,
		"datestamp": null,
		"weekstamps": null,
		"formattedDate": null,
		"year": null
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

	return retVal;
}
// ---------------------------END: Global API Functions-------------------------

// -----------------------------BEGIN: API Functions----------------------------
exports.activeVehicles = functions.https.onRequest((req, res) => {
    switch(req.method) {
		case 'GET':
	        if(req.query.uid) {
				ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
					const auth = authSnap.val();
					if(auth !== null) {
	                    if(auth == 0 || auth == 1) {
							var retVal = { list: [] };

							ref.child('inventory/vehicles').once('value').then(vehiclesSnap => {
								vehiclesSnap.forEach(vehicleSnap => {
									retVal.list.push({
										id: vehicleSnap.key,
										name: vehicleSnap.child('name').val()
									});
								});

								cors(req, res, () => {
					                res.status(200).send(retVal);
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
							const time = getTime();
							var retVal = { list: [] };

							ref.child(`inventory/vehicles/${req.query.vehicleId}/compartments`).once('value').then(compartmentsSnap => {
								const compartments = compartmentsSnap.val();

								if(compartments) {
									const intervalsPr = ref.child('forms/intervals').once('value');
									const resultsPr = ref.child('forms/results').once('value');

									Promise.all([intervalsPr, resultsPr]).then(response => {
										const intervals = response[0].val();
										const results = response[1].val();

										Object.keys(compartments).forEach(compartmentKey => {
											var completedBy = 'nobody';
											const formId = compartments[compartmentKey].formId[0];

											if(results && results[formId]) {
												const frequency = intervals[req.query.vehicleId].frequency;

												if(frequency == "Daily" && results[formId][time.datestamp]) {
													completedBy = results[formId][time.datestamp].completedBy;
												} else if(frequency == "Weekly") {
													const lastTimestamp = Object.keys(results[formId])[Object.keys(results[formId]).length-1];

													if(time.weekstamps.includes(lastTimeStamp)) {
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
												name: compartments[compartmentKey].name,
												formId: formId,
												completedBy: completedBy
											});
										});

										cors(req, res, () => {
											res.status(200).send(retVal);
										});
									});
								} else {
									cors(req, res, () => {
						                res.status(400).send(`Compartments for '${req.query.vehicleId}' do not exist`);
						            });
								}
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

exports.form = functions.https.onRequest((req, res) => {
    switch(req.method) {
		case 'GET':
	        if(req.query.uid && req.query.formId) {
				ref.child(`users/${req.query.uid}/authentication`).once('value').then(authSnap => {
					const auth = authSnap.val();
					if(auth !== null) {
	                    if(auth == 0 || auth == 1) {
							ref.child(`forms/templates/${req.query.formId}`).once('value').then(formSnap => {
								const form = formSnap.val();

								if(form) {
									cors(req, res, () => {
										res.status(200).send(form);
									});
								} else {
									cors(req, res, () => {
						                res.status(400).send(`Template for '${req.query.formId}' does not exist`);
						            });
								}
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
							const time = getTime();

							const userPr = ref.child(`users/${req.body.uid}`).once('value');
							const templatesPr = ref.child(`forms/templates`).once('value');

							Promise.all([userPr, templatesPr]).then(response => {
								const user = response[0].val();
								const templates = response[1].val();

								ref.child(`forms/results/${req.body.formId}/${time.datestamp}`).set({
									completedBy: `${user.firstName} ${user.lastName}`,
									results: req.body.results
								}).then(() => {
									for(var i = 0; i < req.body.results.length; i++) {
										if(req.body.results[i].result) {
											if(req.body.results[i].result == "Repairs Needed") {
												ref.child(`statistics/${time.yearMonth}/repairsNeeded`).push().set(0);
												ref.child(`alerts/repairItems`).push().set(`${time.formattedDate}: '${req.body.results[i].caption}' from '${templates[req.body.formId].title}'`);
											} else if(req.body.results[i].result == "Missing") {
												ref.child(`statistics/${time.yearMonth}/missing`).push().set(0);
												ref.child(`alerts/missingItems`).push().set(`${time.formattedDate}: '${req.body.results[i].caption}' from '${templates[req.body.formId].title}'`);
											} else if(req.body.results[i].result == "Failed") {
                                                ref.child(`statistics/${time.yearMonth}/failed`).push().set(0);
                                                ref.child(`alerts/failItems`).push().set(`${time.formattedDate}: '${req.body.results[i].caption}' from '${templates[req.body.formId].title}'`);
                                            }
										} else {
											for(var j = 0; j < req.body.results[i].results.length; j++) {
												if(req.body.results[i].results[j].result == "Repairs Needed") {
													ref.child(`statistics/${time.yearMonth}/repairsNeeded`).push().set(0);
													ref.child(`alerts/repairItems`).push().set(`${time.formattedDate}: '${req.body.results[i].results[j].caption}' from '${templates[req.body.formId].title}'`);
												} else if(req.body.results[i].results[j].result == "Missing") {
													ref.child(`statistics/${time.yearMonth}/missing`).push().set(0);
													ref.child(`alerts/missingItems`).push().set(`${time.formattedDate}: '${req.body.results[i].results[j].caption}' from '${templates[req.body.formId].title}'`);
												} else if(req.body.results[i].results[j].result == "Failed") {
                                                    ref.child(`statistics/${time.yearMonth}/failed`).push().set(0);
                                                    ref.child(`alerts/failItems`).push().set(`${time.formattedDate}: '${req.body.results[i].results[j].caption}' from '${templates[req.body.formId].title}'`);
                                                }
											}
										}
									}

									cors(req, res, () => {
			                            res.sendStatus(200);
			                        });
								}).catch(err => {
									cors(req, res, () => {
			                            res.status(400).send(err);
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
// -------------------------------END: API Functions----------------------------

exports.ladders = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var ladders = root.inventory.ladders;
                            var results = root.forms.results;
                            var intervals = root.forms.intervals;
                            var time = getTime();

                            var ladderList = {
                                "list": []
                            };

                            for(var i = 0; i < Object.keys(ladders).length; i++) {
                                for(var j = 0; j < ladders[Object.keys(ladders)[i]].formId.length; j++) {
                                    var interval = intervals[ladders[Object.keys(ladders)[i]].formId[j]];
                                    var completedBy = "nobody";

                                    if(interval) {
                                        var schedule = interval.frequency;

                                        if(results && results[ladders[Object.keys(ladders)[i]].formId[j]]) {
                                            var timestamps = Object.keys(results[ladders[Object.keys(ladders)[i]].formId[j]]);
                                            if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                                completedBy = results[ladders[Object.keys(ladders)[i]].formId[j]][time.datestamp].completedBy;
                                            } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                                completedBy = results[ladders[Object.keys(ladders)[i]].formId[j]][timestamps[timestamps.length - 1]].completedBy;
                                            } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                                completedBy = results[ladders[Object.keys(ladders)[i]].formId[j]][timestamps[timestamps.length - 1]].completedBy;
                                            }
                                        }
                                    }

                                    ladderList.list.push({
                                        "name": ladders[Object.keys(ladders)[i]].name,
                                        "formId": ladders[Object.keys(ladders)[i]].formId[j],
                                        "completedBy": completedBy
                                    });
                                }
                            }

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(ladderList);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.scbas = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var scbas = root.inventory.scbas;
                            var results = root.forms.results;
                            var intervals = root.forms.intervals;
                            var time = getTime();

                            var scbaList = {
                                "list": []
                            };

                            for(var i = 0; i < Object.keys(scbas).length; i++) {
                                var forms = scbas[Object.keys(scbas)[i]].formId;

                                for(var j = 0; j < forms.length; j++) {
                                    var name = scbas[Object.keys(scbas)[i]].name;

                                    if(scbas[Object.keys(scbas)[i]].formId[j].includes("M")) {
                                        name += " - Monthly"
                                    } else if(scbas[Object.keys(scbas)[i]].formId[j].includes("W")) {
                                        name += " - Weekly"
                                    }

                                    var interval = intervals[scbas[Object.keys(scbas)[i]].formId[j]];
                                    var completedBy = "nobody";

                                    if(interval) {
                                        var schedule = interval.frequency;

                                        if(results && results[scbas[Object.keys(scbas)[i]].formId[j]]) {
                                            var timestamps = Object.keys(results[scbas[Object.keys(scbas)[i]].formId[j]]);
                                            if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                                completedBy = results[scbas[Object.keys(scbas)[i]].formId[j]][time.datestamp].completedBy;
                                            } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                                completedBy = results[scbas[Object.keys(scbas)[i]].formId[j]][timestamps[timestamps.length - 1]].completedBy;
                                            } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                                completedBy = results[scbas[Object.keys(scbas)[i]].formId[j]][timestamps[timestamps.length - 1]].completedBy;
                                            }
                                        }
                                    }

                                    scbaList.list.push({
                                        "name": name,
                                        "formId": scbas[Object.keys(scbas)[i]].formId[j],
                                        "completedBy": completedBy
                                    });
                                }
                            }

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(scbaList);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.stretchers = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var stretchers = root.inventory.stretchers;
                            var results = root.forms.results;
                            var intervals = root.forms.intervals;
                            var time = getTime();

                            var stretcherList = {
                                "list": []
                            };

                            for(var i = 0; i < Object.keys(stretchers).length; i++) {
                                for(var j = 0; j < stretchers[Object.keys(stretchers)[i]].formId.length; j++) {
                                    var interval = intervals[stretchers[Object.keys(stretchers)[i]].formId[j]];
                                    var completedBy = "nobody";

                                    if(interval) {
                                        var schedule = interval.frequency;

                                        if(results && results[stretchers[Object.keys(stretchers)[i]].formId[j]]) {
                                            var timestamps = Object.keys(results[stretchers[Object.keys(stretchers)[i]].formId[j]]);
                                            if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                                completedBy = results[stretchers[Object.keys(stretchers)[i]].formId[j]][time.datestamp].completedBy;
                                            } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                                completedBy = results[stretchers[Object.keys(stretchers)[i]].formId[j]][timestamps[timestamps.length - 1]].completedBy;
                                            } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                                completedBy = results[stretchers[Object.keys(stretchers)[i]].formId[j]][timestamps[timestamps.length - 1]].completedBy;
                                            }
                                        }
                                    }

                                    stretcherList.list.push({
                                        "name": stretchers[Object.keys(stretchers)[i]].name,
                                        "formId": stretchers[Object.keys(stretchers)[i]].formId[j],
                                        "completedBy": completedBy
                                    });
                                }
                            }

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(stretcherList);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.misc = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var misc = root.inventory.miscellaneous;
                            var results = root.forms.results;
                            var intervals = root.forms.intervals;
                            var time = getTime();

                            var miscList = {
                                "list": []
                            };

                            for(var i = 0; i < Object.keys(misc).length; i++) {
                                for(var j = 0; j < misc[Object.keys(misc)[i]].formId.length; j++) {
                                    var interval = intervals[misc[Object.keys(misc)[i]].formId[j]];
                                    var completedBy = "nobody";

                                    if(interval) {
                                        var schedule = interval.frequency;

                                        if(results && results[misc[Object.keys(misc)[i]].formId[j]]) {
                                            var timestamps = Object.keys(results[misc[Object.keys(misc)[i]].formId[j]]);
                                            if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                                completedBy = results[misc[Object.keys(misc)[i]].formId[j]][time.datestamp].completedBy;
                                            } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                                completedBy = results[misc[Object.keys(misc)[i]].formId[j]][timestamps[timestamps.length - 1]].completedBy;
                                            } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                                completedBy = results[misc[Object.keys(misc)[i]].formId[j]][timestamps[timestamps.length - 1]].completedBy;
                                            }
                                        }
                                    }

                                    miscList.list.push({
                                        "name": misc[Object.keys(misc)[i]].name,
                                        "formId": misc[Object.keys(misc)[i]].formId[j],
                                        "completedBy": completedBy
                                    });
                                }
                            }

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(miscList);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.toDoList = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            // initialize data variables
                            var root = snap.val();
                            var intervals = root.forms.intervals;
                            var results = root.forms.results;
                            var templates = root.forms.templates;
                            var inventory = root.inventory;
                            var users = root.users
                            var forms = Object.keys(templates);
                            var time = getTime();

                            // initialize return variables
                            var list = [];
                            var name;
                            var schedule;
							var timestamps;
                            var completeBy;
                            var formId;

                            // run through all forms in the database
                            for(var i = 0; i < forms.length; i++) {
                                // set name of the report
                                name = templates[forms[i]].title;

                                // set schedule of the report
                                schedule = intervals[forms[i]].frequency;

								// set results
								if(results && results[forms[i]]) {
									timestamps = Object.keys(results[forms[i]]);

									if(schedule == "Daily" && !timestamps.includes(time.datestamp)) {
										completeBy = "End of Day";
									} else if(schedule == "Weekly" && !time.weekstamps.includes(timestamps[timestamps.length-1])) {
										completeBy = "End of Week";
									} else if(schedule == "Monthly" && !timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
										completeBy = "End of Month";
									} else {
										completeBy = "completed";
									}
								} else {
									if(schedule == "Daily") {
										completeBy = "End of Day";
									} else if(schedule == "Weekly") {
										completeBy = "End of Week";
									} else if(schedule == "Monthly") {
										completeBy = "End of Month";
									}
								}

								if(completeBy != "completed") {
									// set id of the report
	                                formId = forms[i];

	                                // create JSON object for the array
	                                var report = {
	                                    "name": name,
	                                    "formId": formId,
	                                    "completeBy": completeBy
	                                };
	                                list.push(report);
								}
                            }

                            // create JSON response object
                            var reports = {list};

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(reports);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.results = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.formId && req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var results = root.forms.results;
                            var intervals = root.forms.intervals;
                            var templates = root.forms.templates;

                            var completedResults;

                            if(results && results[req.query.formId]) {
                                var timestamps = Object.keys(results[req.query.formId]);
                                var result = results[req.query.formId][timestamps[timestamps.length - 1]];
                                var title = templates[req.query.formId].title;

                                completedResults = {
                                    "completedBy": result.completedBy,
                                    "datestamp": timestamps[timestamps.length - 1],
                                    "results": result.results,
                                    "title": title
                                };

                                cors(req, res, () => {
                                    res.status(200).send(completedResults);
                                });
                            } else {
                                cors(req, res, () => {
                                    res.status(400).send('Results for ' + req.query.formId + ' do not exist');
                                });
                            }
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else if(!req.query.formId && req.query.uid) {
            cors(req, res, () => {
                res.status(400).send("Missing 'formId' parameter");
            });
        } else if(req.query.formId && !req.query.uid) {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'formId' and 'uid' parameters");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.checkCompletion = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.formId && req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var results = root.forms.results;
                            var intervals = root.forms.intervals;
                            var time = getTime();

                            var completed = false;

                            if(results && results[req.query.formId]) {
                                var schedule = intervals[req.query.formId].frequency;
                                var timestamps = Object.keys(results[req.query.formId]);

                                if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                    completed = true;
                                } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                    completed = true;
                                } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                    completed = true;
                                }
                            }

                            cors(req, res, () => {
                                res.status(200).send(completed);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else if(!req.query.formId && req.query.uid) {
            cors(req, res, () => {
                res.status(400).send("Missing 'formId' parameter");
            });
        } else if(req.query.formId && !req.query.uid) {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'formId' and 'uid' parameters");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.home = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0) {
                        admin.database().ref('/').once('value', function(snap) {
                            // initialize data variables
                            var root = snap.val();
                            var intervals = root.forms.intervals;
                            var results = root.forms.results;
                            var templates = root.forms.templates;
                            var inventory = root.inventory;
                            var users = root.users;
                            var forms = Object.keys(intervals);
                            var time = getTime();

                            // initialize return variables
                            var totalUsers = Object.keys(users).length;
                            var totalReports = 0;
                            var reportsToDo = 0;
                            var toDoList = [];

                            // run through available forms and add to counters and todo list
                            for(var i = 0; i < Object.keys(inventory).length; i++) {
                                var itemType = Object.keys(inventory)[i];
                                for(var j = 0; j < Object.keys(inventory[itemType]).length; j++) {
                                    var itemKey = Object.keys(inventory[itemType])[j];
                                    if(inventory[itemType][itemKey].compartments) {
                                        var compartments = inventory[itemType][itemKey].compartments;
                                        var push = false;
                                        var complete = true;

                                        for(var k = 0; k < Object.keys(compartments).length; k++) {
                                            var formId = compartments[Object.keys(compartments)[k]].formId;
                                            for(var l = 0; l < formId.length; l++) {
                                                if(intervals[formId[l]].days[time.weekday]) {
                                                    push = true;

                                                    if(results && results[formId[l]]) {
                                                        var frequency = intervals[formId[l]].frequency;
                                                        var timestamps = Object.keys(results[formId[l]]);

                                                        if(frequency == "Daily" && !timestamps.includes(time.datestamp)) {
                                                            complete = false;
                                                            break;
                                                        } else if(frequency == "Weekly" && !time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                                            complete = false;
                                                            break;
                                                        } else if(frequency == "Monthly" && !timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                                            complete = false;
                                                            break;
                                                        }
                                                    } else {
                                                        complete = false;
                                                        break;
                                                    }
                                                }
                                            }

                                            if(!complete) {
                                                reportsToDo++;
                                                break;
                                            }
                                        }

                                        if(push) {
                                            totalReports++;
                                            toDoList.push({
                                                "title": inventory[itemType][itemKey].name,
                                                "complete": complete
                                            });
                                        }
                                    } else {
                                        var formId = inventory[itemType][itemKey].formId;
                                        for(var l = 0; l < formId.length; l++) {
                                            if(intervals[formId[l]].days[time.weekday]) {
                                                var complete = false;

                                                if(results && results[formId[l]]) {
                                                    var frequency = intervals[formId[l]].frequency;
                                                    var timestamps = Object.keys(results[formId[l]]);

                                                    if(frequency == "Daily" && timestamps.includes(time.datestamp)) {
                                                        complete = true;
                                                    } else if(frequency == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                                        complete = true;
                                                    } else if(frequency == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                                        complete = true;
                                                    }
                                                }

                                                if(!complete) {
                                                    reportsToDo++;
                                                }

                                                totalReports++;
                                                toDoList.push({
                                                    "title": templates[formId[l]].title,
                                                    "complete": complete
                                                });
                                            }
                                        }
                                    }
                                }
                            }

                            // create JSON response object
                            var home = {
                                "totalUsers": totalUsers,
                                "totalReports": totalReports,
                                "reportsToDo": reportsToDo,
                                "toDoList": toDoList,
								"alerts": root.alerts
                            };

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(home);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.reports = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0) {
                        admin.database().ref('/').once('value', function(snap) {
                            // initialize data variables
                            var root = snap.val();
                            var intervals = root.forms.intervals;
                            var results = root.forms.results;
                            var templates = root.forms.templates;
                            var inventory = root.inventory;
                            var users = root.users;
                            var forms = Object.keys(intervals);
                            var time = getTime(req.query.date);

                            var retVal = {
                                "reports": []
                            };

                            // run through available forms and add to counters and todo list
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
                                            for(var l = 0; l < formId.length; l++) {
                                                var frequency = intervals[formId[l]].frequency;
                                                var itemCount = templates[formId[l]].inputElements.length;
                                                schedule = frequency;

                                                for(var m = 0; m < templates[formId[l]].inputElements.length; m++) {
                                                    data.rows.push({
                                                        "compartment": templates[formId[l]].title,
                                                        "item": templates[formId[l]].inputElements[m].caption
                                                    });
                                                }

                                                if(results && results[formId[l]]) {
                                                    var timestamps = Object.keys(results[formId[l]]);

                                                    if(frequency == "Daily") {
                                                        for(var m = 0; m < time.weekstamps.length; m++) {
                                                            if(!timestamps.includes(time.weekstamps[m])) {
                                                                status = "Incomplete";
                                                            } else {
                                                                days[weekday[m]] = true;
                                                                for(var n = 0; n < results[formId[l]][time.weekstamps[m]].results.length; n++) {
                                                                    var result = results[formId[l]][time.weekstamps[m]].results[n].result;
                                                                    if(result == "Repairs Needed") {
                                                                        data.rows[offset+n][weekday[m]] = {
                                                                            result: result,
                                                                            note: results[formId[l]][time.weekstamps[m]].results[n].note,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
                                                                        };
                                                                    } else {
                                                                        data.rows[offset+n][weekday[m]] = {
                                                                            result: result,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
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
                                                                for(var n = 0; n < results[formId[l]][time.weekstamps[m]].results.length; n++) {
                                                                    var result = results[formId[l]][time.weekstamps[m]].results[n].result;
                                                                    if(result == "Repairs Needed") {
                                                                        data.rows[offset+n][weekday[m]] = {
                                                                            result: result,
                                                                            note: results[formId[l]][time.weekstamps[m]].results[n].note,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
                                                                        };
                                                                    } else {
                                                                        data.rows[offset+n][weekday[m]] = {
                                                                            result: result,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
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
                                                                        for(var o = 0; o < results[formId[l]][completedTimestamp].results.length; o++) {
                                                                            var result = results[formId[l]][completedTimestamp].results[o].result;
                                                                            if(result == "Repairs Needed") {
                                                                                data.rows[offset+o][weekday[m]] = {
                                                                                    result: result,
                                                                                    note: results[formId[l]][completedTimestamp].results[o].note,
                                                                                    completedBy: results[formId[l]][completedTimestamp].completedBy
                                                                                };
                                                                            } else {
                                                                                data.rows[offset+o][weekday[m]] = {
                                                                                    result: result,
                                                                                    completedBy: results[formId[l]][completedTimestamp].completedBy
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
                                                                for(var n = 0; n < results[formId[l]][time.weekstamps[m]].results.length; n++) {
                                                                    var result = results[formId[l]][time.weekstamps[m]].results[n].result;
                                                                    if(result == "Repairs Needed") {
                                                                        data.rows[offset+n][weekday[m]] = {
                                                                            result: result,
                                                                            note: results[formId[l]][time.weekstamps[m]].results[n].note,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
                                                                        };
                                                                    } else {
                                                                        data.rows[offset+n][weekday[m]] = {
                                                                            result: result,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
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
                                            "data": data
                                        });

                                    } else {
                                        var formId = inventory[itemType][itemKey].formId;
                                        for(var l = 0; l < formId.length; l++) {
                                            var frequency = intervals[formId[l]].frequency;

                                            var name = templates[formId[l]].title;
                                            var schedule = frequency;
                                            var status = "Complete";
                                            var completedTimestamp = null;
                                            var id = formId[l];
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

                                            if(templates[formId[l]].inputElements) {
                                                for(var m = 0; m < templates[formId[l]].inputElements.length; m++) {
                                                    data.rows.push({
                                                        "compartment": "Main",
                                                        "item": templates[formId[l]].inputElements[m].caption
                                                    });
                                                }

                                                if(results && results[formId[l]]) {
                                                    var timestamps = Object.keys(results[formId[l]]);

                                                    if(frequency == "Daily") {
                                                        for(var m = 0; m < time.weekstamps.length; m++) {
                                                            if(!timestamps.includes(time.weekstamps[m])) {
                                                                status = "Incomplete";
                                                            } else {
                                                                days[weekday[m]] = true;
                                                                for(var n = 0; n < results[formId[l]][time.weekstamps[m]].results.length; n++) {
                                                                    var result = results[formId[l]][time.weekstamps[m]].results[n].result;
                                                                    if(result == "Repairs Needed") {
                                                                        data.rows[n][weekday[m]] = {
                                                                            result: result,
                                                                            note: results[formId[l]][time.weekstamps[m]].results[n].note,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
                                                                        };
                                                                    } else {
                                                                        data.rows[n][weekday[m]] = {
                                                                            result: result,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
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
                                                                for(var n = 0; n < results[formId[l]][time.weekstamps[m]].results.length; n++) {
                                                                    var result = results[formId[l]][time.weekstamps[m]].results[n].result;
                                                                    if(result == "Repairs Needed") {
                                                                        data.rows[n][weekday[m]] = {
                                                                            result: result,
                                                                            note: results[formId[l]][time.weekstamps[m]].results[n].note,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
                                                                        };
                                                                    } else {
                                                                        data.rows[n][weekday[m]] = {
                                                                            result: result,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
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
                                                                        for(var o = 0; o < results[formId[l]][completedTimestamp].results.length; o++) {
                                                                            var result = results[formId[l]][completedTimestamp].results[o].result;
                                                                            if(result == "Repairs Needed") {
                                                                                data.rows[o][weekday[m]] = {
                                                                                    result: result,
                                                                                    note: results[formId[l]][completedTimestamp].results[o].note,
                                                                                    completedBy: results[formId[l]][completedTimestamp].completedBy
                                                                                };
                                                                            } else {
                                                                                data.rows[o][weekday[m]] = {
                                                                                    result: result,
                                                                                    completedBy: results[formId[l]][completedTimestamp].completedBy
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
                                                                for(var n = 0; n < results[formId[l]][time.weekstamps[m]].results.length; n++) {
                                                                    var result = results[formId[l]][time.weekstamps[m]].results[n].result;
                                                                    if(result == "Repairs Needed") {
                                                                        data.rows[n][weekday[m]] = {
                                                                            result: result,
                                                                            note: results[formId[l]][time.weekstamps[m]].results[n].note,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
                                                                        };
                                                                    } else {
                                                                        data.rows[n][weekday[m]] = {
                                                                            result: result,
                                                                            completedBy: results[formId[l]][time.weekstamps[m]].completedBy
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
                                                for(var m = 0; m < templates[formId[l]].subSections.length; m++) {
                                                    var itemCount = templates[formId[l]].subSections[m].inputElements.length;
                                                    for(var n = 0; n < templates[formId[l]].subSections[m].inputElements.length; n++) {
                                                        data.rows.push({
                                                            "compartment": templates[formId[l]].subSections[m].title,
                                                            "item": templates[formId[l]].subSections[m].inputElements[n].caption
                                                        });
                                                    }

                                                    if(results && results[formId[l]]) {
                                                        var timestamps = Object.keys(results[formId[l]]);

                                                        if(frequency == "Daily") {
                                                            for(var n = 0; n < time.weekstamps.length; n++) {
                                                                if(!timestamps.includes(time.weekstamps[n])) {
                                                                    status = "Incomplete";
                                                                } else {
                                                                    days[weekday[n]] = true;
                                                                    for(var o = 0; o < results[formId[l]][time.weekstamps[n]].results[m].results.length; o++) {
                                                                        var result = results[formId[l]][time.weekstamps[n]].results[m].results[o].result;
                                                                        if(result == "Repairs Needed") {
                                                                            data.rows[offset+o][weekday[n]] = {
                                                                                result: result,
                                                                                note: results[formId[l]][time.weekstamps[n]].results[m].results[o].note,
                                                                                completedBy: results[formId[l]][time.weekstamps[n]].completedBy
                                                                            };
                                                                        } else {
                                                                            data.rows[offset+o][weekday[n]] = {
                                                                                result: result,
                                                                                completedBy: results[formId[l]][time.weekstamps[n]].completedBy
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
                                                                    for(var o = 0; o < results[formId[l]][time.weekstamps[n]].results[m].results.length; o++) {
                                                                        var result = results[formId[l]][time.weekstamps[n]].results[m].results[o].result;
                                                                        if(result == "Needs Repair") {
                                                                            data.rows[offset+o][weekday[n]] = {
                                                                                result: result,
                                                                                note : results[formId[l]][time.weekstamps[n]].results[m].results[o].note,
                                                                                completedBy: results[formId[l]][time.weekstamps[n]].completedBy
                                                                            };
                                                                        } else {
                                                                            data.rows[offset+o][weekday[n]] = {
                                                                                result: result,
                                                                                completedBy: results[formId[l]][time.weekstamps[n]].completedBy
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
                                                                            for(var p = 0; p < results[formId[l]][completedTimestamp].results[m].results.length; p++) {
                                                                                var result = results[formId[l]][completedTimestamp].results[m].results[p].result;
                                                                                if(result == "Needs Repair") {
                                                                                    data.rows[offset+p][weekday[n]] = {
                                                                                        result: result,
                                                                                        note: results[formId[l]][completedTimestamp].results[m].results[p].note,
                                                                                        completedBy: results[formId[l]][completedTimestamp].completedBy
                                                                                    };
                                                                                } else {
                                                                                    data.rows[offset+p][weekday[n]] = {
                                                                                        result: result,
                                                                                        completedBy: results[formId[l]][completedTimestamp].completedBy
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
                                                                    for(var o = 0; o < results[formId[l]][time.weekstamps[n]].results[m].results.length; o++) {
                                                                        var result = results[formId[l]][time.weekstamps[n]].results[m].results[o].result;
                                                                        if(result == "Needs Repair") {
                                                                            data.rows[offset+o][weekday[n]] = {
                                                                                result: result,
                                                                                note: results[formId[l]][time.weekstamps[n]].results[m].results[o].note,
                                                                                completedBy: results[formId[l]][time.weekstamps[n]].completedBy
                                                                            };
                                                                        } else {
                                                                            data.rows[offset+o][weekday[n]] = {
                                                                                result: result,
                                                                                completedBy: results[formId[l]][time.weekstamps[n]].completedBy
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
                                                "data": data
                                            });
                                        }
                                    }
                                }
                            }

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(retVal);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.users = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0) {
                        admin.database().ref('/users/').once('value', function(snap) {
                            // initialize data variables
                            var users = snap.val();

                            var userList = { "list": [] };

                            for(var i = 0; i < Object.keys(users).length; i++) {
                                    var type;

                                if(users[Object.keys(users)[i]].authentication == 0) {
                                    type = "administrator";
                                } else if(users[Object.keys(users)[i]].authentication == 1) {
                                    type = "user";
                                }

                                userList.list.push({
                                    "firstName": users[Object.keys(users)[i]].firstName,
                                    "lastName": users[Object.keys(users)[i]].lastName,
                                    "email": users[Object.keys(users)[i]].email,
                                    "type": type,
									"alert": users[Object.keys(users)[i]].alert
                                });
                            }

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(userList);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else if(req.method == "POST") {
        if(req.body) {
            var body = req.body;
            if(body.uid && body.user) {
                getAuth(body.uid, function(auth) {
                    if(auth != 401) {
                        if(auth == 0) {
                            admin.auth().getUserByEmail(body.user.email).then(function(user) {
                                var authentication;
                                if(body.user.type == "user") {
                                    authentication = 1;
                                } else if(body.user.type == "administrator") {
                                    authentication = 0;
                                }

                                admin.database().ref('/users/' + user.uid).set({
                                    "email": user.email,
                                    "firstName": body.user.firstName,
                                    "lastName": body.user.lastName,
                                    "authentication": authentication,
									"alert": body.user.alert
                                });

                                cors(req, res, () => {
                                    res.sendStatus(200);
                                });
                            }).catch(function(error) {
                                var password = Math.random().toString(36).slice(-8);

                                admin.auth().createUser({
                                    email: body.user.email,
                                    emailVerified: true,
                                    password: password,
                                    disabled: false
                                }).then(function(user) {
                                    var authentication;
                                    if(body.user.type == "user") {
                                        authentication = 1;
                                    } else if(body.user.type == "administrator") {
                                        authentication = 0;
                                    }

                                    admin.database().ref('/users/' + user.uid).set({
                                        "email": user.email,
                                        "firstName": body.user.firstName,
                                        "lastName": body.user.lastName,
                                        "authentication": authentication,
										"alert": body.user.alert
                                    });

                                    firebase.auth().sendPasswordResetEmail(user.email).then(function() {
                                        cors(req, res, () => {
                                            res.sendStatus(200);
                                        });
                                    }).catch(function(error) {
                                        cors(req, res, () => {
                                            res.status(400).send(error);
                                        });
                                    });
                                }).catch(function(error) {
                                    cors(req, res, () => {
                                        res.status(400).send(error);
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
                            res.status(401).send('The user is not authorized for access');
                        });
                    }
                });
            } else if(body.uid && !body.user) {
                cors(req, res, () => {
                    res.status(400).send("Missing 'user' parameter");
                });
            } else if(!body.uid && body.user) {
                cors(req, res, () => {
                    res.status(400).send("Missing 'uid' parameter");
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing 'uid' and 'user' parameter");
                });
            }
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing request body");
            });
        }
    } else if(req.method == "DELETE") {
        if(req.body) {
            var body = req.body;
            if(body.uid && body.user) {
                getAuth(body.uid, function(auth) {
                    if(auth != 401) {
                        if(auth == 0) {
                            admin.auth().getUserByEmail(body.user.email).then(function(user) {
                                admin.auth().deleteUser(user.uid).then(function() {
                                    admin.database().ref('/users/' + user.uid).set(null);
                                }).catch(function(error) {
                                    cors(req, res, () => {
                                        res.status(400).send(error);
                                    });
                                });

                                cors(req, res, () => {
                                    res.sendStatus(200);
                                });
                            }).catch(function(error) {
                                cors(req, res, () => {
                                    res.status(400).send(error);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send('The user is not authorized for access');
                        });
                    }
                });
            } else if(body.uid && !body.user) {
                cors(req, res, () => {
                    res.status(400).send("Missing 'user' parameter");
                });
            } else if(!body.uid && body.user) {
                cors(req, res, () => {
                    res.status(400).send("Missing 'uid' parameter");
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing 'uid' and 'user' parameter");
                });
            }
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing request body");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.userInfo = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/users/' + req.query.uid).once('value', function(snap) {
                            // initialize data variables
                            var userInfo = snap.val();

                            var type;

                            if(userInfo.authentication == 0) {
                                type = "administrator";
                            } else if(userInfo.authentication == 1) {
                                type = "user";
                            }

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(userInfo);
                            });
                        });
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.resetPassword = functions.https.onRequest((req, res) => {
    if(req.method == "POST") {
        if(req.body) {
            var body = req.body;
            if(body.uid && body.user) {
                getAuth(body.uid, function(auth) {
                    if(auth != 401) {
                        if(auth == 0) {
                            firebase.auth().sendPasswordResetEmail(body.user.email).then(function() {
                                cors(req, res, () => {
                                    res.sendStatus(200);
                                });
                            }).catch(function(error) {
                                cors(req, res, () => {
                                    res.status(400).send(error);
                                });
                            });
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send('The user is not authorized for access');
                        });
                    }
                });
            } else if(body.uid && !body.user) {
                cors(req, res, () => {
                    res.status(400).send("Missing 'user' parameter");
                });
            } else if(!body.uid && body.user) {
                cors(req, res, () => {
                    res.status(400).send("Missing 'uid' parameter");
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing 'uid' and 'user' parameter");
                });
            }
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing request body");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.listReports = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0) {
                        admin.database().ref('/').once('value', function(snap) {
                            // initialize data variables
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

										for(var k = 0; k < Object.keys(inventory[itemType][itemKey].compartments).length; k++) {
											var compartmentKey = Object.keys(inventory[itemType][itemKey].compartments)[k];
											for(var l = 0; l < inventory[itemType][itemKey].compartments[compartmentKey].formId.length; l++) {
												var formId = inventory[itemType][itemKey].compartments[compartmentKey].formId[l];
												templates[formId].id = formId;
												listItem.template.subSections.push(templates[formId]);
											}
										}

										reportsList.list.push(listItem);
									} else {
										for(var k = 0; k < inventory[itemType][itemKey].formId.length; k++) {
											var formId = inventory[itemType][itemKey].formId[k];

											reportsList.list.push({
												"id": formId,
												"itemCategory": itemType,
												"interval": intervals[formId],
												"template": templates[formId]
											});
										}
									}
								}
							}

                            // send response
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
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
	} else if(req.method == "POST") {
		if(req.body) {
            var body = req.body;
            if(body.uid && body.report) {
                getAuth(body.uid, function(auth) {
                    if(auth != 401) {
                        if(auth == 0) {
							const report = body.report;

							if(report.template.inputElements) {
								if(report.id) {
									admin.database().ref(`forms/intervals/${report.id}`).set(report.interval).then(() => {
										admin.database().ref(`forms/templates/${report.id}`).set(report.template).then(() => {
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
								}
							} else if(report.itemCategory == "vehicles") {
								if(report.id) {
									admin.database().ref(`forms/intervals/${report.id}`).set(report.interval).then(() => {
										for(var i = 0; i < report.template.subSections.length; i++) {
											if(report.template.subSections[i].id) {
												admin.database().ref(`forms/intervals/${report.template.subSections[i].id}`).set(report.interval);
												admin.database().ref(`forms/templates/${report.template.subSections[i].id}`).set({
													inputElements: report.template.subSections[i].inputElements,
													title: `${report.template.title} - ${report.template.subSections[i].title}`
												});
											} else {
												var newKey = admin.database().ref(`forms/intervals`).push().key;

												if(newKey) {
													admin.database().ref(`forms/intervals/${newKey}`).set(report.interval);
													admin.database().ref(`forms/templates/${newKey}`).set({
														inputElements: report.template.subSections[i].inputElements,
														title: `${report.template.title} - ${report.template.subSections[i].title}`
													});
													admin.database().ref(`inventory/vehicles/${report.id}/compartments/${newKey}`).set({
														formId: [newKey],
														name: report.template.subSections[i].title
													});
												}
											}
										}

										cors(req, res, () => {
								            res.sendStatus(200);
								        });
									}).catch(err => {
										cors(req, res, () => {
								            res.status(400).send(err);
								        });
									});
								} else {
									var newVehicleKey = admin.database().ref('inventory/vehicles').push().key;

									if(newVehicleKey) {
										admin.database().ref(`inventory/vehicles/${newVehicleKey}`).set({
											name: report.template.title
										}).then(() => {
											admin.database().ref(`forms/intervals/${newVehicleKey}`).set(report.interval).then(() => {
												for(var i = 0; i < report.template.subSections.length; i++) {
													var newKey = admin.database().ref(`inventory/vehicles/${newVehicleKey}`).push().key;

													if(newKey) {
														admin.database().ref(`inventory/vehicles/${newVehicleKey}/compartments/${newKey}`).set({
															formId: [newKey],
															name: report.template.subSections[i].title
														});
														admin.database().ref(`forms/intervals/${newKey}`).set(report.interval);
														admin.database().ref(`forms/templates/${newKey}`).set({
															inputElements: report.template.subSections[i].inputElements,
															title: `${report.template.title} - ${report.template.subSections[i].title}`
														});
													}
												}

												cors(req, res, () => {
										            res.sendStatus(200);
										        });
											});
										});
									}
								}
							} else {
								if(report.id) {
									admin.database().ref(`forms/intervals/${report.id}`).set(report.interval).then(() => {
										admin.database().ref(`forms/templates/${report.id}`).set(report.template).then(() => {
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
									var newKey = admin.database().ref('forms/intervals').push().key;

									if(newKey) {
										admin.database().ref(`forms/intervals/${newKey}`).set(report.interval).then(() => {
											admin.database().ref(`forms/templates/${newKey}`).set(report.template).then(() => {
												admin.database().ref(`inventory/${report.itemCategory}/${newKey}`).set({
													formId: [newKey],
													name: report.template.title
												}).then(() => {
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
								}
							}
                        } else {
                            cors(req, res, () => {
                                res.status(403).send("The request violates the user's permission level");
                            });
                        }
                    } else {
                        cors(req, res, () => {
                            res.status(401).send('The user is not authorized for access');
                        });
                    }
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, report");
                });
            }
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing request body");
            });
        }
	} else if(req.method == "DELETE") {
		if(req.body) {
            var body = req.body;
            if(body.uid && body.id && body.itemCategory) {
                getAuth(body.uid, function(auth) {
                    if(auth != 401) {
                        if(auth == 0) {
							if(body.itemCategory == "vehicles") {
								admin.database().ref(`inventory/vehicles/${body.id}/compartments`).once('value').then(compartmentsSnap => {
									var compartments = compartmentsSnap.val();

									for(var i = 0; i < Object.keys(compartments).length; i++) {
										var formId = compartments[Object.keys(compartments)[i]].formId[0];

										admin.database().ref(`forms/intervals/${formId}`).set(null);
										admin.database().ref(`forms/templates/${formId}`).set(null);
									}

									admin.database().ref(`forms/intervals/${body.id}`).set(null);
									admin.database().ref(`inventory/vehicles/${body.id}`).set(null);

									cors(req, res, () => {
							            res.sendStatus(200);
							        });
								});
							} else {
								admin.database().ref(`inventory/${body.itemCategory}/${body.id}`).set(null);
								admin.database().ref(`forms/intervals/${body.id}`).set(null);
								admin.database().ref(`forms/templates/${body.id}`).set(null);

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
                            res.status(401).send('The user is not authorized for access');
                        });
                    }
                });
            } else {
                cors(req, res, () => {
                    res.status(400).send("Missing parameter(s): uid, id, itemCategory");
                });
            }
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing request body");
            });
        }
	} else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.sendIncompleteFormsEmail = functions.https.onRequest((req, res) => {
	if(req.method == "GET") {
        admin.database().ref('/').once('value', function(snap) {
			var root = snap.val();
			var emails = [];
			var time = getTime();
			var inventory = root.inventory;
			var results = root.forms.results;
			var intervals = root.forms.intervals;
			var templates = root.forms.templates;
			var toDoList = [];

			for(var i = 0; i < Object.keys(root.users).length; i++) {
				var user = Object.keys(root.users)[i];

				if(root.users[user].alert) {
					emails.push(root.users[user].email);
				}
			}

			for(var i = 0; i < Object.keys(inventory).length; i++) {
                var itemType = Object.keys(inventory)[i];
                for(var j = 0; j < Object.keys(inventory[itemType]).length; j++) {
                    var itemKey = Object.keys(inventory[itemType])[j];
                    if(inventory[itemType][itemKey].compartments) {
                        var compartments = inventory[itemType][itemKey].compartments;
                        var push = false;
                        var complete = true;

                        for(var k = 0; k < Object.keys(compartments).length; k++) {
                            var formId = compartments[Object.keys(compartments)[k]].formId;
                            for(var l = 0; l < formId.length; l++) {
                                if(intervals[formId[l]].days[time.weekday]) {
                                    push = true;

                                    if(results && results[formId[l]]) {
                                        var frequency = intervals[formId[l]].frequency;
                                        var timestamps = Object.keys(results[formId[l]]);

                                        if(frequency == "Daily" && !timestamps.includes(time.datestamp)) {
                                            complete = false;
                                            break;
                                        } else if(frequency == "Weekly" && !time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                            complete = false;
                                            break;
                                        } else if(frequency == "Monthly" && !timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                            complete = false;
                                            break;
                                        }
                                    } else {
                                        complete = false;
                                        break;
                                    }
                                }
                            }

                            if(!complete) {
                                break;
                            }
                        }

                        if(push) {
                            toDoList.push({
                                "title": inventory[itemType][itemKey].name,
                                "complete": complete
                            });
                        }
                    } else {
                        var formId = inventory[itemType][itemKey].formId;
                        for(var l = 0; l < formId.length; l++) {
                            if(intervals[formId[l]].days[time.weekday]) {
                                var complete = false;

                                if(results && results[formId[l]]) {
                                    var frequency = intervals[formId[l]].frequency;
                                    var timestamps = Object.keys(results[formId[l]]);

                                    if(frequency == "Daily" && timestamps.includes(time.datestamp)) {
                                        complete = true;
                                    } else if(frequency == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                        complete = true;
                                    } else if(frequency == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                        complete = true;
                                    }
                                }

                                toDoList.push({
                                    "title": templates[formId[l]].title,
                                    "complete": complete
                                });
                            }
                        }
                    }
                }
            }

			if(toDoList.length > 0) {
	            var mailOptions = {
					from: '"Oviedo Fire" <oviedofiresd@gmail.com>',
					bcc: emails.join(),
					subject: time.formattedDate + ': Incomplete Forms',
					text: 'The following form(s) are incomplete for ' + time.formattedDate + ':\n'
				}

				for(var i = 0; i < toDoList.length; i++) {
					if(!toDoList[i].complete) {
						mailOptions.text += "\n\t" + toDoList[i].title;
					}
				}

				admin.database().ref(`alerts/incompleteForms`).push().set(mailOptions.text);

				mailOptions.text += "\n\nThanks,\n\nYour OviedoFireSD team";

				mailTransport.sendMail(mailOptions).then(function() {
					cors(req, res, () => {
	                    res.sendStatus(200);
	                });
				}).catch(function(err) {
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
	}
});

exports.sendRepairItemsEmail = functions.https.onRequest((req, res) => {
	if(req.method == "GET") {
        admin.database().ref('/alerts/repairItems').once('value', function(snap) {
			admin.database().ref('/users').once('value').then(usersSnap => {
				const users = usersSnap.val();
				const repairItems = snap.val();
				var emails = [];
				var time = getTime();

				Object.keys(users).forEach(userKey => {
					if(users[userKey].alert) {
						emails.push(users[userKey].email);
					}
				});

				if(repairItems) {
					var mailOptions = {
						from: '"Oviedo Fire" <oviedofiresd@gmail.com>',
						bcc: emails.join(),
						subject: time.formattedDate + ': Repair Items',
						text: 'The following item(s) need repair:\n'
					}

					Object.keys(repairItems).forEach(itemKey => {
						mailOptions.text += `\n${repairItems[itemKey]}`
					});

					mailOptions.text += "\n\nThanks,\n\nYour OviedoFireSD team";

					mailTransport.sendMail(mailOptions).then(function() {
						cors(req, res, () => {
		                    res.sendStatus(200);
		                });
					}).catch(function(err) {
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
        });
	}
});

exports.sendMissingItemsEmail = functions.https.onRequest((req, res) => {
	if(req.method == "GET") {
        admin.database().ref('/alerts/missingItems').once('value', function(snap) {
			admin.database().ref('/users').once('value').then(usersSnap => {
				const users = usersSnap.val();
				const missingItems = snap.val();
				var emails = [];
				var time = getTime();

				Object.keys(users).forEach(userKey => {
					if(users[userKey].alert) {
						emails.push(users[userKey].email);
					}
				});

				if(missingItems) {
					var mailOptions = {
						from: '"Oviedo Fire" <oviedofiresd@gmail.com>',
						bcc: emails.join(),
						subject: time.formattedDate + ': Missing Items',
						text: 'The following item(s) are missing:\n'
					}

					Object.keys(missingItems).forEach(itemKey => {
						mailOptions.text += `\n${missingItems[itemKey]}`
					});

					mailOptions.text += "\n\nThanks,\n\nYour OviedoFireSD team";

					mailTransport.sendMail(mailOptions).then(function() {
						cors(req, res, () => {
		                    res.sendStatus(200);
		                });
					}).catch(function(err) {
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
        });
	}
});

exports.sendFailItemsEmail = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        admin.database().ref('/alerts/failItems').once('value', function(snap) {
            admin.database().ref('/users').once('value').then(usersSnap => {
                const users = usersSnap.val();
                const failItems = snap.val();
                var emails = [];
                var time = getTime();

                Object.keys(users).forEach(userKey => {
                    if(users[userKey].alert) {
                        emails.push(users[userKey].email);
                    }
                });

                if(failItems) {
                    var mailOptions = {
                        from: '"Oviedo Fire" <oviedofiresd@gmail.com>',
                        bcc: emails.join(),
                        subject: time.formattedDate + ': Failed Items',
                        text: 'The following item(s) are marked as failures:\n'
                    }

                    Object.keys(failItems).forEach(itemKey => {
                        mailOptions.text += `\n${failItems[itemKey]}`
                    });

                    mailOptions.text += "\n\nThanks,\n\nYour OviedoFireSD team";

                    mailTransport.sendMail(mailOptions).then(function() {
                        cors(req, res, () => {
                            res.sendStatus(200);
                        });
                    }).catch(function(err) {
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
        });
    }
});

exports.statistics = functions.https.onRequest((req, res) => {
	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}

    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0) {
						var time = getTime();

						admin.database().ref('/statistics').once('value').then(statisticsSnap => {
							var statistics = statisticsSnap.val();
							var retVal = {
								January: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								February: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								March: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								April: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								May: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								June: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								July: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								August: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								September: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								October: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								November: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								},
								December: {
									repairsNeeded: 0,
									missing: 0,
                                    failed: 0
								}
							};

							if(statistics) {
								for(var i = 0; i < 12; i++) {
									var month = pad(i+1, 2);
									var yearMonth = time.year + month;

									if(statistics[yearMonth]) {
										if(statistics[yearMonth].repairsNeeded) {
											retVal[Object.keys(retVal)[i]].repairsNeeded = Object.keys(statistics[yearMonth].repairsNeeded).length;
										}

										if(statistics[yearMonth].missing) {
											retVal[Object.keys(retVal)[i]].missing = Object.keys(statistics[yearMonth].missing).length;
										}

                                        if(statistics[yearMonth].failed) {
                                            retVal[Object.keys(retVal)[i]].failed = Object.keys(statistics[yearMonth].failed).length;
                                        }
									}
								}
							}

							cors(req, res, () => {
								res.status(200).send(retVal);
                        	});
						});
                    } else {
                        cors(req, res, () => {
                            res.status(403).send("The request violates the user's permission level");
                        });
                    }
                } else {
                    cors(req, res, () => {
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.dismissAlert = functions.https.onRequest((req, res) => {
    if(req.method == "POST") {
        if(req.query.uid && req.query.type && req.query.key) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0) {
						admin.database().ref(`alerts/${req.query.type}/${req.query.key}`).set(null).then(() => {
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
                        res.status(401).send('The user is not authorized for access');
                    });
                }
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing parameter(s): uid, type, key");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});
