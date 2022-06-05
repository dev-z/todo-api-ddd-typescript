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

export class ConflictError extends DomainError {
  constructor(public readonly operation: string) {
    super(`${operation} caused a conflict`);
    this.name = this.constructor.name;
  }
}

export class InvalidInputError extends DomainError {
  constructor(public readonly field: string, public readonly reason: string) {
    super(`${field} is invalid: ${reason}`);
    this.name = this.constructor.name;
  }
}

export class ServiceUnavailableError extends DomainError {
  constructor(public readonly service: string) {
    super(`${service} unavailable`);
    this.name = this.constructor.name;
  }
}
