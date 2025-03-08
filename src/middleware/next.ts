/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

let next: any;
let verifyToken: any;
let verifyRefreshToken: any;

export function authenticateToken(
  handler: (req: any, res: any) => void,
  accessSecret: string,
  refreshSecret: string,
  allowRefreshToken: boolean = false,
) {
  if (!next) {
    try {
      next = require('next');
    } catch (error) {
      throw new Error(
        "Next.js middleware is being used, but 'next' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyToken) {
    ({ verifyToken } = require('../jwt'));
  }
  if (!verifyRefreshToken) {
    ({ verifyRefreshToken } = require('../jwt'));
  }

  return (req: any, res: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const [, token] = authHeader.split(' ');
    let decoded;

    if (allowRefreshToken) {
      decoded = verifyRefreshToken(token, refreshSecret);
    } else {
      decoded = verifyToken(token, accessSecret);
    }

    if (!decoded) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid or expired token' });
    }

    req.user = decoded;
    return handler(req, res);
  };
}
