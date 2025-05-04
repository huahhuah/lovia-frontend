// src/api/project.js
import axios from 'axios'

//base_url
const BASE_URL = import.meta.env.VITE_API_BASE_URL ||'http://localhost:8080/api/v1/projects'

//  �ھ� project ID �o�X GET �ШD
// export const getProjectById = (projectId) => {
//   return axios.get(`${BASE_URL}/${projectId}`)
// }
export const getProjectById = (projectId) => {
    return axios.get(`${BASE_URL}/${projectId}`).then(response => {
      console.log('API �T��:', response.data); // �T�{�ƾڮ榡
      return response;
    });
  }