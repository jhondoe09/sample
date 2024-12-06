import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000", {
  withCredentials: true, // Include credentials like cookies
});
const user_token = localStorage.getItem('token');
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");

  // Listen for incoming messages
  useState(() => {
    socket.on("receiveMessage", (message) => {
      console.log(message);
      setUserId(message.user_name);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const handleSendMessage = async () => {
    let fileUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("http://localhost:5000/upload", formData);
        fileUrl = response.data.fileUrl;
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }

    const message = {
      text: input,
      attachment: fileUrl,
      user_token: localStorage.getItem('token'),
      user_name: localStorage.getItem('user_name')
    };

    socket.emit("sendMessage", message);
    setInput("");
    setFile(null); // Clear file input
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="container my-5">
      <div className="position-relative p-5 text-muted bg-body border border-dashed rounded-5">
        <h1>Chat with {localStorage.getItem('ChatUser') ?? userId}</h1>
        <div
          style={{
            height: "500px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === user_token ? "right" : "left",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: msg.sender === user_token ? "#d1f7c4" : "#e4e4e4",
                }}
              >
                <p>{msg.text}</p>

                {msg.attachment && (
                  <>
                    {msg.attachment.endsWith(".jpg") ||
                      msg.attachment.endsWith(".png") ||
                      msg.attachment.endsWith(".jpeg") ? (
                      <img
                        src={msg.attachment}
                        alt="Attachment"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          marginTop: "10px",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <a
                        href={msg.attachment}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#007bff",
                          textDecoration: "underline",
                          marginTop: "10px",
                          display: "block",
                        }}
                      >
                        Download Attachment
                      </a>
                    )}
                  </>
                )}
              </div>
              <small style={{ display: "block", color: "#888" }}>
                {msg.sender === user_token ? "You" : localStorage.getItem('ChatUser') ?? msg.user}
              </small>
            </div>
          ))}
        </div>
        <div className="container row gap-2">
          <div className="col-md-4">
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              style={{ marginLeft: "10px" }}
            />
          </div>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{ width: "80%" }}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary"
              onClick={handleSendMessage} style={{ marginLeft: "10px" }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
