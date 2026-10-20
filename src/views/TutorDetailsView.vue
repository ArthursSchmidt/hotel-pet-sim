<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const API_URL = 'http://localhost:3000';

const tutor = ref({
  id: '',
  nome: '',
  telefone: '',
  cpfCnpj: '',
  email: '',
  dataNascimento: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
});

const petsVinculados = ref([]);
const novoPet = ref({
  nome: '',
  especie: '',
});
const tutorId = computed(() => String(route.params.id));

async function carregarTutor() {
  const resposta = await fetch(`${API_URL}/tutores/${tutorId.value}`);

  if (!resposta.ok) {
    router.push('/tutores');
    return;
  }

  tutor.value = await resposta.json();
  await carregarPets();
}

async function carregarPets() {
  const resposta = await fetch(`${API_URL}/pets?tutorId=${tutorId.value}`);
  petsVinculados.value = await resposta.json();
}

async function cadastrarPet() {
  if (!novoPet.value.nome || !novoPet.value.especie) {
    return;
  }

  await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: novoPet.value.nome,
      especie: novoPet.value.especie,
      tutorId: tutorId.value,
    }),
  });

  novoPet.value = { nome: '', especie: '' };
  await carregarPets();
}

async function removerTutor() {
  if (petsVinculados.value.length > 0) {
    window.alert(
      'Primeiro remova ou transfira os pets vinculados a este tutor.',
    );
    return;
  }

  const confirmar = window.confirm('Deseja realmente remover este tutor?');

  if (!confirmar) {
    return;
  }

  await fetch(`${API_URL}/tutores/${tutorId.value}`, {
    method: 'DELETE',
  });

  router.push('/tutores');
}

onMounted(carregarTutor);
</script>

<template>
  <div class="tutor-details-view">
    <header class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="display-5 fw-bold mb-1">Detalhes do Tutor</h1>
        <p class="text-secondary mb-0">
          Visualize os dados do tutor e seus pets vinculados.
        </p>
      </div>

      <button
        class="btn btn-outline-primary"
        type="button"
        @click="router.push('/tutores')"
      >
        <i
          class="bi bi-arrow-left me-2"
          aria-hidden="true"
        ></i>
        Voltar para Tutores
      </button>
    </header>

    <section class="border rounded p-3 bg-light-subtle mb-4">
      <h2 class="h4 fw-bold mb-3">Informações do Tutor</h2>

      <div class="row g-3">
        <div class="col-md-4">
          <div class="fw-semibold text-secondary">ID</div>
          <div>{{ tutor.id }}</div>
        </div>
        <div class="col-md-4">
          <div class="fw-semibold text-secondary">Nome Completo</div>
          <div>{{ tutor.nome }}</div>
        </div>
        <div class="col-md-4">
          <div class="fw-semibold text-secondary">
            Telefone / Celular / WhatsApp
          </div>
          <div>{{ tutor.telefone }}</div>
        </div>
      </div>
    </section>

    <section class="border rounded p-3 bg-light-subtle mb-4">
      <h2 class="h4 fw-bold mb-3">Pets vinculados</h2>

      <div
        v-if="petsVinculados.length === 0"
        class="text-secondary"
      >
        Nenhum pet vinculado a este tutor.
      </div>

      <div
        v-else
        class="table-responsive"
      >
        <table class="table table-bordered align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Espécie</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pet in petsVinculados"
              :key="pet.id"
            >
              <td>{{ pet.id }}</td>
              <td>{{ pet.nome }}</td>
              <td>{{ pet.especie }}</td>
              <td>
                <RouterLink
                  class="btn btn-outline-primary btn-sm"
                  :to="`/pets/${pet.id}`"
                >
                  Visualizar Pet
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="border rounded p-3 bg-light-subtle">
      <h2 class="h4 fw-bold mb-3">Cadastrar novo pet</h2>

      <div class="row g-3 align-items-end">
        <div class="col-md-5">
          <label
            class="form-label fw-semibold"
            for="petNome"
            >Nome do pet</label
          >
          <input
            id="petNome"
            v-model="novoPet.nome"
            class="form-control"
            type="text"
            placeholder="Digite o nome do pet"
          />
        </div>

        <div class="col-md-4">
          <label
            class="form-label fw-semibold"
            for="petEspecie"
            >Espécie</label
          >
          <select
            id="petEspecie"
            v-model="novoPet.especie"
            class="form-select"
          >
            <option value="">Selecione</option>
            <option value="Cachorro">Cachorro</option>
            <option value="Gato">Gato</option>
          </select>
        </div>

        <div class="col-md-3 d-grid">
          <button
            class="btn btn-success"
            type="button"
            @click="cadastrarPet"
          >
            Cadastrar pet
          </button>
        </div>
      </div>
    </section>

    <div class="mt-4">
      <button
        class="btn btn-outline-danger btn-lg"
        type="button"
        @click="removerTutor"
      >
        Remover Tutor
      </button>
    </div>
  </div>
</template>

<style scoped>
.tutor-details-view {
  min-height: 100%;
}

.table th,
.table td {
  vertical-align: middle;
}
</style>
