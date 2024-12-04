const { google } = require("googleapis");
const fs = require("fs");

function refreshTokenIfNeeded(oAuth2Client) {
    const tokens = oAuth2Client.credentials;

    // Check if the token is expired or about to expire
    if (tokens && tokens.expiry_date) {
        const currentTime = Date.now();
        const tokenExpiryTime = tokens.expiry_date;

        // If the token will expire in less than 5 minutes, refresh it
        if (tokenExpiryTime - currentTime < 5 * 60 * 1000) { 
            console.log('Refreshing the access token');
            oAuth2Client.setCredentials({
                refresh_token: tokens.refresh_token
            });
        }
    }
}

function authenticate() {
    const credentials = JSON.parse(fs.readFileSync("credentials.json"));
    const tokens = JSON.parse(fs.readFileSync("token.json"));

    const { client_id, client_secret, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Set the credentials (tokens) for the oAuth2Client
    oAuth2Client.setCredentials(tokens);

    // Ensure the token is refreshed if necessary
    refreshTokenIfNeeded(oAuth2Client);

    return oAuth2Client;
}

module.exports = { authenticate, refreshTokenIfNeeded };
