<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import validations from "@/stores/validations";

const router = useRouter();
const cart = ref([]);
const addressMode = ref("saved");
const validShipping = ref(false);
const shippingForm = ref(null);
const savedAddress = ref({});
const shipping = ref({ name: "", address: "", city: "", pincode: "" });
const hasAddressSaved = ref(false);
const paymentDetails = ref({
  upiId: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});

const totalAmount = computed(() => {
  const amnt = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return amnt.toFixed(2);
});
const isCardValid = computed(
  () =>
    paymentDetails.value.cardNumber.length >= 16 &&
    paymentDetails.value.expiry.length === 5 &&
    paymentDetails.value.cvv.length === 3
);

const requiredRule = (v) => !!v || "Required";

const saveShippingAddress = () => {
  if (shippingForm.value?.validate()) {
    localStorage.setItem("shipping", JSON.stringify(shipping.value));
    addressMode.value = "saved";
    hasAddressSaved.value = true;
    savedAddress.value = { ...shipping.value };
  }
};

const placeOrder = (method) => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push({
    items: cart.value,
    total: totalAmount.value,
    shipping: addressMode.value === "saved" ? savedAddress.value : shipping.value,
    method,
    date: new Date().toLocaleString(),
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");
  router.push("/ecommerce/ordersuccess");
};

const goToHome = () => {
  router.push("/ecommerce/cart");
};

onMounted(() => {
  cart.value = JSON.parse(localStorage.getItem("cart") || "[]");
  const stored = JSON.parse(localStorage.getItem("shipping") || "{}");
  if (Object.keys(stored).length) {
    savedAddress.value = stored;
    hasAddressSaved.value = true;
    addressMode.value = "saved";
  } else {
    addressMode.value = "new";
  }
});
</script>

<template>
  <AppLayout>
    <VRow class="ga-2">
      <VBtn density="comfortable" icon @click="goToHome">
        <VIcon>mdi-arrow-left</VIcon>
      </VBtn>

      <h2>Complete Payment</h2>
    </VRow>
    <VContainer>
      <VRow>
        <VCol cols="12" md="6" class="mt-5">
          <h3 class="mb-5">Shipping Address</h3>

          <VRadioGroup
            v-if="hasAddressSaved"
            v-model="addressMode"
            label="Choose an option"
          >
            <VRadio label="Use saved address" value="saved" />
            <VRadio label="Add new address" value="new" />
          </VRadioGroup>

          <VCard class="pa-3 mb-4" v-if="addressMode === 'saved' && hasAddressSaved">
            <p><strong>Name:</strong> {{ savedAddress.name }}</p>
            <p>
              <strong>Address:</strong> {{ savedAddress.address }},
              {{ savedAddress.city }} - {{ savedAddress.pincode }}
            </p>
          </VCard>

          <VForm ref="shippingForm" v-if="addressMode === 'new'" v-model="validShipping">
            <VTextField
              v-model="shipping.name"
              label="Full Name"
              :rules="[requiredRule]"
            />
            <VTextField
              v-model="shipping.address"
              label="Address"
              :rules="[requiredRule]"
            />
            <VTextField v-model="shipping.city" label="City" :rules="[requiredRule]" />
            <VTextField
              v-model="shipping.pincode"
              label="Pincode"
              :rules="[requiredRule, validations.pincodeRules()]"
            />
            <VBtn
              class="mt-2"
              color="primary"
              :disabled="!validShipping"
              @click="saveShippingAddress"
            >
              Save and Continue
            </VBtn>
          </VForm>
        </VCol>

        <VCol cols="12" md="6">
          <h3 class="mb-4">Select Payment Method</h3>

          <VExpansionPanels>
            <VExpansionPanel>
              <VExpansionPanelTitle>
                <VIcon class="mr-2">mdi-cellphone</VIcon> UPI
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <VTextField
                  v-model="paymentDetails.upiId"
                  :rules="validations.upiRules()"
                  label="Enter UPI ID"
                />
                <VBtn
                  class="mt-2 btn"
                  :disabled="!paymentDetails.upiId"
                  @click="placeOrder('UPI')"
                >
                  Pay ₹{{ totalAmount }}
                </VBtn>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel>
              <VExpansionPanelTitle>
                <VIcon class="mr-2">mdi-credit-card-outline</VIcon> Credit / Debit Card
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <VTextField v-model="paymentDetails.cardNumber" label="Card Number" />
                <VRow>
                  <VCol cols="6">
                    <VTextField v-model="paymentDetails.expiry" label="Expiry (MM/YY)" />
                  </VCol>
                  <VCol cols="6">
                    <VTextField
                      v-model="paymentDetails.cvv"
                      label="CVV"
                      type="password"
                    />
                  </VCol>
                </VRow>
                <VBtn
                  class="mt-2 btn"
                  :disabled="!isCardValid"
                  @click="placeOrder('Card')"
                >
                  Pay ₹{{ totalAmount }}
                </VBtn>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel>
              <VExpansionPanelTitle>
                <VIcon class="mr-2">mdi-cash</VIcon> Cash on Delivery
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <p>No online payment required. Pay when your item is delivered.</p>
                <VBtn class="mt-2 btn" @click="placeOrder('COD')"> Confirm Order </VBtn>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCol>
      </VRow>
    </VContainer>
  </AppLayout>
</template>

<style scoped>
.btn {
  color: black;
  background-color: rgb(44, 151, 44);
}
</style>
