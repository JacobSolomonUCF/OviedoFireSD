const functions = require('firebase-functions');
var cors = require('cors')({origin: true});
var admin = require('firebase-admin');
var serviceAccount = require("./admin/oviedofiresd-55a71-firebase-adminsdk-ol8a1-20a377ac5e.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://oviedofiresd-55a71.firebaseio.com"
});

function getAuth(uid, callback) {
	admin.database().ref('/users/' + uid + '/authentication').once('value', function(snap) {
		if(snap.val() || snap.val() == 0) {
			callback(snap.val());
		} else {
			callback(401);
		}
	});
}

function getTime() {
    var weekday = new Array(7);
    weekday[0] = "sunday";
    weekday[1] = "monday";
    weekday[2] = "tuesday";
    weekday[3] = "wednesday";
    weekday[4] = "thursday";
    weekday[5] = "friday";
    weekday[6] = "saturday";

	var offset = -5.0;
	var serverDate = new Date();
	var utc = serverDate.getTime() + (serverDate.getTimezoneOffset() * 60000);
	var easternDate = new Date(utc + (3600000*offset));
    var yearMonth = easternDate.getFullYear().toString() + pad(easternDate.getMonth() + 1).toString();
    var today = easternDate.getDay();

    var datestamp = easternDate.getFullYear().toString() + pad(easternDate.getMonth() + 1).toString() + pad(easternDate.getDate()).toString();
    var weekstamps = [];

    easternDate.setDate(easternDate.getDate() - weekday.indexOf(weekday[today]));
    var sunday = easternDate.getFullYear().toString() + pad(easternDate.getMonth() + 1).toString() + pad(easternDate.getDate()).toString();
    weekstamps.push(sunday);

    for(var i = 0; i < 6; i++) {
        easternDate.setDate(easternDate.getDate() + 1);
        var day = easternDate.getFullYear().toString() + pad(easternDate.getMonth() + 1).toString() + pad(easternDate.getDate()).toString();
        weekstamps.push(day);
    }

	var time = {
        "yearMonth": yearMonth,
		"weekday": weekday[today],
        "datestamp": datestamp,
		"weekstamps": weekstamps
	}

	return time;
}

function pad(n) {
	return (n < 10) ? ("0" + n) : n;
}

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
							var totalUsers = Object.keys(root.users).length;
							var equipment = 0;
							var totalReports = 0;
							var reportsToDo = 0;
							var toDoList = [];

                            // recursively count equipment in inventory
							var numTrucks = Object.keys(inventory).length;
							for(var i = 0; i < numTrucks; i++) {
								var truck = Object.keys(inventory)[i];
								var numCompartments = Object.keys(inventory[truck]).length;
								for(var j = 0; j < numCompartments; j++) {
										var compartment = Object.keys(inventory[truck])[j];
										var numEquipment = Object.keys(inventory[truck][compartment]).length;
										equipment += numEquipment;
								}
							}

                            // run through available forms and add to counters and todo list
							var complete;
							for(var i = 0; i < forms.length; i++) {
								if(intervals[forms[i]].days[time.weekday]) {
                                    // add report to count for the day
									totalReports++;

                                    // check to see if the report has been completed
                                    if(results && results[forms[i]]) {
    									if(Object.keys(results[forms[i]]).includes(time.datestamp)) {
    										complete = true;
    									} else {
    										complete = false;
    									}
                                    } else {
                                        complete = false;
                                    }

                                    // add report to todo count for the day
                                    if(!complete) {
                                        reportsToDo++;
                                    }

                                    // create item for todo list
									var toDoItem = {
										"title": templates[forms[i]].title,
										"complete": complete
									};

                                    // add item to todo list
									toDoList.push(toDoItem);
								}
							}

                            // create JSON response object
							var home = {
								"totalUsers": totalUsers,
								"equipment": equipment,
								"totalReports": totalReports,
								"reportsToDo": reportsToDo,
								"toDoList": toDoList
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
                            var users = root.users
                            var forms = Object.keys(intervals);
                            var time = getTime();

                            // initialize return variables
                            var reportsList = [];
                            var name;
                            var schedule;
                            var status;
                            var id;

                            // run through all forms in the database
                            for(var i = 0; i < forms.length; i++) {
                                // set name of the report
                                name = templates[forms[i]].title;

                                // set schedule of the report
                                schedule = intervals[forms[i]].frequency;

                                // check to see if the form has been completed
                                status = "Incomplete";
                                if(results && results[forms[i]]) {
                                    var timestamps = Object.keys(results[forms[i]]);
                                    if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                        status = "Complete";
                                    } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                        status = "Complete";
                                    } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                        status = "Complete";
                                    }
                                }

                                // set id of the report
                                id = forms[i];

                                // create JSON object for the array
                                var report = {
                                    "name": name,
                                    "schedule": schedule,
                                    "status": status,
                                    "id": id
                                };
                                reportsList.push(report);
                            }

                            // create JSON response object
                            var reports = {reportsList};

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

