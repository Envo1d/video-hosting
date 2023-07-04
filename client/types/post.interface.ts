export interface IPost {
  id: string
  title: string
  description: string
  iconUrl: string
  videoUrl: string
  user: {
    id: string
    image: string
    name: string
  }
  likes: ILike[]
  created_at: string
  comments: IComment[]
}

export interface ILitePost {
  id: string
  title: string
  videoUrl: string
  iconUrl: string
  userId: string
  name: string
  image: string
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
