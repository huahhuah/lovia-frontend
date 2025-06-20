const BASE_URL = 'https://lovia-backend-xl4e.onrender.com/api/v1'

export const useSponsorshipStore = defineStore('sponsorship', {
  state: () => ({
    mySponsorships: [],
  }),
  actions: {
    async fetchMySponsorships() {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('未登入，請先登入')

        const res = await axios.get(`${BASE_URL}/users/orders/mine`, {   // <-- 這裡改用完整路徑
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.mySponsorships = res.data.data || []
      } catch (error) {
        console.error('取得贊助專案失敗', error)
        this.mySponsorships = []
        throw error
      }
    },
  }
})
