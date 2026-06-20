import api from './api';

export const getAlunos  = (params) => api.get('/api/alunos', { params }).then((r) => r.data);
export const getAluno   = (id)     => api.get(`/api/alunos/${id}`).then((r) => r.data);
export const createAluno = (data)  => api.post('/api/alunos', data).then((r) => r.data);
