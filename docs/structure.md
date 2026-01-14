# アプリ構造定義書 - タスク管理アプリケーション

## 1. プロジェクト構造

```
task-management-app/
├── frontend/                    # フロントエンドアプリケーション
│   ├── public/                 # 静的ファイル
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/            # 画像、フォント等
│   │   ├── components/        # 再利用可能なコンポーネント
│   │   │   ├── common/       # 共通コンポーネント
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Alert.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   ├── layout/       # レイアウトコンポーネント
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── auth/         # 認証関連
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── PrivateRoute.tsx
│   │   │   ├── task/         # タスク関連
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskItem.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   ├── TaskFilter.tsx
│   │   │   │   └── TaskSort.tsx
│   │   │   ├── category/     # カテゴリー関連
│   │   │   │   ├── CategoryList.tsx
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   └── CategoryBadge.tsx
│   │   │   └── tag/          # タグ関連
│   │   │       ├── TagInput.tsx
│   │   │       ├── TagList.tsx
│   │   │       └── TagCloud.tsx
│   │   ├── contexts/          # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   ├── TaskContext.tsx
│   │   │   └── CategoryContext.tsx
│   │   ├── hooks/             # カスタムフック
│   │   │   ├── useAuth.ts
│   │   │   ├── useTasks.ts
│   │   │   ├── useCategories.ts
│   │   │   └── useDebounce.ts
│   │   ├── pages/             # ページコンポーネント
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   ├── Categories.tsx
│   │   │   └── Profile.tsx
│   │   ├── services/          # API通信
│   │   │   ├── api.ts        # Axios設定
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── category.service.ts
│   │   │   └── tag.service.ts
│   │   ├── types/             # TypeScript型定義
│   │   │   ├── auth.types.ts
│   │   │   ├── task.types.ts
│   │   │   ├── category.types.ts
│   │   │   └── tag.types.ts
│   │   ├── utils/             # ユーティリティ関数
│   │   │   ├── constants.ts
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   └── storage.ts
│   │   ├── styles/            # グローバルスタイル
│   │   │   └── globals.css
│   │   ├── App.tsx            # メインアプリケーション
│   │   ├── main.tsx           # エントリーポイント
│   │   └── vite-env.d.ts      # Vite型定義
│   ├── .env                   # 環境変数
│   ├── .env.example           # 環境変数サンプル
│   ├── .eslintrc.cjs          # ESLint設定
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js      # PostCSS設定
│   ├── tailwind.config.js     # Tailwind CSS設定
│   ├── tsconfig.json          # TypeScript設定
│   ├── tsconfig.node.json
│   └── vite.config.ts         # Vite設定
│
├── backend/                    # バックエンドアプリケーション
│   ├── prisma/                # Prismaスキーマ・マイグレーション
│   │   ├── migrations/        # マイグレーションファイル
│   │   └── schema.prisma      # データベーススキーマ
│   ├── src/
│   │   ├── controllers/       # コントローラー
│   │   │   ├── auth.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   └── tag.controller.ts
│   │   ├── middleware/        # ミドルウェア
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── rateLimit.middleware.ts
│   │   ├── routes/            # ルート定義
│   │   │   ├── auth.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   ├── category.routes.ts
│   │   │   ├── tag.routes.ts
│   │   │   └── index.ts
│   │   ├── services/          # ビジネスロジック
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── category.service.ts
│   │   │   └── tag.service.ts
│   │   ├── validators/        # バリデーションスキーマ
│   │   │   ├── auth.validator.ts
│   │   │   ├── task.validator.ts
│   │   │   ├── category.validator.ts
│   │   │   └── tag.validator.ts
│   │   ├── types/             # TypeScript型定義
│   │   │   ├── auth.types.ts
│   │   │   ├── task.types.ts
│   │   │   └── express.d.ts  # Express拡張
│   │   ├── utils/             # ユーティリティ
│   │   │   ├── prisma.ts     # Prismaクライアント
│   │   │   ├── jwt.ts        # JWT処理
│   │   │   ├── bcrypt.ts     # パスワード処理
│   │   │   ├── logger.ts     # ロガー設定
│   │   │   └── errors.ts     # カスタムエラー
│   │   ├── config/            # 設定
│   │   │   └── index.ts      # 環境変数設定
│   │   ├── app.ts             # Expressアプリケーション
│   │   └── server.ts          # サーバー起動
│   ├── tests/                 # テストファイル
│   │   ├── unit/             # ユニットテスト
│   │   └── integration/      # 統合テスト
│   ├── .env                   # 環境変数
│   ├── .env.example           # 環境変数サンプル
│   ├── .eslintrc.js           # ESLint設定
│   ├── .gitignore
│   ├── jest.config.js         # Jest設定
│   ├── nodemon.json           # Nodemon設定
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json          # TypeScript設定
│
├── docs/                       # ドキュメント
│   ├── product.md             # プロダクト企画書
│   ├── requirements.md        # 要求仕様書
│   ├── design.md              # 機能設計書
│   ├── tech.md                # 技術仕様書
│   └── structure.md           # アプリ構造定義書
│
├── CLAUDE.md                   # 開発標準ルール
├── README.md                   # プロジェクト説明
└── .gitignore                  # Git除外設定
```

