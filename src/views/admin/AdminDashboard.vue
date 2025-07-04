<template>
  <div class="container py-5 mt-5">
    <h2 class="mb-4 fw-bold">管理員總覽</h2>

    <!-- KPI 卡 -->
    <div class="row mb-5 text-center">
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">總募資金額</h5>
            <p class="card-text display-6 text-primary">NT$ {{ totalAmount.toLocaleString() }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">總專案數</h5>
            <p class="card-text display-6 text-success">{{ totalProjects }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">總會員數</h5>
            <p class="card-text display-6 text-danger">{{ totalUsers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 上方：專案圓餅圖 + 會員柱狀圖 -->
    <div class="row mb-4">
      <div class="col-md-6 mb-4">
        <canvas ref="projectChart"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <canvas ref="userChart"></canvas>
      </div>
    </div>

    <!-- 下方：log 與小額雙折線 -->
    <div class="row">
      <div class="col-md-6 mb-4">
        <canvas ref="amountChart"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <canvas ref="smallAmountChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'

Chart.register(...registerables)

const totalAmount = ref(0)
const totalProjects = ref(0)
const totalUsers = ref(0)
const dailyAmounts = ref([])
const dailyUsers = ref([])
const projectStatusCounts = ref([])

const amountChart = ref(null)
const smallAmountChart = ref(null)
const userChart = ref(null)
const projectChart = ref(null)

onMounted(async () => {
  const res = await axios.get('https://lovia-backend-xl4e.onrender.com/api/v1/admins/dashboard')
  totalAmount.value = res.data.totalAmount
  totalProjects.value = res.data.totalProjects
  totalUsers.value = res.data.totalUsers
  dailyAmounts.value = res.data.dailyAmounts
  dailyUsers.value = res.data.dailyUsers
  projectStatusCounts.value = res.data.projectStatusCounts

  renderProjectChart()
  renderAmountChart()
  renderSmallAmountChart()
  renderUserChart()
})

function renderAmountChart() {
  new Chart(amountChart.value, {
    type: 'line',
    data: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: '每日贊助金額 (log)',
          data: dailyAmounts.value,
          fill: false,
          borderColor: '#EF476F',
          tension: 0.3,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: '近30天贊助金額 (log scale)',
        },
      },
      scales: {
        y: {
          type: 'logarithmic',
          min: 1,
          ticks: {
            callback: function (value) {
              return 'NT$' + value.toLocaleString()
            },
          },
        },
      },
    },
  })
}

function renderSmallAmountChart() {
  const filteredAmounts = dailyAmounts.value.map((v) => (v > 100000 ? 0 : v))
  new Chart(smallAmountChart.value, {
    type: 'line',
    data: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: '每日小額贊助 (<100,000)',
          data: filteredAmounts,
          fill: false,
          borderColor: '#06D6A0',
          tension: 0.3,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: '近30天小額贊助金額',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return 'NT$' + value.toLocaleString()
            },
          },
        },
      },
    },
  })
}

function renderUserChart() {
  new Chart(userChart.value, {
    type: 'bar',
    data: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: '新註冊會員數',
          data: dailyUsers.value,
          backgroundColor: '#118AB2',
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: '近30天新會員',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
            callback: function (value) {
              return value
            },
          },
        },
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8,
          },
        },
      },
      elements: {
        bar: {
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        },
      },
    },
  })
}

function renderProjectChart() {
  new Chart(projectChart.value, {
    type: 'pie',
    data: {
      labels: ['募資中', '長期贊助', '歷年專案'],
      datasets: [
        {
          data: projectStatusCounts.value,
          backgroundColor: ['#FF8FA3', '#FFD6A5', '#A0C4FF'],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: '專案狀態比例',
        },
      },
    },
  })
}
</script>

<style scoped>
.container {
  padding-top: 5rem;
}
canvas {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  max-height: 400px;
  width: 100%;
}
</style>
