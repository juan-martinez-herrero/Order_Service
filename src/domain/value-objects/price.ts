import { Currency } from './currency.ts'

class CurrencyMismatch extends Error {
    constructor() {
        super("Cannot add prices with different currencies")
        this.name = "CurrencyMismatch"
    }
}

class InvalidQuantity extends Error {
    constructor() {
        super("Quantity must be a positive integer")
        this.name = "InvalidQuantity"
    }
}

export class Price {
    private constructor(readonly amount: number, readonly currency: Currency) { }

    static create(amount: number, currency: Currency) {
        if (!Number.isFinite(amount) || amount < 0) throw new Error("Amount must be a positive number")
        const rounded = Math.round(amount * 100) / 100
        return new Price(rounded, currency)
    }
    add(other: Price) {
        if (this.currency !== other.currency)
            throw new CurrencyMismatch()
        return Price.create(this.amount + other.amount, this.currency)
    }
    multiply(qty: number) {
        if (!Number.isInteger(qty) || qty <= 0) throw new InvalidQuantity()
        return Price.create(this.amount * qty, this.currency)
    }
    equals(other: Price) {
        return this.amount === other.amount && this.currency === other.currency
    }
}