## 2. 命名規則

### ファイル名
- **コンポーネント**: PascalCase (例: `TaskList.tsx`)
- **サービス/ユーティリティ**: camelCase + 接尾辞 (例: `auth.service.ts`, `format.utils.ts`)
- **型定義**: camelCase + `.types.ts` (例: `task.types.ts`)
- **テスト**: ファイル名 + `.test.ts` (例: `auth.service.test.ts`)
- **設定ファイル**: kebab-case (例: `jest.config.js`)

### 変数・関数名
- **変数**: camelCase (例: `userName`, `taskCount`)
- **定数**: UPPER_SNAKE_CASE (例: `MAX_RETRY_COUNT`, `API_BASE_URL`)
- **関数**: camelCase (例: `getUserById`, `formatDate`)
- **クラス**: PascalCase (例: `UserService`, `TaskController`)
- **インターフェース/型**: PascalCase (例: `User`, `TaskResponse`)
- **Enum**: PascalCase (例: `TaskStatus`, `Priority`)

### データベース
- **テーブル名**: snake_case + 複数形 (例: `users`, `task_tags`)
- **カラム名**: snake_case (例: `user_id`, `created_at`)

### API エンドポイント
- **URL**: kebab-case (例: `/api/auth/reset-password`)
- **パラメータ**: camelCase (例: `userId`, `taskId`)

## 3. コーディング規約

### TypeScript

#### 型定義
```typescript
// 明示的な型定義を使用
const userName: string = 'John'
const taskCount: number = 5
const isCompleted: boolean = false

// インターフェースを優先
interface User {
  id: string
  email: string
  username: string
}

// Union型、リテラル型の活用
type Status = 'pending' | 'in_progress' | 'completed'
type Priority = 'low' | 'medium' | 'high'
```

#### 関数
```typescript
// アロー関数を優先
const calculateProgress = (completed: number, total: number): number => {
  return total === 0 ? 0 : (completed / total) * 100
}

// async/awaitを使用
const fetchUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/tasks?userId=${userId}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch tasks')
  }
}
```

### React

#### コンポーネント定義
```typescript
// 関数コンポーネント + TypeScriptを使用
interface TaskItemProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  return (
    <div className="task-item">
      {/* コンポーネント内容 */}
    </div>
  )
}
```

#### フック使用規則
```typescript
// カスタムフックは use プレフィックス
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  // フックロジック
  return { user, login, logout }
}

// useEffectの依存配列を正確に指定
useEffect(() => {
  fetchData()
}, [userId, status]) // 依存する値を明示
```

