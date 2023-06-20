export function getContentType() {
  return {
    'Content-Type': 'application/json',
  }
}

export function catchError(error: any): string {
  const msg = error?.response?.data?.message

  return msg ? typeof error.response.data.message === 'object' ? msg[0] : msg : error.message
}
