<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">Home</router-link>

      <div>
        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="!auth">
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
        </ul>

        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="auth">
          <li class="nav-item">
            <a href="#" class="nav-link" @click="logout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from "vue-router";

export default {
  name: "Nav",
  setup() {
    const router = useRouter();
    const store = useStore();
    const auth = computed(() => store.state.authenticated)
    const logout = async () => {
  try {
    const response = await fetch('http://localhost:8001/api/logout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });
    
    if (response.ok) {
      // 使用正確的 mutation 名稱
      store.commit('SET_AUTH', false);
      await router.push('/login');
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

    return{
      auth,
      logout
    }
  }
}
</script>