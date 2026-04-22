export interface NavItem {
  label: string
  to: string
  icon: string
  description: string
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
      },
      {
        label: 'Psicólogos',
        to: '/dashboard/psicologos',
        icon: 'bi-person-badge-fill',
        description: 'Gestiona el equipo de psicólogos',
      },
    ],
  },
]
