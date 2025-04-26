import Navbar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import './Home.css';

const Home = () => {
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/route/account', {
          withCredentials: true, // Include cookies for authentication
        });

        if (response.data.success) {
          setUsername(response.data.user.user_name); // Extract username from response
        } else {
          setError(response.data.message); // Handle user not authenticated or not found
          setUsername(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
        setUsername(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1 className="welcome-message">
          {username ? `Welcome, ${username}!` : "Welcome to Our Learning Platform!"}
        </h1>
        {error && <p className="error-message">{error}</p>}
        <p className="summary">
          Dive into a world of hands-on learning with our interactive labs. Whether you're a beginner or an expert,
          our platform offers a variety of challenges to enhance your skills in programming, cybersecurity, and more.
          Start exploring today and track your progress as you complete each lab!
        </p>
        <div className="cta">
          <button onClick={() => window.location.href = '/labs'}>
            Explore Labs
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;