<template>
    <div class="">
        <h2>進度分享</h2>
        <!--必填之進度資料-->
        <label>標題</label>
        <input type="text" v-model="title" placeholder="50字以內"/>
        <br/>
        <label>日期</label>
        <input type="date" v-model="date" />
        <br/>
        <label>內容</label>
        <textarea  v-model="content"></textarea>
        <br/>
            
        <!--資金使用狀況卡片-->
        <div 
            class = "card"
            v-for="(card, index) in cards"
            :key="index"
        >
            <label>匯款資料</label>
            <input type="text" v-model="card.recipient">
            <br/>
            <label>資金用途</label>
            <input type="text" v-model="card.usage">
            <br/>
            <label>金額</label>
            <input type="number" v-model="card.amount">
            <br/>
            <label>資金狀態</label>
            <select v-model="card.status">
                <option value="已撥款">已撥款</option>
                <option value="審核中">審核中</option>
                <option value="未撥款">未撥款</option>
            </select>
            <br/>
            <button @click="removeCard(index)">刪除此筆資料</button>
        </div>
        <button @click="addCard">新增一筆資料</button>
        <button @click="submit">儲存進度</button>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const title = ref('')
const content = ref('')
const date = ref('')
const cards = ref([])
const props = defineProps(['projectId', 'progressId'])
const isEditMode = ref(false)
const progressId = ref(null)

function addCard(){
    cards.value.push({
        recipient: '',
        usage: '',
        amount: 0,
        status: '審核中'
    })
}
function removeCard(index){
    cards.value.splice(index, 1)
}

onMounted(() => {
    if (props.progressId){
        isEditMode.value = true
        progressId.value = props.progressId
        progressData()
    }
})

async function progressData(){
    const token = localStorage.getItem('token')
    try{
        const response = await axios.get(`https://lovia-backend-xl4e.onrender.com/api/v1/projects/${props.projectId}/progresses`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
    })
    const progress = response.data.data
    const data = progress.find( per => per.id === Number(props.progressId))
    if (!data) {
        alert('找不到進度資料')
        return
    }
    title.value = data.title
    content.value = data.content
    date.value = data.date
    cards.value = data.fund_usages.map(fund =>({
        recipient: fund.recipient,
        usage: fund.usage,
        amount: fund.amount,
        status: fund.status
    }))
    } catch (error){
        console.error('載入資料失敗', error)
    }
}

async function submit(){
    const url = isEditMode.value
    ? `https://lovia-backend-xl4e.onrender.com/api/v1/users/projects/${props.projectId}/progress/${props.progressId}`
    : `https://lovia-backend-xl4e.onrender.com/api/v1/users/projects/${props.projectId}/progress`
    const method = isEditMode.value ? 'patch' : 'post'
    const token = localStorage.getItem('token')
    try{
        const response = await axios({
            method, url, headers: {
                Authorization:`Bearer ${token}`
            },
            data: {
                title: title.value,
                content: content.value,
                date: date.value,
                fund_usages: cards.value
            }
        })
        console.log('送出成功', response.data)
        alert(isEditMode.value? '進度更新成功!':'進度儲存成功!')
    } catch (error){
        console.error('送出失敗',error)
        alert('儲存失敗，請檢查後再送出')
    }
}
</script>