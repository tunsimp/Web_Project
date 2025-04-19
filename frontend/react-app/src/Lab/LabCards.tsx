import React, { useState } from "react";
import "./Lab.css";
import axios from "axios";

type LabCardsProps = {
    lab_name: string;
    lab_description: string;
    lab_id: string;
    difficulty: string;
    category: string;
};

function LabCards({ lab_name, lab_description, lab_id, difficulty, category }: LabCardsProps) {
    const [modal, setShowModal] = useState(false);
    const [textValue, setTextValue] = useState("");

    const toggleModal = () => {
        setShowModal(!modal);
    };

    const handleStart = () => {
        axios
          .post(
            "http://localhost:5000/api/route/create-container",
            {
              labinfo_id: lab_id,
            },
            { withCredentials: true }
          )
          .then((response) => {
            // Handle success
            console.log("Container created:", response.data);
            // If backend returns { hostPort }, redirect manually
            if (response.data.lab_link) {
              window.open( `${response.data.lab_link}`);
            }
          })
          .catch((error) => {
            // Handle errors (e.g., 401, 404, 500)
            console.error("Error creating container:", error.response?.data || error.message);
            alert("Failed to create container: " + (error.response?.data?.message || "Unknown error"));
          });
      };

    const handleStop = () => {
        console.log("Stop clicked");
    };

    const handleSubmit = () => {
        console.log("Submit clicked with value:", textValue);
        axios
            .get(
                `http://localhost:5000/api/route/verify-flag?labinfo_id=${lab_id}&flag=${textValue}`
            )
            .then((response) => {
                // Handle success
                console.log("Flag submitted:", response.data);
                alert("Flag submitted successfully!");
            })
            .catch((error) => {
                // Handle errors (e.g., 401, 404, 500)
                console.error("Error submitting flag:", error.response?.data || error.message);
                alert("Failed to submit flag: " + (error.response?.data?.message || "Unknown error"));
            });
        setTextValue(""); // Clear the input field after submission
    };

    const closeModal = () => {
        setShowModal(false);
        setTextValue("");
    };

    if (!modal) {
        return (
            <div className="lab-card" onClick={toggleModal}>
                <h3 className="lab-title">{lab_name}</h3>
                <p className="lab-difficulty">{difficulty}</p>
                <p className="lab-category">{category}</p>
                <p className="lab-description">{lab_description}</p>
                <p className="lab-id" hidden>{lab_id}</p>
            </div>
        );
    } else {
        return (
            <div className="modal">
                <div className="overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="lab-title">{lab_name}</h3>
                        <p className="lab-difficulty">{difficulty}</p>
                        <p className="lab-category">{category}</p>
                        <p className="lab-description">{lab_description}</p>
                        <p className="lab-id" hidden>{lab_id}</p>
                        <div className="modal-button">
                        <button className="start-button" onClick={handleStart}>Start</button>
                        <button className="stop-button" onClick={handleStop}>Stop</button>
                        </div>
                        <div className="modal-submit">
                        <input
                            className="text-input"
                            type="text"
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                            placeholder="TS{FLAG}"
                        />
                        <button className="submit-button" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LabCards;