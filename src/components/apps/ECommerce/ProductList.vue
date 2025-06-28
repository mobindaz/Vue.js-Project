<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const products = ref([]);
const selectedCategories = ref([]);
const filterMenu = ref(false);
const router = useRouter();
const loading = ref(true);
const snackbar = ref(false);
const quantityVisible = ref({});
const productQuantity = ref({});
const showSearch = ref(false);
const searchTerm = ref("");
const cart = ref(JSON.parse(localStorage.getItem("cart") || "[]"));
const categories = ref([]);
const currentPage = ref(1);
const pageSize = 36;

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredProducts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize);
});

const filteredProducts = computed(() => {
  let result = products.value;

  if (selectedCategories.value.length) {
    result = result.filter((p) => selectedCategories.value.includes(p.category));
  }

  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(term));
  }

  return result;
});

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchTerm.value = "";
    resetFilters();
  }
};

const resetFilters = () => {
  selectedCategories.value = [];
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

const confirmAddToCart = (product) => {
  cart.value.push({ ...product, quantity: productQuantity.value[product.id] });
  localStorage.setItem("cart", JSON.stringify(cart.value));
  quantityVisible.value[product.id] = false;
  snackbar.value = true;
};

const buyNow = (product) => {
  localStorage.setItem("cart", JSON.stringify([{ ...product, quantity: 1 }]));
  router.push("/ecommerce/payment");
};

const goToDetails = (id) => {
  router.push(`/ecommerce/product/${id}`);
};

const cartCount = computed(() => cart.value.length);

onMounted(async () => {
  try {
    const cat = await axios.get("https://dummyjson.com/products/categories");
    const res = await axios.get("https://dummyjson.com/products?limit=0");
    products.value = res.data.products;
    categories.value = cat.data;
  } catch (e) {
    console.error("Error fetching products", e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <VContainer fluid>
    <VCard class="pa-6 body" elevation="4">
      <VRow class="align-center justify-space-between flex-wrap">
        <!-- Left: Heading -->
        <VCol cols="12" md="4" class="d-flex align-center">
          <h2 class="text-h4 font-weight-bold mb-0">Explore Products</h2>
        </VCol>

        <!-- Center: Filter Select -->
        <VCol cols="12" md="4" class="d-flex justify-center align-center">
          <VSelect
            v-model="selectedCategories"
            :items="categories"
            item-title="name"
            item-value="slug"
            label="Filter Categories"
            multiple
            chips
            closable-chips
            clearable
            variant="outlined"
            density="compact"
            class="w-100"
            style="max-width: 320px"
          />
        </VCol>

        <!-- Right: Search and Icons -->
        <VCol cols="12" md="4" class="d-flex justify-end align-center flex-wrap gap-2">
          <VTextField
            v-if="showSearch"
            v-model="searchTerm"
            label="Search Products"
            placeholder="Search Products..."
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            density="compact"
            variant="outlined"
            class="mb-2"
            style="max-width: 200px; width: 100%"
            @click:clear="
              searchTerm = '';
              resetFilters();
            "
          />
          <VBtn icon class="ml-2 mb-2" @click="toggleSearch">
            <VIcon>{{ showSearch ? "mdi-close" : "mdi-magnify" }}</VIcon>
          </VBtn>
          <VBtn icon class="ml-2 mb-2" @click="router.push('/ecommerce/cart')">
            <VBadge :content="cartCount" color="error" overlap>
              <VIcon>mdi-cart</VIcon>
            </VBadge>
          </VBtn>
          <VBtn icon class="ml-2 mb-2" @click="router.push('/ecommerce/orders')">
            <VIcon>mdi-receipt-text</VIcon>
          </VBtn>
        </VCol>
      </VRow>

      <VRow v-if="loading">
        <VCol cols="12" class="text-center py-6">
          <VProgressCircular indeterminate color="primary" size="40" />
          <p class="mt-2">Loading products...</p>
        </VCol>
      </VRow>

      <VRow v-else-if="filteredProducts.length === 0">
        <VCol cols="12" class="text-center py-10">
          <VIcon size="64" color="grey">mdi-magnify-close</VIcon>
          <p class="text-subtitle-1 mt-2">No products found</p>
        </VCol>
      </VRow>

      <VCard v-else class="w-100 pa-4 productCard">
        <VRow dense>
          <VCol
            v-for="product in paginatedProducts"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="d-flex"
          >
            <VHover v-slot="{ isHovering }">
              <VCard
                class="w-100 d-flex flex-column justify-space-between pa-4 transition-slow"
                :elevation="isHovering ? 6 : 2"
                :class="{ 'hover-card': isHovering }"
              >
                <VImg
                  :src="product.thumbnail"
                  max-height="200"
                  aspect-ratio="1"
                  contain
                  class="mb-3 cursor-pointer"
                  @click="goToDetails(product.id)"
                />

                <div class="mb-2">
                  <h3 class="text-subtitle-1 font-weight-medium text-truncate">
                    {{ product.title }}
                  </h3>
                  <VRating
                    :model-value="product.rating"
                    half-increments
                    readonly
                    color="amber"
                    size="20"
                  />
                  <p class="text-body-2 font-weight-bold text-primary my-1">
                    <span class="text-subtitle-1 text-green mr-2">
                      {{ product.discountPercentage }}% OFF
                    </span>
                    <span class="text-h6">₹{{ product.price }}</span>
                  </p>
                  <p class="text-body-2">
                    <b>{{ product.availabilityStatus }}</b>
                    {{ product.shippingInformation }}
                  </p>
                  <p class="text-caption text-grey">{{ product.category }}</p>
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
                        <VBtn
                          color="success"
                          block
                          class="btn-sm"
                          @click="buyNow(product)"
                        >
                          Buy Now
                        </VBtn>
                      </VCol>
                    </VRow>
                  </template>
                </div>
              </VCard>
            </VHover>
          </VCol>
        </VRow>

        <VRow justify="center" class="mt-4">
          <VPagination
            v-model="currentPage"
            :length="totalPages"
            total-visible="6"
            color="primary"
          />
        </VRow>
      </VCard>
    </VCard>

    <VSnackbar v-model="snackbar" timeout="1500">
      Product added to cart!
      <template #actions>
        <v-btn color="pink" variant="text" @click="router.push('/ecommerce/cart')"
          >View</v-btn
        >
      </template>
    </VSnackbar>
  </VContainer>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.transition-slow {
  transition: all 0.25s ease-in-out;
  height: 55vh;
}
.hover-card {
  min-height: 200px;
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.filter {
  margin-left: 550px;
}

.card {
  height: 83vh;
  overflow-y: auto;
}

.header {
  background-color: transparent;
  box-shadow: none;
}

.productCard {
  background-color: transparent;
  box-shadow: none;
  overflow-y: auto;
  height: 70vh;
}

.body {
  height: 83vh;
}

.btn-sm {
  font-size: 13px;
  min-height: 36px;
  padding: 0 12px;
}
</style>
