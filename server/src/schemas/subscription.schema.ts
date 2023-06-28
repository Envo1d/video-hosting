import { object, string, TypeOf } from 'zod'

export const createSubSchema = object({
  body: object({
    id: string({
      required_error: 'User ID is required',
    }),
  })
});

export const deleteSubSchema = object({
  body: object({
    id: string({
      required_error: 'Like ID is required',
    }),
  })
});

export type CreateSubInput =
  TypeOf<typeof createSubSchema>['body']

 export type DeleteSubInput =
  TypeOf<typeof deleteSubSchema>['body']
