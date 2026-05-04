import React, { useState } from 'react';
import { jobsAPI } from '../api/jobs';
import './AnalysisModal.css';

const AnalysisModal = ({ job, onClose }) => {
    const [matching, setMatching] = useState(false);
    const [matchResult, setMatchResult] = useState(null);
    const [error, setError] = useState(null);

    const handleMatch = async () => {
        setMatching(true);
        setError(null);
        try {
            const response = await jobsAPI.match(job.id);
            setMatchResult(response.data);
        } catch (error) {
            console.error('Matching failed:', error);
            if (error.response && error.response.status === 400) {
                setError("Please upload your resume in the 'Resume Upload' tab first.");
            } else {
                setError('Failed to analyze match. Please try again later.');
            }
        } finally {
            setMatching(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass">
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <div className="modal-body">
                    <div className="column job-info">
                        <h2>{job.title}</h2>
                        <h4 className="company">{job.company}</h4>
                        <div className="description-scroll">
                            <p>{job.description}</p>
                        </div>
                    </div>

                    <div className="column match-analysis">
                        {!matchResult ? (
                            <div className="upload-prompt">
                                <h3>AI Match Analysis</h3>
                                <p>We'll compare your saved resume against this job description to see if you're a good fit.</p>
                                
                                {error && <div className="error-message">{error}</div>}

                                <button 
                                    className="btn-primary" 
                                    onClick={handleMatch} 
                                    disabled={matching}
                                >
                                    {matching ? 'AI is thinking...' : 'Analyze My Fit'}
                                </button>
                            </div>
                        ) : (
                            <div className="result-view">
                                <div className="score-container">
                                    <div className="score-circle" style={{ borderColor: matchResult.match_score > 70 ? '#10b981' : '#f59e0b' }}>
                                        <span className="score-number">{matchResult.match_score}%</span>
                                    </div>
                                    <h3>Match Score</h3>
                                </div>
                                <div className="ai-explanation">
                                    <h4>AI Reasoning</h4>
                                    <p>{matchResult.ai_explanation}</p>
                                </div>
                                <button className="btn-outline" onClick={() => setMatchResult(null)}>
                                    Refresh Analysis
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisModal;
