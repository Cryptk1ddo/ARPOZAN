import assert from "assert";
import { calculateTotal } from "../lib/cartHelpers.js";

const sample = [
  { id: "a", price: 100, quantity: 2 },
  { id: "b", price: 50, quantity: 1 },
  { id: "c", price: 0, quantity: 5 },
];

assert.strictEqual(calculateTotal(sample), 250);
console.log("calculateTotal sample passed");

// edge cases
assert.strictEqual(calculateTotal([]), 0);
assert.strictEqual(calculateTotal(null), 0);
console.log("edge cases passed");
