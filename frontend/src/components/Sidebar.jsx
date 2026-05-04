import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { logout } = useAuth();

    const menuItems = [
        { id: 'search', label: 'Job Search', icon: '🔍' },
        { id: 'rules', label: 'Matching Rules', icon: '🎯' },
        { id: 'upload', label: 'Resume Upload', icon: '📄' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-small">AI Scout</div>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={logout}>
                    <span className="icon">🚪</span>
                    <span className="label">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
