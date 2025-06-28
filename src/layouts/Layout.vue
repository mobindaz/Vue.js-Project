<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useTheme, useDisplay } from "vuetify";
import { useRouter, useRoute } from "vue-router";

const theme = useTheme();
const display = useDisplay();
const router = useRouter();
const route = useRoute();

const isDark = ref(false);
const logout = ref(false);

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const setThemeFromSystemOrLocal = () => {
  const stored = localStorage.getItem("preferredTheme");
  if (stored === "dark") {
    isDark.value = true;
  } else if (stored === "light") {
    isDark.value = false;
  } else {
    isDark.value = mediaQuery.matches;
  }

  theme.global.name.value = isDark.value ? "dark" : "light";
};

watch(isDark, (newVal) => {
  theme.global.name.value = newVal ? "dark" : "light";
  localStorage.setItem("preferredTheme", newVal ? "dark" : "light");
});

const handleSystemChange = () => {
  const stored = localStorage.getItem("preferredTheme");
  if (!stored) {
    isDark.value = mediaQuery.matches;
  }
};

onMounted(() => {
  setThemeFromSystemOrLocal();
  mediaQuery.addEventListener("change", handleSystemChange);
});

onBeforeUnmount(() => {
  mediaQuery.removeEventListener("change", handleSystemChange);
});

const openDialogLogout = () => {
  logout.value = true;
};

const closeDialog = () => {
  logout.value = false;
};

const confirmLogout = () => {
  logout.value = false;
  localStorage.removeItem("currentUser");
  router.push("/login");
};

const drawer = ref(false);

const items = [
  {
    title: "Dashboard",
    value: "dashboard",
    to: "/dashboard",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Todolist",
    value: "todolist",
    to: "/todolist",
    icon: "mdi-format-list-checkbox",
  },
  {
    title: "E-Commerce",
    value: "ecommerce",
    to: "/ecommerce/products",
    icon: "mdi-invoice-list",
  },
  {
    title: "Tables",
    value: "tables",
    to: "/producttable",
    icon: "mdi-table"
  }
];

const isActive = (to) => {
  
  if (route.path === to) return true;

  const section = to.split('/')[1]; 
  return route.path.startsWith(`/${section}`);
};


const navigate = (path) => {
  if (route.path !== path) {
    router.push(path);
  }
};
</script>

<template>
  <VApp>
    <VLayout>
      <VAppBar app color="primary">
        <VAppBarNavIcon @click="drawer = !drawer" />
        <VToolbarTitle>My Dashboard</VToolbarTitle>
        <VSpacer />

        <VMenu location="bottom end" transition="scale-transition">
          <template #activator="{ props }">
            <VBtn v-bind="props" icon>
              <VIcon>mdi-cog</VIcon>
            </VBtn>
          </template>

          <VList>
            <VListItem>
              <VSwitch
                v-model="isDark"
                inset
                hide-details
                :label="isDark ? 'Dark' : 'Light'"
              />
            </VListItem>

            <VListItem>
              <VBtn variant="text" block @click="openDialogLogout">
                Logout
                <VIcon end>mdi-logout</VIcon>
              </VBtn>
            </VListItem>
          </VList>
        </VMenu>
      </VAppBar>

      <VNavigationDrawer
        v-model="drawer"
        :location="display.mobile ? 'left' : 'bottom'"
        permanent
      >
        <VList>
          <VListItem
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            link
            exact
            :active="isActive(item.to)"
            @click="navigate(item.to)"
          >
            <VIcon class="mr-2">{{ item.icon }}</VIcon>
            <VListItemTitle>{{ item.title }}</VListItemTitle>
          </VListItem>
        </VList>
      </VNavigationDrawer>

      <VMain class="main-content">
        <VContainer fluid class="fill-height d-flex align-center justify-center">
          <RouterView v-slot="{ Component, route }">
            <transition name="fade-scale" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </RouterView>
        </VContainer>
      </VMain>
    </VLayout>

    <VDialog v-model="logout" max-width="400">
      <VCard>
        <VCardTitle class="text-h6">Confirm Logout</VCardTitle>
        <VCardText> Are you sure you want to Logout? </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="closeDialog">Cancel</VBtn>
          <VBtn color="error" text @click="confirmLogout">Logout</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VApp>
</template>

<style scoped>
.settings {
  background-color: cadetblue;
}

.main-area {
  min-height: 100vh;
  padding: 16px;
  background-color: var(--v-theme-background);
  color: var(--v-theme-on-background);
}

.v-toolbar,
.v-app-bar {
  background-color: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
}

.v-navigation-drawer {
  background-color: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
}

.v-list-item--active {
  background-color: var(--v-theme-primary);
  color: rgb(15, 121, 219);
  font-weight: bold;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

</style>
