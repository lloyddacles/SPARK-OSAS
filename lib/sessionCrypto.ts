const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error(
    "CRITICAL: SESSION_SECRET must be set in environment (min 32 characters). " +
    "Generate one with: openssl rand -hex 32"
  );
}

/**
 * Signs a payload string using HMAC-SHA256 via Web Crypto API.
 * Returns the payload concatenated with its signature (payload.signature).
 */
export async function signSession(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SESSION_SECRET);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(payload)
  );
  
  // Convert signature to hex
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${payload}.${hashHex}`;
}

/**
 * Verifies a token's HMAC-SHA256 signature.
 * Returns the original payload if verification succeeds, or null if tampered.
 */
export async function verifySession(token: string): Promise<string | null> {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    
    const signatureHex = parts.pop()!;
    const payload = parts.join(".");
    
    const expectedToken = await signSession(payload);
    const expectedSignatureHex = expectedToken.split(".").pop()!;
    
    if (signatureHex === expectedSignatureHex) {
      return payload;
    }
  } catch (err) {
    console.error("Session verification failure:", err);
  }
  return null;
}
