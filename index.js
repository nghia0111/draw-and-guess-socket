const express = require("express");
const app = express();
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");
require("dotenv").config();

const cors = require("cors");
app.use(cors());

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_MAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

console.log(serviceAccount)

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

io.on("connection", (socket) => {
  let userId = socket.handshake.query?.userId,
    roomId = socket.handshake.query?.roomId;

  socket.on("disconnect", async (socket) => {
    try {
      await db
        .doc(`rooms/${roomId}/members/${userId}`)
        .update({ isOnline: false });
    } catch (err) {
      console.log(err);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
