import React from 'react'
import { useNavigate } from "react-router-dom";

function ChatHome() {
    const navigate = useNavigate();
    return (
    <div class="container my-5">
        <div class="position-relative p-5 text-muted bg-body border border-dashed rounded-5">
            <h1 class="text-body-emphasis mb-2">SMS</h1>
            <div class="col-md-12 row">
                <div class="col-md-10"></div>
                <div class="col-md-2">
                <button type="button" class="btn btn-outline-secondary" 
                onClick={() => navigate("/sms")}
                    >Compose</button>
                </div>
            </div>
            <div class="container">
                <div class="my-3 p-3 bg-body rounded shadow-sm">
                    <div class="d-flex text-body-secondary pt-3">
                    <p class="pb-3 mb-0 small lh-sm border-bottom">
                        <strong class="d-block text-gray-dark">@username</strong>
                        Some representative placeholder content, with some information about this user. Imagine this being some sort of status update, perhaps?
                    </p>
                    </div>
                    <div class="d-flex text-body-secondary pt-3">
                    <p class="pb-3 mb-0 small lh-sm border-bottom">
                        <strong class="d-block text-gray-dark">@username</strong>
                        Some more representative placeholder content, related to this other user. Another status update, perhaps.
                    </p>
                    </div>
                    <div class="d-flex text-body-secondary pt-3">
                    <p class="pb-3 mb-0 small lh-sm border-bottom">
                        <strong class="d-block text-gray-dark">@username</strong>
                        This user also gets some representative placeholder content. Maybe they did something interesting, and you really want to highlight this in the recent updates.
                    </p>
                    </div>
                    <small class="d-block text-end mt-3">
                    <a href="#">All updates</a>
                    </small>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatHome