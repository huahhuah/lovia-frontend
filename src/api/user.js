import axios from 'axios'

//base_url
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com/api/v1'

// �ק�l�ܪ��A
export const toggleFavorite = (projectId, token) => {
  return axios.patch(`${BASE_URL}/users/projects/${projectId}/follow`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
