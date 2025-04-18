// about.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../NavBar/NavBar";
import axios from "axios";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-content">
            <h1 className="big-title">TSAcademy</h1>
            <h1 className="hero-title">Your <span className="highlight">Self-Learn</span> Platform</h1>
            <p className="hero-subtitle">Unlock your creative potential. Seamlessly fast, and perfect for your cyber security career.</p>
            <a href='/paths'>
              <div className="hero-buttons">
              <button className="primary-button">Get Hands On</button>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Unleash Your <span className="highlight">Creativity</span></h2>
        <p className="section-subtitle">Explore how our cybersecurity learning platform empowers you to master both theory and hands-on skills.
        </p>
        
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon upload-icon"></div>
            <h3 className="feature-title">Interactive Lab Sessions</h3>
            <p className="feature-description">Get hands-on with real-world scenarios in our virtual labs. Practice ethical hacking, network defense, and incident response in a safe, simulated environment that builds real skills.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon generate-icon"></div>
            <h3 className="feature-title">Comprehensive Theory Modules</h3>
            <p className="feature-description">Learn the foundations of cybersecurity through well-structured, easy-to-follow modules. From cryptography to network protocols, we break down complex topics into digestible lessons.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon refine-icon"></div>
            <h3 className="feature-title">Beginner-Friendly Learning Paths</h3>
            <p className="feature-description">Whether you're starting from scratch or brushing up on the basics, our guided learning paths help you progress with confidence—no prior experience required.</p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <h2 className="section-title">Stay Inspired with Our Latest <span className="highlight">Insights</span></h2>
        <p className="section-subtitle">Dive into our video for the latest trends, tips, and insights in the world of cyber. Whether you're seeking inspiration, tutorials, or industry news, our knowledge are crafted to keep you informed and inspired.</p>
        
        <div className="video-container">
          <a href="https://www.youtube.com/watch?v=EoaDgUgS6QA">
          <div className="video-card">
            <div className="video-image video-image-1"></div>
            <h3 className="video-title">Cross-Site Scripting (XSS) Explained</h3>
          </div>
          </a>
          <a href="https://www.youtube.com/watch?v=O9Yye537soM">
          <div className="video-card">
            <div className="video-image video-image-2"></div>
            <h3 className="video-title">Structured query language injection Explained</h3>
          </div>
          </a>
          <a href="https://www.youtube.com/watch?v=SN6EVIG4c-0">
          <div className="video-card">
            <div className="video-image video-image-3"></div>
            <h3 className="video-title">Server-Side Template Injections Explained
            </h3>
          </div>
          </a>

        </div>
      </div>
    
      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Start Your Design <span className="highlight">Journey</span> Today</h2>
          <p className="cta-subtitle">Sign up now and experience the power of AI-driven design without any commitment.</p>
          <a href='/auth'>
          <button className="primary-button">Get Started</button>
          </a>
        </div>
        <div className="cta-image">
          {/* Purple abstract design element */}
        </div>
      </div>
      
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-container">
          <div className="logo-item"><a href="/">Discord</a></div>
          <div className="logo-item"><a href="/">Linkedin</a></div>
          <div className="logo-item"><a href="/">Email</a></div>
        </div>
      </div>
    </div>
  );
};

export default About;