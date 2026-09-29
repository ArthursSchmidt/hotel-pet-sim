<script setup>
  import { onMounted, ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';

  // chamando minha API para exibir os dados dos pets e tutores
  const API_URL = 'http://localhost:3000';
  const router = useRouter(); 
  
  //exibindo a lista de tutores da aplicação
  const tutores = ref([]);
  async function carregarTutores() {
    const respostaTutores = await fetch (`${API_URL}/tutores`);
    console.log('tutores', respostaTutores.json());
    //transformando os valores da minha API em resposta em JSON
    tutores.value = await respostaTutores.json();
  }

  // chamando a minha API para salvar os dados dos pets
  const novoPet = ref({
    nome: '',
    especie: '',
    tutorId: null,
  })

  async function salvarPet() {
    //fazendo uma requisição para o servidor
    await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoPet.value),
    });
    router.push('/pets');    
  }
  
  onMounted(carregarTutores)
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Pets</h1>
      <p class="text-body-secondary mb-0">Cadastro de Pets no sistema.</p>
    </header>
<!--
        <RouterLink
      class="btn btn-primary"
      :to="{ name: 'addPet' }"
    >
      Adicionar Pet
    </RouterLink>-->

    <form @submit.prevent="salvarPet">
      <div class="col-md-6">
        <label 
        for="nome" 
        class="form-label"
        >Nome do Pet</label>
        
        <input
          type="text"
          id="nome"
          v-model="novoPet.nome"
          class="form-control"
          required
        />
      </div>


      <div class="col-md-6">
        <label 
        for="especie" 
        class="form-label"
        >Espécie</label>

        <select
          v-model="novoPet.especie"
          class="form-control"
          required
          >
        >
        Espécie
        
        <option value="" disabled>Selecione a Espécie</option>
        <option value="Cachorro">Cachorro</option>
        <option value="Gato">Gato</option>
        
      </select>
        
      </div>
      
      <div class="col-md-6">
        <label 
        for="tutor" 
        class="form-label"
        >Tutor</label>

        <select
          v-model="novoPet.tutorId"
          class="form-control"
          required
          >
          <option value="" disabled>Selecione o Tutor</option>
          <option
            v-for="tutor in tutores"
            :key="tutor.id"
            :value="tutor.id"
          >
            {{ tutor.nome }}
          </option>
        </select>
      </div>

      <button
      type="submit"
      class="btn btn-success"
      >
      Salvar pet
      </button>

    </form>
  </div>
</template>