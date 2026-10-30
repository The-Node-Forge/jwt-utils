import jwt, { Algorithm, SignOptions } from 'jsonwebtoken';

/** HMAC algorithms; the only ones valid for the shared-secret API of this library. */
const HMAC_ALGORITHMS: Algorithm[] = ['HS256', 'HS384', 'HS512'];

export interface TokenPayload {
  id: string;
  role: string;
}

export interface TokenOptions extends SignOptions {
  accessExpiresIn?: string;
  refreshExpiresIn?: string;
}

/**
 * Generates a signed access token and refresh token for the given payload.
 *
 * @param payload - Claims to embed in both tokens.
 * @param accessSecret - Secret used to sign the access token.
 * @param refreshSecret - Secret used to sign the refresh token. Must differ from
 * `accessSecret`, otherwise a refresh token would also verify as an access token.
 * @param options - Expiry, audience, issuer and algorithm overrides. `algorithm`
 * must be one of `HS256`, `HS384` or `HS512`.
 * @throws If the secrets are identical or `options.algorithm` is not an HMAC
 * algorithm (e.g. `none`).
 */
export function generateTokens(
  payload: TokenPayload,
  accessSecret: string,
  refreshSecret: string,
  options?: TokenOptions,
) {
  if (accessSecret === refreshSecret) {
    throw new Error(
      'accessSecret and refreshSecret must be different, otherwise a refresh token would be accepted as an access token.',
    );
  }

  if (options?.algorithm && !HMAC_ALGORITHMS.includes(options.algorithm)) {
    throw new Error(
      `Unsupported algorithm '${options.algorithm}'. Use one of: ${HMAC_ALGORITHMS.join(', ')}.`,
    );
  }

  const accessExpiresIn: string | number =
    options?.accessExpiresIn !== undefined ? options.accessExpiresIn : '15m';

  const refreshExpiresIn: string | number =
    options?.refreshExpiresIn !== undefined ? options.refreshExpiresIn : '1d';

  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiresIn,
    algorithm: options?.algorithm ?? 'HS256',
    audience: options?.audience ?? 'my-app',
    issuer: options?.issuer ?? 'auth-service',
  } as SignOptions);

  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiresIn,
    algorithm: options?.algorithm ?? 'HS256',
    audience: options?.audience ?? 'my-app',
    issuer: options?.issuer ?? 'auth-service',
  } as SignOptions);

  return { accessToken, refreshToken };
}

/**
 * Verifies an access token. Only HMAC (`HS256`/`HS384`/`HS512`) tokens are accepted.
 *
 * @param token - The JWT to verify.
 * @param accessSecret - Secret the access token was signed with.
 * @param options - Optional expected `audience` and `issuer`.
 * @returns The decoded payload, or `null` if verification fails.
 */
export function verifyToken(
  token: string,
  accessSecret: string,
  options?: { audience?: string; issuer?: string },
) {
  try {
    return jwt.verify(token, accessSecret, {
      audience: options?.audience,
      issuer: options?.issuer,
      algorithms: HMAC_ALGORITHMS,
    });
  } catch (err: any) {
    console.error('❌ JWT Verification Error:', err.message);
    return null;
  }
}

/**
 * Verifies a refresh token. Only HMAC (`HS256`/`HS384`/`HS512`) tokens are accepted.
 *
 * @param token - The JWT to verify.
 * @param refreshSecret - Secret the refresh token was signed with.
 * @param options - Optional expected `audience` and `issuer`.
 * @returns The decoded payload, or `null` if verification fails.
 */
export function verifyRefreshToken(
  token: string,
  refreshSecret: string,
  options?: { audience?: string; issuer?: string },
) {
  try {
    return jwt.verify(token, refreshSecret, {
      audience: options?.audience,
      issuer: options?.issuer,
      algorithms: HMAC_ALGORITHMS,
    });
  } catch (err: any) {
    console.error('❌ JWT Refresh Token Verification Error:', err.message);
    return null;
  }
}
