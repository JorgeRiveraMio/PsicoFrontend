import { supabase } from './supabase'
import type { IsOkResponse, IsOkResponseGeneric } from '@/types/response'
import type { User } from '@/types/User'
import type { Psicologo } from '@/types/entity/Psicologo'

/**
 * LOGIN
 */

export const login = async (
  email: string,
  password: string,
): Promise<IsOkResponseGeneric<User | null>> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        isOk: null,
        message: error.message,
        listMessage: [],
      }
    }

    return {
      isOk: true,
      message: 'Login exitoso',
      modelResponse: data.user,
      listMessage: [],
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return {
      isOk: null,
      message: message,
      listMessage: [],
    }
  }
}

/**
 * LOGOUT
 */
export const logout = async (): Promise<IsOkResponse> => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        isOk: null,
        message: error.message,
        listMessage: [],
      }
    }

    return {
      isOk: true,
      message: 'Sesión cerrada correctamente',
      listMessage: [],
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'

    return {
      isOk: null,
      message: message,
      listMessage: [],
    }
  }
}

/**
 * USUARIO ACTUAL
 */
export const getUser = async (): Promise<IsOkResponseGeneric<User>> => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return {
      isOk: null,
      message: error.message,
      listMessage: [],
    }
  }

  return {
    isOk: true,
    message: 'OK',
    modelResponse: data.user,
    listMessage: [],
  }
}

export const registerPsicologo = async (
  data: Psicologo,
  password: string,
): Promise<IsOkResponseGeneric<Psicologo | null>> => {
  try {
    const { data: userData, error: authError } = await supabase.auth.signUp({
      email: data.des_email!,
      password,
    })

    if (authError || !userData.user) {
      return {
        isOk: null,
        message: authError?.message || 'No se pudo crear el usuario',
        listMessage: [],
      }
    }

    const { data: psicologoData, error: insertError } = await supabase
      .from('tbm_usuario')
      .insert({
        idu_usuario: userData.user.id,
        des_email: data.des_email,
        des_nombr: data.des_nombr,
        ape_pater: data.ape_pater,
        idt_rol: 2,
        ape_mater: data.ape_mater,
        est_activo: true,
      })
      .select()
      .single()

    if (insertError) {
      return {
        isOk: null,
        message: insertError.message,
        listMessage: [],
      }
    }

    return {
      isOk: true,
      message: 'Psicólogo registrado correctamente',
      modelResponse: psicologoData,
      listMessage: [],
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'

    return {
      isOk: null,
      message,
      listMessage: [],
    }
  }
}
