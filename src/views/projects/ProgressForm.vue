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
import { ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const title = ref('')
const content = ref('')
const date = ref('')
const cards = ref([])
const route = useRoute()
const projectId = route.params.id

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

async function submit(){
    const url = `https://lovia-backend-xl4e.onrender.com/api/v1/users/projects/${projectId}/progress`
    const token = localStorage.getItem('token')
    try{
        const responce = await axios.post(url, {
            title: title.value,
            content: content.value,
            date: date.value,
            fund_usages: cards.value
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log('送出成功', Response.data)
        alert('進度儲存成功!')
    } catch (error){
        console.error('送出失敗',error)
        alert('儲存失敗，請檢查後再送出')
    }
}
</script>