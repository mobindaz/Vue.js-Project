<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';   

const orders = ref([]);
const router = useRouter();


const goHome = () => {
  router.push('/ecommerce/products');
};

onMounted(() => {
  orders.value = JSON.parse(localStorage.getItem('orders') || '[]').reverse();
});
</script>

<template>
  <AppLayout>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span class="text-h5">My Orders</span>
      <VBtn icon @click="goHome">
        <VIcon>mdi-home</VIcon>
      </VBtn>
    </VCardTitle>

    <VExpansionPanels v-if="orders.length">
      <VExpansionPanel
        v-for="(order, index) in orders"
        :key="index"
        elevation="1"
      >
        <VExpansionPanelTitle>
          Order #{{ index + 1 }} — {{ order.date }} — ₹{{ order.total }}
        </VExpansionPanelTitle>

        <VExpansionPanelText>
          <p class="mb-2">
            <strong>Shipping Address:</strong><br />
            {{ order.shipping.name }}, {{ order.shipping.address }},
            {{ order.shipping.city }} - {{ order.shipping.pincode }}
          </p>

          <p class="mb-2">
            <strong>Payment Method:</strong> {{ order.method }}
          </p>

          <p><strong>Items:</strong></p>
          <ul>
            <li
              v-for="(item, i) in order.items"
              :key="i"
            >
              {{ item.title }} × {{ item.quantity }} — ₹{{
                (item.price * item.quantity).toFixed(2)
              }}
            </li>
          </ul>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <div v-else class="text-center text-grey pa-6">
      No orders found.
    </div>
  </AppLayout>
</template>
