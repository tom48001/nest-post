<template>
  <div class="home">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "HomeView",
  setup() {
    const message = ref('You are not login!');
    const store = useStore();

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
    });

    return {
      message
    }
  }
}
</script>
