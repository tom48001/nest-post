<template>
  <div class="post-article">
    <h2>發表文章</h2>
    <form @submit.prevent="submitArticle">
      <div>
        <label>標題</label>
        <input v-model="title" required />
      </div>
      <div>
        <label>內文</label>
        <textarea v-model="content" required></textarea>
      </div>
      <div>
        <label>標籤（用 , 分隔）</label>
        <input v-model="tags" />
      </div>
      <div>
        <label>發布時間（選填）</label>
        <input type="datetime-local" v-model="publishedAt" />
      </div>
      <button type="submit">送出</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const title = ref('')
const content = ref('')
const tags = ref('')
const publishedAt = ref('')
const message = ref('')

async function submitArticle() {
  try {
    const res = await axios.post(
      'http://localhost:8001/api/articles/post',
      {
        title: title.value,
        content: content.value,
        tags: tags.value.split(',').map(t => t.trim()).filter(Boolean),
        publishedAt: publishedAt.value ? new Date(publishedAt.value) : null,
      },
      { withCredentials: true }
    )
    message.value = '發表成功！'
  } catch (err) {
    console.error(err)
    message.value = '發表失敗'
  }
}
</script>

<style scoped>
.post-article {
  max-width: 600px;
  margin: 2rem auto;
}
.post-article input,
.post-article textarea {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
