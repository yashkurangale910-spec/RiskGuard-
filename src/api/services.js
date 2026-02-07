import apiClient from './apiClient';

export const studentService = {
    getStudents: () => apiClient.get('/api/students'),
    getStudent: (id) => apiClient.get(`/api/students/${id}`),
    updateStudent: (id, data) => apiClient.put(`/api/students/${id}`, data),
    createStudent: (data) => apiClient.post('/api/students', data),
    addNote: (id, data) => apiClient.post(`/api/students/${id}/notes`, data),
    archiveStudent: (id) => apiClient.post(`/api/students/${id}/archive`),
};

export const dashboardService = {
    getStats: () => apiClient.get('/api/dashboard/stats'),
    getTrends: () => apiClient.get('/api/dashboard/trends'),
};

export const interventionService = {
    getInterventions: () => apiClient.get('/api/interventions'),
    createIntervention: (data) => apiClient.post('/api/interventions', data),
    moveCard: (cardId, status, progress = 0) => apiClient.post(`/api/interventions/${cardId}/move`, { status, progress }),
};
