export interface ILoginData {
  email: string
  password: string
}

export interface IRegisterData extends ILoginData {
  name: string
  nickname: string
  passwordConfirm: string
}

export interface IAuthResponse {
  status: string
  access_token: string
}
