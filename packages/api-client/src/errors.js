export class ApiError extends Error {
  constructor(message, info) {
    super(message)
    this.name = 'ApiError'
    this.info = info
  }
}
