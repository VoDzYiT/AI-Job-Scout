import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import JobSearch from '../components/JobSearch';
import ResumeUpload from '../components/ResumeUpload';
import MatchingRules from '../components/MatchingRules';
import './Dashboard.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('search');

    return (
        <div className="dashboard-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>{activeTab === 'search' ? 'Job Discovery' : activeTab === 'rules' ? 'Matching Rules' : 'Resume Analysis'}</h1>
                </header>
                <section className="dashboard-content">
                    {activeTab === 'search' && <JobSearch />}
                    {activeTab === 'rules' && <MatchingRules />}
                    {activeTab === 'upload' && <ResumeUpload />}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;