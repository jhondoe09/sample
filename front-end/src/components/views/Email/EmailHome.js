import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
function Home() {
    const navigate = useNavigate();

    const apiURL = 'http://localhost:5000';
    const [emails, setEmails] = useState([]);
    const [viewEmail, setViewEmail] = useState([]);
    useState(() => {
        axios.get(apiURL + "/inbox", {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(response => {
                console.log(response);
                if (response.data.length > 0) {
                    setEmails(response.data);
                } else {
                    setEmails([]);
                }
            })
            .catch(error => {
                console.error(error);
            })
    })

    const handleViewEmail = (id) => (event) => {
        event.preventDefault();
        const newEmail = emails.filter(i => i.id == id);
        console.log(newEmail);
        setViewEmail(newEmail);
    }

    return (
        <div className="container my-5">
            <div className="position-relative p-5 text-muted bg-body border border-dashed rounded-5">
                <h1 className="text-body-emphasis mb-2">E-mail</h1>
                <div className="col-md-12 row">
                    <div className="col-md-10"></div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-outline-secondary"
                            onClick={() => navigate("/email")}
                        >Compose</button>
                    </div>
                </div>
                <div className="container">
                    <div className="my-3 p-3 bg-body rounded shadow-sm">
                        {emails.map((e, i) => (
                            <div key={i} className="col-md-12 text-body-secondary pt-3 row">
                                <div className='col-md-10'>
                                    <p className="pb-3 mb-0 small lh-sm border-bottom">
                                        <strong className="d-block text-gray-dark">{e.from}</strong>
                                        {e.subject}
                                    </p>
                                </div>
                                <div className='col-md-2'>
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                        onClick={handleViewEmail(e.id)}>
                                        View mail
                                    </button>
                                </div>
                            </div>
                        ))}
                        <small className="d-block text-end mt-3">
                            <a href="#">All updates</a>
                        </small>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">View E-mail</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {viewEmail.map((v, i) => (
                                <div key={i} className="col-md-12 row ">
                                    <div className="mb-2">
                                        <div className="col-md-12">
                                            <label htmlFor="floatingInput">From</label>
                                        </div>
                                        <div className="col-md-12">
                                            <p>{v.from}</p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="col-md-12">
                                            <label htmlFor="floatingPassword">Subject:</label>
                                        </div>
                                        <div className="col-md-12">
                                            <p>{v.subject}</p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="col-md-12">
                                            <label htmlFor="floatingPassword">Body:</label>
                                        </div>
                                        <div className="col-md-12">
                                            <p className="text-break">{v.body ? v.body : v.snippet}</p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        {v.attachments.length > 0 ?
                                            v.attachments.map((a, i) => (
                                                <ul className="list-group list-group-flush">
                                                    <div className="col-md-12 row">
                                                        <a
                                                            href={`/download/${a.filename}`}
                                                            download={a.filename}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        ><li className="list-group-item col-md-12">{a.filename}</li></a>
                                                    </div>
                                                </ul>
                                            ))
                                            : <p>No attachments</p>}

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home