import axios from 'axios';

const api = axios.create({ baseURL: '', timeout: 60000 });

export async function generateLesson(topic) {
  const { data } = await api.post('/api/learn/generate', { topic });
  return data;
}

export async function getHint(topic, question) {
  const { data } = await api.post('/api/learn/hint', { topic, question });
  return data;
}

export async function webSearch(query) {
  const { data } = await api.get('/api/search', { params: { q: query } });
  return data;
}
