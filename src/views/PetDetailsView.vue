<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const API_URL = 'http://localhost:3000';
const pet = ref({});
const tutor = ref({ nome: 'Tutor Não Encontrado!' });

async function carregarPet() {
  try {
    const respostaPet = await fetch(`${API_URL}/pets/${route.params.id}`);

    if (!respostaPet.ok) {
      throw new Error('Pet não encontrado');
    }

    pet.value = await respostaPet.json();

    const respostaTutor = await fetch(
      `${API_URL}/tutores/${pet.value.tutorId}`,
    );
    tutor.value = respostaTutor.ok
      ? await respostaTutor.json()
      : { nome: 'Tutor Não Encontrado!' };
  } catch (error) {
    console.error('Erro ao carregar os dados do pet e do tutor:', error);
  }
}

onMounted(carregarPet);
</script>

<template>
  <section>
    <h1>Nome: {{ pet.nome }}</h1>
    <p>Espécie: {{ pet.especie }}</p>
    <p>Tutor: {{ tutor.nome }}</p>
  </section>
</template>
