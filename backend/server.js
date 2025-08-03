require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sendReport } = require("./sendReport");
const app = express();
app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

app.post("/send-report", sendReport);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
