import api from './client';

export const jobsAPI = {
    search: (keyword, location, limit = 25, offset = 0) => 
        api.get('/jobs/search', {
            params: { keyword, location, limit, offset }
        }),
    match: (jobId) => {
        const formData = new FormData();
        formData.append('job_id', jobId);
        return api.post('/jobs/match', formData);
    },
    uploadResume: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/jobs/cv/parse', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getResume: () => api.get('/jobs/cv/me'),
};
