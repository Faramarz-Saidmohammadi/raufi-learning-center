import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 12) {
  console.error("Set ADMIN_PASSWORD to a password containing at least 12 characters.");
  process.exit(1);
}

const iterations = 210_000;
const salt = randomBytes(16);
const derivedKey = pbkdf2Sync(password, salt, iterations, 32, "sha256");
const encode = (value) => value.toString("base64url");
process.stdout.write(`pbkdf2-sha256$${iterations}$${encode(salt)}$${encode(derivedKey)}\n`);
