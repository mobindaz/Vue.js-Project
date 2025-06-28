<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";

const cart = ref([]);
const router = useRouter();
const cartEmpty = ref(false);

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart.value));
};

const formattedTotal = computed(() => {
  const total = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(total);
});

const goToPayment = () => {
  if (cart.value.length == 0) {
    cartEmpty.value = true;
  } else {
    router.push("/ecommerce/payment");
  }
};

const goToHome = () => {
  router.push("/ecommerce/products");
};

onMounted(() => {
  cart.value = JSON.parse(localStorage.getItem("cart") || "[]");
});
</script>

<template>
  <AppLayout>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span class="text-h5">My Shopping Cart</span>
      <VBtn icon @click="goToHome">
        <VIcon>mdi-home</VIcon>
      </VBtn>
    </VCardTitle>

    <VTable v-if="cart.length">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Subtotal</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart" :key="index">
          <td>{{ item.title }}</td>
          <td>{{ item.quantity }}</td>
          <td>₹ {{ item.price }}</td>
          <td>₹ {{ (item.price * item.quantity).toFixed(2) }}</td>
          <td>
            <VBtn icon @click="removeFromCart(index)">
              <VIcon color="red">mdi-delete</VIcon>
            </VBtn>
          </td>
        </tr>
      </tbody>
    </VTable>

    <div v-else class="text-center text-grey pa-6">Your cart is empty.</div>

    <VDivider class="my-4" />

    <div class="d-flex justify-space-between">
      <div class="text-h6">Total: {{ formattedTotal }}</div>
      <VBtn color="primary" @click="goToPayment"> CheckOut </VBtn>
    </div>
    <VSnackbar v-model="cartEmpty" timeout="1500"> Your cart is empty </VSnackbar>
  </AppLayout>
</template>

<style scoped>
th,
td {
  padding: 12px;
  text-align: left;
}
</style>
