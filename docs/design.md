# 機能設計書 - タスク管理アプリケーション

## 1. システムアーキテクチャ

### 全体構成
```
┌─────────────────────────────────────────────────────┐
│                   クライアント層                      │
│  ┌─────────────────────────────────────────────┐   │
│  │           React + TypeScript                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │   Pages   │ │Components│ │  Hooks   │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │  Context  │ │  Utils   │ │ Services │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                           ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────┐
│                    API層                            │
│  ┌─────────────────────────────────────────────┐   │
│  │         Express + TypeScript                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │  Routes   │ │Controllers│ │Middleware│  │   │
│  │  └──────────┘ └──────────┘ └──────────┘  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ Services  │ │  Models  │ │Validators│  │   │
│  │  └──────────┘ └──────────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│                   データ層                          │
│  ┌─────────────────────────────────────────────┐   │
│  │              PostgreSQL                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │  Users    │ │  Tasks   │ │Categories│  │   │
│  │  └──────────┘ └──────────┘ └──────────┘  │   │
│  │  ┌──────────┐ ┌──────────┐                │   │
│  │  │   Tags    │ │ TaskTags │                │   │
│  │  └──────────┘ └──────────┘                │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 2. 認証機能設計

### 認証フロー
```
┌──────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│Client│     │  API     │     │Auth     │     │Database  │
└──┬───┘     └────┬─────┘     └────┬────┘     └────┬─────┘
   │              │                 │                │
   │ 1. 登録リクエスト              │                │
   ├─────────────>│                 │                │
   │              │ 2. バリデーション │                │
   │              ├────────────────>│                │
   │              │                 │ 3. パスワード    │
   │              │                 │   ハッシュ化    │
   │              │                 ├───────────────>│
   │              │                 │                │ 4. ユーザー保存
   │              │                 │<───────────────┤
   │              │ 5. JWT生成      │                │
   │              │<────────────────┤                │
   │ 6. トークン返却                 │                │
   │<─────────────┤                 │                │
   │              │                 │                │
```

### JWT構造
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "uuid",
    "email": "user@example.com",
    "iat": 1234567890,
    "exp": 1234571490
  },
  "signature": "HMACSHA256(...)"
}
```

## 3. タスク管理機能設計

### タスクのライフサイクル
```
     作成
       ↓
   [未着手] ─────> [進行中] ─────> [完了]
       ↑              ↓              ↓
       └──────────────┘          [削除]
```

### データモデル

#### Users
- id: UUID (PK)
- email: string (unique)
- username: string
- password_hash: string
- created_at: timestamp
- updated_at: timestamp

#### Tasks
- id: UUID (PK)
- user_id: UUID (FK → Users)
- title: string
- description: text
- status: enum ('pending', 'in_progress', 'completed')
- priority: enum ('low', 'medium', 'high')
- due_date: date
- category_id: UUID (FK → Categories)
- created_at: timestamp
- updated_at: timestamp

#### Categories
- id: UUID (PK)
- user_id: UUID (FK → Users)
- name: string
- color: string
- created_at: timestamp
- updated_at: timestamp

#### Tags
- id: UUID (PK)
- user_id: UUID (FK → Users)
- name: string
- created_at: timestamp

#### TaskTags (中間テーブル)
- task_id: UUID (FK → Tasks)
- tag_id: UUID (FK → Tags)
- PRIMARY KEY (task_id, tag_id)

## 4. API設計

### 認証エンドポイント
- POST /api/auth/register - ユーザー登録
- POST /api/auth/login - ログイン
- POST /api/auth/logout - ログアウト
- POST /api/auth/refresh - トークンリフレッシュ

### タスクエンドポイント
- GET /api/tasks - タスク一覧取得
- POST /api/tasks - タスク作成
- GET /api/tasks/:id - タスク詳細取得
- PUT /api/tasks/:id - タスク更新
- DELETE /api/tasks/:id - タスク削除
- PATCH /api/tasks/:id/status - ステータス更新

### カテゴリーエンドポイント
- GET /api/categories - カテゴリー一覧取得
- POST /api/categories - カテゴリー作成
- PUT /api/categories/:id - カテゴリー更新
- DELETE /api/categories/:id - カテゴリー削除

