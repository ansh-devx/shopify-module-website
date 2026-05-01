import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";

const REGION = process.env.AWS_REGION || "ap-south-1";
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || "";
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || "";
const SERVICE_USERNAME = process.env.COGNITO_SERVICE_USERNAME || "";
const SERVICE_PASSWORD = process.env.COGNITO_SERVICE_PASSWORD || "";

// Refresh ~5 minutes before expiry to avoid using a token that expires mid-request.
const SAFETY_BUFFER_MS = 5 * 60 * 1000;

let cachedToken: { idToken: string; expiresAt: number } | null = null;
let inFlight: Promise<string> | null = null;

function computeSecretHash(username: string): string {
  return createHmac("sha256", CLIENT_SECRET)
    .update(username + CLIENT_ID)
    .digest("base64");
}

async function fetchNewIdToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET || !SERVICE_USERNAME || !SERVICE_PASSWORD) {
    throw new Error(
      "Cognito service-user credentials are not configured. Set COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_SERVICE_USERNAME, COGNITO_SERVICE_PASSWORD."
    );
  }

  const client = new CognitoIdentityProviderClient({ region: REGION });
  const result = await client.send(
    new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: SERVICE_USERNAME,
        PASSWORD: SERVICE_PASSWORD,
        SECRET_HASH: computeSecretHash(SERVICE_USERNAME),
      },
    })
  );

  const idToken = result.AuthenticationResult?.IdToken;
  const expiresInSec = result.AuthenticationResult?.ExpiresIn ?? 3600;
  if (!idToken) {
    throw new Error("Cognito did not return an IdToken");
  }

  cachedToken = {
    idToken,
    expiresAt: Date.now() + expiresInSec * 1000,
  };
  return idToken;
}

export async function getCognitoIdToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + SAFETY_BUFFER_MS) {
    return cachedToken.idToken;
  }
  if (inFlight) return inFlight;

  inFlight = fetchNewIdToken().finally(() => {
    inFlight = null;
  });
  return inFlight;
}
