import type { IUser } from './user.interface'

interface IError {
  validation: string
  code: string
  message: string
  path: string[]
  minimum: number
  type: string
  inclusive: boolean
  exact: boolean
  expected: string
  received: string
}

export interface IAuthErrors {
  status: string
  errors: IError[]
  message?: string
}

export interface IUserResponse {
  status: string
  data: IUser
}

export interface IHomeResponse {
  posts: {
    id: string
    videoUrl: string
    text: string
    user: {
      id: string
      name: string
      image: string
    }
  }
}
