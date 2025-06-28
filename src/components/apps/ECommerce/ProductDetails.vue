<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const product = ref(null);
const scale = ref(1);
const imageRef = ref(null);
const imageWrapper = ref(null);
const cart = ref(JSON.parse(localStorage.getItem("cart") || "[]"));
const quantityVisible = ref({});
const productQuantity = ref({});
const snackbar = ref(false);

const confirmAddToCart = (product) => {
  cart.value.push({ ...product, quantity: productQuantity.value[product.id] });
  localStorage.setItem("cart", JSON.stringify(cart.value));
  quantityVisible.value[product.id] = false;
  snackbar.value = true;
};

const showQuantityInput = (id) => {
  quantityVisible.value[id] = true;
  productQuantity.value[id] = 1;
};

const increment = (id) => {
  productQuantity.value[id]++;
};

const decrement = (id) => {
  if (productQuantity.value[id] > 0) productQuantity.value[id]--;
};

const buyNow = () => {
  localStorage.setItem("cart", JSON.stringify([{ ...product.value, quantity: 1 }]));
  router.push("/ecommerce/payment");
};

const goBack = () => router.back();

const zoomImage = (e) => {
  e.preventDefault();
  const wrapper = imageWrapper.value;
  const img = imageRef.value;
  const rect = wrapper.getBoundingClientRect();

  const delta = Math.sign(e.deltaY);
  const oldScale = scale.value;

  if (delta < 0 && scale.value < 3) {
    scale.value += 0.1;
  } else if (delta > 0 && scale.value > 1) {
    scale.value -= 0.1;
  }

  img.style.transform = `scale(${scale.value})`;

  const cursorX = e.clientX - rect.left + wrapper.scrollLeft;
  const cursorY = e.clientY - rect.top + wrapper.scrollTop;
  const zoomFactor = scale.value / oldScale;

  wrapper.scrollLeft = cursorX * zoomFactor - (e.clientX - rect.left);
  wrapper.scrollTop = cursorY * zoomFactor - (e.clientY - rect.top);
};

onMounted(async () => {
  const id = route.params.id;
  try {
    const res = await axios.get(`https://dummyjson.com/products/${id}`);
    product.value = res.data;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    router.push("/ecommerce/products");
  }
});
</script>

<template>
  <VContainer>
    <VCard class="pa-4" elevation="4">
      <VBtn icon @click="goBack">
        <VIcon>mdi-arrow-left</VIcon>
      </VBtn>

      <VRow v-if="product" class="mt-4" align="start">
        <VCol cols="12" md="6">
          <VCard class="pa-2 image-card">
            <div ref="imageWrapper" class="image-zoom-container" @wheel="zoomImage">
              <img
                ref="imageRef"
                :src="product.thumbnail"
                class="zoomable-image"
                draggable="false"
              />
            </div>

            <div class="d-flex flex-wrap gap-2 mt-2 justify-center justify-sm-start">
              <template
                v-if="quantityVisible[product.id] && productQuantity[product.id] > 0"
              >
                <VBtn icon size="small" @click="decrement(product.id)">
                  <VIcon>mdi-minus</VIcon>
                </VBtn>
                <span class="mx-5 mt-3 font-weight-medium">
                  {{ productQuantity[product.id] }}
                </span>
                <VBtn icon size="small" @click="increment(product.id)">
                  <VIcon>mdi-plus</VIcon>
                </VBtn>
                <VBtn
                  color="success "
                  class="flex-grow-1"
                  @click="confirmAddToCart(product)"
                >
                  Add
                </VBtn>
              </template>

              <template v-else>
                <VRow class="w-100" dense>
                  <VCol cols="6" class="pr-1">
                    <VBtn
                      color="primary"
                      block
                      class="btn-sm"
                      @click="showQuantityInput(product.id)"
                    >
                      Add to Cart
                    </VBtn>
                  </VCol>
                  <VCol cols="6" class="pl-1">
                    <VBtn color="success" block class="btn-sm" @click="buyNow(product)">
                      Buy Now
                    </VBtn>
                  </VCol>
                </VRow>
              </template>
            </div>
          </VCard>
        </VCol>

        <VCol cols="12" md="6" class="card">
          <h2 class="text-h5 font-weight-bold mb-2">{{ product.title }}</h2>
          <p class="text-caption text-grey mb-1">{{ product.brand }}</p>
          <VRating :model-value="product.rating" readonly color="amber" size="24" />
          <div class="my-2 text-h6 font-weight-bold text-primary">
            ₹ {{ product.price }}
            <span class="text-subtitle-2 text-grey ml-2">
              ({{ product.discountPercentage }}% off)
            </span>
          </div>
          <p class="mb-2">{{ product.description }}</p>

          <div class="mt-6">
            <h4 class="text-subtitle-1 font-weight-bold">Specifications</h4>
            <p><strong>SKU:</strong> {{ product.sku }}</p>
            <p><strong>Category:</strong> {{ product.category }}</p>
            <p><strong>Weight:</strong> {{ product.weight }} kg</p>
            <p>
              <strong>Dimensions:</strong>
              {{ product.dimensions.width }} x {{ product.dimensions.height }} x
              {{ product.dimensions.depth }} cm
            </p>
            <p><strong>Stock:</strong> {{ product.stock }} items</p>
            <p><strong>Warranty:</strong> {{ product.warrantyInformation }}</p>
            <p><strong>Shipping:</strong> {{ product.shippingInformation }}</p>
            <p><strong>Return Policy:</strong> {{ product.returnPolicy }}</p>
            <p>
              <strong>Minimum Order:</strong> {{ product.minimumOrderQuantity }} units
            </p>
          </div>

          <VRow v-if="product?.reviews?.length">
            <VCol cols="12" class="mt-6">
              <h4 class="text-h5 font-weight-bold">Customer Reviews</h4>
              <VCard v-for="(review, i) in product.reviews" :key="i" class="pa-4 mb-2">
                <VRating :model-value="review.rating" readonly color="amber" size="20" />
                <p class="text-body-2 mt-2">"{{ review.comment }}"</p>
                <p class="text-caption grey--text mt-1">
                  - {{ review.reviewerName }},
                  {{ new Date(review.date).toLocaleDateString() }}
                </p>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
      </VRow>

      <div v-else class="text-center pa-6">
        <VProgressCircular indeterminate color="primary" size="32" />
        <div class="mt-2">Loading product details...</div>
      </div>
    </VCard>

    <VSnackbar v-model="snackbar" timeout="1500">
      Product added to cart!
      <template v-slot:actions>
        <VBtn color="pink" variant="text" @click="router.push('/ecommerce/cart')">
          View
        </VBtn>
      </template>
    </VSnackbar>
  </VContainer>
</template>

<style scoped>
.image-zoom-container {
  width: 100%;
  max-height: 400px;
  overflow: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoomable-image {
  transition: transform 0.2s ease;
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.card {
  overflow-y: auto;
  max-height: 72vh;
}

.image-card {
  height: 450px;
  box-shadow: none;
}

.cartbtn,
.buynow {
  width: 180px;
}

@media (max-width: 960px) {
  .card {
    max-height: none;
    overflow: visible;
  }

  .cartbtn,
  .buynow {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
