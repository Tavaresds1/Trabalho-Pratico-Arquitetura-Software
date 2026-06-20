import api from './api';

export const getCursos  = (params) => api.get('/api/cursos', { params }).then((r) => r.data);
export const getCurso   = (id)     => api.get(`/api/cursos/${id}`).then((r) => r.data);
export const createCurso = (data)  => api.post('/api/cursos', data).then((r) => r.data);
