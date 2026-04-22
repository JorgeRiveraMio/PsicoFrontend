import { supabase } from './supabase'
import type { IsOkResponseGeneric,IsOkResponse } from '@/types/response'

/**
 * SELECT GENERICO
 */

export const select = async <T>(  table: string,  filters?: Record<string, any>,
): Promise<IsOkResponseGeneric<T[]>> => {
  try {
    let query = supabase.from(table).select('*')

    if (filters) {
      Object.keys(filters).forEach((key) => {
        query = query.eq(key, filters[key])
      })
    }

    const { data, error } = await query

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
      modelResponse: data as T[],
      listMessage: [],
    }
  } catch (err: any) {
    return {
      isOk: null,
      message: err.message,
      listMessage: [],
    }
  }
}

/**
 * INSERT GENERICO
 */

export const insert = async <T>(
  table: string,
  payload: any
): Promise<IsOkResponseGeneric<T>> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single()

    if (error) {
      return {
        isOk: null,
        message: error.message,
        listMessage: []
      }
    }

    return {
      isOk: true,
      message: 'Registro creado',
      modelResponse: data as T,
      listMessage: []
    }

  } catch (err: any) {
    return {
      isOk: null,
      message: err.message,
      listMessage: []
    }
  }
}

/**
 * UPDATE GENERICO
 */
export const update = async <T>(
  table: string,
  payload: any,
  where: Record<string, any>
): Promise<IsOkResponseGeneric<T>> => {
  try {
    let query = supabase.from(table).update(payload)

    Object.keys(where).forEach(key => {
      query = query.eq(key, where[key])
    })

    const { data, error } = await query.select().single()

    if (error) {
      return {
        isOk: null,
        message: error.message,
        listMessage: []
      }
    }

    return {
      isOk: true,
      message: 'Actualizado correctamente',
      modelResponse: data as T,
      listMessage: []
    }

  } catch (err: any) {
    return {
      isOk: null,
      message: err.message,
      listMessage: []
    }
  }
}
/**
 * DELETE LOGICO (soft delete)
 */
export const softDelete = async (
  table: string,
  where: Record<string, any>
): Promise<IsOkResponse> => {
  try {
    const result = await update(table, { EST_ACTIVO: false }, where)

    if (!result.isOk) {
      return {
        isOk: null,
        message: result.message,
        listMessage: []
      }
    }

    return {
      isOk: true,
      message: 'Eliminado correctamente (lógico)',
      listMessage: []
    }

  } catch (err: any) {
    return {
      isOk: null,
      message: err.message,
      listMessage: []
    }
  }
}