exports.activeVehicles = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var vehicles = root.inventory.vehicles;

                            var activeVehicles = {
                                "list": []
                            };

                            for(var i = 0; i < Object.keys(vehicles).length; i++) {
                                activeVehicles.list.push({
                                    "name": vehicles[Object.keys(vehicles)[i]].name,
                                    "id": Object.keys(vehicles)[i]
                                });
                            }

                            // send response
                            cors(req, res, () => {
                                res.status(200).send(activeVehicles);
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

exports.vehicleCompartments = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.vehicleId && req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var vehicles = root.inventory.vehicles;
                            var results = root.forms.results;
                            var intervals = root.forms.intervals;
                            var compartments = vehicles[req.query.vehicleId].compartments;
                            var time = getTime();

                            if(compartments) {
                                var vehicleCompartments = {
                                    "list": []
                                };

                                for(var i = 0; i < Object.keys(compartments).length; i++) {
                                    var interval = intervals[compartments[Object.keys(compartments)[i]].formId];
                                    var completedBy = "nobody";

                                    if(interval) {
                                        var schedule = interval.frequency;

                                        if(results && results[compartments[Object.keys(compartments)[i]].formId]) {
                                            var timestamps = Object.keys(results[compartments[Object.keys(compartments)[i]].formId]);
                                            if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                                completedBy = results[compartments[Object.keys(compartments)[i]].formId][time.datestamp].completedBy;
                                            } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                                completedBy = results[compartments[Object.keys(compartments)[i]].formId][timestamps[timestamps.length - 1]].completedBy;
                                            } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                                completedBy = results[compartments[Object.keys(compartments)[i]].formId][timestamps[timestamps.length - 1]].completedBy;
                                            }
                                        }
                                    }

                                    vehicleCompartments.list.push({
                                        "name": compartments[Object.keys(compartments)[i]].name,
                                        "formId": compartments[Object.keys(compartments)[i]].formId,
                                        "completedBy": completedBy
                                    });
                                }

                                // send response
                                cors(req, res, () => {
                                    res.status(200).send(vehicleCompartments);
                                });
                            } else {
                                cors(req, res, () => {
                                    res.status(400).send('Compartments for ' + req.query.vehicleId + ' do not exist');
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
        } else if(!req.query.vehicleId && req.query.uid) {
            cors(req, res, () => {
                res.status(400).send("Missing 'vehicleId' parameter");
            });
        } else if(req.query.vehicleId && !req.query.uid) {
            cors(req, res, () => {
                res.status(400).send("Missing 'uid' parameter");
            });
        } else {
            cors(req, res, () => {
                res.status(400).send("Missing 'vehicleId' and 'uid' parameters");
            });
        }
    } else {
        cors(req, res, () => {
            res.sendStatus(404);
        });
    }
});

