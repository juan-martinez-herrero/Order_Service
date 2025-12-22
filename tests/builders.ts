import { Price } from "../src/domain/value-objects/price";
import {Quantity} from "../src/domain/value-objects/quantity";
import {SKU} from "../src/domain/value-objects/sku";

export const anyEUR = (n = 10) => Price.create(n, "EUR");
export const qty = (n = 1) => Quantity.create(n);
export const sku = (v = "ABC-1") => sku.create(v);