const functions = require("firebase-functions");
const app = require("./app");

// All requests to `/app` are routed to our express app.
exports.app = functions
  .runWith({
    // minInstances: 2,
  })
  .https.onRequest(app);
