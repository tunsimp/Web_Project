import React, { useState } from "react";
import "./Lab.css";

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
        console.log("Start clicked");
    };

    const handleStop = () => {
        console.log("Stop clicked");
    };

    const handleSubmit = () => {
        console.log("Submit clicked with value:", textValue);
        setShowModal(false);
        setTextValue("");
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
                        <p className="lab-id">{lab_id}</p>
                        <input
                            type="text"
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                            placeholder="Enter text"
                        />
                        <button onClick={handleStart}>Start</button>
                        <button onClick={handleStop}>Stop</button>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default LabCards;