import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Chat() {
  const navigate = useNavigate();
  const apiURL = 'http://localhost:5000';
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");

  const sendSms = async () => {
    try {
      const response = await axios.post(apiURL + "/send-sms", { to, message });
      alert("SMS sent successfully! SID: " + response.data.messageSid);
    } catch (error) {
      alert("Error sending SMS: " + error.response?.data?.error || error.message);
    }
  };
  return (
    <div class="container my-5 p-auto">
      <div class="position-relative p-5 text-center text-muted bg-body border border-dashed rounded-5">
        <h1 class="text-body-emphasis mb-2">Compose SMS</h1>
        <div class="col-md-12 row ">
          <div class="col-md-10"></div>
          <div class="col-md-2 float-end mb-2">
            <button type="button" class="btn btn-outline-secondary"
              onClick={() => navigate("/smsHome")}
            >Cancel</button>
          </div>
          <div class="form-floating mb-2">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            ></input>
            <label for="floatingInput">To</label>
          </div>
          <div class="form-floating mb-3">
            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: 300 }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div class="form-floating mb-3">
            <input type="file" class="form-control" id="floatingPassword" placeholder="Attachment" multiple></input>
          </div>
          <button className='btn btn-secondary' onClick={sendSms}>Send SMS</button>
        </div>
      </div>
    </div>
  )
}

export default Chat