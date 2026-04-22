<template>
  <section class="vh-100 bg-light">
    <div class="container h-100">
      <div class="row h-100 align-items-center justify-content-center">
        <!-- IMAGEN -->
        <div class="col-md-6 d-flex justify-content-center align-items-center">
          <img src="/Logo.png" alt="Logo" class="img-fluid" style="max-width: 300px" />
        </div>

        <!-- FORM -->
        <div class="col-md-5">
          <div class="card shadow border-0 p-4">
            <form @submit.prevent="loginUser">
              <h3 class="text-center mb-4 fw-bold text-primary">Iniciar Sesión</h3>

              <!-- Email -->
              <div class="mb-3">
                <label class="form-label">Correo</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="ejemplo@gmail.com"
                />
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="********"
                />
              </div>

              <!-- Opciones -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember" />
                  <label class="form-check-label">Recordarme</label>
                </div>
                <a href="#" class="small">¿Olvidaste tu contraseña?</a>
              </div>

              <!-- BOTÓN -->
              <button type="submit" class="btn btn-primary w-100">Ingresar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/lib/auth'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const router = useRouter()
const toast = useToast()

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

  if (res.modelResponse) {
    localStorage.setItem('user', JSON.stringify(res.modelResponse))
    router.push('/dashboard')
  }
}
</script>
