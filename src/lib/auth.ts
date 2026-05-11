import { supabase } from './supabase'
import type { IsOkResponse, IsOkResponseGeneric } from '@/types/response'
import type { User } from '@/types/User'
import type { Psicologo } from '@/types/entity/Psicologo'

/**
 * LOGIN
 */

export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return {
        isOk: null,
        message: error?.message || 'Error al iniciar sesión',
      }
    }

    const { data: usuarioDB, error: dbError } = await supabase
      .from('tbm_usuario')
      .select('*')
      .eq('idu_usuario', data.user.id)
      .single()

    if (dbError) {
      return {
        isOk: null,
        message: dbError.message,
      }
    }

    // 🔥 UNIR auth + BD
    if (usuarioDB.est_activo === false) {
      await supabase.auth.signOut()

      return {
        isOk: null,
        message: 'Usuario inactivo. Contacte al administrador.',
      }
    }

    const userFinal = {
      ...data.user,
      ...usuarioDB,
    }

    return {
      isOk: true,
      message: 'Login exitoso',
      modelResponse: userFinal,
    }
  } catch (err: unknown) {
    return {
      isOk: null,
      message: err instanceof Error ? err.message : 'Error desconocido',
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
        des_nombres: data.des_nombres,
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

/**
 * CAMBIAR CONTRASEÑA
 */
export const changePassword = async (newPassword: string): Promise<IsOkResponse> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
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
      message: 'Contraseña actualizada correctamente',
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

/**
 * ENVIAR EMAIL DE RECUPERACIÓN
 */
export const sendResetEmail = async (email: string): Promise<IsOkResponse> => {
  try {
    const redirectUrl = window.location.origin + '/reset-password'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
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
      message: 'Correo enviado. Revisa tu bandeja 📩',
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
