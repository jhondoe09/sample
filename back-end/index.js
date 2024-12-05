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
const twilio = require("twilio");
const { WebSocketServer } = require("ws");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);
// const io = new Server(server);


// Storage for uploaded files
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name
    },
});
const upload2 = multer({ storage });
// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// File upload route
app.post("/upload", upload2.single("file"), (req, res) => {
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    console.log(fileUrl);
    res.json({ fileUrl });
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


// Email endpoint with attachments
app.post("/send-email", upload.array("attachments", 5), async (req, res) => {
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

// Twilio credentials
const accountSid = "AC36feaf625087a9dba5598d607c58b84c"; // Get this from Twilio Console
const authToken = "d46cfd589a2eaa9114d3e40f15cf92af"; // Get this from Twilio Console
const client = twilio(accountSid, authToken);

// SMS send endpoint
app.post("/send-sms", async (req, res) => {
    const { to, message } = req.body;

    try {
        const sms = await client.messages.create({
            body: message,
            from: "+12184234424", // Your Twilio phone number
            to: to, // Recipient's phone number
        });

        res.status(200).json({ success: true, messageSid: sms.sid });
    } catch (error) {
        console.error("Error sending SMS:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/receive-sms", async (req, res) => {
    try {
        // Fetch messages from Twilio
        const messages = await client.messages.list({ limit: 20 }); // Limit to 20 logs
        const logs = messages.map((msg) => ({
            sid: msg.sid, // Unique message ID
            to: msg.to,   // Recipient's phone number
            from: msg.from, // Sender's phone number
            body: msg.body, // Message content
            status: msg.status, // Status (sent, delivered, failed, etc.)
            dateSent: msg.dateSent, // Date message was sent
        }));

        res.json(logs); // Send logs to the frontend
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch message logs" });
    }
});


// Your Twilio phone number
const twilioNumber = '12184234424';

// Your personal phone number to call (the number to make the call to)
const yourPhoneNumber = '+63 992 572 3706'; // Replace with your phone number

// Endpoint to initiate the call
app.post('/make-call', (req, res) => {
    client.calls
        .create({
            url: 'https://82dc-58-71-18-187.ngrok-free.app/handle-call', // URL for TwiML instructions
            to: yourPhoneNumber, // Your personal number to call
            from: twilioNumber,  // Twilio number to call from
        })
        .then(call => {
            console.log(call);
            res.send(`Call initiated with SID: ${call.sid}`);
        })
        .catch(error => {
            res.status(500).send('Error making call: ' + error);
        });
});


const PORT = 5000;
// Create an HTTP server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// Attach WebSocket to the HTTP server
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set();

// Real-time messaging

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", // Your frontend's URL
        methods: ["GET", "POST"],       // Allowed methods
        credentials: true,              // Allow cookies or auth headers
    },
});

const users = {}; // Store connected users

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Assign a dynamic user ID (e.g., from query or random ID)
    const userId = socket.handshake.query.userId || socket.id;
    users[socket.id] = userId;

    // Notify others about the new connection
    socket.broadcast.emit("userConnected", { userId });

    // Listen for messages and attach sender info
    socket.on("sendMessage", (message) => {
        const senderId = users[socket.id];
        const messageWithSender = { ...message, sender: senderId };
        io.emit("receiveMessage", messageWithSender); // Broadcast message
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        delete users[socket.id];
        io.emit("userDisconnected", { userId });
    });
});




