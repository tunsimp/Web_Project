import { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import "./Lab.css";
import LabCards from "./LabCards";
import { labService, LabData } from "../services/labService";

const Lab = () => {
    const [labs, setLabs] = useState<LabData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const labsData = await labService.fetchLabs();
                setLabs(labsData);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load labs. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchLabs();
    }, []);
    
    if (loading) return <div>Loading labs...</div>;
    if (error) return <div>{error}</div>;
    
    return (
        <>
            <Navbar/>
            <div className="labs-section">
                <h1 className="labs-heading">Labs</h1>
                <div className="labs-container">
                    {labs.map((lab) => (
                        <LabCards
                            key={lab.lab_id}
                            lab_name={lab.lab_name}
                            lab_description={lab.lab_description}
                            lab_id={lab.lab_id}
                            difficulty={lab.difficulty}
                            category={lab.category}
                            lab_link={lab.lab_link || ""}
                            completed={lab.completed || false}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Lab;