// src/api/project.js
import axios from 'axios'

//base_url
const BASE_URL = import.meta.env.VITE_API_BASE_URL ||'http://localhost:8080/api/v1/projects'

//  根據 project ID 發出 GET 請求
// export const getProjectById = (projectId) => {
//   return axios.get(`${BASE_URL}/${projectId}`)
// }
export const getProjectById = (projectId) => {
    return axios.get(`${BASE_URL}/${projectId}`).then(response => {
      console.log('API 響應:', response.data); // 確認數據格式
      return response;
    });
  }