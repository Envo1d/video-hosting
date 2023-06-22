import { object, string, TypeOf } from 'zod'

export const createLikeSchema = object({
  body: object({
    userId: string({
      required_error: 'User ID is required',
    }),
    postId: string({
      required_error: 'Post ID is required',
    }),
  })
});

export const deleteLikeSchema = object({
  body: object({
    id: string({
      required_error: 'Like ID is required',
    }),
  })
});

export type CreateLikeInput =
  TypeOf<typeof createLikeSchema>['body']

 export type DeleteLikeInput =
  TypeOf<typeof deleteLikeSchema>['body']
