<template>
  <section class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <!-- IZQUIERDA (IMAGEN / BRANDING) -->
        <div class="col-lg-6 d-none d-lg-flex flex-column align-items-center text-center">
          <img src="/Logo.png" class="img-fluid mb-4" style="max-width: 220px" />

          <h3 class="fw-bold text-primary">Sistema Psicológico</h3>
          <p class="text-muted px-5">
            Gestiona pacientes, psicólogos y seguimiento clínico de forma simple y segura.
          </p>
        </div>

        <!-- DERECHA (FORM) -->
        <div class="col-md-8 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4 p-md-5">
              <h4 class="text-center mb-4 fw-bold text-dark">Iniciar Sesión</h4>

              <form @submit.prevent="loginUser">
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

                <!-- PASSWORD -->
                <div class="mb-3">
                  <label class="form-label small text-muted">Contraseña</label>
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

                <!-- OPCIONES -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      v-model="rememberMe"
                    />
                    <label class="form-check-label small" for="rememberMe">Recuérdame</label>
                  </div>

                  <router-link
                    to="/forgot-password"
                    class="small text-decoration-none text-primary"
                  >
                    ¿Olvidaste tu contraseña?
                  </router-link>
                </div>

                <!-- BOTÓN -->
                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold">
                  Ingresar
                </button>
              </form>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/lib/auth'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const router = useRouter()
const toast = useToast()
const rememberMe = ref(false)
//Recuperar inicio de sesión guardado
onMounted(() => {
  const savedEmail = localStorage.getItem('rememberEmail')

  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})
const isValidEmail = (value: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(value)
}

const loginUser = async () => {
  if (!email.value || !password.value) {
    toast.warning('Completa todos los campos')
    return
  }

  if (!isValidEmail(email.value)) {
    toast.error('Correo inválido')
    return
  }

  const loadingToast = toast.info('Ingresando...', { timeout: false })

  const res = await login(email.value, password.value)

  toast.dismiss(loadingToast)

  if (!res.isOk) {
    toast.error(res.message)
    return
  }

  toast.success('Login exitoso ')
  if (rememberMe.value) {
    localStorage.setItem('rememberEmail', email.value)
  } else {
    localStorage.removeItem('rememberEmail')
  }

  if (res.modelResponse) {
    localStorage.setItem('user', JSON.stringify(res.modelResponse))
    router.push('/dashboard')
  }
}
</script>
