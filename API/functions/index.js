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

function getDay() {
	var offset = -5.0;
	var serverDate = new Date();
	var utc = serverDate.getTime() + (serverDate.getTimezoneOffset() * 60000);
	var easternDate = new Date(utc + (3600000*offset));

	var weekday = new Array(7);
	weekday[0] = "sunday";
	weekday[1] = "monday";
	weekday[2] = "tuesday";
	weekday[3] = "wednesday";
	weekday[4] = "thursday";
	weekday[5] = "friday";
	weekday[6] = "saturday";

	var today = {
		"weekday": weekday[easternDate.getDay()],
		"datestamp": pad(easternDate.getMonth() + 1).toString() + pad(easternDate.getDate()).toString() + easternDate.getFullYear().toString()
	}

	return today;
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
							var root = snap.val();
							var intervals = root.forms.intervals;
							var results = root.forms.results;
							var templates = root.forms.templates;
							var forms = Object.keys(templates);
							var today = getDay();

							var totalUsers = Object.keys(root.users).length;
							var equipment = 0;
							var totalReports = 0;
							var reportsToDo = 0;
							var toDoList = [];

							var numTrucks = Object.keys(root.inventory).length;
							for(var i = 0; i < numTrucks; i++) {
								var truck = Object.keys(root.inventory)[i];
								var numCompartments = Object.keys(root.inventory[truck]).length;
								for(var j = 0; j < numCompartments; j++) {
										var compartment = Object.keys(root.inventory[truck])[j];
										var numEquipment = Object.keys(root.inventory[truck][compartment]).length;
										equipment += numEquipment;
								}
							}

							var complete;
							for(var i = 0; i < forms.length; i++) {
								if(intervals[forms[i]].days[today.weekday]) {
									totalReports++;

									if(Object.keys(results[forms[i]]).includes(today.datestamp)) {
										complete = true;
									} else {
										reportsToDo++;
										complete = false;
									}

									var toDoItem = {
										"title": templates[forms[i]].title,
										"complete": complete
									};
									toDoList.push(toDoItem);
								}
							}

							var home = {
								"totalUsers": totalUsers,
								"equipment": equipment,
								"totalReports": totalReports,
								"reportsToDo": reportsToDo,
								"toDoList": toDoList
							};
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
							var root = snap.val();
							var intervals = root.forms.intervals;
							var results = root.forms.results;
							var templates = root.forms.templates;
							var forms = Object.keys(templates);
							var today = getDay();

							var name;
							var schedule = [];
							var status;
							var id;

							var reportsList = [];
							for(var i = 0; i < forms.length; i++) {
								schedule = [];
								name = templates[forms[i]].title;
								for(var j = 0; j < Object.keys(intervals[forms[i]].days).length; j++) {
									if(intervals[forms[i]].days[Object.keys(intervals[forms[i]].days)[j]]) {
										schedule.push(Object.keys(intervals[forms[i]].days)[j]);
									}
								}

								var sorter = {
									"sunday": 0,
									"monday": 1,
									"tuesday": 2,
									"wednesday": 3,
									"thursday": 4,
									"friday": 5,
									"saturday": 6
								}

								schedule.sort(function sortByDay(day1, day2) {
									return sorter[day1] > sorter[day2];
								});

								if(Object.keys(results[forms[i]]).includes(today.datestamp)) {
									status = "Complete";
								} else {
									reportsToDo++;
									status = "Not Complete";
								}
								id = forms[i];
								var report = {
									"name": name,
									"schedule": schedule,
									"status": status,
									"id": id
								};
								reportsList.push(report);
							}
							var reports = {reportsList};
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
