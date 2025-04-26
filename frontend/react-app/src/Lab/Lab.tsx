import axios from "axios"
import { useState, useEffect } from "react"
import Navbar from "../NavBar/NavBar"
import "./Lab.css"
import LabCards from "./LabCards"

interface LabData {
  lab_id: string;
  lab_name: string;
  lab_description: string;
  difficulty: string;
  category: string;
  is_active: boolean;
  completed?: boolean;
  lab_link?: string;
}

const Lab = () => {
    const [labs, setLabs] = useState<LabData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                // Use the labs-with-status endpoint instead of labs
                const response = await axios.get("http://localhost:5000/api/route/labs", { withCredentials: true });
                
                // Convert the object of labs to an array
                const labsArray = Object.keys(response.data).map(key => ({
                    lab_id: key,
                    ...response.data[key]
                }));
                
                setLabs(labsArray);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching labs:", err);
                setError("Failed to load labs. Please try again later.");
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
                <div className="labs-container" >
                    {labs.map((lab) => (
                        <LabCards 
                            key={lab.lab_id}
                            lab_name={lab.lab_name}
                            lab_description={lab.lab_description}
                            lab_id={lab.lab_id}
                            difficulty={lab.difficulty}
                            category={lab.category}
                            lab_link={lab.lab_link || ""}
                            completed={lab.completed || false} // Pass the completion status
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Lab;