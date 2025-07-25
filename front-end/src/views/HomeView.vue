<template>
  <div>
    <div class="home">
      {{ message }}
    </div>
    <div>
      <h2>文章列表</h2>
      <div v-for="article in articles" :key="article.id" class="article-card">
        <router-link :to="`/articles/${article.id}`">
          <h3>{{ article.title }}</h3>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios'

export default {
  name: "HomeView",
  setup() {
    const message = ref('You are not login!');
    const store = useStore();
    const articles = ref([])
    const router = useRouter();

    const auth = computed(() => store.state.authenticated);
    const checkAuth = () => {
      if (!auth.value) {
        router.push('/login');
        return false;
      }
    return true;
    };

    onMounted(async() => {
      try {
        const response = await fetch('http://localhost:8001/api/user', {
          headers: {'Content-Type': 'application/json'},
          credentials: 'include'
        });
        
        if (response.ok) {
          const content = await response.json();
          message.value = `Hi ${content.name}` || 'You are not login!';
          await store.dispatch('setAuth', true);
        } else {
          message.value = 'You are not login!';
          await store.dispatch('setAuth', false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.value = 'You are not login!';
        await store.dispatch('setAuth', false);
      }

      try {
        const res = await axios.get('http://localhost:8001/api/articles', {
          withCredentials: true
        })
        articles.value = res.data
        console.log('文章列表：', articles.value)
      } catch (err) {
        console.error('無法取得文章：', err)
      }
    });

    return {
      message,
      articles
    }
  }
}
</script>

<style scoped>
.article-card {
  border: 1px solid #ccc;
  padding: 12px;
  margin: 10px 0;
  border-radius: 6px;
}
</style>
