<template>
  <!-- ══════════════════════════════════════════════
       OVERLAY móvil
  ══════════════════════════════════════════════ -->
  <div v-if="mobileOpen" class="sidebar-overlay d-lg-none" @click="mobileOpen = false" />

  <div class="app-shell">
    <!-- ══════════════════════════════════════════════
         SIDEBAR
    ══════════════════════════════════════════════ -->
    <aside :class="['app-sidebar', { 'app-sidebar--open': mobileOpen }]">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="sidebar-brand__logo">
          <i class="bi bi-heart-pulse-fill"></i>
        </div>
        <div class="sidebar-brand__text">
          <span class="sidebar-brand__name">PsicoApp</span>
          <span class="sidebar-brand__sub">Centro de Salud</span>
        </div>
      </div>

      <!-- Nav generado desde nav.config.ts -->
      <nav class="sidebar-nav">
        <template v-for="group in navGroups" :key="group.groupLabel">
          <p class="sidebar-nav__group-label">{{ group.groupLabel }}</p>

          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="sidebar-nav__item"
            active-class="sidebar-nav__item--active"
            @click="mobileOpen = false"
          >
            <span class="sidebar-nav__icon">
              <i :class="['bi', item.icon]"></i>
            </span>
            <span class="sidebar-nav__label">{{ item.label }}</span>
          </RouterLink>
        </template>
      </nav>

      <!-- Footer con usuario -->
      <div class="sidebar-footer">
        <div class="sidebar-footer__user">
          <div class="sidebar-footer__avatar">
            {{ userInitials }}
          </div>
          <div class="sidebar-footer__info">
            <span class="sidebar-footer__name">{{ userName }}</span>
            <span class="sidebar-footer__role">Administrador</span>
          </div>
        </div>
        <button class="sidebar-footer__logout" @click="handleLogout" title="Cerrar sesión">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </aside>

    <!-- ══════════════════════════════════════════════
         ÁREA DERECHA
    ══════════════════════════════════════════════ -->
    <div class="app-body">
      <!-- Topbar -->
      <header class="app-topbar">
        <button
          class="topbar-toggle d-lg-none"
          @click="mobileOpen = !mobileOpen"
          aria-label="Abrir menú"
        >
          <i class="bi bi-list"></i>
        </button>

        <!-- Breadcrumb en desktop -->
        <div class="topbar-breadcrumb d-none d-md-flex">
          <span class="topbar-breadcrumb__root">Dashboard</span>
          <i class="bi bi-chevron-right topbar-breadcrumb__sep"></i>
          <span class="topbar-breadcrumb__current">{{ currentLabel }}</span>
        </div>

        <!-- Título en móvil -->
        <span class="topbar-title d-md-none">{{ currentLabel }}</span>

        <!-- Acciones -->
        <div class="topbar-actions ms-auto">
          <button class="topbar-actions__btn" title="Notificaciones">
            <i class="bi bi-bell"></i>
            <span class="topbar-actions__badge">3</span>
          </button>
        </div>
      </header>

      <!-- Vista hija con transición -->
      <main class="app-content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '@/lib/auth'
import { navGroups } from '@/config/nav.config'

const router = useRouter()
const route = useRoute()

const mobileOpen = ref(false)

// ── Usuario desde localStorage ─────────────────────────────
const stored = localStorage.getItem('user')
const userData = stored ? JSON.parse(stored) : null
const userName = computed(() => userData?.email?.split('@')[0] ?? 'Usuario')
const userInitials = computed(() => userName.value.slice(0, 2).toUpperCase())

// ── Título activo desde nav.config ─────────────────────────
const currentLabel = computed(() => {
  for (const group of navGroups) {
    const found = group.items.find((i) => route.path.startsWith(i.to))
    if (found) return found.label
  }
  return 'Dashboard'
})

// ── Logout ──────────────────────────────────────────────────
async function handleLogout() {
  await logout()
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
/* ── Variables ──────────────────────────────────────────── */
.app-shell {
  --sidebar-w: 260px;
  --sidebar-bg: #0f172a;
  --sidebar-border: rgba(255, 255, 255, 0.06);
  --sidebar-text: #94a3b8;
  --sidebar-text-active: #f8fafc;
  --sidebar-accent: #6366f1;
  --sidebar-accent-bg: rgba(99, 102, 241, 0.15);
  --topbar-h: 64px;
  --body-bg: #f1f5f9;

  display: flex;
  min-height: 100vh;
  background: var(--body-bg);
}

/* ── Sidebar ─────────────────────────────────────────────── */
.app-sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  scrollbar-width: none;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1040;
}
.app-sidebar::-webkit-scrollbar {
  display: none;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 26px 20px 22px;
  border-bottom: 1px solid var(--sidebar-border);
  flex-shrink: 0;
}
.sidebar-brand__logo {
  width: 40px;
  height: 40px;
  background: var(--sidebar-accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}
.sidebar-brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.sidebar-brand__name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
}
.sidebar-brand__sub {
  font-size: 0.68rem;
  color: #64748b;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sidebar-nav__group-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  color: #475569;
  margin: 10px 10px 6px;
  font-weight: 600;
}
.sidebar-nav__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition:
    background 0.18s,
    color 0.18s,
    transform 0.15s;
  position: relative;
}
.sidebar-nav__item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--sidebar-text-active);
  transform: translateX(3px);
}
.sidebar-nav__item--active {
  background: var(--sidebar-accent-bg);
  color: #a5b4fc;
}
.sidebar-nav__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 55%;
  background: var(--sidebar-accent);
  border-radius: 0 3px 3px 0;
}
.sidebar-nav__icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

/* Footer */
.sidebar-footer {
  padding: 14px 12px 20px;
  border-top: 1px solid var(--sidebar-border);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.sidebar-footer__user {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}
.sidebar-footer__avatar {
  width: 34px;
  height: 34px;
  background: var(--sidebar-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.sidebar-footer__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.sidebar-footer__name {
  font-size: 0.78rem;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar-footer__role {
  font-size: 0.68rem;
  color: #64748b;
}
.sidebar-footer__logout {
  background: none;
  border: none;
  color: #f87171;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  flex-shrink: 0;
  transition: background 0.18s;
}
.sidebar-footer__logout:hover {
  background: rgba(248, 113, 113, 0.12);
}

/* ── App body ────────────────────────────────────────────── */
.app-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Topbar */
.app-topbar {
  height: var(--topbar-h);
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 14px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.topbar-toggle {
  background: none;
  border: none;
  font-size: 1.45rem;
  color: #475569;
  cursor: pointer;
  padding: 4px;
}
.topbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}
.topbar-breadcrumb__root {
  color: #94a3b8;
}
.topbar-breadcrumb__sep {
  color: #cbd5e1;
  font-size: 0.7rem;
}
.topbar-breadcrumb__current {
  color: #1e293b;
  font-weight: 600;
}
.topbar-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.topbar-actions__btn {
  position: relative;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #64748b;
  cursor: pointer;
  transition: background 0.18s;
  outline: none;
}
.topbar-actions__btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}
.topbar-actions__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: #fff;
  font-size: 0.58rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

/* Contenido */
.app-content {
  flex: 1;
  padding: 28px 24px;
  overflow-y: auto;
}

/* ── Transición vistas ───────────────────────────────────── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Overlay + Responsive ────────────────────────────────── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1039;
  backdrop-filter: blur(2px);
}
@media (max-width: 991.98px) {
  .app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
  }
  .app-sidebar--open {
    transform: translateX(0);
  }
  .app-content {
    padding: 20px 16px;
  }
}
</style>
