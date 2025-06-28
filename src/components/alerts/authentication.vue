<script setup>
import { useAuthAlert } from '@/stores/useAuthAlert';

const { alertMessage, alertType } = useAuthAlert();
watch(alertMessage, (val) => {
  if (val) {
    setTimeout(() => {
      alertMessage.value = '';
    }, 2000); 
  }
});
</script>

<template>
  <VCard
    v-if="alertMessage"
    class="elevation-10 floating-alert d-flex justify-space-between align-center"
    :color="alertType"
  >
    <div class="text-body-2 font-weight-medium">{{ alertMessage }}</div>
    <!-- &nbsp; <VBtn icon size="small" @click="alertMessage = ''"> 
        <VIcon color="error">mdi-close</VIcon>
    </VBtn> -->
  </VCard>
</template>



<style scoped>

.floating-alert {
  position: fixed;
  bottom: 12vh; 
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  min-width: 280px;
  max-width: 360px;
  max-height: 120px;
  padding: 16px 20px;
  border-radius: 12px;

  color: white;
  background-color: var(--v-theme-primary); 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

  transition: opacity 0.3s ease-in-out;
}



</style>
