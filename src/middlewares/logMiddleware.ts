import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

import Log from '../models/logModel';

export const logRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const requestId = uuidv4();
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();
  let statusCode: number;
  let movieId: string | null = null;

  if (req.params.id) {
    movieId = req.params.id;
  }

  res.on('finish', async () => {
    statusCode = res.statusCode;

    const logEntry = new Log({
      requestId,
      method,
      url,
      statusCode,
      timestamp,
      duration: Date.now() - start,
      movieId,
    });

    await logEntry.save();
  });

  next();
};