### タグエンドポイント
- GET /api/tags - タグ一覧取得
- POST /api/tags - タグ作成
- DELETE /api/tags/:id - タグ削除

## 5. 画面設計

### 画面一覧
1. ログイン画面
2. 登録画面
3. ダッシュボード
4. タスク一覧画面
5. タスク詳細/編集画面
6. カテゴリー管理画面
7. プロフィール設定画面

### 画面遷移図
```
[ログイン] ←→ [登録]
    ↓
[ダッシュボード]
    ├── [タスク一覧]
    │     └── [タスク詳細/編集]
    ├── [カテゴリー管理]
    └── [プロフィール設定]
```

## 6. コンポーネント設計

### 主要コンポーネント

#### Layout Components
- Header - ナビゲーションバー
- Sidebar - サイドメニュー
- Footer - フッター

#### Auth Components
- LoginForm - ログインフォーム
- RegisterForm - 登録フォーム
- PrivateRoute - 認証保護ルート

#### Task Components
- TaskList - タスク一覧
- TaskItem - タスクアイテム
- TaskForm - タスク作成/編集フォーム
- TaskFilter - フィルター
- TaskSort - ソート

#### Category Components
- CategoryList - カテゴリー一覧
- CategoryForm - カテゴリー作成/編集
- CategoryBadge - カテゴリーバッジ

#### Tag Components
- TagInput - タグ入力
- TagList - タグ一覧
- TagCloud - タグクラウド

#### Common Components
- Button - ボタン
- Input - 入力フィールド
- Select - セレクトボックス
- Modal - モーダル
- Alert - アラート
- Spinner - ローディング

## 7. 状態管理設計

### Context構造
```typescript
interface AuthContext {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  register: (data: RegisterData) => Promise<void>
  isAuthenticated: boolean
}

interface TaskContext {
  tasks: Task[]
  loading: boolean
  error: Error | null
  fetchTasks: () => Promise<void>
  createTask: (task: CreateTaskData) => Promise<void>
  updateTask: (id: string, task: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  filterTasks: (filters: TaskFilters) => void
  sortTasks: (sortBy: SortOption) => void
}

interface CategoryContext {
  categories: Category[]
  fetchCategories: () => Promise<void>
  createCategory: (category: CreateCategoryData) => Promise<void>
  updateCategory: (id: string, category: UpdateCategoryData) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}
```

## 8. セキュリティ設計

### 実装するセキュリティ対策
1. **認証・認可**
   - JWT トークンベース認証
   - リフレッシュトークンの実装
   - ロールベースアクセス制御（将来実装）

2. **データ保護**
   - パスワードのbcryptハッシュ化
   - HTTPSの強制
   - 機密情報の環境変数管理

3. **入力検証**
   - フロントエンド・バックエンド両方での検証
   - SQLインジェクション対策（パラメータ化クエリ）
   - XSS対策（入力のサニタイズ）

4. **API保護**
   - レート制限
   - CORS設定
   - CSRF対策

## 9. エラー処理設計

### エラーカテゴリ
1. **認証エラー** (401)
   - 無効なトークン
   - トークン期限切れ

2. **認可エラー** (403)
   - アクセス権限なし

3. **バリデーションエラー** (400)
   - 必須フィールド不足
   - 形式不正

4. **リソースエラー** (404)
   - リソース未発見

5. **サーバーエラー** (500)
   - 内部サーバーエラー

### エラーレスポンス形式
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {
      "field": "エラー詳細"
    }
  }
}
```

## 10. パフォーマンス最適化設計

### フロントエンド最適化
- React.memoによるコンポーネント最適化
- useMemo/useCallbackによる再計算防止
- 仮想スクロール（大量タスク表示時）
- 画像の遅延読み込み
- コード分割とdynamic import

### バックエンド最適化
- データベースインデックス設計
- クエリ最適化
- キャッシング戦略
- ペイジネーション実装
- N+1問題の回避

### ネットワーク最適化
- APIレスポンスの圧縮
- CDNの活用
- HTTPキャッシュヘッダーの設定