
<template>
  <VContainer fluid>
    <VSlideYTransition mode="out-in">
      <VCard class="pa-6 card" elevation="4">
        <slot />
      </VCard>
    </VSlideYTransition>
  </VContainer>
</template>

<style scoped>

.card {
  max-width: 900px;      
  margin: 0 auto;        
  width: 100%;           
}

@media (max-width: 960px) {
  .card {
    max-width: 720px;
  }
}

@media (max-width: 600px) {
  .card {
    max-width: 95%;
    padding: 16px;
  }
}


</style>

