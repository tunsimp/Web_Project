import React, { useState } from "react";
import "./Lab.css";
import { labService } from "../services/labService";

type LabCardsProps = {
    lab_name: string;
    lab_description: string;
    lab_id: string;
    difficulty: string;
    category: string;
    lab_link: string;
    completed?: boolean;
};

function LabCards({ 
    lab_name, 
    lab_description, 
    lab_id, 
    difficulty, 
    category, 
    lab_link: initialLabLink,
    completed = false
}: LabCardsProps) {
    const [modal, setShowModal] = useState(false);
    const [textValue, setTextValue] = useState("");
    const [activeLabLink, setActiveLabLink] = useState(initialLabLink || "");
    const [isCompleted, setIsCompleted] = useState(completed);

    const toggleModal = () => {
        setShowModal(!modal);
    };

    const handleStart = async () => {
        try {
            const result = await labService.createContainer(lab_id);
            setActiveLabLink(result.lab_link);
            window.open(result.lab_link);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unknown error");
        }
    };

    const handleStop = async () => {
        try {
            await labService.deleteContainer();
            setActiveLabLink(""); // Clear the lab link after stopping
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unknown error");
        }
    };

    const handleSubmit = async () => {
        try {
            const result = await labService.verifyFlag(lab_id, textValue);
            if (result.success) {
                setIsCompleted(true); // Mark as completed when flag is correct
            }
            alert(result.message);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unknown error");
        }
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