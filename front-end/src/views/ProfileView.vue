<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4>個人資料</h4>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">載入中...</span>
              </div>
            </div>
            
            <form v-else @submit.prevent="updateProfile">
              <div class="mb-3">
                <label for="name" class="form-label">姓名</label>
                <input 
                  v-model="profile.name" 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  v-model="profile.email" 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="bio" class="form-label">個人介紹</label>
                <textarea 
                  v-model="profile.bio" 
                  class="form-control" 
                  id="bio" 
                  rows="4" 
                  placeholder="介紹一下自己..."
                ></textarea>
              </div>
              
              <div class="mb-3">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="saving"
                >
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ saving ? '儲存中...' : '更新資料' }}
                </button>
                <router-link to="/" class="btn btn-secondary ms-2">取消</router-link>
              </div>
            </form>
            
            <div v-if="message" :class="messageClass" class="alert" role="alert">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

interface Profile {
  name: string;
  email: string;
  bio: string;
}

export default {
  name: "ProfileView",
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const profile = ref<Profile>({
      name: '',
      email: '',
      bio: ''
    });
    
    const loading = ref(true);
    const saving = ref(false);
    const message = ref('');
    const isSuccess = ref(false);
    
    const auth = computed(() => store.state.authenticated);
    
    const messageClass = computed(() => ({
      'alert-success': isSuccess.value,
      'alert-danger': !isSuccess.value
    }));
    
    // 檢查是否已登入
    const checkAuth = () => {
      if (!auth.value) {
        router.push('/login');
        return false;
      }
      return true;
    };
    
    // 載入個人資料
    const loadProfile = async () => {
      if (!checkAuth()) return;
      
      try {
        const response = await fetch('http://localhost:8001/api/profile', {
          headers: {'Content-Type': 'application/json'},
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          profile.value = {
            name: data.name || '',
            email: data.email || '',
            bio: data.bio || ''
          };
        } else if (response.status === 401) {
          store.commit('SET_AUTH', false);
          router.push('/login');
        } else {
          throw new Error('無法載入個人資料');
        }
      } catch (error) {
        console.error('載入個人資料失敗:', error);
        message.value = '載入個人資料失敗，請重新整理頁面';
        isSuccess.value = false;
      } finally {
        loading.value = false;
      }
    };
    
    // 更新個人資料
    const updateProfile = async () => {
      if (!checkAuth()) return;
      
      saving.value = true;
      message.value = '';
      
      try {
        const response = await fetch('http://localhost:8001/api/profile', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify(profile.value)
        });
        
        if (response.ok) {
          message.value = '個人資料更新成功！';
          isSuccess.value = true;
          
          // 3秒後清除訊息
          setTimeout(() => {
            message.value = '';
          }, 3000);
        } else if (response.status === 401) {
          store.commit('SET_AUTH', false);
          router.push('/login');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || '更新失敗');
        }
      } catch (error) {
        console.error('更新個人資料失敗:', error);
        message.value = (error as Error).message || '更新失敗，請稍後再試';
        isSuccess.value = false;
      } finally {
        saving.value = false;
      }
    };
    
    onMounted(() => {
      loadProfile();
    });
    
    return {
      profile,
      loading,
      saving,
      message,
      messageClass,
      updateProfile
    };
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.alert {
  margin-top: 1rem;
}
</style>