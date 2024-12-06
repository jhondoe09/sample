const express = require('express');
const { twiml } = require('twilio');
const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: false }));

// Endpoint to handle the call flow with recording and dialing your personal phone
app.post('/handle-call', (req, res) => {
    const response = new twiml.VoiceResponse();

    // Play a message to the caller
    response.say('Hello, you are now connected to the call. Feel free to speak.');

    // Start recording the conversation (both sides)
    response.record({
        maxLength: 10,  // Set the recording duration to 30 seconds (or adjust as needed)
        action: '/handle-recording',  // Where to send the recording details after the call
        method: 'POST',
    });

    // Dial your personal phone number for the two-way call
    response.dial('+639925723706'); // Replace with your phone number in E.164 format

    // Send the TwiML response
    res.type('text/xml');
    res.send(response.toString());
});

// Endpoint to handle the recording and receive the recorded file details
app.post('/handle-recording', (req, res) => {
    const recordingUrl = req.body.RecordingUrl;  // URL of the recorded audio file
    const recordingDuration = req.body.RecordingDuration;  // Duration of the recording

    console.log(`Recording URL: ${recordingUrl}`);
    console.log(`Recording Duration: ${recordingDuration} seconds`);

    // Here you can store the recording URL, process it, or save it to your database
    res.send('Recording received');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
