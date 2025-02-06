import { Request, Response, NextFunction } from 'express';

const USERNAME = process.env.BASIC_AUTH_USER || 'user';
const PASSWORD = process.env.BASIC_AUTH_PASS || '123';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.status(401).json({ message: 'Autenticação necessária!' });
    return;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'utf-8'
  );

  const [username, password] = credentials.split(':');

  if (username !== USERNAME || password !== PASSWORD) {
    res.status(401).json({ message: 'Credenciais inválidas!' });
    return;
  }

  next();
};
