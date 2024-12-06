import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./components/views/Home/Home";
import Email from "./components/views/Email/Email";
import EmailHome from "./components/views/Email/EmailHome";
import SMS from "./components/views/SMS/Sms";
import SmsHome from "./components/views/SMS/SmsHome";
import Chat from "./components/views/Chat/Chat";
import ChatHome from "./components/views/Chat/ChatHome";
import Call from "./components/views/Call/Call";
import NotFound from "./components/views/NotFound/NotFound";
import RichTextEditor from "./components/views/TextEditor/TextEditor";
import reportWebVitals from "./reportWebVitals";
import Login from "./components/Login/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="emailHome" element={<EmailHome />} />
        <Route path="email" element={<Email />} />
        <Route path="smsHome" element={<SmsHome />} />
        <Route path="sms" element={<SMS />} />
        <Route path="chatHome" element={<ChatHome />} />
        <Route path="chat" element={<Chat />} />
        <Route path="call" element={<Call />} />
        <Route path="text" element={<RichTextEditor />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
