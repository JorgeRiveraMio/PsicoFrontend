export interface Psicologo {
  idu_usuario?: string | null  // UUID (FK a auth.users)
  des_email?: string | null
  idt_rol?: number | null
  est_activo?: boolean
  fec_registro?: string
  des_nombr?: string | null
  ape_pater?: string | null
  ape_mater?: string | null
}