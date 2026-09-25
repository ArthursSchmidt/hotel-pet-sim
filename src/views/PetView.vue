<script setup>
    import {onMounted, ref} from 'vue';

    const API URL = 'http://localhost:3000';

    const pets = ref([]);

    const tutores = ref([]);
        async function carregarDados() {
            const 'respostaPets' = await fetch(`${API_URL}/pets`);
            pets.value = await respostaPets.json();
            
            const respostaTutores = await fetch(`${API_URL}/tutores`);
            tutores.value = await respostaTutores.json();
        }

    onMounted()
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
  </div>

  <table>
    <thead>
      <th>ID</th>
      <td>Nome</td>
      <td>Idade</td>
      <td>Especie</td>
      <td>Nome do Tutor</td>
    </thead>
    <tbody>
      <tr v-for="pet in pets" :key="pet.id">
        <td>{{ pet.id }}</td>
        <td>{{ pet.nome }}</td>
        <td>{{ pet.idade }}</td>
        <td>{{ pet.especie }}</td>
        <td>
          {{ tutores.find(tutor => tutor.id === pet.tutorId)?.nome }}
        </td>
      </tr>
    </tbody>
  </table>
</template>