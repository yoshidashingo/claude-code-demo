import { Request, Response, NextFunction } from 'express'

// 開発用のモック認証ミドルウェア
// 本番環境では実際の認証機能に置き換える
export const mockAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // モックユーザー情報を設定
  req.user = {
    userId: 'mock-user-id-123',
    email: 'user@example.com'
  }
  next()
}