<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000';
const router = useRouter();

const tutores = ref([]);

async function carregarTutores() {
  const respostaTutores = await fetch(`${API_URL}/tutores`);
  tutores.value = await respostaTutores.json();
}

const novoPet = ref({
  nome: '',
  especie: '',
  tutorId: '',
});

async function salvarPet() {
  await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...novoPet.value,
      tutorId: String(novoPet.value.tutorId),
    }),
  });

  router.push('/pets');
}

onMounted(carregarTutores);
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Pets</h1>
      <p class="text-body-secondary mb-0">Cadastro de Pets no sistema.</p>
    </header>

    <form @submit.prevent="salvarPet">
      <div class="col-md-6">
        <label
          for="nome"
          class="form-label"
          >Nome do Pet</label
        >
        <input
          id="nome"
          v-model="novoPet.nome"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-6">
        <label
          for="especie"
          class="form-label"
          >Espécie</label
        >
        <select
          id="especie"
          v-model="novoPet.especie"
          class="form-control"
          required
        >
          <option
            value=""
            disabled
          >
            Selecione a Espécie
          </option>
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
        </select>
      </div>

      <div class="col-md-6">
        <label
          for="tutor"
          class="form-label"
          >Tutor</label
        >
        <select
          id="tutor"
          v-model="novoPet.tutorId"
          class="form-control"
          required
        >
          <option
            value=""
            disabled
          >
            Selecione o Tutor
          </option>
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
