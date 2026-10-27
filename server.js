
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Timestamp handler
function handleTimestamp(req, res) {
  const dateParam = req.params.date;
  let date;

  if (dateParam === undefined || dateParam === "") {
    date = new Date();
  } else if (/^\d+$/.test(dateParam)) {
    date = new Date(Number(dateParam));
  } else {
    date = new Date(dateParam);
  }

  if (Number.isNaN(date.getTime())) {
    return res.status(200).json({
      error: "Invalid Date"
    });
  }

  return res.status(200).json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
}

// API routes (Express 5 compatible)
app.get("/api", handleTimestamp);
app.get("/api/:date", handleTimestamp);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
