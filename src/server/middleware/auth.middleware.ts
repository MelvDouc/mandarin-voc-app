import authService from "$/server/services/auth.service.js";
import type { NextFunction, Request, Response } from "express";

function checkAuth(req: Request, res: Response, next: NextFunction) {
  const email = authService.decodeAuthToken(req.cookies["auth_token"] ?? "");

  if (!email) {
    res.status(401).end();
    return;
  }

  next();
}

export default {
  checkAuth
};