import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="logo">AI Job Scout</div>
                <div className="nav-links">
                    <Link to="/login" className="btn-outline">Login</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Stop Searching. <span className="highlight">Start Matching.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Our advanced AI analyzes your resume and finds the perfect LinkedIn jobs for your skills. 
                        Get instant compatibility scores and personalized application advice.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn-hero">Find My Perfect Job</Link>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Placeholder for an AI graphic */}
                    <div className="abstract-graphic">
                        <div className="circle one"></div>
                        <div className="circle two"></div>
                        <div className="circle three"></div>
                    </div>
                </div>
            </header>

            <section className="features-section">
                <div className="feature-card glass">
                    <h3>LinkedIn Scraper</h3>
                    <p>Real-time job discovery directly from LinkedIn's latest postings.</p>
                </div>
                <div className="feature-card glass">
                    <h3>AI Matching</h3>
                    <p>GPT-4 powered analysis comparing your PDF resume to job requirements.</p>
                </div>
                <div className="feature-card glass">
                    <h3>Match Insights</h3>
                    <p>Detailed reasoning on why you fit and what skills you should highlight.</p>
                </div>
            </section>
        </div>
    );
};

export default Landing;
