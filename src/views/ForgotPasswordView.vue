<template>
  <section class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <!-- IZQUIERDA (IMAGEN / INFO) -->
        <div class="col-lg-6 d-none d-lg-flex flex-column align-items-center text-center">
          <img src="/Logo.png" class="img-fluid mb-4" style="max-width: 220px" />

          <h4 class="fw-bold text-primary">¿Olvidaste tu contraseña?</h4>
          <p class="text-muted px-5">
            No te preocupes. Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <!-- DERECHA (FORM) -->
        <div class="col-md-8 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4 p-md-5">
              <h5 class="text-center mb-3 fw-semibold">Recuperar contraseña</h5>

              <p class="text-muted small text-center mb-4">
                Ingresa tu correo para recibir un enlace
              </p>

              <!-- EMAIL -->
              <div class="mb-3">
                <label class="form-label small text-muted">Correo</label>

                <div class="input-group">
                  <span class="input-group-text bg-white">
                    <i class="bi bi-envelope"></i>
                  </span>

                  <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    placeholder="ejemplo@gmail.com"
                  />
                </div>
              </div>

              <!-- BOTÓN -->
              <button
                class="btn btn-primary w-100 py-2 fw-semibold"
                :disabled="loading || !email.trim()"
                @click="enviarCorreo"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Enviar enlace</span>
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
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { sendResetEmail } from '@/lib/auth'

const email = ref('')
const loading = ref(false)
const toast = useToast()
const isValidEmail = (value: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(value)
}

const enviarCorreo = async () => {
  if (!email.value.trim()) {
    toast.warning('Ingresa un correo')
    return
  }

  if (!isValidEmail(email.value)) {
    toast.warning('Correo inválido')
    return
  }

  loading.value = true

  const loadingToast = toast.info('Enviando correo...', { timeout: false })

  try {
    const resp = await sendResetEmail(email.value)

    toast.dismiss(loadingToast)

    if (!resp.isOk) {
      toast.error(resp.message)
      return
    }

    toast.success(resp.message)
  } catch (e: unknown) {
    toast.dismiss(loadingToast)
    const message = e instanceof Error ? e.message : 'Error inesperado'
    toast.error(message)
  } finally {
    loading.value = false
  }
}
</script>
