export interface IPost {
  id: string
  text: string
  videoUrl: string
  user: {
    id: string
    image: string
    name: string
  }
  likes: ILike[]
  created_at: string
  comments: IComment[]
  reposts: number
}

export interface IComment {
  id: string
  text: string
  user: {
    id: string
    name: string
    image: string
  }

  parentComment: IComment
  childComments: IComment[]
}

export interface ILike {
  id: string
  userId: string
  postId: string
}
