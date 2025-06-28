<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import Validation from "@/stores/validations";
import Authentication from "../alerts/authentication.vue";
import { useAuthAlert } from "@/stores/useAuthAlert";

const router = useRouter();
const theme = useTheme();
const { alertMessage, alertType } = useAuthAlert();

const isDark = ref(false);
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const setThemeFromSystemOrStorage = () => {
  const storedTheme = localStorage.getItem("preferredTheme");
  if (storedTheme === "dark") isDark.value = true;
  else if (storedTheme === "light") isDark.value = false;
  else isDark.value = mediaQuery.matches;

  theme.global.name.value = isDark.value ? "dark" : "light";
};

const handleSystemChange = () => {
  const stored = localStorage.getItem("preferredTheme");
  if (!stored) isDark.value = mediaQuery.matches;
};

const isDarkTheme = computed(() => theme.global.name.value === "dark");

const formRef = ref();
const identifier = ref("");
const password = ref("");
const show = ref(false);

const resetForm = () => {
  alertMessage.value = "";
  alertType.value = "";
};

const handleLogin = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (u) =>
      (u.email === identifier.value || u.username === identifier.value) &&
      u.password === password.value
  );

  if (!user) {
    alertMessage.value = "❌ Incorrect email or password!";
    alertType.value = "error";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  alertMessage.value = "✅ Login successful! Redirecting...";
  alertType.value = "success";

  setTimeout(() => {
    router.push("/dashboard");
    resetForm();
  }, 1000);
};

watch(isDark, (val) => {
  theme.global.name.value = val ? "dark" : "light";
  localStorage.setItem("preferredTheme", val ? "dark" : "light");
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
  <div
    class="form-body d-flex justify-center align-center"
    :class="isDarkTheme ? 'dark-mode' : 'light-mode'"
  >
    <VCard class="registration-card" max-width="400" elevation="10">
      <Authentication> </Authentication>

      <VCardTitle class="text-h6 title font-weight-bold text-center py-6">
        Login to your account
      </VCardTitle>

      <VForm ref="formRef" validate-on="submit lazy" @submit.prevent="handleLogin">
        <VCardText class="px-6">
          <VTextField
            v-model="identifier"
            label="Email or Username"
            placeholder="Enter your Username or Email"
            variant="outlined"
            density="compact"
            class="form-field"
            :rules="[(v) => !!v || 'Required']"
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
        </VCardText>

        <VCardActions class="px-6 pt-2 pb-6">
          <VBtn block class="text-none btn font-weight-bold" type="submit"> Login </VBtn>
        </VCardActions>
      </VForm>

      <div class="text-center pb-6 text-body-2">
        Don't have an account?
        <a @click.prevent="router.push('/signup')" class="link">Register</a>
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
  padding: 20px;
  margin-top: -20px;
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
