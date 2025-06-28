<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const order = ref(null);

const goToOrders = () => {
  router.push('/ecommerce/orders');
};

const goToHome = () => {
  router.push('/ecommerce/products');
};

onMounted(() => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  order.value = orders[orders.length - 1] || null;
});

</script>

<template>
  <VContainer>
    <VCard class="pa-6 text-center" elevation="6">
      <VIcon color="success" size="80">mdi-check-circle</VIcon>
      <h2 class="text-h5 mt-4">Your order has been placed!</h2>
      <p class="mt-2">Thank you for shopping with us.</p>

      <div v-if="order" class="mt-4">
        <p><strong>Total:</strong> ₹ {{ order.total }}</p>
        <p><strong>Payment Method:</strong> {{ order.method }}</p>
        <p><strong>Shipping To:</strong> {{ order.shipping.name }}, {{ order.shipping.address }}</p>
        <p><strong>Date:</strong> {{ order.date }}</p>
      </div>

      <div class="mt-6 d-flex justify-center gap-2">
        <VBtn color="primary" @click="goToOrders">View Orders</VBtn>
        <VBtn variant="outlined" color="secondary" @click="goToHome">Continue Shopping</VBtn>
      </div>
    </VCard>
  </VContainer>
</template>

<style scoped>
.gap-2 {
  gap: 12px;
}
</style>
