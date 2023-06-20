import config from 'config'
import jwt, { SignOptions } from 'jsonwebtoken'

export const signJwt = (
  payload: Object,
  keyName: 'accessTokenKey' | 'refreshTokenKey',
  options: SignOptions
) => {
  const key = config.get<string>(keyName)
  return jwt.sign(payload, key, {
    ...(options && options),
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: 'accessTokenKey' | 'refreshTokenKey'
): T | null => {
  try {
    const key = config.get<string>(keyName)
    const decoded = jwt.verify(token, key) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};