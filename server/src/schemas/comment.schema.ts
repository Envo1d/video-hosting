import { object, string, infer as Infer } from 'zod'

export const createCommentSchema = object({
  body: object({
    text: string({
      error: 'Text is required',
    }),
    postId: string({
      error: 'Post ID is required',
    }),
  })
});

export const deleteCommentSchema = object({
  body: object({
    id: string({
      error: 'Comment ID is required',
    }),
  })
});

export type CreateCommentInput =
  Infer<typeof createCommentSchema>['body']

export type DeleteCommentInput =
Infer<typeof deleteCommentSchema>['body']
