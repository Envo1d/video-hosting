import { object, string, TypeOf } from 'zod'

export const createCommentSchema = object({
  body: object({
    text: string({
      required_error: 'Text is required',
    }),
    postId: string({
      required_error: 'Post ID is required',
    }),
  })
});

export const deleteCommentSchema = object({
  body: object({
    id: string({
      required_error: 'Comment ID is required',
    }),
  })
});

export type CreateCommentInput =
  TypeOf<typeof createCommentSchema>['body']

export type DeleteCommentInput =
TypeOf<typeof deleteCommentSchema>['body']