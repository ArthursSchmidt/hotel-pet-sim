<script setup>
import { onMounted, ref } from 'vue';
import {RouterLink , useRoute} from 'vue-router';

//camando UseRoute
const route = useRoute();

// chamando API
const API_URL = 'http://localhost:3000';
const pets = ref([]);
const tutor = ref([]);

//função para carregar os dados do pet e do tutor

async function carregarPet(){
    try {
        const respostaPet = await fetch(`${API_URL}/pets/${route.params.id}`);
        if(!respostaPet.ok){
           console.log(`ops, deu errado`)
        }
           pets.value = await respostaPet.json();
        const respostaTutor = await fetch(`${API_URL}/tutores/${pets.value.tutorId}`);
        tutor.value = respostaTutor.ok ? await respostaTutor.json() : { nome: 'Tutor Não Encontrado!'};
        } catch (error) {
            console.error('Erro ao carregar os dados do pet e do tutor:', error);
        }
}


onMounted(carregarPet);
</script>

<template>
  <h1>Nome: {{ pet.nome }}</h1>
  <p>Especie: {{ pet.especie }}</p>
  <!-- <p>Tutor: {{ nomeDoTutor(pet.tutorId) }}</p> -->
</template>
