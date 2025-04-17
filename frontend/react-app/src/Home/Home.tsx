// Home.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../NavBar/NavBar";
import axios from "axios";
import "./Home.css";
const Home = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/route/home", { withCredentials: true })
      .then((res) => {
        if (res.data.message === "valid") {
          setName(res.data.user_name);
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="home-content">
        <h1 className="welcome-text">Hello {name}!</h1>
        <h2>Welcome to TSAcademy!</h2>

        <p className="intro-text">
          This platform is your dedicated space for mastering the world of web
          application security. Whether you're taking your first steps into
          ethical hacking or looking to deepen your existing knowledge, you're
          in the right place.
        </p>

        <p className="intro-text">
          Inspired by leading resources like the PortSwigger Web Security
          Academy, we offer a structured learning path combining:
        </p>
        <ul>
          <li>
            <strong>In-depth Theoretical Modules:</strong> Understand the core
            concepts behind common vulnerabilities, attack vectors, and defense
            mechanisms.
          </li>
          <li>
            <strong>Hands-On Lab Sessions:</strong> Apply what you've learned
            in interactive, practical scenarios designed to simulate real-world
            challenges safely.
          </li>
        </ul>

        <p className="intro-text">
          Our goal is to equip aspiring security professionals, curious
          developers, and tech enthusiasts with practical, actionable skills.
          Explore the topics, tackle the labs, and track your progress as you
          level up your cybersecurity expertise.
        </p>

        <p className="cta-text">
          Use the navigation bar above to browse the available theory sections
          or jump straight into the labs. Happy learning (and ethical hacking)!
        </p>
      </div>
    </div>
  );
};

export default Home;