exports.form = functions.https.onRequest((req, res) => {
    if(req.method == "GET") {
        if(req.query.formId && req.query.uid) {
            getAuth(req.query.uid, function(auth) {
                if(auth != 401) {
                    if(auth == 0 || auth == 1) {
                        admin.database().ref('/').once('value', function(snap) {
                            var root = snap.val();
                            var templates = root.forms.templates;

                            if(templates[req.query.formId]) {
                                // send response
                                cors(req, res, () => {
                                    res.status(200).send(templates[req.query.formId]);
                                });
                            } else {
                                cors(req, res, () => {
                                    res.status(400).send("Template for " + req.query.formId + " does not exist");
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
                                var interval = intervals[ladders[Object.keys(ladders)[i]].formId];
                                var completedBy = "nobody";

                                if(interval) {
                                    var schedule = interval.frequency;

                                    if(results && results[ladders[Object.keys(ladders)[i]].formId]) {
                                        var timestamps = Object.keys(results[ladders[Object.keys(ladders)[i]].formId]);
                                        if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                            completedBy = results[ladders[Object.keys(ladders)[i]].formId][time.datestamp].completedBy;
                                        } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                            completedBy = results[ladders[Object.keys(ladders)[i]].formId][timestamps[timestamps.length - 1]].completedBy;
                                        } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                            completedBy = results[ladders[Object.keys(ladders)[i]].formId][timestamps[timestamps.length - 1]].completedBy;
                                        }
                                    }
                                }

                                ladderList.list.push({
                                    "name": ladders[Object.keys(ladders)[i]].name,
                                    "formId": ladders[Object.keys(ladders)[i]].formId,
                                    "completedBy": completedBy
                                });
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
                                var interval = intervals[stretchers[Object.keys(stretchers)[i]].formId];
                                var completedBy = "nobody";

                                if(interval) {
                                    var schedule = interval.frequency;

                                    if(results && results[stretchers[Object.keys(stretchers)[i]].formId]) {
                                        var timestamps = Object.keys(results[stretchers[Object.keys(stretchers)[i]].formId]);
                                        if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                            completedBy = results[stretchers[Object.keys(stretchers)[i]].formId][time.datestamp].completedBy;
                                        } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                            completedBy = results[stretchers[Object.keys(stretchers)[i]].formId][timestamps[timestamps.length - 1]].completedBy;
                                        } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                            completedBy = results[stretchers[Object.keys(stretchers)[i]].formId][timestamps[timestamps.length - 1]].completedBy;
                                        }
                                    }
                                }

                                stretcherList.list.push({
                                    "name": stretchers[Object.keys(stretchers)[i]].name,
                                    "formId": stretchers[Object.keys(stretchers)[i]].formId,
                                    "completedBy": completedBy
                                });
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
                                var interval = intervals[misc[Object.keys(misc)[i]].formId];
                                var completedBy = "nobody";

                                if(interval) {
                                    var schedule = interval.frequency;

                                    if(results && results[misc[Object.keys(misc)[i]].formId]) {
                                        var timestamps = Object.keys(results[misc[Object.keys(misc)[i]].formId]);
                                        if(schedule == "Daily" && timestamps.includes(time.datestamp)) {
                                            completedBy = results[misc[Object.keys(misc)[i]].formId][time.datestamp].completedBy;
                                        } else if(schedule == "Weekly" && time.weekstamps.includes(timestamps[timestamps.length - 1])) {
                                            completedBy = results[misc[Object.keys(misc)[i]].formId][timestamps[timestamps.length - 1]].completedBy;
                                        } else if(schedule == "Monthly" && timestamps[timestamps.length-1].substring(0,6) == time.yearMonth) {
                                            completedBy = results[misc[Object.keys(misc)[i]].formId][timestamps[timestamps.length - 1]].completedBy;
                                        }
                                    }
                                }

                                miscList.list.push({
                                    "name": misc[Object.keys(misc)[i]].name,
                                    "formId": misc[Object.keys(misc)[i]].formId,
                                    "completedBy": completedBy
                                });
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
                            var forms = Object.keys(intervals);
                            var time = getTime();

                            // initialize return variables
                            var list = [];
                            var name;
                            var schedule;
                            var completeBy;
                            var formId;

                            // run through all forms in the database
                            for(var i = 0; i < forms.length; i++) {
                                // set name of the report
                                name = templates[forms[i]].title;

                                // set schedule of the report
                                schedule = intervals[forms[i]].frequency;

                                // check to see if the form has been completed
                                if(!results || !results[forms[i]]) {
                                    if(schedule == "Daily") {
                                        completeBy = "End of Day";
                                    } else if(schedule == "Weekly") {
                                        completeBy = "End of Week";
                                    } else if(schedule == "Monthly") {
                                        completeBy = "End of Month";
                                    }
                                }

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

                            var completedResults;

                            if(results && results[req.query.formId]) {
                                var timestamps = Object.keys(results[req.query.formId]);
                                var result = results[req.query.formId][timestamps[timestamps.length - 1]];

                                completedResults = {
                                    "completedBy": result.completedBy,
                                    "datestamp": timestamps[timestamps.length - 1],
                                    "results": result.results
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