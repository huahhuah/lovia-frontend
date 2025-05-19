<template>
  <div class="container py-5" v-if="project">
    <!-- 上方 Banner -->
    <div
      v-if="!project"
      class="skeleton-banner mb-4 rounded bg-secondary bg-opacity-10"
      style="height: 300px"
    ></div>
    <ProjectBanner v-else :project="project" />

    <!-- 分頁切換區塊 -->
    <div class="row mt-5">
      <!-- 左側內容區 -->
      <div class="col-lg-8">
        <!-- 自訂 tabs 樣式 -->
        <ul class="custom-tabs d-flex gap-4 mb-4">
          <li
            v-for="tab in tabs"
            :key="tab"
            :class="['tab-item', { active: activeTab === tab }]"
            @click="activeTab = tab"
          >
            {{ tab }}
          </li>
        </ul>

        <!-- 切換對應內容 -->
        <div class="bg-white p-4 rounded-4 shadow-sm">
          <div v-if="activeTab === '提案內容'">
            <p class="text-muted" style="white-space: pre-line">
              {{ project?.full_content || '尚無提案內容。' }}
            </p>
          </div>

          <div v-else-if="activeTab === '問與答'">
            <p class="text-muted">尚未提供 Q&A 資料。</p>
          </div>

          <div v-else-if="activeTab === '常見問題'">
            <ul class="list-unstyled text-muted">
              <li>Q：如何贊助？</li>
              <li>A：點擊「立即贊助」按鈕即可完成操作。</li>
              <li class="mt-3">Q：我可以取消贊助嗎？</li>
              <li>A：請聯繫平台客服協助處理。</li>
            </ul>
          </div>

          <div v-else-if="activeTab === '進度分享'">
            <p class="text-muted">尚未發布任何更新內容。</p>
          </div>
        </div>
      </div>

      <!-- 右側方案卡片 -->
      <div class="col-lg-4 mt-5 mt-lg-0 border-start ps-3">
        <div v-if="plans.length === 0">
          <div
            v-for="n in 2"
            :key="n"
            class="card mb-3 p-4 bg-secondary bg-opacity-10 rounded-4"
            style="height: 180px"
          ></div>
        </div>
        <ProjectPlans v-else :plans="plans" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProjectBanner from '@/components/ProjectBanner.vue'
import ProjectPlans from '@/components/ProjectPlans.vue'
import { getProjectOverview, getProjectPlans } from '@/api/project'

const route = useRoute()
const projectId = route.params.id

const project = ref(null)
const plans = ref([])
const activeTab = ref('提案內容')
const tabs = ['提案內容', '問與答', '常見問題', '進度分享']

onMounted(async () => {
  const projectId = parseInt(route.params.id)
  if (isNaN(projectId)) return

  try {
    const resOverview = await getProjectOverview(projectId)
    project.value = resOverview.data.data

    const resPlans = await getProjectPlans(projectId)
    plans.value = resPlans.data.data
    console.log('✅ plans:', plans.value)
  } catch (err) {
    console.error('讀取專案資料失敗', err)
  }
})
</script>

<style scoped>
.container {
  max-width: 1140px;
}

.custom-tabs {
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.tab-item {
  cursor: pointer;
  padding-bottom: 8px;
  font-weight: 500;
  position: relative;
  color: #333;
}

.tab-item.active {
  color: #e74c3c;
  font-weight: 700;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #e74c3c;
  border-radius: 6px;
}
</style>
