const { google } = require("googleapis");
const fs = require("fs");

function authenticate() {
    const credentials = JSON.parse(fs.readFileSync("./credentials.json"));
    const tokens = JSON.parse(fs.readFileSync("./token.json"));

    const { client_id, client_secret, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(tokens); // Use existing tokens
     // Ensure the appropriate scopes are granted (Gmail read-only scope)
    oAuth2Client.scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
    return oAuth2Client;
}

module.exports = { authenticate };
