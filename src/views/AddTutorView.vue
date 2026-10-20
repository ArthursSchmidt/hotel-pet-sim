<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000';
const router = useRouter();

const formulario = ref({
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

const erros = ref({
  nome: '',
  telefone: '',
});

const camposObrigatorios = computed(() => {
  const nomeValido = formulario.value.nome.trim().length > 0;
  const telefoneValido =
    formulario.value.telefone.replace(/\D/g, '').length > 0;

  return {
    nome: nomeValido,
    telefone: telefoneValido,
  };
});

const podeSalvar = computed(() => {
  return camposObrigatorios.value.nome && camposObrigatorios.value.telefone;
});

function formatarTelefone(valor) {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 11);

  if (apenasNumeros.length <= 10) {
    return apenasNumeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return apenasNumeros
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function formatarCpfCnpj(valor) {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 14);

  if (apenasNumeros.length <= 11) {
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return apenasNumeros
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function formatarEmail(valor) {
  return valor;
}

function validarCampo(campo) {
  if (campo === 'nome') {
    erros.value.nome = formulario.value.nome.trim()
      ? ''
      : 'Ops, campo obrigatório, por favor preencha-o!';
    return;
  }

  if (campo === 'telefone') {
    erros.value.telefone = formulario.value.telefone.replace(/\D/g, '').length
      ? ''
      : 'Ops, campo obrigatório, por favor preencha-o!';
  }
}

function atualizarCampo(chave, valor) {
  if (chave === 'telefone') {
    formulario.value.telefone = formatarTelefone(valor);
  } else if (chave === 'cpfCnpj') {
    formulario.value.cpfCnpj = formatarCpfCnpj(valor);
  } else if (chave === 'email') {
    formulario.value.email = formatarEmail(valor);
  } else {
    formulario.value[chave] = valor;
  }

  validarCampo(chave);
}

async function salvarTutor() {
  validarCampo('nome');
  validarCampo('telefone');

  if (!podeSalvar.value) {
    return;
  }

  const payload = {
    nome: formulario.value.nome.trim(),
    telefone: formulario.value.telefone,
    cpfCnpj: formulario.value.cpfCnpj || '',
    email: formulario.value.email || '',
    dataNascimento: formulario.value.dataNascimento || '',
    rua: formulario.value.rua || '',
    numero: formulario.value.numero || '',
    bairro: formulario.value.bairro || '',
    cidade: formulario.value.cidade || '',
    estado: formulario.value.estado || '',
    cep: formulario.value.cep || '',
  };

  await fetch(`${API_URL}/tutores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  router.push('/tutores');
}

onMounted(() => {
  validarCampo('nome');
  validarCampo('telefone');
});
</script>

<template>
  <div class="add-tutor-view">
    <header class="mb-4">
      <h1 class="display-5 fw-bold mb-1">Cadastrar Tutor</h1>
      <p class="text-secondary mb-0">
        Preencha os dados para cadastrar um novo tutor.
      </p>
    </header>

    <form @submit.prevent="salvarTutor">
      <section class="border rounded p-3 bg-light-subtle">
        <h2 class="h4 fw-bold mb-3">Dados do Tutor</h2>

        <div class="row g-3">
          <div class="col-md-6">
            <label
              class="form-label fw-semibold"
              for="nome"
              >Nome Completo</label
            >
            <input
              id="nome"
              :value="formulario.nome"
              class="form-control"
              type="text"
              placeholder="Digite o nome completo"
              @input="atualizarCampo('nome', $event.target.value)"
            />
            <small
              v-if="erros.nome"
              class="text-danger d-block mt-1"
              >{{ erros.nome }}</small
            >
          </div>

          <div class="col-md-6">
            <label
              class="form-label fw-semibold"
              for="telefone"
              >Telefone / Celular / WhatsApp</label
            >
            <input
              id="telefone"
              :value="formulario.telefone"
              class="form-control"
              type="text"
              placeholder="(00) 00000-0000"
              @input="atualizarCampo('telefone', $event.target.value)"
            />
            <small
              v-if="erros.telefone"
              class="text-danger d-block mt-1"
              >{{ erros.telefone }}</small
            >
          </div>

          <div class="col-md-6">
            <label
              class="form-label fw-semibold"
              for="cpfCnpj"
              >CPF / CNPJ</label
            >
            <input
              id="cpfCnpj"
              :value="formulario.cpfCnpj"
              class="form-control"
              type="text"
              placeholder="Digite o CPF ou CNPJ"
              @input="atualizarCampo('cpfCnpj', $event.target.value)"
            />
          </div>

          <div class="col-md-6">
            <label
              class="form-label fw-semibold"
              for="email"
              >E-mail</label
            >
            <input
              id="email"
              :value="formulario.email"
              class="form-control"
              type="email"
              placeholder="nome@example.com"
              @input="atualizarCampo('email', $event.target.value)"
            />
          </div>

          <div class="col-md-6">
            <label
              class="form-label fw-semibold"
              for="dataNascimento"
              >Data de Nascimento</label
            >
            <input
              id="dataNascimento"
              v-model="formulario.dataNascimento"
              class="form-control"
              type="date"
            />
          </div>
        </div>
      </section>

      <section class="border rounded p-3 bg-light-subtle mt-4">
        <h2 class="h4 fw-bold mb-3">Endereço</h2>

        <div class="row g-3">
          <div class="col-md-6">
            <label
              class="form-label fw-semibold"
              for="rua"
              >Rua</label
            >
            <input
              id="rua"
              v-model="formulario.rua"
              class="form-control"
              type="text"
              placeholder="Digite o nome da rua"
            />
          </div>

          <div class="col-md-3">
            <label
              class="form-label fw-semibold"
              for="numero"
              >Número</label
            >
            <input
              id="numero"
              v-model="formulario.numero"
              class="form-control"
              type="text"
              placeholder="Número"
            />
          </div>

          <div class="col-md-3">
            <label
              class="form-label fw-semibold"
              for="bairro"
              >Bairro</label
            >
            <input
              id="bairro"
              v-model="formulario.bairro"
              class="form-control"
              type="text"
              placeholder="Digite o bairro"
            />
          </div>

          <div class="col-md-6">
            <label
              class="form-label fw-semibold"
              for="cidade"
              >Cidade</label
            >
            <input
              id="cidade"
              v-model="formulario.cidade"
              class="form-control"
              type="text"
              placeholder="Digite a cidade"
            />
          </div>

          <div class="col-md-3">
            <label
              class="form-label fw-semibold"
              for="estado"
              >Estado</label
            >
            <select
              id="estado"
              v-model="formulario.estado"
              class="form-select"
            >
              <option value="">Selecione</option>
              <option value="SP">SP</option>
              <option value="SC">SC</option>
              <option value="PR">PR</option>
              <option value="RJ">RJ</option>
              <option value="RS">RS</option>
            </select>
          </div>

          <div class="col-md-3">
            <label
              class="form-label fw-semibold"
              for="cep"
              >CEP</label
            >
            <input
              id="cep"
              v-model="formulario.cep"
              class="form-control"
              type="text"
              placeholder="00000-000"
            />
          </div>
        </div>
      </section>

      <div class="d-flex justify-content-end gap-3 mt-4">
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="router.push('/tutores')"
        >
          Cancelar
        </button>
        <button
          class="btn btn-primary"
          type="submit"
          :disabled="!podeSalvar"
        >
          Cadastrar Tutor
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-tutor-view {
  min-height: 100%;
}

.form-control,
.form-select {
  min-height: 48px;
}

.form-label {
  font-size: 1rem;
}
</style>
