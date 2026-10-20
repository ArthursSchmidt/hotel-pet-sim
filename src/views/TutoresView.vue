<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const API_URL = 'http://localhost:3000';
const tutores = ref([]);
const pets = ref([]);
const filtro = ref('');

async function carregarDados() {
  const [respostaTutores, respostaPets] = await Promise.all([
    fetch(`${API_URL}/tutores`),
    fetch(`${API_URL}/pets`),
  ]);

  tutores.value = await respostaTutores.json();
  pets.value = await respostaPets.json();
}

const tutoresFiltrados = computed(() => {
  const termo = filtro.value.trim().toLowerCase();

  return tutores.value
    .map((tutor) => {
      const petsTutor = pets.value.filter(
        (pet) => String(pet.tutorId) === String(tutor.id),
      );

      return {
        ...tutor,
        petsTutor,
        quantidade: petsTutor.length,
        nomesPets: petsTutor.map((pet) => pet.nome).join(' / '),
      };
    })
    .filter((tutor) => {
      if (!termo) {
        return true;
      }

      const busca =
        `${tutor.nome} ${tutor.telefone ?? ''} ${tutor.email ?? ''}`.toLowerCase();
      return busca.includes(termo);
    });
});

async function removerTutor(tutorId) {
  const petsTutor = pets.value.filter(
    (pet) => String(pet.tutorId) === String(tutorId),
  );

  if (petsTutor.length > 0) {
    alert(
      'Não é possível remover este tutor enquanto houver pets vinculados. Remova ou transfira os pets primeiro.',
    );
    return;
  }

  const confirmarExclusao = window.confirm(
    'Deseja realmente remover este tutor?',
  );

  if (!confirmarExclusao) {
    return;
  }

  await fetch(`${API_URL}/tutores/${tutorId}`, {
    method: 'DELETE',
  });

  await carregarDados();
}

onMounted(carregarDados);
</script>

<template>
  <div class="tutores-view">
    <header class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="display-5 fw-bold mb-1">Listagem de Tutores</h1>
        <p class="text-secondary mb-0">
          Consulte os tutores cadastrados e seus pets.
        </p>
      </div>

      <RouterLink
        class="btn btn-primary btn-lg"
        to="/tutores/novo"
      >
        <i
          class="bi bi-plus-lg me-2"
          aria-hidden="true"
        ></i>
        Cadastrar Tutor
      </RouterLink>
    </header>

    <div class="mb-4">
      <div class="input-group search-box">
        <span class="input-group-text bg-white border-end-0">
          <i
            class="bi bi-search"
            aria-hidden="true"
          ></i>
        </span>
        <input
          v-model="filtro"
          class="form-control border-start-0"
          type="text"
          placeholder="Pesquisar tutor por nome, CPF/CNPJ ou e-mail"
        />
      </div>
    </div>

    <div class="table-responsive border rounded">
      <table class="table table-bordered align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nome Completo</th>
            <th>CPF / CNPJ</th>
            <th>Telefone / Celular / WhatsApp</th>
            <th>E-mail</th>
            <th>Pets (Quantidade)</th>
            <th>Nome dos Pets</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="tutor in tutoresFiltrados"
            :key="tutor.id"
          >
            <td>{{ tutor.id }}</td>
            <td>{{ tutor.nome }}</td>
            <td>{{ tutor.cpfCnpj || '—' }}</td>
            <td>{{ tutor.telefone || '—' }}</td>
            <td>{{ tutor.email || '—' }}</td>
            <td>{{ tutor.quantidade }}</td>
            <td>{{ tutor.nomesPets || 'Nenhum pet vinculado' }}</td>
            <td class="text-nowrap">
              <RouterLink
                class="btn btn-outline-primary btn-sm me-2"
                :to="`/tutores/${tutor.id}`"
              >
                Visualizar
              </RouterLink>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="removerTutor(tutor.id)"
              >
                Remover
              </button>
            </td>
          </tr>

          <tr v-if="tutoresFiltrados.length === 0">
            <td
              class="text-center text-secondary py-4"
              colspan="8"
            >
              Nenhum tutor encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tutores-view {
  min-height: 100%;
}

.search-box {
  max-width: 100%;
}

.table th,
.table td {
  vertical-align: middle;
}
</style>
