<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const products = ref([]);
const search = ref("");
const selected = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);
const dialog = ref(false);
const selectedProduct = ref(null);
const selectedCategory = ref(null);
const categories = ref([]);
const loading = ref(true);

const headers = [
  { title: "ID", key: "id" },
  { title: "Name", key: "name", align: "center" },
  { title: "Category", key: "category", align: "center" },
  { title: "Price", key: "price", align: "center" },
  { title: "Rating", key: "rating", align: "center" },
  { title: "Stock", key: "stock", align: "center" },
  { title: "Status", key: "available", align: "center" },
  { title: "Actions", key: "actions", align: "center", sortable: false },
];

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get("https://dummyjson.com/products?limit=100");
    const mapped = res.data.products.map((p) => ({
      id: p.id,
      name: p.title,
      category: p.category,
      price: p.price,
      rating: p.rating,
      stock: p.stock,
      available: p.availabilityStatus,
      full: p,
    }));
    products.value = mapped;
    categories.value = [...new Set(mapped.map((p) => p.category))];
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  let temp = [...products.value];
  if (search.value) {
    temp = temp.filter(
      (p) =>
        p.name.toLowerCase().includes(search.value.toLowerCase()) ||
        p.category.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  if (selectedCategory.value) {
    temp = temp.filter((p) => p.category === selectedCategory.value);
  }
  return temp;
});

const openDialog = (product) => {
  selectedProduct.value = product;
  dialog.value = true;
};

const reset = () => {
  page.value = 1;
  selectedCategory.value = null;
  search.value = null;
};

onMounted(fetchProducts);
</script>

<template>
  <VContainer fluid>
    <VCard class="pa-4">
      <VToolbar flat class="flex-wrap">
        <VToolbarTitle class="text-h6">Product Details</VToolbarTitle>
        <VSpacer />
        <VTextField
          v-model="search"
          label="Search"
          append-inner-icon="mdi-magnify"
          dense
          class="mt-5"
          variant="outlined"
          style="max-width: 200px"
        />
        <VSelect
          v-model="selectedCategory"
          :items="categories"
          label="Filter by Category"
          clearable
          dense
          class="mt-7 ga-2"
          variant="outlined"
          style="max-width: 200px"
        />
        <VTooltip location="top">
          <template #activator="{ props }">
            <VBtn icon v-bind="props" class="ma-2" @click="reset">
              <VIcon>mdi-refresh</VIcon>
            </VBtn>
          </template>
          <span>Reset Filters</span>
        </VTooltip>
      </VToolbar>

      <VSkeletonLoader
        v-if="loading"
        type="table-thead, table-row@10"
        class="mx-4 my-6"
        boilerplate
        elevation="1"
      />

      <VDataTable
        v-else
        :headers="headers"
        :items="filteredProducts"
        :items-per-page="itemsPerPage"
        :page="page"
        v-model="selected"
        show-select
        return-object
        class="elevation-2 mt-4"
        density="comfortable"
        fixed-header
        height="400"
      >
        <template #item.rating="{ item }">
          <VRating
            v-model="item.rating"
            readonly
            density="compact"
            half-increments
            color="amber"
          />
        </template>

        <template #item.available="{ item }">
          <VChip
            :color="item.available === 'In Stock' ? 'green' : 'red'"
            class="text-white font-weight-medium"
            size="small"
          >
            {{ item.available }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <VBtn
            size="small"
            color="primary"
            variant="tonal"
            @click="openDialog(item.full)"
          >
            View
          </VBtn>
        </template>
      </VDataTable>

      <div class="text-center pt-4">
        <VPagination
          v-model="page"
          :length="Math.ceil(filteredProducts.length / itemsPerPage)"
          total-visible="7"
          color="primary"
        />
      </div>
    </VCard>

    <VDialog v-model="dialog" width="600" persistent>
      <VCard>
        <VCardTitle class="text-h6">
          {{ selectedProduct?.name }}
          <VSpacer />
          <VBtn icon @click="dialog = false">
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VCardTitle>
        <VCardText>
          <VImg
            :src="selectedProduct?.thumbnail || selectedProduct?.images?.[0]"
            class="product-image mb-4"
          />

          <div><strong>Brand:</strong> {{ selectedProduct?.brand }}</div>
          <div><strong>SKU:</strong> {{ selectedProduct?.sku }}</div>
          <div><strong>Category:</strong> {{ selectedProduct?.category }}</div>
          <div><strong>Price:</strong> ${{ selectedProduct?.price }}</div>
          <div><strong>Stock:</strong> {{ selectedProduct?.stock }}</div>
          <div><strong>Status:</strong> {{ selectedProduct?.available }}</div>
          <div><strong>Weight:</strong> {{ selectedProduct?.weight }}g</div>

          <div class="mt-2"><strong>Dimensions (cm):</strong></div>
          <ul class="pl-4">
            <li>Width: {{ selectedProduct?.dimensions?.width }}</li>
            <li>Height: {{ selectedProduct?.dimensions?.height }}</li>
            <li>Depth: {{ selectedProduct?.dimensions?.depth }}</li>
          </ul>

          <div class="mt-2">
            <strong>Warranty:</strong> {{ selectedProduct?.warrantyInformation }}
          </div>
          <div><strong>Shipping:</strong> {{ selectedProduct?.shippingInformation }}</div>

          <div class="mt-2"><strong>Description:</strong></div>
          <div class="text-subtitle-2">{{ selectedProduct?.description }}</div>

          <div v-if="selectedProduct?.reviews?.length" class="mt-4">
            <strong>Customer Reviews:</strong>
            <VList class="mt-2" density="compact">
              <VListItem v-for="(review, index) in selectedProduct.reviews" :key="index">
                <VListItemContent>
                  <div class="font-weight-medium">
                    {{ review.reviewerName }} — ★{{ review.rating }}
                  </div>
                  <div class="text-caption">
                    {{ new Date(review.date).toLocaleDateString() }}
                  </div>
                  <div class="text-body-2 mt-1">{{ review.comment }}</div>
                </VListItemContent>
              </VListItem>
            </VList>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<style scoped>
.product-image {
  width: 100%;
  height: 250px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .v-toolbar__content {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
