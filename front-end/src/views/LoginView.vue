<template>
  <div>
    <form @submit.prevent="submit" class="form-signin">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <input v-model="data.name" type="name" class="form-control" placeholder="Name" required>

      <input v-model="data.password" type="password" class="form-control" placeholder="Password" required>

      <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
    </form>
  </div>
</template>
<script>
import {reactive} from 'vue';
import {useRouter} from "vue-router";

export default {
    name: "LoginView",
    setup() {
        const data = reactive({
            name: '',
            password: ''
        });
        const router = useRouter();

        const submit = async () => {
            await fetch('http://localhost:8001/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(data)
            });

            await router.push('/');
        }

        return {
            data,
            submit
        }
    }
}
</script>
<style >
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}

.form-signin .form-control:focus {
  z-index: 2;
}

.form-signin input[type="name"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>