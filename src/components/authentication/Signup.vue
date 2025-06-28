<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import Validation from '@/stores/validations';
import Authentication from "../alerts/authentication.vue";
import { useAuthAlert } from "@/stores/useAuthAlert";

const router = useRouter();
const theme = useTheme();
const formRef = ref();
const fullName = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const show = ref(false);
const show1 = ref(false);
const { alertMessage, alertType } = useAuthAlert(); 
const isDark = ref(false);
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const setThemeFromSystemOrStorage = () => {
  const stored = localStorage.getItem("preferredTheme");
  if (stored === "dark") isDark.value = true;
  else if (stored === "light") isDark.value = false;
  else isDark.value = mediaQuery.matches;

  theme.global.name.value = isDark.value ? "dark" : "light";
};

const handleSystemChange = () => {
  if (!localStorage.getItem("preferredTheme")) {
    isDark.value = mediaQuery.matches;
  }
};

const isDarkTheme = computed(() => theme.global.name.value === "dark");

const users = ref(JSON.parse(localStorage.getItem("users")) || []);

const resetForm = () => {
  fullName.value = "";
  username.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  alertMessage.value = "";
  alertType.value = "";
};

const handleRegister = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const newUser = {
    fullName: fullName.value,
    username: username.value,
    email: email.value,
    password: password.value,
  };

  users.value.push(newUser);
  localStorage.setItem("users", JSON.stringify(users.value));

  alertMessage.value = "✅ Registration successful!";
  alertType.value = "success";
  setTimeout(() => {
    router.push("/login");
    resetForm();
  }, 1000);
};


watch(isDark, (newVal) => {
  theme.global.name.value = newVal ? "dark" : "light";
  localStorage.setItem("preferredTheme", newVal ? "dark" : "light");
});

onMounted(() => {
  setThemeFromSystemOrStorage();
  mediaQuery.addEventListener("change", handleSystemChange);
});

onBeforeUnmount(() => {
  mediaQuery.removeEventListener("change", handleSystemChange);
});
</script>

<template>
  <div class="form-body d-flex justify-center align-center" :class="isDarkTheme ? 'dark-mode' : 'light-mode'">
    <VCard class="registration-card" max-width="400" elevation="10">
    
      <Authentication />

      <VCardTitle class="text-h6 title font-weight-bold text-center py-6">
        Create your account for free!
      </VCardTitle>

      <VForm ref="formRef" validate-on="submit lazy" @submit.prevent="handleRegister">
        <VCardText class="px-6">
          <VTextField
            v-model="fullName"
            label="Full Name"
            placeholder="Please enter your name and surname"
            variant="outlined"
            density="compact"
            class="form-field"
            :rules="Validation.fullNameRules()" 
          />
          <VTextField
            v-model="email"
            label="Email"
            placeholder="example@domain.com"
            variant="outlined"
            density="compact"
            class="form-field"
            :rules="Validation.emailRules(users)"  
          />
          <VTextField
            v-model="username"
            label="Username"
            placeholder="Please enter your username"
            variant="outlined"
            density="compact"
            class="form-field"
            :rules="Validation.usernameRules(users)" 
          />
          <VTextField
            v-model="password"
            label="Password"
            :type="show ? 'text' : 'password'"
            placeholder="Please enter your password"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show = !show"
            variant="outlined"
            density="compact"
            class="form-field"
            :rules="Validation.passwordRules()" 
          />
          <VTextField
            v-model="confirmPassword"
            label="Confirm Password"
            :type="show1 ? 'text' : 'password'"
            placeholder="Please confirm your password"
            :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show1 = !show1"
            variant="outlined"
            density="compact"
            class="form-field"
            :rules="Validation.confirmPasswordRules(password)" 
          />
        </VCardText>

        <VCardActions class="px-6 pt-2 pb-6">
          <VBtn block class="text-none btn font-weight-bold" type="submit">
            Sign Up
          </VBtn>
        </VCardActions>
      </VForm>

      <div class="text-center pb-6 text-body-2">
        Already have an account?
        <a @click.prevent="router.push('/login')" class="link">Login</a>
      </div>
    </VCard>
  </div>
</template>

<style scoped>
.form-body {
  min-height: 100vh;
  padding: 20px;
}

.registration-card {
  position: relative;
  border-radius: 12px;
  width: 400px;
  padding: 24px;
  z-index: 1;
  overflow: hidden;
  border: 2px solid;
}

.form-field {
  margin-bottom: 18px;
}

.link {
  text-decoration: underline;
  cursor: pointer;
}

.btn {
  padding: 20px;
  margin-top: -20px;
  background-color: rgb(0, 255, 255);
  color: #000000;
}

.dark-mode {
  background-color: #000000;
  color: white;
}

.dark-mode .registration-card {
  background-color: #000000;
  color: white;
  border-color: rgb(6, 205, 240);
}

.dark-mode .title {
  color: cyan;
}

.dark-mode .link {
  color: #12d6e4;
}

.light-mode .btn {
  background-color: #07aefc;
  border: 2px solid #169bff;
}

.light-mode {
  background-color: #eeeeee;
  color: #070606;
}

.light-mode .registration-card {
  background-color: #ffffff;
  color: #1a1a1a;
  border-color: #ffffff;
}

.light-mode .title {
  color: #169bff;
}

.light-mode .link {
  color: #169bff;
}
</style>
