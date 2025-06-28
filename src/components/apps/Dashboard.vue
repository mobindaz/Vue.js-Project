<script setup>
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
</script>

<template>
  <VContainer class="fill-height" fluid>
    <VRow justify="center" align="center">
      <VCol cols="12" sm="10" md="8" lg="6">
        <VCard class="pa-6 card">
          <VCardTitle class="text-center">
            <h1 class="text-h3 text-sm-h2 text-md-h1">
              Hi 👋 {{ currentUser.username }}
            </h1>
          </VCardTitle>

          <VCardText class="text-center">
            <h2 class="text-h5">Welcome to the Dashboard</h2>
            <p>This is your main dashboard area.</p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.card {
  margin: auto;
  margin-bottom: 300px;
}
</style>
