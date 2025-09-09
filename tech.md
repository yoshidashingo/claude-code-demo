# 技術仕様書

## テクノロジースタック

### フロントエンド
| カテゴリ | 技術 | バージョン | 選定理由 |
|---------|------|-----------|---------|
| フレームワーク | React | 18.x | コンポーネントベース、豊富なエコシステム |
| 言語 | TypeScript | 5.x | 型安全性、開発効率向上 |
| 状態管理 | Zustand | 4.x | シンプル、軽量、TypeScript対応 |
| UIライブラリ | Tailwind CSS | 3.x | 高速開発、レスポンシブ対応 |
| ビルドツール | Vite | 5.x | 高速ビルド、優れたDX |
| ドラッグ&ドロップ | @dnd-kit | 6.x | React向け、モバイル対応良好 |
| HTTP クライアント | Axios | 1.x | インターセプター、エラーハンドリング |
| WebSocket | Socket.io-client | 4.x | 自動再接続、イベントベース |

### バックエンド
| カテゴリ | 技術 | バージョン | 選定理由 |
|---------|------|-----------|---------|
| ランタイム | Node.js | 20.x LTS | JavaScript統一、高パフォーマンス |
| フレームワーク | Express | 4.x | シンプル、軽量、柔軟 |
| 言語 | TypeScript | 5.x | 型安全性、フロントエンドと統一 |
| ORM | Prisma | 5.x | 型安全、マイグレーション管理 |
| 認証 | jsonwebtoken | 9.x | JWT標準実装 |
| パスワード | bcrypt | 5.x | 業界標準のハッシュ化 |
| WebSocket | Socket.io | 4.x | クライアントと統一、フォールバック対応 |
| バリデーション | zod | 3.x | TypeScript統合、スキーマ検証 |

### データベース
| カテゴリ | 技術 | バージョン | 選定理由 |
|---------|------|-----------|---------|
| メインDB | PostgreSQL | 15.x | ACID準拠、高信頼性 |
| セッションストア | Redis | 7.x | 高速、インメモリ |
| ORM | Prisma | 5.x | 型安全、自動マイグレーション |

### インフラ・デプロイ
| カテゴリ | 技術 | 選定理由 |
|---------|------|---------|
| ホスティング | Vercel (Frontend) | 自動デプロイ、エッジ配信、無料枠 |
| バックエンド | Railway/Render | Node.js対応、PostgreSQL統合、WebSocket対応 |
| データベース | Supabase | PostgreSQL、無料枠、リアルタイム機能 |
| CDN | Cloudflare | グローバル配信、DDoS対策 |

### 開発ツール
| カテゴリ | 技術 | 用途 |
|---------|------|------|
| パッケージ管理 | pnpm | 高速、ディスク効率的 |
| リンター | ESLint | コード品質管理 |
| フォーマッター | Prettier | コードフォーマット統一 |
| テスト | Vitest + Testing Library | 単体テスト、統合テスト |
| E2Eテスト | Playwright | ブラウザ自動テスト |
| API ドキュメント | Swagger/OpenAPI | API仕様書自動生成 |
| Git フック | Husky + lint-staged | コミット前の品質チェック |

## 開発環境要件

### 必須ソフトウェア
- Node.js 20.x LTS
- pnpm 8.x
- Git 2.x
- VS Code (推奨)

### VS Code 拡張機能（推奨）
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prisma

## API仕様

### エンドポイント一覧

#### 認証関連
```yaml
POST /api/auth/register
  body:
    email: string
    password: string
  response:
    token: string
    user: User

POST /api/auth/login
  body:
    email: string
    password: string
  response:
    token: string
    user: User

POST /api/auth/logout
  headers:
    Authorization: Bearer {token}
  response:
    message: string

GET /api/auth/me
  headers:
    Authorization: Bearer {token}
  response:
    user: User
```

#### タスク関連
```yaml
GET /api/tasks
  headers:
    Authorization: Bearer {token}
  response:
    tasks: Task[]

POST /api/tasks
  headers:
    Authorization: Bearer {token}
  body:
    content: string
  response:
    task: Task

PUT /api/tasks/:id
  headers:
    Authorization: Bearer {token}
  body:
    content?: string
    completed?: boolean
  response:
    task: Task

DELETE /api/tasks/:id
  headers:
    Authorization: Bearer {token}
  response:
    message: string

PUT /api/tasks/reorder
  headers:
    Authorization: Bearer {token}
  body:
    taskId: string
    newOrder: number
  response:
    tasks: Task[]
```

## データベース設計

### スキーマ定義（Prisma）
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  tasks        Task[]
}

model Task {
  id        String   @id @default(uuid())
  content   String
  completed Boolean  @default(false)
  order     Float    
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId, order])
}
```

## セキュリティ要件

### 環境変数
```bash
# .env.example
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=https://yourdomain.com
```

### セキュリティヘッダー
```javascript
// Helmet.js による設定
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}
```

## パフォーマンス目標

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5秒
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### API レスポンスタイム
- 認証エンドポイント: < 200ms
- タスク取得: < 100ms
- タスク作成/更新: < 150ms

### 同時接続数
- WebSocket: 10,000接続/サーバー
- HTTP: 1,000リクエスト/秒

## 監視・ログ

### アプリケーション監視
- Sentry: エラートラッキング
- Google Analytics: ユーザー行動分析

### インフラ監視
- Uptime監視: Better Uptime
- パフォーマンス: Datadog/New Relic

### ログ管理
- アプリケーションログ: Winston
- アクセスログ: Morgan
- エラーログ: Sentry

## CI/CD パイプライン

### GitHub Actions
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    - Lint チェック
    - TypeScript型チェック
    - 単体テスト実行
    - E2Eテスト実行
    
  build:
    - Docker イメージビルド
    - 依存関係の脆弱性チェック
    
  deploy:
    - Vercel (Frontend)
    - Railway/Render (Backend)
```

## 制約事項

### 技術的制約
- ブラウザ: IE11非対応
- JavaScript必須（プログレッシブエンハンスメント非対応）
- オンライン接続必須（オフライン時は読み取り専用）

### スケーラビリティ制約
- 1ユーザーあたりのタスク数上限: 10,000
- タスク内容の文字数上限: 500文字
- ファイルアップロード: 非対応

### サードパーティ依存
- 認証: 自前実装（Auth0等の外部サービス非使用）
- 決済: 非対応（無料サービス）
- メール送信: 非対応（パスワードリセット機能なし）