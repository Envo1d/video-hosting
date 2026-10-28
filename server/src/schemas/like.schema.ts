import { object, string, infer as Infer } from 'zod'

export const createLikeSchema = object({
  body: object({
    postId: string({
      error: 'Post ID is required',
    }),
  })
});

export const deleteLikeSchema = object({
  body: object({
    id: string({
      error: 'Like ID is required',
    }),
  })
});

export type CreateLikeInput =
  Infer<typeof createLikeSchema>['body']

 export type DeleteLikeInput =
  Infer<typeof deleteLikeSchema>['body']
