// src/api/upload.js
import axios from 'axios'

export async function uploadImage(formData) {
  return axios.post('https://lovia-backend-xl4e.onrender.com/api/v1/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
