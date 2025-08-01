import axios from 'axios'

// base_url
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com/api/v1'

/** ───── 建立 / 修改 ───── **/

// 新增專案
export const createProject = (data, token) => {
  return axios.post(`${BASE_URL}/projects/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// 新增專案方案
export const createProjectPlan = (projectId, data, token) => {
  return axios.post(
    `${BASE_URL}/projects/${projectId}/plans`,
    { plans: data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
}

// 更新專案資料
export const updateProject = (projectId, data, token) => {
  return axios.put(`${BASE_URL}/projects/${projectId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// 更新專案方案資料
export const updateProjectPlan = (projectId, planId, data, token) => {
  return axios.put(`${BASE_URL}/projects/${projectId}/plans/${planId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// 刪除專案
export const deleteProject = (projectId, token) => {
  return axios.delete(`${BASE_URL}/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function deleteProjectPlan(projectId, planId, token) {
  return axios.delete(`${BASE_URL}/projects/${projectId}/plans/${planId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/** ───── 查詢資料 ───── **/

// 取得所有專案（首頁 or 探索頁用）
export const getAllProjects = ({
  page = 1,
  per_page = 6,
  filter = 'all',
  sort = 'newest',
  category_id = null,
} = {}) => {
  const params = { page, per_page, filter, sort }
  if (category_id) params.category_id = category_id
  return axios.get(`${BASE_URL}/projects`, { params })
}

// 取得單一專案詳情
export const getProjectById = (projectId) => {
  return axios.get(`${BASE_URL}/projects/${projectId}`)
}

// 取得所有分類（探索頁用）
export const getAllCategories = () => {
  return axios.get(`${BASE_URL}/projects/categories`)
}

// 取得提案者自己的所有提案
export const getMyProjects = (token) => {
  return axios.get(`${BASE_URL}/projects/my-projects`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

/** ───── 子功能資料 ───── **/

// 取得專案概覽資料
export const getProjectOverview = (projectId) => {
  return axios.get(`${BASE_URL}/projects/${projectId}/overview`)
}

// 取得專案的所有回饋方案
export const getProjectPlans = (projectId) => {
  return axios.get(`${BASE_URL}/projects/${projectId}/plans`)
}

// 取得專案進度
export const getProgress = (projectId) => {
  return axios.get(`${BASE_URL}/projects/${projectId}/progresses`)
}

// 取得留言與回覆
export const getProjectComments = (projectId) => {
  return axios.get(`${BASE_URL}/projects/${projectId}/comments`)
}

// 取得專案 FAQ
export const getProjectFaqs = (projectId) => {
  return axios.get(`${BASE_URL}/projects/${projectId}/faq`)
}

/** ───── 留言與贊助 ───── **/

// 建立留言
export const createProjectComment = (projectId, content, token) => {
  return axios.post(
    `${BASE_URL}/projects/${projectId}/comments`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
}

// 贊助某個方案
export const sponsorProjectPlan = (projectId, planId, data, token) => {
  return axios
    .post(`${BASE_URL}/projects/${projectId}/plans/${planId}/sponsor`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
}

// 建立訂單
export const createSponsorship = (projectId, planId, payload, token) => {
  return axios
    .post(`${BASE_URL}/projects/${projectId}/plans/${planId}/sponsor-entry`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
}

/** ───── 付款功能 ───── **/

// 建立付款連結（信用卡 / linepay）
// 建立付款連結
export async function createOrderPaymentLink(orderId, paymentType = 'credit', token) {
  return axios.post(
    `${BASE_URL}/users/orders/${orderId}/payment`,
    { payment_type: paymentType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export async function createOrderPaymentForm(orderId, amount, email, token) {
  return axios.post(`${BASE_URL}/users/ecpay/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'document',
  })
}
