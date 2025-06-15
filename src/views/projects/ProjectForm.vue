<template>
  <div class="proposal-wrapper position-relative" style="font-family: 'Noto Sans', sans-serif;">
    <!-- 背景圖 -->
    <img src="/proposal-bg2.png" class="position-absolute top-0 start-0" style="z-index: -1; width: 100%; height: 80vh; object-fit: cover;" />

    <!-- 標題區 -->
    <div class="proposal-header text-white">
      <img src="/proposal-deco.png" class="position-absolute deco-icon" style="top: 60px; left: 120px; width: 280px;" />
      <div class="container py-2 d-flex flex-column align-items-start text-start" style="padding-top: 6rem !important; max-width: 900px; margin: 0 auto;">
        <h1 style="font-size: 2em; margin-top: 5rem; margin-bottom: 0.5rem; color: black;">
          {{isEdit ? '編輯提案' : '發起提案'}}
        </h1>
        <p style="font-size: 1rem; color: black;">讓改變，從這裡開始</p>
      </div>
    </div>

    <!-- 表單內容 -->
    <div class="proposal-body py-5" style="background-image: url('/proposal-bg.png'); background-size: cover; background-position: 0 -10px;">
      <div class="container" style="padding-top: 10rem; max-width: 900px; margin: 0 auto;">
        <form @submit.prevent="submitForm">

          <!-- (1) 基本資訊 -->
          <div class="form-section mb-5">
            <h3 class="section-title mb-4">基本資訊</h3>
            <div class="row g-4">
              <div class="col-md-6">
                <!-- 提案標題 -->
                <div class="mb-3 position-relative">
                  <label class="form-label">提案標題<span class="text-danger">*</span></label>
                  <input
                    v-model="form.title"
                    maxlength="40"
                    @input="titleCount = form.title.length"
                    type="text"
                    class="form-control bg-light rounded"
                    placeholder="請簡短描述本提案的名稱"
                    required
                  />
                  <small class="char-count text-muted">{{ titleCount }}/40</small>
                </div>

                <!-- 類別 -->
                <div class="mb-3">
                  <label class="form-label">提案分類<span class="text-danger">*</span></label>
                  <select
                    v-model.number="form.category_id"
                    class="form-select bg-light rounded"
                    :class="{ 'text-muted': !form.category_id }"
                    required
                  >
                    <option disabled value="">請選擇本提案所屬的類別，例如教育、環保、人文等</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <!-- 團隊 -->
                <div class="mb-3">
                  <label class="form-label">提案團隊<span class="text-danger">*</span></label>
                  <input v-model="form.project_team" type="text" class="form-control bg-light rounded" placeholder="請輸入提案人姓名或團隊名稱" required />
                </div>

                <!-- 團隊介紹 -->
                <div class="mb-3">
                  <label class="form-label">團隊介紹</label>
                  <textarea
                    v-model = "form.project_team"
                    class="form-control bg-light rounded" placeholder="請介紹團隊成員與專業背景，讓支持者更安心地了解您們如何實現這項計畫。"></textarea>
                </div>
              </div>

              <!-- 封面 -->
              <div class="col-md-6 d-flex flex-column align-items-stretch">
                <label class="form-label mb-2" style="color: #5F6368; font-weight: 400;">
                  專案封面<span class="text-danger">*</span>
                </label>
                <div
                  class="upload-box bg-light w-100 d-flex align-items-center justify-content-center"
                  :class="{ 'drag-over': isDragging}"
                  @dragover.prevent="onDragOver"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="onDrop"
                >
                  <div class="inner-box position-relative">
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    class="preview-image"
                  />
                    <div v-if="!imagePreview" class="upload-content text-center">
                      <img src="/upload.png" alt="upload" style="width: 30px" class="mb-2" />
                      <p class="mb-1">拖曳圖片至此處，或點擊選擇檔案</p>
                      <p class="mb-1 text-muted">支援 PNG、JPG 格式，大小上限 10MB</p>
                      <button type="button" class="btn btn-outline-secondary mt-2" @click="triggerFileInput">選擇檔案</button>
                      <input
                        type="file"
                        ref="fileInput"
                        accept="image/jpeg, image/png"
                        style="display: none;"
                        @change="onFileChange"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="isUpload" class="text-center mt-2">
                  <small class="text-muted">正在上傳...</small>
                </div>
              </div>
            </div>
          </div>

          <!-- (2) 募資設定 -->
          <div class="form-section mb-5">
            <h3 class="section-title mb-4">募資設定</h3>
            <div class="mb-3">
              <label class="form-label">目標金額<span class="text-danger">*</span></label>
              <div class="icon-overlay-wrapper">
                <span class="calendar-overlay" style="left: 10px; font-size: 0.9rem; color: #5F6368;">NT$</span>
                <input v-model.number="form.total_amount" type="number" class="form-control bg-light" placeholder="請輸入您希望募得的總金額" required />
              </div>
            </div>
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label">開始日期<span class="text-danger">*</span></label>
                <div class="icon-overlay-wrapper">
                  <img src="/calendar.png" alt="calendar" class="calendar-overlay" style="width: 20px;" />
                  <input v-model="form.start_time" type="text" class="form-control bg-light" placeholder="請選擇專案希望開始募資的日期" @focus="(e) => e.target.type='date'" required />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">結束日期<span class="text-danger">*</span></label>
                <div class="icon-overlay-wrapper">
                  <img src="/calendar.png" alt="calendar" class="calendar-overlay" style="width: 20px;" />
                  <input v-model="form.end_time" type="text" class="form-control bg-light" placeholder="請選擇專案結束募資的日期" @focus="(e) => e.target.type='date'" required />
                </div>
              </div>
            </div>
          </div>

          <!-- (3) 提案說明 -->
          <div class="form-section mb-5">
            <h3 class="section-title mb-4">提案說明</h3>
            <div class="mb-3 position-relative">
              <label class="form-label">摘要說明<span class="text-danger">*</span></label>
              <textarea v-model="form.summary" maxlength="100" @input="summaryCount = form.summary.length" class="form-control bg-light rounded" placeholder="請簡要介紹您的提案，讓支持者了解計畫初衷，並將希望與支持帶給需要的人。" rows="3" required></textarea>
              <small class="char-count text-muted">{{ summaryCount }}/100</small>
            </div>
            <div class="mb-3">
              <label class="form-label">詳細介紹<span class="text-danger">*</span></label>
              <textarea v-model="form.full_content" class="form-control bg-light rounded" placeholder="請補充完整專案內容，說明創新性、社會影響力及可持續性，建議包括背景、執行方式、經費用途及預期成果。" rows="6" required></textarea>
            </div>
          </div>

          <!-- 常見問題區塊 -->
          <div class="form-section mb-5">
            <h3 class="section-title mb-4">常見問題</h3>
            <div v-for="(faq, index) in formFaqs" :key="index" class="faq-box mb-4 shadow-sm">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="d-flex align-items-center gap-2">
                  <img src="/vector.png" width="16" />
                  <img src="/layers.png" width="16" />
                  <input
                    v-if = "faq.isEditing"
                    v-model = "faq.question"
                    type = "text"
                    class = "form-control bg-light"
                    placeholder="請輸入問題"
                  />
                  <span style="font-weight: 300; color: #000000;">{{ faq.question }}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <img
                    src="/edit.png"
                    width="16"
                    alt="edit"
                    style="cursor: pointer;"
                    @click="faq.isEditing = !faq.isEditing"
                  />
                  <img
                    src="/delete.png"
                    width="16"
                    alt="delete"
                    style="cursor: pointer;"
                    @click="formFaqs.splice(index, 1)"
                  />
                  <img src="/edit.png" width="16" alt="edit" style="cursor: pointer;" />
                  <img src="/delete.png" width="16" alt="delete" style="cursor: pointer;" @click="formFaqs.splice(index, 1)" />
                </div>
              </div>
              <div class="faq-divider"></div>
              <p class="faq-answer">{{ faq.answer }}</p>
            </div>
          </div>

          <!-- 新增常見問題 -->
          <div class="form-section mb-5">
            <h3 class="section-title mb-4" style="font-size: 1rem;">新增常見問題</h3>
            <div class="faq-box faq-new shadow-sm">
              <div class="mb-3 d-flex align-items-center gap-2">
                <img src="/vector.png" width="16" />
                <img src="/layers.png" width="16" />
                <input type="text" class="form-control bg-light" style="font-weight: 300;" :placeholder="questionPlaceholder" v-model="newFaq.question" />
              </div>
              <div class="faq-divider"></div>
              <div class="mb-3">
                <textarea class="form-control bg-light" style="font-weight: 300;" rows="3" placeholder="請回答上方問題，提供具體資訊或執行方式說明。" v-model="newFaq.answer"></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="addbtn btn-outline-dark rounded-pill px-2.5 py-1" @click="addFaq">＋ 新增</button>
              </div>
            </div>
          </div>

          <!-- 提交按鈕 -->
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-danger rounded-pill px-6 py-2">下一步：填寫回饋方案</button>
            <p class="mt-2" style="font-size: 0.6rem; color: #5F6368;">確認所有 * 欄位皆完成填寫</p>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createProject, updateProject } from '@/api/project'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const imageFile = ref(null)  //  原始檔
