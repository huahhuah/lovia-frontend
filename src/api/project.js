// src/api/project.js
import axios from 'axios'

//base_url
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com' 

// �ھ� project ID �o�X GET �ШD
export const getProjectById = (projectId) => {
  return axios.get(`${BASE_URL}/api/v1/projects/${projectId}`)
}


