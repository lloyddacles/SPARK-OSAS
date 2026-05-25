function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    console.error(
      "CRITICAL: SESSION_SECRET not set or too short (min 32 chars). " +
      "Sessions will be invalid. Set it in your environment variables."
    );
    return null;
  }
  return secret;
}

export async function signSession(payload: string): Promise<string | null> {
  const SESSION_SECRET = getSecret();
  if (!SESSION_SECRET) return null;

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
  
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${payload}.${hashHex}`;
}

export async function verifySession(token: string): Promise<string | null> {
  try {
    const SESSION_SECRET = getSecret();
    if (!SESSION_SECRET) return null;

    const parts = token.split(".");
    if (parts.length < 2) return null;
    
    const signatureHex = parts.pop()!;
    const payload = parts.join(".");
    
    const expectedToken = await signSession(payload);
    if (!expectedToken) return null;
    const expectedSignatureHex = expectedToken.split(".").pop()!;
    
    if (signatureHex === expectedSignatureHex) {
      return payload;
    }
  } catch (err) {
    console.error("Session verification failure:", err);
  }
  return null;
}
