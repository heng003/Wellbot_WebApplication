// generate-keys.js
const jwt = require("jsonwebtoken");

const secret = "Rz9Fgqv8bYkmnLkV7wTxm3oPiUZrNWfKnxPL12345";

// Generate anon key
const anon = jwt.sign({ role: "anon", iss: "supabase" }, secret, {
  algorithm: "HS256",
  expiresIn: "10y",
});

// Generate service role key
const service = jwt.sign({ role: "service_role", iss: "supabase" }, secret, {
  algorithm: "HS256",
  expiresIn: "10y",
});

console.log("ANON_KEY=", anon);
console.log("SERVICE_ROLE_KEY=", service);