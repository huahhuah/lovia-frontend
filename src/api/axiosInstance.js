import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://lovia-backend-xl4e.onrender.com/api/v1', // 根據你的後端 API 調整
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
