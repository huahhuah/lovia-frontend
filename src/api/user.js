import axios from 'axios'

//base_url
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com'

// ­×§ï°lÂÜª¬ºA
export const toggleFavorite = (projectId, token) => {
  return axios.patch(`${BASE_URL}/api/v1/users/projects/${projectId}/follow`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}