export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'Not Found')
    this.name = 'NotFoundError'
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error — please check your connection') {
    super(message)
    this.name = 'NetworkError'
  }
}
