import React, { useEffect, useState } from "react";
import axios from "axios";
import countryCodesData from './country_code.json';
const Call = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isCalling, setIsCalling] = useState(false);
    const [countryCodes, setCountryCodes] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('');

    useEffect(() => {
        console.log(countryCodesData);
        setCountryCodes(countryCodesData.countries);  // Set the JSON data to the state
    }, []);

    const handleChange = (event) => {
        setSelectedCountryCode(event.target.value);
    };

    const handleCall = async () => {
        try {
            setIsCalling(true);
            const response = await axios.post("http://localhost:5000/make-call", {
                toPhoneNumber: phoneNumber,
            });
            console.log(response.data);
            alert(response.data);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setIsCalling(false);
        }
    };
    return (
        <div className="container my-5">
            <div className="position-relative p-5 text-muted bg-body border border-dashed rounded-5">
                <div className="col-md-12 row gap-2">
                    <label htmlFor="country-select">Select Country:</label>
                    <select className="form-select"
                        id="country-select"
                        value={selectedCountryCode}
                        onChange={handleChange}
                    >
                        <option value="">Select a country</option>
                        {countryCodes.map((country, index) => (
                            <option key={index} value={country.code}>
                                {country.name} ({country.code})
                            </option>
                        ))}
                    </select>

                    {/* Display selected country code */}
                    {selectedCountryCode && (
                        <p>Selected Country Code: {selectedCountryCode}</p>
                    )}
                    <h1>Voice Call</h1>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary col-md-6" onClick={handleCall} disabled={isCalling}>
                        {isCalling ? "Calling..." : "Make Call"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Call;