### Express/Node.js

#### コントローラー
```typescript
// エラーハンドリングを含む
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await taskService.create(req.body, req.user.id)
    res.status(201).json({ data: task })
  } catch (error) {
    next(error)
  }
}
```

#### サービス
```typescript
// ビジネスロジックをサービスに集約
export class TaskService {
  async create(data: CreateTaskDto, userId: string): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        ...data,
        userId,
      },
    })
    return task
  }
}
```

## 4. スタイリング規約

### CSS Modules + Tailwind CSS
```tsx
// Tailwind優先、カスタムスタイルは CSS Modules
import styles from './TaskItem.module.css'

const TaskItem = () => {
  return (
    <div className={`p-4 rounded-lg ${styles.taskItem}`}>
      <h3 className="text-lg font-semibold">タスクタイトル</h3>
    </div>
  )
}
```

### Tailwind クラス順序
1. レイアウト (flex, grid)
2. スペーシング (p-, m-)
3. サイジング (w-, h-)
4. 背景 (bg-)
5. ボーダー (border-, rounded-)
6. テキスト (text-, font-)
7. その他 (shadow, cursor)

## 5. コミット規約

### コミットメッセージフォーマット
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 例
```
feat(task): タスクフィルタリング機能を追加

- ステータスによるフィルタリング実装
- 優先度によるフィルタリング実装
- カテゴリーによるフィルタリング実装

Closes #123
```

### Type一覧
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードスタイル変更
- `refactor`: リファクタリング
- `perf`: パフォーマンス改善
- `test`: テスト追加・修正
- `chore`: ビルド・ツール関連

## 6. エラーハンドリング規約

### カスタムエラークラス
```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// 使用例
throw new AppError(404, 'Task not found', 'TASK_NOT_FOUND')
```

### エラーレスポンス形式
```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
}
```

## 7. セキュリティ規約

### 入力検証
- すべてのユーザー入力を検証
- SQLインジェクション対策（Prisma使用）
- XSS対策（React自動エスケープ + 追加サニタイズ）

### 認証・認可
- JWTトークンによる認証
- ルートレベルでの認可チェック
- センシティブ情報の暗号化

### 環境変数
- センシティブ情報は必ず環境変数
- `.env`ファイルは絶対にコミットしない
- `.env.example`で必要な変数を明示

## 8. テスト規約

### テストファイル配置
```
src/
├── services/
│   ├── auth.service.ts
│   └── auth.service.test.ts  # 同階層に配置
```

### テスト記述
```typescript
describe('AuthService', () => {
  describe('login', () => {
    it('should return user and token on valid credentials', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'password' }
      
      // Act
      const result = await authService.login(credentials)
      
      // Assert
      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token')
    })
  })
})
```

## 9. インポート順序

```typescript
// 1. React/Node組み込みモジュール
import React, { useState, useEffect } from 'react'
import path from 'path'

// 2. 外部ライブラリ
import axios from 'axios'
import { format } from 'date-fns'

// 3. 内部モジュール（絶対パス）
import { useAuth } from '@/hooks/useAuth'
import { TaskService } from '@/services/task.service'

// 4. 内部モジュール（相対パス）
import { Button } from '../components/Button'
import styles from './Task.module.css'

// 5. 型定義
import type { Task, User } from '@/types'
```

## 10. ドキュメンテーション

### JSDoc使用
```typescript
/**
 * タスクを作成する
 * @param data - タスク作成データ
 * @param userId - ユーザーID
 * @returns 作成されたタスク
 * @throws {AppError} バリデーションエラー時
 */
async function createTask(data: CreateTaskDto, userId: string): Promise<Task> {
  // 実装
}
```

### README更新
- 新機能追加時は必ずREADMEを更新
- セットアップ手順の変更は即座に反映
- APIドキュメントとの整合性を保つ