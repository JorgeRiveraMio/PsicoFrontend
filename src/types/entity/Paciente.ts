export interface Paciente {
  idm_paciente?: number

  cod_paciente?: string | null

  des_nombre: string
  des_ape_paterno: string
  des_ape_materno: string
  num_telefono?: string | null
  fec_ingreso: string
  fec_nacimiento: string

  idu_psicologa?: string | null
  idu_usuario_registro?: string | null
  idt_diagnostico?: number | null

  est_activo?: boolean

  num_modificaciones?: number

  fec_registro?: string
  fec_modificacion?: string
}
