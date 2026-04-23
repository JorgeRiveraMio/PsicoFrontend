export interface NavItem {
  label: string
  to: string
  icon: string
  description: string
  roles?: number[]
}

export interface NavGroup {
  groupLabel: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    groupLabel: 'Registros',
    items: [
      {
        label: 'Pacientes',
        to: '/dashboard/pacientes',
        icon: 'bi-people-fill',
        description: 'Gestiona el listado de pacientes registrados',
        roles: [1, 2],
      },
      {
        label: 'Psicólogos',
        to: '/dashboard/psicologos',
        icon: 'bi-person-badge-fill',
        description: 'Gestiona el equipo de psicólogos',
        roles: [1],
      },
    ],
  },
]
