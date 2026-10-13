<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
const API_URL = 'http://localhost:3000';
const pets = ref([]);
const tutores = ref([]);
const loading = ref(true);
async function carregarDados() {
  const respostaPets = await fetch(`${API_URL}/pets`);
  pets.value = await respostaPets.json();
  console.log('Pets:', pets.value);
  const respostaTutores = await fetch(`${API_URL}/tutores`);
  tutores.value = await respostaTutores.json();
  console.log('Tutores:', tutores.value);
  loading.value = false;
}
function nomeDoTutor(tutorId) {
  for (const tutor of tutores.value) {
    console.log('tutor', tutorId);
    // tutor.id == tutorId
    if (tutor.id === tutorId) {
      return tutor.nome;
    }
  }
  return 'Tutor Não Encontrado!';
}

async function excluirPet(id){
  //lógica para excluir o pet

  const confirmarExclusao = window.confirm (`tem certeza que deseja excluir o pet?`);

  if(confirmarExclusao){
    await fetch(`${API_URL}/pets/${id}`, {
      method: 'DELETE'
    });
    await carregarDados();
  }
}
// Recebe o tutorId do pet e procura o tutor correspondente.
onMounted(carregarDados);
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Pets</h1>
      <p class="text-body-secondary mb-0">
        Listagem dos Pets cadastrados no sistema.
      </p>
    </header>

    <RouterLink
      class="btn btn-primary"
      :to="{ name: 'addPet' }"
    >
      Adicionar Pet
    </RouterLink>

    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Especie</th>
          <th>Tutor</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="pet in pets"
          :key="pet.id"
        >
          <td>{{ pet.id }}</td>
          <td>{{ pet.nome }}</td>
          <td>{{ pet.especie }}</td>
          <td>{{ nomeDoTutor(pet.tutorId) }}</td>
          <td>
            <RouterLink :to="{ name: 'editPet', params: { id: pet.id } }">
              Editar
            </RouterLink>
            <RouterLink :to="`/pets/${pet.id}`" >
              Visualizar
            </RouterLink>
            <button class="btn btn-danger" @click="excluirPet(pet.id)">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
