<template>
  <section class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <!-- IZQUIERDA -->
        <div class="col-lg-6 d-none d-lg-flex flex-column align-items-center text-center">
          <img src="/Logo.png" class="img-fluid mb-4" style="max-width: 220px" />

          <h4 class="fw-bold text-primary">Crea una nueva contraseña</h4>
          <p class="text-muted px-5">
            Asegúrate de usar una contraseña segura para proteger tu cuenta.
          </p>
        </div>

        <!-- DERECHA -->
        <div class="col-md-8 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4 p-md-5">
              <h5 class="text-center mb-3 fw-semibold">Restablecer contraseña</h5>

              <p class="text-muted small text-center mb-4">Ingresa tu nueva contraseña</p>

              <!-- PASSWORD -->
              <div class="mb-3">
                <label class="form-label small text-muted">Nueva contraseña</label>

                <div class="input-group">
                  <span class="input-group-text bg-white">
                    <i class="bi bi-lock"></i>
                  </span>

                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="********"
                  />
                </div>
              </div>

              <!-- CONFIRMAR -->
              <div class="mb-3">
                <label class="form-label small text-muted">Confirmar contraseña</label>

                <div class="input-group">
                  <span class="input-group-text bg-white">
                    <i class="bi bi-shield-lock"></i>
                  </span>

                  <input
                    v-model="confirmPassword"
                    type="password"
                    class="form-control"
                    placeholder="********"
                  />
                </div>
              </div>

              <!-- BOTÓN -->
              <button
                class="btn btn-primary w-100 py-2 fw-semibold"
                :disabled="loading || !isValid"
                @click="cambiarPassword"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Guardar contraseña</span>
              </button>

              <!-- VOLVER -->
              <div class="text-center mt-4">
                <router-link to="/login" class="text-decoration-none small text-primary">
                  ← Volver al login
                </router-link>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="text-center mt-3">
            <small class="text-muted"> © 2026 Sistema Psicológico </small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { changePassword } from '@/lib/auth'

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const toast = useToast()

const isValid = computed(() => {
  return (
    password.value.length >= 6 &&
    confirmPassword.value.length >= 6 &&
    password.value === confirmPassword.value
  )
})

const cambiarPassword = async () => {
  if (!password.value || !confirmPassword.value) {
    toast.warning('Completa todos los campos')
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.error('Las contraseñas no coinciden')
    return
  }

  if (password.value.length < 6) {
    toast.warning('Mínimo 6 caracteres')
    return
  }

  loading.value = true

  const loadingToast = toast.info('Actualizando contraseña...', { timeout: false })

  try {
    const resp = await changePassword(password.value)

    toast.dismiss(loadingToast)

    if (!resp.isOk) {
      toast.error(resp.message)
      return
    }

    toast.success('Contraseña actualizada 🎉')

    setTimeout(() => {
      window.location.href = '/login'
    }, 1500)
  } catch (e: unknown) {
    toast.dismiss(loadingToast)
    const message = e instanceof Error ? e.message : 'Error inesperado'
    toast.error(message)
  } finally {
    loading.value = false
  }
}
</script>
