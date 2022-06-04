class DomainError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(public readonly entity: string) {
    super(`${entity} not found`);
    this.name = this.constructor.name;
  }
}
