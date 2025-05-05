import Navbar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import './Home.css';
import { accountService } from "../services/accountService";

const Home = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await accountService.fetchUserData();
        setUsername(userData.user_name);
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err instanceof Error ? err.message : "Failed to load user data");
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