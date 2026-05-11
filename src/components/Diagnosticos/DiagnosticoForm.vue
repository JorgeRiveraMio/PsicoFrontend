<template>
  <form class="diagnostico-form" @submit.prevent="submit">
    <div v-if="error" class="alert alert-danger py-2 small">
      {{ error }}
    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">Codigo</label>
        <input
          v-model.trim="form.cod_diagnostico"
          class="form-control"
          maxlength="20"
          required
          placeholder="Ej. F41.1"
        />
      </div>

      <div class="col-md-8">
        <label class="form-label">Descripcion</label>
        <input
          v-model.trim="form.des_diagnostico"
          class="form-control"
          maxlength="160"
          required
          placeholder="Nombre del diagnostico"
        />
      </div>

      <div class="col-12">
        <div class="form-check form-switch">
          <input
            id="diagnosticoActivo"
            v-model="form.est_activo"
            class="form-check-input"
            type="checkbox"
          />
          <label class="form-check-label" for="diagnosticoActivo">Activo</label>
        </div>
      </div>
    </div>

    <button class="btn btn-primary w-100 mt-4" :disabled="loading">
      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
      Guardar diagnostico
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Diagnostico } from '../../types/entity/Diagnosticos'

const props = defineProps<{
  data: Diagnostico | null
}>()

const emit = defineEmits<{
  (e: 'submit', data: Diagnostico): void
}>()

const loading = ref(false)
const error = ref('')

const form = reactive<Diagnostico>({
  cod_diagnostico: '',
  des_diagnostico: '',
  est_activo: true,
})

watch(
  () => props.data,
  (val) => {
    error.value = ''
    if (val) {
      Object.assign(form, val)
    } else {
      form.cod_diagnostico = ''
      form.des_diagnostico = ''
      form.est_activo = true
    }
  },
  { immediate: true },
)

const submit = () => {
  error.value = ''

  if (!form.cod_diagnostico?.trim() || !form.des_diagnostico?.trim()) {
    error.value = 'Completa el codigo y la descripcion.'
    return
  }

  if (loading.value) return
  loading.value = true

  try {
    emit('submit', {
      cod_diagnostico: form.cod_diagnostico.trim(),
      des_diagnostico: form.des_diagnostico.trim(),
      est_activo: Boolean(form.est_activo),
    })
  } finally {
    loading.value = false
  }
}
</script>
