import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../api/jobs';
import { useAuth } from '../context/AuthContext';
import './ResumeUpload.css';

const ResumeUpload = () => {
    const { user, setUser } = useAuth();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [parsedData, setParsedData] = useState(user?.parsed_cv || null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (user?.parsed_cv) {
            setParsedData(user.parsed_cv);
        }
    }, [user?.parsed_cv]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf" || droppedFile.name.toLowerCase().endswith(".pdf")) {
                setFile(droppedFile);
            } else {
                alert("Please upload a PDF file.");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            console.log('Starting resume upload...');
            const response = await jobsAPI.uploadResume(file);
            
            if (response.data && response.data.parsed_data) {
                const newData = response.data.parsed_data;
                setParsedData(newData);
                setUser(prev => ({ ...prev, parsed_cv: newData }));
                setFile(null);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            const errorMsg = error.response?.data?.detail || error.message || 'Failed to parse resume.';
            alert(`Error: ${errorMsg}`);
        } finally {
            setUploading(false);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to clear your current resume analysis?")) {
            setParsedData(null);
            setUser(prev => ({ ...prev, parsed_cv: null }));
        }
    };

    return (
        <div className="resume-upload-view">
            {!parsedData ? (
                <div 
                    className={`upload-zone glass ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="upload-icon">📄</div>
                    <h3>{file ? 'File Selected!' : 'Upload your Resume'}</h3>
                    <p>{file ? file.name : 'Drag and drop your PDF here, or click to browse.'}</p>
                    
                    <input 
                        type="file" 
                        id="file-upload"
                        className="file-input"
                        accept=".pdf" 
                        onChange={handleFileChange} 
                    />
                    <label htmlFor="file-upload" className="btn-outline">
                        {file ? 'Change File' : 'Browse Files'}
                    </label>

                    {file && (
                        <button 
                            className="btn-primary mt-20" 
                            onClick={handleUpload} 
                            disabled={uploading}
                        >
                            {uploading ? 'Processing with AI...' : 'Analyze Resume'}
                        </button>
                    )}
                </div>
            ) : (
                <div className="analysis-results glass">
                    <div className="results-header">
                        <h3>AI Extracted Profile</h3>
                        <button className="btn-text" onClick={handleReset}>Replace Resume</button>
                    </div>
                    
                    <div className="profile-section">
                        <h4>Professional Summary</h4>
                        <p className="summary-text">{parsedData.summary}</p>
                    </div>

                    <div className="profile-section">
                        <h4>Extracted Skills</h4>
                        <div className="skills-grid">
                            {parsedData.skills && parsedData.skills.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="info-alert">
                        <span className="icon">ℹ️</span>
                        <p>Your resume is now saved. Head over to <strong>Job Discovery</strong> to see how you match with open roles!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
