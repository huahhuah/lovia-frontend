// src/api/project.js
import axios from 'axios'

//base_url
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com' 

// 根據 project ID 發出 GET 請求
export const getProjectById = (projectId) => {
  return axios.get(`${BASE_URL}/api/v1/projects/${projectId}`)
}


