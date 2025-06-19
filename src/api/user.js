import axios from 'axios'

//base_url
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

// �ק�l�ܪ��A
export const toggleFavorite = (projectId, token) => {
  return axios.patch(`${BASE_URL}/users/projects/${projectId}/follow`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
