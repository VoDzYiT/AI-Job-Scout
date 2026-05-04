import React, { useState } from 'react';
import { jobsAPI } from '../api/jobs';
import './JobSearch.css';
import AnalysisModal from './AnalysisModal';

const JobSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const PAGE_SIZE = 25;

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setOffset(0);
        setHasMore(true);
        try {
            console.log('Searching jobs with offset 0');
            const response = await jobsAPI.search(keyword, location, PAGE_SIZE, 0);
            setJobs(response.data.jobs);
            if (response.data.jobs.length < PAGE_SIZE) setHasMore(false);
        } catch (error) {
            console.error('Search failed:', error);
            alert('Failed to fetch jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        const nextOffset = offset + PAGE_SIZE;
        try {
            console.log(`Loading more jobs with offset ${nextOffset}`);
            const response = await jobsAPI.search(keyword, location, PAGE_SIZE, nextOffset);
            
            const newJobsData = response.data.jobs;
            
            if (!newJobsData || newJobsData.length === 0) {
                setHasMore(false);
                return;
            }

            setJobs(prevJobs => {
                // Filter out any duplicates just in case
                const filteredNewJobs = newJobsData.filter(
                    newJob => !prevJobs.some(prevJob => prevJob.id === newJob.id)
                );
                
                if (filteredNewJobs.length === 0) {
                    // If we got jobs but they are all duplicates, we might have reached the end or LinkedIn is repeating
                    setHasMore(false);
                    return prevJobs;
                }

                if (newJobsData.length < PAGE_SIZE) {
                    setHasMore(false);
                }

                return [...prevJobs, ...filteredNewJobs];
            });
            
            setOffset(nextOffset);
        } catch (error) {
            console.error('Failed to load more:', error);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="job-search-view">
            <form className="search-form glass" onSubmit={handleSearch}>
                <div className="input-group">
                    <label>Role</label>
                    <input 
                        type="text" 
                        value={keyword} 
                        onChange={(e) => setKeyword(e.target.value)} 
                        placeholder="e.g. Python Developer"
                    />
                </div>
                <div className="input-group">
                    <label>Location</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="e.g. London"
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search Jobs'}
                </button>
            </form>

            <div className="job-scroll-container">
                <div className="job-list">
                    {jobs.map((job) => (
                        <div key={job.id} className="job-card glass">
                            <div className="job-card-header">
                                <div className="title-area">
                                    <h3>{job.title}</h3>
                                    <span className="company">{job.company}</span>
                                </div>
                                <a href={job.url} target="_blank" rel="noopener noreferrer" className="external-link" title="View on LinkedIn">
                                    ↗️
                                </a>
                            </div>
                            <p className="job-preview">{job.description.substring(0, 150)}...</p>
                            <div className="job-card-footer">
                                <button className="btn-match" onClick={() => setSelectedJob(job)}>Analyze Match</button>
                            </div>
                        </div>
                    ))}
                    {jobs.length > 0 && hasMore && (
                        <button 
                            className="btn-outline load-more-btn" 
                            onClick={handleLoadMore} 
                            disabled={loadingMore}
                        >
                            {loadingMore ? 'Loading more...' : 'Load More Jobs'}
                        </button>
                    )}
                    {jobs.length > 0 && !hasMore && (
                        <p className="no-more-jobs">No more jobs found for this search.</p>
                    )}
                    {!loading && jobs.length === 0 && (
                        <div className="empty-state">
                            <p>Enter a role and location to start discovering jobs.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedJob && (
                <AnalysisModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)} 
                />
            )}
        </div>
    );
};

export default JobSearch;
