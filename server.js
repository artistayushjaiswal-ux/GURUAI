require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

// ===============================
// GEMINI
// ===============================

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "GURUAI Cloud AI is running!"
    });
});

// ===============================
// TEXT CHAT
// ===============================

app.post("/chat", async (req, res) => {
    try {
        const message = (req.body.message || "").trim();

        if (!message) {
            return res.json({
                reply: "Please enter a message."
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        });

        const result = await model.generateContent(message);

        const reply = result.response.text();

        res.json({
            reply: reply
        });

    } catch (error) {
        console.log("Gemini connection failed.");
        console.log(error.message);

        res.status(500).json({
            reply: "Gemini connection failed."
        });
    }
});

// ===============================
// GURU LENS
// ===============================

app.post("/analyze-image", async (req, res) => {
    try {
        const image = req.body.image;

        const mimeType =
            req.body.mimeType || "image/jpeg";

        const question = (
            req.body.question ||
            "Analyze this image and explain what you see."
        ).trim();

        if (!image) {
            return res.status(400).json({
                reply: "No image was received."
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        });

        const imagePart = {
            inlineData: {
                data: image,
                mimeType: mimeType
            }
        };

        const result = await model.generateContent([
            question,
            imagePart
        ]);

        const reply = result.response.text();

        res.json({
            reply: reply
        });

    } catch (error) {
        console.log("GURU Lens error:");
        console.log(error.message);

        res.status(500).json({
            reply: "GURU Lens could not analyze the image."
        });
    }
});

// ===============================
// GURUAI ADMIN PAGE
// ===============================

app.get("/admin", (req, res) => {

    res.send(`
<!DOCTYPE html>
<html>
<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>GURUAI Admin</title>

    <style>

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #10101a;
            color: white;

            display: flex;
            justify-content: center;
            align-items: center;

            min-height: 100vh;
        }

        .admin-box {
            width: 90%;
            max-width: 700px;

            padding: 35px;

            border-radius: 20px;

            background: #25253a;

            box-shadow:
                0 0 30px rgba(0,0,0,0.5);

            text-align: center;
        }

        h1 {
            margin-bottom: 10px;
        }

        .status {
            padding: 15px;
            margin-top: 25px;

            border-radius: 12px;

            background: #181827;
        }

        button {
            margin-top: 20px;

            padding: 12px 25px;

            border: none;

            border-radius: 10px;

            cursor: pointer;

            font-size: 16px;
        }

    </style>

</head>

<body>

    <div class="admin-box">

        <h1>👑 GURUAI Admin Panel</h1>

        <p>
            Welcome to the GURUAI administration area.
        </p>

        <div class="status">
            🟢 Backend is connected
        </div>

        <button onclick="location.href='/'">
            Back to GURUAI
        </button>

    </div>

</body>
</html>
    `);

});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        "GURUAI Cloud AI running at http://localhost:3000"
    );

});