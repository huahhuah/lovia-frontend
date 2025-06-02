import axios from 'axios'

//base_url
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com'

// ���o�����ϥΪ̸��
export const allUsers = ( token, page = 1 ) => {
  return axios.get(`${BASE_URL}/api/v1/admins/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params:{
      page,
    }
  })
}