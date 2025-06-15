import axios from 'axios'

//base_url
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com'

// 取得全部使用者資料
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