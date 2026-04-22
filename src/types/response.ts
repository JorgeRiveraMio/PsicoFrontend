export type IsOkResponse = {
  isOk: boolean | null
  message: string
  id?: number | null
  contenResponse?: string
  listMessage: string[]
}

export type IsOkResponseGeneric<T> = IsOkResponse & {
  modelResponse?: T | null
}