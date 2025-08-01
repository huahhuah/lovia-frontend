import axios from 'axios'

//base_url
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com/api/v1'

// 取得全部使用者資料
export const allUsers = (token, page = 1) => {
  return axios.get(`${BASE_URL}/admins/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })
}

// 取得全部專案資料
export const allProjects = (token, page = 1) => {
  return axios.get(`${BASE_URL}/admins/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })
}
