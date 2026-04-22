<template>
  <form @submit.prevent="submit">
    <!-- NOMBRE -->
    <div class="mb-2">
      <label class="form-label">Nombres</label>
      <input v-model="form.des_nombr" class="form-control" required />
    </div>

    <!-- APELLIDO PATERNO -->
    <div class="mb-2">
      <label class="form-label">Apellido Paterno</label>
      <input v-model="form.ape_pater" class="form-control" />
    </div>

    <!-- APELLIDO MATERNO -->
    <div class="mb-2">
      <label class="form-label">Apellido Materno</label>
      <input v-model="form.ape_mater" class="form-control" />
    </div>

    <!-- EMAIL -->
    <div class="mb-2">
      <label class="form-label">Correo</label>
      <input v-model="form.des_email" type="email" class="form-control" />
    </div>

    <!-- ACTIVO -->
    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" v-model="form.est_activo" id="activoCheck" />
      <label class="form-check-label" for="activoCheck"> Activo </label>
    </div>

    <button class="btn btn-success w-100 mt-2" :disabled="loading">
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
        v-if="loading"
      ></span>
      <span v-else>Guardar</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import type { Psicologo } from '../../types/entity/Psicologo'
const loading = ref(false)

const props = defineProps<{
  data: Psicologo | null
}>()

const emit = defineEmits<{
  (e: 'submit', data: Psicologo): void
}>()

const form = reactive<Psicologo>({
  des_nombr: '',
  ape_pater: '',
  ape_mater: '',
  des_email: '',
  est_activo: true,
})

watch(
  () => props.data,
  (val) => {
    if (val) {
      Object.assign(form, val)
    } else {
      form.des_nombr = ''
      form.ape_pater = ''
      form.ape_mater = ''
      form.des_email = ''
      form.est_activo = true
    }
  },
  { immediate: true },
)

const submit = () => {
  if (loading.value) return
  loading.value = true
  try {
    emit('submit', { ...form })
  } finally {
    loading.value = false
  }
}
</script>
