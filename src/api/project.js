// src/api/project.js
import axios from 'axios'

//base_url
const BASE_URL = 'http://localhost:8080'


export const createProject = (data, token) => {
  return axios.post(`${BASE_URL}/api/v1/projects/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// 新增專案方案
export const createProjectPlan = (projectId, data, token) => {
  return axios.post(`${BASE_URL}/api/v1/projects/${projectId}/plans`, { plans: data }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// �ھ� project ID �o�X GET �ШD
export const getProjectById = (projectId) => {
  return axios.get(`${BASE_URL}/api/v1/projects/${projectId}`)
}


