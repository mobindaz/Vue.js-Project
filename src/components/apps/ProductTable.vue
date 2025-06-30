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
  { title: "Product Name", key: "title", align: "left" },
  { title: "Category", key: "category", align: "center" },
  { title: "Price", key: "price", align: "center" },
  { title: "Rating", key: "rating", align: "center" },
  { title: "Stock", key: "stock", align: "center" },
  { title: "Status", key: "availabilityStatus", align: "center" },
  { title: "Actions", key: "actions", align: "center", sortable: false },
];

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get("https://dummyjson.com/products?limit=100");
    products.value = res.data.products;
    categories.value = [...new Set(products.value.map((p) => p.category))];
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  let temp = [...products.value];
  if (search.value) {
    temp = temp.filter(
      (p) =>
        p.title.toLowerCase().includes(search.value.toLowerCase()) ||
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

const reset = async () => {
  page.value = 1;
  selectedCategory.value = null;
  search.value = "";
  await fetchProducts(); 
};


onMounted(fetchProducts);
</script>


<template>
  <VContainer fluid>
    <VToolbar flat class="flex-wrap">
      <VToolbarTitle class="text-h6">Product Details</VToolbarTitle>
      <VSpacer />
      <VTextField
        v-model="search"
        label="Search"
        append-inner-icon="mdi-magnify"
        dense
        class="mt-7"
        variant="outlined"
        style="max-width: 200px"
        clearable
      />
      <VSelect
        v-model="selectedCategory"
        :items="categories"
        label="Filter by Category"
        clearable
        dense
        class="mt-9 ga-2"
        variant="outlined"
        style="max-width: 200px"
      />
      <VTooltip location="top">
        <template #activator="{ props }">
          <VBtn icon v-bind="props" class="ma-2" @click="reset">
            <VIcon>mdi-refresh</VIcon>
          </VBtn>
        </template>
        <span>Refresh</span>
      </VTooltip>
    </VToolbar>

    <VSkeletonLoader
      v-if="loading"
      type="table-thead, table-row@11"
      class="mx-4 my-6"
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
      show-current-page
      return-object
      class="elevation-2 mt-0 w-100"
      density="comfortable"
      fixed-header
      height="500"
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

      <template #item.availabilityStatus="{ item }">
        <VChip
          :color="item.availabilityStatus === 'In Stock' ? 'green' : 'red'"
          class="text-white font-weight-medium"
          size="small"
        >
          {{ item.availabilityStatus.toUpperCase() }}
        </VChip> 
      </template>

      <template #item.actions="{ item}">
        <VBtn
          size="small"
          color="primary"
          variant="tonal"
          @click="openDialog(item)"
        >
          View 
        </VBtn> 
      </template>
    </VDataTable>

    <VDialog v-model="dialog" width="600" persistent scrollable>
  <VCard class="overflow-hidden">

    <VCardTitle
      class="text-h6 d-flex justify-space-between align-center sticky-header"
    >
      {{ selectedProduct?.title || "Product Details" }}
   
    </VCardTitle>

 
    <VCardText class="dialog-body">
      <VImg
        :src="selectedProduct?.thumbnail || selectedProduct?.images?.[0]"
        class="product-image mb-4"
      />

      <strong>Brand:</strong> {{ selectedProduct?.brand }} <br>
      <strong>SKU:</strong> {{ selectedProduct?.sku }} <br>
      <strong>Category:</strong> {{ selectedProduct?.category }} <br>
      <strong>Price:</strong> ${{ selectedProduct?.price }} <br>
      <strong>Stock:</strong> {{ selectedProduct?.stock }} <br>
      <strong>Status:</strong> {{ selectedProduct?.availabilityStatus || "Unavailable" }} <br>
      <strong>Weight:</strong> {{ selectedProduct?.weight }}g

      <div v-if="selectedProduct?.dimensions" class="mt-2">
        <strong>Dimensions (cm):</strong>
        <ul class="pl-4">
          <li>Width: {{ selectedProduct.dimensions.width }}</li>
          <li>Height: {{ selectedProduct.dimensions.height }}</li>
          <li>Depth: {{ selectedProduct.dimensions.depth }}</li>
        </ul>
      </div>

      <div class="mt-2">
        <strong>Warranty:</strong> {{ selectedProduct?.warrantyInformation }}
      </div>
     
        <strong>Shipping:</strong> {{ selectedProduct?.shippingInformation }}
     

      <div class="mt-2"><strong>Description:</strong></div>
      <div class="text-subtitle-2">
        {{ selectedProduct?.description }}
      </div>

      <div v-if="selectedProduct?.reviews?.length" class="mt-4">
        <strong>Customer Reviews:</strong>
        <VList class="mt-2" density="compact">
          <VListItem
            v-for="(review, index) in selectedProduct.reviews"
            :key="index"
          >
            <div class="d-flex flex-column">
              <div class="font-weight-medium">
                {{ review.reviewerName }} — ★{{ review.rating }}
              </div>
              <div class="text-caption">
                {{ new Date(review.date).toLocaleDateString() }}
              </div>
              <div class="text-body-2 mt-1">
                {{ review.comment }}
              </div>
            </div>
          </VListItem>
        </VList>
      </div>
    </VCardText>

    <VCardActions class="dialog-footer">
      <VSpacer />
      <VBtn color="error" variant="tonal" @click="dialog = false">Close</VBtn>
    </VCardActions>
  </VCard>
</VDialog>

  </VContainer>
</template>


<style scoped>


@media (max-width: 768px) {
  .v-toolbar__content {
    flex-direction: column;
    align-items: stretch;
  }
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #eee;
}

.dialog-body {
  max-height: 60vh;
  overflow-y: auto;
  padding-top: 16px;
  padding-bottom: 16px;
}

.dialog-footer {
  border-top: 1px solid #eee;
  padding: 12px 24px;
}
</style>




