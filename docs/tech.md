# 技術仕様書 - タスク管理アプリケーション

## 1. テクノロジースタック

### フロントエンド
- **Framework**: React 18.3.x
- **Language**: TypeScript 5.x
- **State Management**: React Context API + useReducer
- **Routing**: React Router v6
- **Styling**: CSS Modules + Tailwind CSS 3.x
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date Handling**: date-fns
- **Icons**: React Icons

### バックエンド
- **Runtime**: Node.js 20.x LTS
- **Framework**: Express 4.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma
- **Database**: PostgreSQL 15.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **CORS**: cors
- **Environment Variables**: dotenv
- **Logging**: Winston

### 開発ツール
- **Package Manager**: npm
- **Build Tool**: Vite
- **Linter**: ESLint
- **Formatter**: Prettier
- **Testing**: Jest + React Testing Library
- **API Testing**: Supertest
- **Version Control**: Git
- **API Documentation**: Swagger/OpenAPI

### デプロイメント・インフラ
- **Hosting (Frontend)**: Vercel / Netlify
- **Hosting (Backend)**: Railway / Render
- **Database**: Supabase / Neon (PostgreSQL)
- **Monitoring**: Sentry (エラートラッキング)
- **CI/CD**: GitHub Actions

## 2. システム要件

### 最小要件
- **Node.js**: 20.x 以上
- **npm**: 10.x 以上
- **PostgreSQL**: 15.x 以上
- **RAM**: 4GB 以上
- **Storage**: 1GB 以上

### 推奨要件
- **RAM**: 8GB 以上
- **Storage**: 5GB 以上
- **CPU**: 2コア以上

## 3. 依存パッケージ詳細

### フロントエンド依存関係
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^3.0.0",
    "react-icons": "^5.0.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "prettier": "^3.2.0"
  }
}
```

### バックエンド依存関係
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "@prisma/client": "^5.8.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "joi": "^17.11.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "winston": "^3.11.0",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/cors": "^2.8.0",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "prisma": "^5.8.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "supertest": "^6.3.0",
    "@types/supertest": "^6.0.0"
  }
}
```

## 4. データベース設計

### Prisma Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String     @id @default(uuid())
  email        String     @unique
  username     String
  passwordHash String     @map("password_hash")
  createdAt    DateTime   @default(now()) @map("created_at")
  updatedAt    DateTime   @updatedAt @map("updated_at")
  
  tasks        Task[]
  categories   Category[]
  tags         Tag[]
  
  @@map("users")
}

model Task {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?  @map("due_date")
  categoryId  String?    @map("category_id")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")
  
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category?  @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  tags        TaskTag[]
  
  @@index([userId])
  @@index([categoryId])
  @@index([status])
  @@index([dueDate])
  @@map("tasks")
}

model Category {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  name      String
  color     String   @default("#6B7280")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks     Task[]
  
  @@unique([userId, name])
  @@map("categories")
}

model Tag {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks     TaskTag[]
  
  @@unique([userId, name])
  @@map("tags")
}

model TaskTag {
  taskId String @map("task_id")
  tagId  String @map("tag_id")
  
  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([taskId, tagId])
  @@map("task_tags")
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## 5. API仕様

### 認証ヘッダー
```
Authorization: Bearer <JWT_TOKEN>
```

### エラーレスポンス形式
```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
}
```

### 主要エンドポイント仕様

#### POST /api/auth/register
```typescript
// Request
interface RegisterRequest {
  email: string
  username: string
  password: string
}

// Response
interface RegisterResponse {
  user: {
    id: string
    email: string
    username: string
  }
  token: string
}
```

#### POST /api/auth/login
```typescript
// Request
interface LoginRequest {
  email: string
  password: string
}

// Response
interface LoginResponse {
  user: {
    id: string
    email: string
    username: string
  }
  token: string
}
```

#### GET /api/tasks
```typescript
// Query Parameters
interface TasksQuery {
  status?: 'pending' | 'in_progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  categoryId?: string
  tag?: string
  search?: string
  sortBy?: 'createdAt' | 'dueDate' | 'priority'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Response
interface TasksResponse {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

## 6. セキュリティ仕様

### 認証・認可
- JWT有効期限: 7日間
- リフレッシュトークン: 30日間（将来実装）
- パスワード最小長: 8文字
- パスワード必須要件: 英数字混在

### API保護
```typescript
// Rate Limiting設定
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  standardHeaders: true,
  legacyHeaders: false
}

// CORS設定
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}
```

### データ保護
- bcryptラウンド数: 10
- JWT署名アルゴリズム: HS256
- HTTPS強制（本番環境）
- SQLインジェクション対策: Prismaのパラメータ化クエリ
- XSS対策: 入力のサニタイズ、CSPヘッダー

## 7. 環境変数

### フロントエンド (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=タスク管理アプリ
```

### バックエンド (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

## 8. ビルド・デプロイ設定

### フロントエンドビルド
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "typecheck": "tsc --noEmit"
  }
}
```

### バックエンドビルド
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:push": "prisma db push",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "typecheck": "tsc --noEmit"
  }
}
```

## 9. テスト戦略

### テストカバレッジ目標
- ユニットテスト: 80%以上
- 統合テスト: 主要APIエンドポイント100%
- E2Eテスト: クリティカルパス100%

### テストツール
- **ユニットテスト**: Jest
- **コンポーネントテスト**: React Testing Library
- **APIテスト**: Supertest
- **E2Eテスト**: Playwright（将来実装）

## 10. パフォーマンス目標

### レスポンスタイム
- APIレスポンス: 95パーセンタイル < 500ms
- ページロード: < 2秒
- First Contentful Paint: < 1.8秒

### スケーラビリティ
- 同時接続ユーザー: 1,000人
- データベース接続プール: 20
- APIレート制限: 100req/15min/IP

## 11. 監視・ロギング

### ロギングレベル
- **error**: システムエラー、例外
- **warn**: 警告、非推奨の使用
- **info**: 重要なイベント、APIアクセス
- **debug**: デバッグ情報（開発環境のみ）

### 監視項目
- APIレスポンスタイム
- エラー率
- データベース接続数
- メモリ使用量
- CPU使用率

## 12. 開発規約

### Git ブランチ戦略
- main: 本番環境
- develop: 開発環境
- feature/*: 機能開発
- bugfix/*: バグ修正
- hotfix/*: 緊急修正

### コミットメッセージ規約
```
<type>: <subject>

<body>

<footer>
```

Types:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: コードスタイル
- refactor: リファクタリング
- test: テスト
- chore: ビルド、補助ツール