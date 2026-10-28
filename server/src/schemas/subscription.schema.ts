import { object, string, infer as Infer } from 'zod'

export const createSubSchema = object({
  body: object({
    id: string({
      error: 'User ID is required',
    }),
  })
});

export const deleteSubSchema = object({
  body: object({
    id: string({
      error: 'Like ID is required',
    }),
  })
});

export type CreateSubInput =
  Infer<typeof createSubSchema>['body']

 export type DeleteSubInput =
  Infer<typeof deleteSubSchema>['body']
