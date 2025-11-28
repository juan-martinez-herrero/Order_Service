import { Price } from "../../domain/value-objects/Price.ts";
import { SKU } from "../../domain/value-objects/SKU.ts";
import { Currency } from "../../domain/value-objects/Currency.ts";

export interface PricingService {
    getCurrentPrice(sku: SKU, currency: Currency): Promise<Price | null>;
}