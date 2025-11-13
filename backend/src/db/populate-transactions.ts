import client from "../db/db"; // Import PostgreSQL client.

// TUNABLE CONSTANTS
// The number of days between the earliest possible generated transaction and today.
const MAX_DAY_BEFORE = 365;
const MAX_AMOUNT = 15; // The maximum amount for a transaction.
const ITEM_NAME_LENGTH = 6; // The number of characters for item names.
const TRANSACTIONS_NUMBER = 120; // The number of transactions to populate.
const USER_ID = 3; // The user_id of the transactions to populate.

// CONSTANTS
const CATEGORIES = ["Food", "Shopping", "Subscriptions", "Transportation", "Other"] as const;
const QUERY =
  "INSERT INTO transactions(user_id, item_name, amount, category_name, date) " +
  "VALUES ($1, $2, $3, $4, LOCALTIMESTAMP - $5::INTERVAL)";

/**
 * Returns a random integer in the range [0, end).
 *
 * @param end the end of the range of possible values, exclusive
 * @return a random integer in the given range
 */
function randInt(end: number): number {
  return Math.floor(Math.random() * end);
}

for (let i = 0; i < TRANSACTIONS_NUMBER; i++) {
  const item_name = randInt(Math.pow(16, ITEM_NAME_LENGTH))
    .toString(16)
    .padStart(ITEM_NAME_LENGTH, "0"); // Random hex string.
  const amount = randInt(MAX_AMOUNT * 100) / 100; // Value round to cents
  const category_name = CATEGORIES[randInt(CATEGORIES.length)];
  const day_before = randInt(MAX_DAY_BEFORE) + " days";
  client.query(QUERY, [USER_ID, item_name, amount, category_name, day_before]);
}
