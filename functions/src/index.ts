/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as express from "express";
import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";

const app = express();
app.use(cors({ origin: true }));

app.get("/", async (req, res) => {
  const apiKey = "f185e4803318a03d7ea19e7ad238d5f738388f2b"; // API 키를 여기에 입력
  try {
    const response = await axios.get(
      `https://www.giantbomb.com/api/games/?api_key=${apiKey}&format=json&limit=10&offset=0`,
    );
    res.status(200).send(response.data.results);
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.fetchGames = functions.https.onRequest(app);
