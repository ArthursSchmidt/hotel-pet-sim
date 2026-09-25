import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/pets',
      name: 'pets',
      component: () => import('../views/PetView.vue'),
    },
    {
      path: '/pets/novo',
      name: 'AddPet', 
      component: () => import('../views/AddPetView.vue')
    }
  ],
});

export default router;
