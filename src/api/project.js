// src/api/project.js
import axios from 'axios'

//base_url
//const BASE_URL = 'https://lovia-backend-xl4e.onrender.com'
const BASE_URL = 'http://127.0.0.1:8080'

// 新增專案
export const createProject = (data, token) => {
  return axios.post(`${BASE_URL}/api/v1/projects/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// 新增專案方案
export const createProjectPlan = (projectId, data, token) => {
  return axios.post(
    `${BASE_URL}/api/v1/projects/${projectId}/plans`,
    { plans: data },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

// 取得指定 ID 的專案
export const getProjectById = (projectId) => {
  return axios.get(`${BASE_URL}/api/v1/projects/${projectId}`)
}

// 取得首頁整包分類
export const getAllProjects = ({
  page = 1,
  per_page = 6,
  filter = 'all',
  sort = 'newest',
  category_id = null,
} = {}) => {
  const params = {
    page,
    per_page,
    filter,
    sort,
  }

  if (category_id) {
    params.category_id = category_id
  }

  return axios.get(`${BASE_URL}/api/v1/projects`, { params })
}

// 取得所有分類（探索頁用）
export const getAllCategories = () => {
  return axios.get(`${BASE_URL}/api/v1/projects/categories`)
}

// 取得專案概覽資料
export const getProjectOverview = async (projectId) => {
  return axios.get(`${BASE_URL}/api/v1/projects/${projectId}/overview`)
}

// 取得專案的所有回饋方案
export const getProjectPlans = async (projectId) => {
  return axios.get(`${BASE_URL}/api/v1/projects/${projectId}/plans`)
}

// 取得專案進度
export const getProgress = (projectId) => {
  return axios.get(`${BASE_URL}/api/v1/projects/${projectId}/progresses`)
}

// 建立留言
export function createProjectComment(projectId, content, token) {
  return axios.post(
    `${BASE_URL}/api/v1/projects/${projectId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

//贊助某個方案
export async function sponsorProjectPlan(projectId, planId, payload, token) {
  return axios.post(`${BASE_URL}/api/v1/projects/${projectId}/plans/${planId}/sponsor`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//建立訂單
export async function createSponsorship(projectId, planId, payload, token) {
  const res = await axios.post(
    `${BASE_URL}/api/v1/projects/${projectId}/plans/${planId}/sponsor`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return res.data
}

// 更新專案資料
export const updateProject = (projectId, data, token) => {
  return axios.put(`${BASE_URL}/api/v1/projects/${projectId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// 更新專案方案資料
export const updateProjectPlan = (projectId, planId, data, token) => {
  return axios.put(`${BASE_URL}/api/v1/projects/${projectId}/plans/${planId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// 取得專案留言
export async function getProjectCommets(projectId) {
  return axios.get(`${BASE_URL}/api/v1/projects/${projectId}/comments`)
}

// 建立付款連結
export async function createOrderPaymentLink(orderId, paymentType = 'credit', token) {
  return axios.post(
    `${BASE_URL}/api/v1/users/orders/${orderId}/payment`,
    { payment_type: paymentType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export async function createOrderPaymentForm(orderId, amount, email, token) {
  return axios.post(
    `${BASE_URL}/api/v1/users/ecpay/orders/${orderId}`, // ✅ 修正這一行
    { amount, email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'document', // 🔄 綠界回傳的是 HTML form
    }
  )
}
