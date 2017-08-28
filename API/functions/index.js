const functions = require('firebase-functions');
var admin = require('firebase-admin');
var serviceAccount = require("./admin/oviedofiresd-55a71-firebase-adminsdk-ol8a1-20a377ac5e.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://oviedofiresd-55a71.firebaseio.com"
});

function getAuth(uid, callback) {
	admin.database().ref('users/' + uid + '/authentication').once('value', function(snap) {
		if(snap.val() || snap.val() == 0) {
			callback(snap.val());
		} else {
			callback(401);
		}
	});
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
						admin.database().ref('forms/templates/' + req.query.form).once('value', function(snap) {
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
						admin.database().ref('users/' + req.query.user + '/authentication').once('value', function(snap) {
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
