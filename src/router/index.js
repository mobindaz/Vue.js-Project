import { createRouter, createWebHistory } from 'vue-router';

import Signup from '@/components/authentication/Signup.vue';
import Login from '@/components/authentication/Login.vue';
import Layout from '@/layouts/Layout.vue';
import Dashboard from '@/components/apps/Dashboard.vue';
import TodoList from '@/components/apps/TodoList.vue';


import ProductList from '@/components/apps/ECommerce/ProductList.vue';
import CartPage from '@/components/apps/ECommerce/CartPage.vue';
import PaymentPage from '@/components/apps/ECommerce/PaymentPage.vue';
import OrdersPage from '@/components/apps/ECommerce/OrdersPage.vue';
import ProductDetails from '@/components/apps/ECommerce/ProductDetails.vue';
import OrderSuccess from '@/components/apps/ECommerce/OrderSuccess.vue';
import ProductTable from '@/components/apps/ProductTable.vue';


const routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
      { path: 'todolist', component: TodoList, meta: { requiresAuth: true } },

  
      { path: 'ecommerce/products', component: ProductList, meta: { requiresAuth: true } },
      { path: 'ecommerce/cart', component: CartPage, meta: { requiresAuth: true } },
      { path: 'ecommerce/payment', component: PaymentPage, meta: { requiresAuth: true } },
      { path: 'ecommerce/orders', component: OrdersPage, meta: { requiresAuth: true } },
      { path: 'ecommerce/product/:id', component: ProductDetails, meta: { requiresAuth: true } },
      {path: 'ecommerce/ordersuccess', component: OrderSuccess, meta: {requiresAuth: true}},

      {path: 'producttable', component: ProductTable, meta: {requiresAuth: true}},
   
    ],
    meta: { requiresAuth: true }
  },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('currentUser');

  if (isLoggedIn && (to.path === '/login' || to.path === '/signup' || to.path === '/')) {
    next({ path: '/dashboard' });
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
