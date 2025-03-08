/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

let express: any;

export function authorizeRoles(...allowedRoles: string[]) {
  if (!express) {
    try {
      express = require('express');
    } catch (error) {
      throw new Error(
        "RBAC middleware is being used, but 'express' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user data found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Insufficient Permissions' });
    }

    next();
  };
}
