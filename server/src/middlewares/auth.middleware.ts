import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json({ message: "Unauthorized" });
      return 
    }

    req.userId = session.user.id;
    next();
  } catch (error: unknown) {
    console.error("Auth error:", error);

    const message = error instanceof Error ? error.message : "Unauthorized";

    res.status(401).json({ message });
  }
};
