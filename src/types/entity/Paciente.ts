export interface Paciente {
  idm_paciente?: number

  cod_paciente?: string | null

  des_nombre: string
  num_telefono?: string | null
  fec_ingreso: string

  idu_psicologa?: string | null
  idu_usuario_registro?: string | null

  est_activo?: boolean

  num_modificaciones?: number

  fec_registro?: string
  fec_modificacion?: string
}
