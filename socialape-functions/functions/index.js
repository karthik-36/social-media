const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello world");
});

exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push(doc.data());
      });
      return res.json(screams);
    })
    .catch((err) => res.send(err));
});

exports.createScream = functions.https.onRequest((req, res) => {
  if (req.method != "POST") {
    return res.status(400).json({ message: "method not allowed" });
  }
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  admin
    .firestore()
    .collection("screams")
    .add({
      newScream,
    })
    .then((ref) => {
      console.log("added new id" + ref.id);
      res.json({ message: `document ${ref.id} created successfully` });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});
