import React, { useState } from "react";
import "./Lab.css";
import axios from "axios";

type LabCardsProps = {
    lab_name: string;
    lab_description: string;
    lab_id: string;
    difficulty: string;
    category: string;
    lab_link: string;
    completed?: boolean; // Add completed prop
};

function LabCards({ 
    lab_name, 
    lab_description, 
    lab_id, 
    difficulty, 
    category, 
    lab_link: initialLabLink,
    completed = false // Default to false if not provided
}: LabCardsProps) {
    const [modal, setShowModal] = useState(false);
    const [textValue, setTextValue] = useState("");
    const [activeLabLink, setActiveLabLink] = useState(initialLabLink || "");
    const [isCompleted, setIsCompleted] = useState(completed);

    const toggleModal = () => {
        setShowModal(!modal);
    };

    const handleStart = () => {
        axios
          .post(
            "http://localhost:5000/api/labs/create-container",
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
                setActiveLabLink(response.data.lab_link);
                // Open the lab link in a new tab
              window.open(`${response.data.lab_link}`);
            }
          })
          .catch((error) => {
            // Handle errors (e.g., 401, 404, 500)
            console.error("Error creating container:", error.response?.data || error.message);
            alert("Failed to create container: " + (error.response?.data?.message || "Unknown error"));
          });
      };

    const handleStop = () => {
        axios
            .post(
                "http://localhost:5000/api/labs/delete-container",
                {}, // Empty payload since no data is needed
                { withCredentials: true } // Include cookies in the request
            )
            .then((response) => {
                console.log("Container deleted:", response.data);
                setActiveLabLink(""); // Clear the lab link after stopping
            })
            .catch((error) => {
                console.error("Error deleting container:", error.response?.data || error.message);
                alert("Failed to delete container: " + (error.response?.data?.error || "Unknown error"));
            });
    };

    const handleSubmit = () => {
        console.log("Submit clicked with value:", textValue);
        axios
            .get(
                `http://localhost:5000/api/labs/verify-flag?labinfo_id=${lab_id}&flag=${textValue}`,
                { withCredentials: true } // Include cookies in the request
            )
            .then((response) => {
                // Handle success
                console.log("Flag submitted:", response.data);
                if (response.data.success) {
                    setIsCompleted(true); // Mark as completed when flag is correct
                    alert(response.data.message || "Flag submitted successfully!");
                } else {
                    alert(response.data.message || "Incorrect flag. Try again!");
                }
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

    // Apply different class names based on completion status
    const cardClassName = `lab-card ${isCompleted ? 'lab-completed' : 'lab-pending'}`;

    if (!modal) {
        return (
            <div className={cardClassName} onClick={toggleModal}>
                <h3 className="lab-title">{lab_name}</h3>
                <p className="lab-difficulty">{difficulty}</p>
                <p className="lab-category">{category}</p>
                <p className="lab-description">{lab_description}</p>
                {isCompleted && <span className="completion-badge">Completed</span>}
                <p className="lab-id" hidden>{lab_id}</p>
            </div>
        );
    } else {
        return (
            <div className="modal">
                <div className="overlay" onClick={closeModal}>
                    <div className={`modal-content ${isCompleted ? 'lab-completed' : 'lab-pending'}`} onClick={(e) => e.stopPropagation()}>
                        <h3 className="lab-title">{lab_name}</h3>
                        <p className="lab-difficulty">{difficulty}</p>
                        <p className="lab-category">{category}</p>
                        <p className="lab-description">{lab_description}</p>
                        {isCompleted && <span className="completion-badge">Completed</span>}
                        {activeLabLink && (
                            <p className="lab-link">
                                <a href={activeLabLink} target="_blank" rel="noopener noreferrer">
                                {activeLabLink}
                                </a>
                            </p>
                        )}
                        <p className="lab-id" hidden>{lab_id}</p>
                        <div className="modal-buttons">
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
                            <button className="flag-submit-button" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LabCards;