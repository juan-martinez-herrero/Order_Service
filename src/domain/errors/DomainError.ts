export class DomainError extends Error {}
export class InvalidState extends DomainError {}

export class InvalidPrice extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidPrice";
    }
}

export class CurrencyMismatch extends DomainError {    
    constructor(message: string = "Currency mismatch") {
        super(message);
        this.name = "CurrencyMismatch";
    }

}