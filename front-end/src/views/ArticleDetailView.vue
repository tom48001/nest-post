
<template>
  <div v-if="article">
    <h2>{{ article.title }}</h2>
    <p>作者：{{ article.author.name }}</p>
    <p>發布時間：{{ new Date(article.publishedAt).toLocaleString() }}</p>
    <p v-html="article.content"></p>

    <!-- 喜歡按鈕 -->
    <button @click="toggleLike">
      {{ liked ? '取消喜歡' : '喜歡' }}
    </button>
    <p>共 {{ likeCount }} 人喜歡</p>

    <!-- 留言區 -->
    <div>
      <h3>留言</h3>
      <form @submit.prevent="submitComment">
        <textarea v-model="commentContent" placeholder="留下你的想法..." required></textarea>
        <button type="submit">送出留言</button>
      </form>

      <div v-for="c in comments" :key="c.id" class="comment">
        <p><strong>{{ c.author.name }}：</strong>{{ c.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'


const route = useRoute()
const article = ref(null)
const comments = ref([])
const commentContent = ref('')
const liked = ref(false)
const likeCount = ref(0)
const articleId = route.params.id

const fetchArticle = async () => {
  const res = await axios.get(`http://localhost:8001/api/articles/${route.params.id}`, { withCredentials: true })
  article.value = res.data
}

const fetchComments = async () => {
  const res = await axios.get(`http://localhost:8001/api/articles/${route.params.id}/comments`, { withCredentials: true })
  comments.value = res.data
}

const fetchLikes = async () => {
  const res = await axios.get(`http://localhost:8001/api/articles/${route.params.id}/likes`, { withCredentials: true })
  liked.value = res.data.liked
  likeCount.value = res.data.count
}

const toggleLike = async () => {
  const res = await axios.post(`http://localhost:8001/api/articles/${route.params.id}/like`, {}, { withCredentials: true })
  liked.value = res.data.liked
  likeCount.value = res.data.count
}

const submitComment = async () => {
  await axios.post(`http://localhost:8001/api/articles/${route.params.id}/comments`, {
    content: commentContent.value
  }, {
    withCredentials: true
  })
  commentContent.value = ''
  await fetchComments()
}

onMounted(async () => {
  await fetchArticle()
  await fetchComments()
  await fetchLikes()
})
</script>

<style scoped>
.comment {
  padding: 8px;
  border-top: 1px solid #ccc;
}
</style>
