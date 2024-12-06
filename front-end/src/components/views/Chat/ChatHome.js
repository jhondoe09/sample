
import { useNavigate } from "react-router-dom";

import React, { useEffect, useState } from "react";
import axios from "axios";

function ChatHome() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const apiURL = 'http://localhost:5000';
    useState(() => {
        axios.get(apiURL + "/getUsers", {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(response => {
                console.log(response);
                if (response.status == 200) {
                    const filter_users = response.data.users.filter((u, i) => u.username === localStorage.getItem('user_name'));
                    setUsers(filter_users);
                } else {
                    setUsers([]);
                }
            })
            .catch(error => {
                console.error(error);
            })
    })

    const handleUserClick = (user_name) => {
        localStorage.setItem('ChatUser', user_name);
        window.location.href = '/chat';
    }
    return (
        <div class="container my-5">
            <div class="position-relative p-5 text-muted bg-body border border-dashed rounded-5">
                <h1 class="text-body-emphasis mb-2">Chat</h1>
                <div className="col-md-10"></div>
                <div className="col-md-2">
                    <button type="button" className="btn btn-outline-secondary"
                        onClick={() => navigate("/chat")}
                    >Compose</button>
                </div>
                <div class="my-3 p-3 bg-body rounded shadow-sm">
                    <h6 class="border-bottom pb-2 mb-0">Recent updates</h6>
                    {users.map((u, i) => (
                        <div key={i} class="d-flex text-body-secondary pt-3">
                            <p class="pb-3 mb-0 small lh-sm border-bottom">
                                <strong class="d-block text-gray-dark" onClick={() => handleUserClick(u.username)}>@{u.username}</strong>
                                Some representative placeholder content, with some information about this user. Imagine this being some sort of status update, perhaps?
                            </p>
                        </div>
                    ))}
                    <small class="d-block text-end mt-3">
                        <a href="#">All updates</a>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default ChatHome