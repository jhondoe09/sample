const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { google } = require("googleapis");
const { fetchEmails } = require("./fetchEmails");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


// Email endpoint with attachments
app.post("/send-email", upload.array("attachments", 10), async (req, res) => {
    const { to, subject, message } = req.body;

    try {
        // Map uploaded files to attachment objects for Nodemailer
        const attachments = req.files.map((file) => ({
            filename: file.originalname, // Use the original file name
            path: file.path, // Path to the uploaded file
        }));

        console.log(attachments);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: message,
            attachments: attachments, // Add the attachments array here
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Clean up uploaded files after sending the email
        attachments.forEach((attachment) => {
            fs.unlinkSync(attachment.path); // Delete the uploaded files
        });

        res.status(200).send("Email sent successfully with attachments!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email.");
    }
});


app.get("/inbox", async (req, res) => {
    try {
        const emails = await fetchEmails(); // Fetch emails from Gmail
        res.json(emails); // Send the emails to the client
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching emails" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
