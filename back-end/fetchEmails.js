const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Load previously stored token or generate a new one
async function authorize() {
    let credentials;
    try {
        credentials = fs.readFileSync(path.join(__dirname, 'credentials.json'));
    } catch (error) {
        console.error('Error loading client secret file:', error);
        return;
    }
    const { client_secret, client_id, redirect_uris } = JSON.parse(credentials).web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Get new token if necessary
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
}

// Fetch emails using Gmail API
async function fetchEmails() {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    // const res = await gmail.users.messages.list({ userId: 'me' });
    const res = await gmail.users.messages.list({
        userId: "me",
        labelIds: ["INBOX"], // You can adjust labels as per your need
        q: "is:unread", // Optional filter, e.g., unread messages
        maxResults: 10
    });

    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
        return [];
    }

    // Fetch detailed data for each message
    const emailDetails = [];
    for (const message of messages) {
        const messageData = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
        });

        // Extract useful information from the message (e.g., subject, from, snippet)
        const email = {
            id: messageData.data.id,
            threadId: messageData.data.threadId,
            subject: getHeader(messageData.data.payload.headers, "Subject"),
            from: getHeader(messageData.data.payload.headers, "From"),
            snippet: messageData.data.snippet,
            body: extractBody(messageData.data.payload),
            attachments: await extractAttachments(gmail, messageData.data),
        };

        emailDetails.push(email);
    }

    return emailDetails;
}
function getHeader(headers, name) {
    const header = headers.find((h) => h.name === name);
    return header ? header.value : "";
}

// Function to extract body from the payload
function extractBody(payload) {
    let body = '';

    // Look through the parts array to find the body content (plain text or HTML)
    if (payload.parts && payload.parts.length > 0) {
        for (const part of payload.parts) {
            // Check for 'text/plain' or 'text/html' mime types
            if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
                body = part.body.data ? decodeBase64Url(part.body.data) : '';
                break;
            }
        }
    } else {
        // If the payload does not have parts, check the body directly
        body = payload.body.data ? decodeBase64Url(payload.body.data) : '';
    }

    return body;
}

// Helper function to extract attachments
async function extractAttachments(gmail, messageData) {
    const attachments = [];

    // Check if there are parts in the payload
    if (messageData.payload.parts) {
        for (const part of messageData.payload.parts) {
            if (part.filename && part.body && part.body.attachmentId) {
                // Fetch the attachment data using the attachmentId
                const attachment = await gmail.users.messages.attachments.get({
                    userId: "me",
                    messageId: messageData.id,
                    id: part.body.attachmentId,
                });

                // Decode the Base64 data
                const decodedData = decodeBase64Url(attachment.data.data);

                attachments.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: part.body.size,
                    data: decodedData, // This is the raw attachment data
                });
            }
        }
    }

    return attachments;
}

// Function to decode Base64 URL
function decodeBase64Url(base64Url) {
    // Base64 URL encoded content needs to be decoded to text
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert Base64 URL to Base64 standard
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    return decoded;
}

// If token.json doesn't exist, get a new token
async function getNewToken() {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this URL:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', async (code) => {
        rl.close();
        try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
            console.log('Tokens stored to', TOKEN_PATH);
        } catch (error) {
            console.error('Error retrieving access token', error);
        }
    });
}

// Check if token.json exists, otherwise initiate OAuth flow
fs.existsSync(TOKEN_PATH) ? console.log('Token exists!') : getNewToken();

module.exports = { fetchEmails };
