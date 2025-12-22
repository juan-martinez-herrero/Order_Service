import {it, expect, describe} from 'vitest';
import { Price } from '../../src/domain/value-objects/price.ts';

it("sumar es conmutativo (mismo currency)", () => {
    const a = Price.create(12.34, "EUR");
    const b = Price.create(5.67, "EUR");
    expect(a.add(b).amount).toBeCloseTo(b.add(a).amount, 2);
});