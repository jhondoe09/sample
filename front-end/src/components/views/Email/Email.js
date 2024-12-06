import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
function Email() {
    const navigate = useNavigate();
    const apiURL = 'http://localhost:5000';
    const [emailData, setEmailData] = useState({
        to: "",
        subject: "",
        message: "",
    });
    const [attachments, setAttachments] = useState([]);

    const handleChange = (e) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setAttachments(e.target.files); // Save the file list
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("to", emailData.to);
        formData.append("subject", emailData.subject);
        formData.append("message", emailData.message);

        // Append multiple files to FormData
        for (let i = 0; i < attachments.length; i++) {
            formData.append("attachments", attachments[i]); // Key must match multer's array key
        }

        try {
            const response = await axios.post(apiURL + "/send-email", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div class="container my-5 p-auto">
                <div class="position-relative p-5 text-center text-muted bg-body border border-dashed rounded-5">
                    <h1 class="text-body-emphasis mb-2">Compose E-mail</h1>
                    <div class="col-md-12 row ">
                        <div class="col-md-10"></div>
                        <div class="col-md-2 float-end mb-2">
                            <button type="button" class="btn btn-outline-secondary"
                                onClick={() => navigate("/emailHome")}
                            >Cancel</button>
                        </div>
                        <div class="form-floating mb-2">
                            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
                                name="to"
                                value={emailData.to}
                                onChange={handleChange}
                                required
                            ></input>
                            <label for="floatingInput">To</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="floatingPassword" placeholder="Subject"
                                name="subject"
                                value={emailData.subject}
                                onChange={handleChange}
                                required
                            ></input>
                            <label for="floatingPassword">Subject</label>
                        </div>
                        <div class="form-floating mb-3">
                            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: 300 }}
                                name="message"
                                value={emailData.message}
                                onChange={handleChange}
                                required></textarea>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="file" class="form-control" id="floatingPassword" placeholder="Attachment"
                                name="attachments" onChange={handleFileChange}
                                multiple></input>
                        </div>
                        <button className='btn btn-secondary' type="submit">Send Email</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Email