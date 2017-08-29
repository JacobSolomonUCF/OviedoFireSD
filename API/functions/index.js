const functions = require('firebase-functions');
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

exports.info = functions.https.onRequest((req, res) => {
	if(req.method == "GET") {
		if(req.query.type && req.query.uid) {
			getAuth(req.query.uid, function(auth) {
				if(auth != 401) {
					if(auth == 0 || auth == 1) {
						res.sendStatus(200);
					} else {
						res.status(403).send("The request violates the user's permission level");
					}
				} else {
					res.status(401).send('The user is not authorized for access');
				}
			});
		} else if(!req.query.type && req.query.uid) {
			res.status(400).send("Missing 'type' parameter");
		}  else if(req.query.type && !req.query.uid) {
			res.status(400).send("Missing 'uid' parameter");
		} else {
			res.status(400).send("Missing 'type' and 'uid' parameters");
		}
	} else {
		res.sendStatus(404);
	}
});

exports.form = functions.https.onRequest((req, res) => {
	if(req.method == "GET") {
		if(req.query.form && req.query.uid) {
			getAuth(req.query.uid, function(auth) {
				if(auth != 401) {
					if(auth == 0 || auth == 1) {
						admin.database().ref('/forms/templates/' + req.query.form).once('value', function(snap) {
							if(snap.val()) {
								var form = {
									"form": snap.val()
								};
								res.status(200).send(form);
							} else {
								res.status(400).send('Form template for ' + req.query.form + ' does not exist');
							}
						});
					} else {
						res.status(403).send("The request violates the user's permission level");
					}
				} else {
					res.status(401).send('The user is not authorized for access');
				}
			});
		} else if(!req.query.form && req.query.uid) {
			res.status(400).send("Missing 'form' parameter");
		} else if(req.query.form && !req.query.uid) {
			res.status(400).send("Missing 'uid' parameter");
		} else {
			res.status(400).send("Missing 'form' and 'uid' parameters");
		}
	} else if(req.method == "POST") {
		res.sendStatus(200);
	} else if(req.method == "PATCH") {
		res.sendStatus(200);
	} else if(req.method == "DELETE") {
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
});

exports.permissions = functions.https.onRequest((req, res) => {
	if(req.method == "GET") {
		if(req.query.user && req.query.uid) {
			getAuth(req.query.uid, function(auth) {
				if(auth != 401) {
					if(auth == 0) {
						admin.database().ref('/users/' + req.query.user + '/authentication').once('value', function(snap) {
							if(snap.val()) {
								res.status(200).send(snap.val().toString());
							} else {
								res.status(400).send('The user ' + req.query.user + ' does not exist');
							}
						});
					} else {
						res.status(403).send("The request violates the user's permission level");
					}
				} else {
					res.status(401).send('The user is not authorized for access');
				}
			});
		} else if(!req.query.user && req.query.uid) {
			res.status(400).send("Missing 'user' parameter");
		} else if(req.query.user && !req.query.uid) {
			res.status(400).send("Missing 'uid' parameter");
		} else {
			res.status(400).send("Missing 'user' and 'uid' parameters");
		}
	} else if(req.method == "POST") {
		res.sendStatus(200);
	} else if(req.method == "PATCH") {
		res.sendStatus(200);
	} else if(req.method == "DELETE") {
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
});

exports.status = functions.https.onRequest((req, res) => {
	if(req.method == "GET") {
		if(req.query.form && req.query.uid) {
			getAuth(req.query.uid, function(auth) {
				if(auth != 401) {
					if(auth == 0 || auth == 1) {
						res.sendStatus(200);
					} else {
						res.status(403).send("The request violates the user's permission level");
					}
				} else {
					res.status(401).send('The user is not authorized for access');
				}
			});
		} else if(!req.query.form && req.query.uid) {
			res.status(400).send("Missing 'form' parameter");
		}  else if(req.query.form && !req.query.uid) {
			res.status(400).send("Missing 'uid' parameter");
		} else {
			res.status(400).send("Missing 'form' and 'uid' parameters");
		}
	} else {
		res.sendStatus(404);
	}
});

exports.item = functions.https.onRequest((req, res) => {
	if(req.method == "POST") {
		res.sendStatus(200);
	} else if(req.method == "PATCH") {
		res.sendStatus(200);
	} else if(req.method == "DELETE") {
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
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
                            var users = root.users
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
							res.status(200).send(home);
						});
					} else {
						res.status(403).send("The request violates the user's permission level");
					}
				} else {
					res.status(401).send('The user is not authorized for access');
				}
			});
		} else {
			res.status(400).send("Missing 'uid' parameter");
		}
	} else {
		res.sendStatus(404);
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
                            res.status(200).send(reports);
                        });
                    } else {
                        res.status(403).send("The request violates the user's permission level");
                    }
                } else {
                    res.status(401).send('The user is not authorized for access');
                }
            });
        } else {
            res.status(400).send("Missing 'uid' parameter");
        }
    } else {
        res.sendStatus(404);
    }
});