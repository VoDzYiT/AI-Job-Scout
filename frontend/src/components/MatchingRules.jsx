import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import './MatchingRules.css';

const MatchingRules = () => {
    const { user, setUser } = useAuth();
    const [rules, setRules] = useState(user?.matching_rules || []);
    const [newRule, setNewRule] = useState('');
    const [saving, setSaving] = useState(false);

    const commonPresets = [
        "I want to work only online (Remote)",
        "I need a pizza day once a week",
        "Salary must be above 20k PLN",
        "Private healthcare is a must",
        "No corporate bullshit environment",
        "Flexible working hours"
    ];

    const handleAddRule = (ruleText) => {
        const text = ruleText || newRule;
        if (!text || rules.includes(text)) return;
        setRules([...rules, text]);
        setNewRule('');
    };

    const removeRule = (index) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    const saveRules = async () => {
        setSaving(true);
        try {
            const response = await authAPI.updatePreferences(rules);
            setUser(prev => ({ ...prev, matching_rules: rules }));
            alert('Rules saved successfully! These will be used for your next job matches.');
        } catch (error) {
            console.error('Failed to save rules:', error);
            alert('Failed to save rules.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="matching-rules-view">
            <div className="rules-container glass">
                <div className="rules-header">
                    <h2>🎯 Matching Rules & Preferences</h2>
                    <p>Define what matters most to you. Our AI will use these rules to evaluate job matches.</p>
                </div>

                <div className="rules-input-section">
                    <div className="input-row">
                        <input 
                            type="text" 
                            placeholder="e.g. 'I want to work only online'" 
                            value={newRule}
                            onChange={(e) => setNewRule(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                        />
                        <button className="btn-primary" onClick={() => handleAddRule()}>Add Rule</button>
                    </div>
                    
                    <div className="presets-area">
                        <span>Quick Presets:</span>
                        <div className="presets-list">
                            {commonPresets.map((preset, i) => (
                                <button 
                                    key={i} 
                                    className="preset-tag"
                                    onClick={() => handleAddRule(preset)}
                                >
                                    + {preset}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="active-rules-section">
                    <h3>Your Active Rules</h3>
                    {rules.length === 0 ? (
                        <div className="empty-rules">
                            <p>No rules added yet. Add some to get more personalized job matches!</p>
                        </div>
                    ) : (
                        <div className="rules-list">
                            {rules.map((rule, index) => (
                                <div key={index} className="rule-item">
                                    <span>{rule}</span>
                                    <button onClick={() => removeRule(index)}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rules-footer">
                    <button 
                        className="btn-primary save-btn" 
                        onClick={saveRules}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
            
            <div className="pro-tip glass">
                <h4>💡 How it works</h4>
                <p>When you click "Analyze Match" on a job, the AI compares your resume to the job description while strictly enforcing these rules. If a job violates a rule (e.g. it's on-site but you want Remote), the score will be lower.</p>
            </div>
        </div>
    );
};

export default MatchingRules;