const imagePreview = ref(null)  // 預覽用
const isUpload = ref(false)  // 上傳狀態
const isDragging = ref(false)  //  增加拖曳狀態
const fileInput = ref(null)
const projectId = route.params.project_id
const isEdit = ref(route.name === 'ProjectFormEdit')

function triggerFileInput(){
  fileInput.value?.click()
}

function onFileChange(event){
  const file = event.target.files[0]
  handleImageFile(file)
}

function onDragOver(event){
  isDragging.value = true
}

function onDrop(event){
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  handleImageFile(file)
}

function handleImageFile(file){
  if(!file) return;
  if(!['image/jpeg', 'image/png'].includes(file.type)){
    alert('僅支援 JPG 或 PNG 格式');
    return;
  }
  if(file.size > 10*1024*1024 ){
    alert('圖片大小不能超過 10MB');
    return;
  }
  //  本地預覽
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
  //  開始上傳
  uploadFile(file);
}

//  圖片上傳
async function uploadFile(file){
  try{
    isUpload.value = true;
    const formData = new FormData();
    formData.append('file',file);

    const res = await axios.post('https://lovia-backend-xl4e.onrender.com/api/v1/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    form.cover = res.data.url;
    imagePreview.value = res.data.url
  } catch(err){
    alert('圖片上傳失敗:'+(err.response?.data?.message || err.message));
  } finally{
    isUpload.value = false;
  }
}

const questionPlaceholder = ref('請輸入支持者可能會提出的問題，例如：捐款是否可抵稅？')

const categories = [
  { id: 1, name: '人文' },
  { id: 2, name: '環境' },
  { id: 3, name: '動物' },
  { id: 4, name: '醫療' },
  { id: 5, name: '救援' },
]

const titleCount = ref(0)
const summaryCount = ref(0)

const form = reactive({
  title: '',
  category_id: null,
  total_amount: null,
  start_time: '',
  end_time: '',
  cover: '',
  summary: '',
  full_content: '',
  project_team: '',
  faq: '',
})

const formFaqs = ref([
  {
    question: '專案成功後，什麼時候會開始執行？',
    answer: '一旦募資成功，我們將於 7 月啟動購置流程，預計在 9 月開學前完成設備發送與教學安排。'
  },
  {
    question: '我可以指定支持某一所學校嗎？',
    answer: '目前本專案為整體性規劃，未提供指定對象功能。不過您將會收到我們在三所學校執行的完整成果紀錄。'
  },
  {
    question: '這個協會真的可信嗎',
    answer: '我們為正式立案之公益團體，協會資訊可於內政部網站查詢。我們也會在專案頁面展示過往成果與媒體報導。'
  }
])

const newFaq = reactive({
  question: '',
  answer: ''
})

function addFaq() {
  if (newFaq.question && newFaq.answer) {
    formFaqs.value.push({ ...newFaq })
    newFaq.question = ''
    newFaq.answer = ''
  } else {
    alert('請填寫完整的問題與答案')
  }
}

async function loadProjectData(id) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('未登入或 token 遺失')
      router.push('/login')
      return
    }
    const res = await axios.get(`https://lovia-backend-xl4e.onrender.com/api/v1/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const project = res.data.data
    form.title = project.title
    form.category_id = project.category?.id || null
    form.total_amount = project.total_amount
    form.start_time = project.start_time
    form.end_time = project.end_time
    form.cover = project.cover
    form.summary = project.summary
    form.full_content = project.full_content
    form.project_team = project.project_team
    // FAQ 預設處理
    formFaqs.value = Array.isArray(project.faq) ? project.faq.map(faq => ({
      question: faq.question || '',
      answer: faq.answer || ''
    })) : [];
    // 封面圖片預覽
    imagePreview.value = project.cover
    console.log('form:', form) //這裡
  } catch (error) {
    console.error('專案載入失敗', error)
    alert ('專案載入失敗，請稍後再試')
  }
}

async function submitForm() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('未登入或 token 遺失')
      return
    }

    if (!form.title ||
       !form.category_id ||
       !form.total_amount ||
       !form.start_time ||
       !form.end_time ||
       !form.cover ||
       !form.summary ||
       !form.full_content ||
       !form.project_team){
        alert ('請確認所有必填欄位已完成')
        return
       }

    const payload = {
      title: form.title,
      summary: form.summary,
      category_id: form.category_id,
      total_amount: form.total_amount,
      start_time: form.start_time,
      end_time: form.end_time,
      cover: form.cover,
      full_content: form.full_content,
      project_team: form.project_team,
      faq: formFaqs.value,  // 把 faq 字串改成陣列送出去，後端才能收到多筆 FAQ
    }
    let newProjectId = null
    if (isEdit.value && projectId){
      // put 更新
      await updateProject(projectId, payload, token)
      alert('專案更新成功，請更新回饋方案')
      router.push({
       path: `/projects/${projectId}/plans`,
       query: { isEdit: true },
      })
    } else {
      const res = await createProject(payload, token)
      const newProjectId = res.data.data?.project_id
      if (!newProjectId) {
        alert('建立成功但未取得專案 ID')
        return
      }
      alert('專案建立成功，請繼續填寫回饋方案')
      router.push(`/projects/${newProjectId}/plans`)
    }
  } catch (err) {
    console.error('建立專案失敗', err)
    alert('建立專案失敗，請確認欄位是否填寫完整')
  }
}

onMounted(async () => {
  console.log('onMounted -> projectId:', projectId)
  console.log('onMounted -> isEdit:', isEdit.value)
  if (projectId && isEdit.value) {
    await loadProjectData(projectId)
  }

  if (window.innerWidth <= 767.98) {
    questionPlaceholder.value = '請輸入支持者可能會提出的問題'
  }
})

</script>

<style scoped>
.form-label {
  color: #5F6368;
  font-weight: 400;
}
.text-danger {
  color: #FC5B53 !important;
}
.form-control,
.form-select {
  font-weight: 300 !important;
  border-radius: 0.75rem !important;
}
::placeholder {
  color: #C4C4C4 !important;
  font-size: 0.9rem;
  font-weight: 300;
}
option:disabled {
  color: #C4C4C4;
}
.border-dashed {
  border-style: dashed !important;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 400;
}
.position-relative {
  position: relative;
}
.char-count {
  position: absolute;
  right: 12px;
  font-size: 0.7rem;
  color: #C4C4C4;
}
/* 新增：讓 input-group icon 與 input 欄位邊框無縫連接 */
.input-group .input-group-text {
  border: none;
  background: transparent;
  padding-right: 0;
}
.input-group .form-control {
  border-left: none;
}
.input-group .calendar-icon img {
  margin-left: 8px;
}
/* 可選：讓 icon 疊在欄位上 */
.icon-overlay-wrapper {
  position: relative;
}
.icon-overlay-wrapper .calendar-overlay {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}
.icon-overlay-wrapper input {
  padding-left: 2.5rem;
}
.faq-divider {
  border-top: 1px dashed #C4C4C4;
  margin: 12px 0;
  width: 100%;
  max-width: 780px;
  height: 1px;
}
.faq-box {
  background-color: #FFF8F9;
  border-radius: 1rem;
  border: 1px solid #dee2e6;
  padding: 2rem 3rem; /* 上下 3rem, 左右 2rem */
}
.faq-answer {
  color: #5F6368;
  font-weight: 300;
  margin-top: 0.5rem;
  margin-bottom: 0;
  padding-left: 25px;
}
.faq-box h3.section-title {
  font-size: 1rem;
}

button.btn-outline-dark.rounded-pill {
  background-color: black;
  color: white;
  border: none !important;
  transition: all 0.2s ease-in-out;
  font-weight: 300;
  font-size: 1rem;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
}

button.btn-outline-dark.rounded-pill:active {
  color: #C4C4C4;
}

button.btn-danger.rounded-pill {
  border-radius: 999px !important;
  background-color: #FC5B53 !important;
  border: none !important;
  font-weight: bold;
  letter-spacing: 3px;
}
.upload-box {
  min-height: 320px;
  max-height: 320px;  /* 加這行 */
  width: 100%;  /* 加這行 */
  max-width: 400px;  /* 加這行 */
  border-radius: 0.8rem;
  border: 1px solid #dee2e6;
  position: relative;  /* 加這行 */
  overflow: hidden;  /* 加這行 */
}

.upload-box .inner-box {
  width: 97%;
  height: 97%;
  max-height: 300px;  /* 加這行 */
  border: 1px dashed #dee2e6;
  border-radius: 0.8rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;  /* 加這行 */
  overflow: hidden; /* 加這行 */
}
@media (max-width: 767.98px) {
  .faq-new .d-flex.align-items-center {
    flex-wrap: wrap !important; /* ✅ 讓裡面的元素可換行 */
    align-items: flex-start;
  }

  .faq-new .d-flex.align-items-center input.form-control {
    width: 100% !important;
    margin-top: 0.8rem;
  }
  .faq-box textarea.form-control {
    width: 100% !important;
    display: block;
  }

  .faq-box .addbtn {
    width: 30%;
    margin-top: 0.5rem;
  }

  .faq-box img {
    width: 16px;
    height: auto;
  }

  /* 1. 縮短上方背景圖高度 */
  img[src="/proposal-bg2.png"] {
    height: 50vh !important;
  }

  img[src="/edit.png"],
  img[src="/delete.png"] {
    display: none !important;
  }
  .container {
    padding-left: 1.5rem !important;
    padding-right: 1rem !important;
  }

  .proposal-header .container {
    align-items: center !important;
    text-align: center !important;
    padding-top: 3rem !important;
  }

  .proposal-header h1 {
    font-size: 1.5rem !important;
    margin-top: 3rem !important;
    color: black !important;
  }

  .proposal-header p {
    font-size: 1rem !important;
    color: black !important;
  }

  .deco-icon {
    display: none !important;
  }

  .proposal-body {
    padding-top: 0rem !important;
    background-position: -150px -50px !important;
  }

  .form-section {
    padding: 0 0.5rem;
  }

  .faq-box {
    padding: 1rem 1.5rem !important;
  }

  .upload-box {
    min-height: 200px !important;
    max-height: 200px;  /* 加這行 */
    max-width: 100%;  /* 加這行 */
    padding: 1rem;
    overflow: hidden; /* 加這行 */
    position: relative; /* 加這行 */
  }

  .upload-box .inner-box {
    padding: 1rem;
    max-height: 180px; /* 加這行 */
    position: relative; /* 加這行 */
    overflow: hidden;   /* 加這行 */
  }

  .upload-box p {
    font-size: 0.85rem;
    text-align: center;
  }

  .upload-box button {
    font-size: 0.85rem;
    padding: 0.25rem 1rem;
  }

  .preview-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    border-radius: 0.8rem;
  }

  .upload-content {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .form-label {
    font-size: 0.9rem !important;
  }

  .form-control,
  .form-select {
    font-size: 0.9rem !important;
  }

  .char-count {
    font-size: 0.65rem;
    right: 8px;
  }

  .section-title {
    font-size: 1.1rem !important;
  }

  .faq-answer {
    padding-left: 0.5rem !important;
  }

  .btn-danger.rounded-pill {
    font-size: 1rem;
    padding: 0.6rem 1.5rem !important;
    width: 100%;
  }

  .addbtn {
    width: 100%;
    font-size: 0.9rem;
  }
}
  .btn-danger {
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
    max-width: 75%;
  }

</style>
