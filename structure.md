# アプリ構造定義書

## プロジェクト構造

```
task-manager/
├── frontend/                    # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/         # UIコンポーネント
│   │   │   ├── common/        # 共通コンポーネント
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Loading.tsx
│   │   │   ├── auth/          # 認証関連コンポーネント
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   └── tasks/         # タスク関連コンポーネント
│   │   │       ├── TaskList.tsx
│   │   │       ├── TaskItem.tsx
│   │   │       └── TaskInput.tsx
│   │   ├── pages/             # ページコンポーネント
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── hooks/             # カスタムフック
│   │   │   ├── useAuth.ts
│   │   │   ├── useTasks.ts
│   │   │   └── useSocket.ts
│   │   ├── stores/            # 状態管理
│   │   │   ├── authStore.ts
│   │   │   └── taskStore.ts
│   │   ├── services/          # API通信
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   └── taskService.ts
│   │   ├── types/             # TypeScript型定義
│   │   │   ├── auth.types.ts
│   │   │   └── task.types.ts
│   │   ├── utils/             # ユーティリティ関数
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   ├── App.tsx            # メインアプリケーション
│   │   ├── main.tsx           # エントリーポイント
│   │   └── index.css          # グローバルスタイル
│   ├── public/                # 静的ファイル
│   ├── .env.example           # 環境変数サンプル
│   ├── index.html             # HTMLテンプレート
│   ├── package.json           # 依存関係
│   ├── tsconfig.json          # TypeScript設定
│   ├── vite.config.ts         # Vite設定
│   └── tailwind.config.js     # Tailwind CSS設定
│
├── backend/                    # バックエンドアプリケーション
│   ├── src/
│   │   ├── controllers/       # コントローラー
│   │   │   ├── authController.ts
│   │   │   └── taskController.ts
│   │   ├── services/          # ビジネスロジック
│   │   │   ├── authService.ts
│   │   │   └── taskService.ts
│   │   ├── models/            # データモデル
│   │   │   └── index.ts
│   │   ├── routes/            # ルーティング
│   │   │   ├── authRoutes.ts
│   │   │   └── taskRoutes.ts
│   │   ├── middleware/        # ミドルウェア
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── utils/             # ユーティリティ
│   │   │   ├── jwt.ts
│   │   │   └── logger.ts
│   │   ├── config/            # 設定
│   │   │   ├── database.ts
│   │   │   └── config.ts
│   │   ├── sockets/           # WebSocket
│   │   │   └── taskSocket.ts
│   │   ├── types/             # TypeScript型定義
│   │   │   └── index.ts
│   │   └── app.ts             # アプリケーションエントリー
│   ├── prisma/                # Prismaスキーマ
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── .env.example           # 環境変数サンプル
│   ├── package.json           # 依存関係
│   ├── tsconfig.json          # TypeScript設定
│   └── server.ts              # サーバーエントリーポイント
│
├── shared/                     # 共有コード
│   └── types/                 # 共通型定義
│       ├── auth.types.ts
│       └── task.types.ts
│
├── .gitignore                 # Git除外設定
├── README.md                  # プロジェクト説明
├── pnpm-workspace.yaml        # pnpmワークスペース設定
└── package.json               # ルートパッケージ設定
```

## 命名規則

### ファイル名
| 種類 | 命名規則 | 例 |
|------|---------|-----|
| React コンポーネント | PascalCase.tsx | `TaskList.tsx` |
| TypeScript ファイル | camelCase.ts | `authService.ts` |
| 型定義ファイル | camelCase.types.ts | `task.types.ts` |
| テストファイル | {対象}.test.ts(x) | `TaskList.test.tsx` |
| 設定ファイル | kebab-case.{ext} | `vite.config.ts` |
| 環境変数ファイル | .env.{環境} | `.env.production` |

### 変数・関数名
| 種類 | 命名規則 | 例 |
|------|---------|-----|
| 変数 | camelCase | `userName`, `isLoading` |
| 定数 | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_TASKS` |
| 関数 | camelCase | `createTask`, `handleSubmit` |
| React コンポーネント | PascalCase | `TaskItem`, `LoginForm` |
| カスタムフック | use + PascalCase | `useAuth`, `useTasks` |
| 型・インターフェース | PascalCase | `Task`, `UserResponse` |
| enum | PascalCase | `TaskStatus`, `UserRole` |

### API エンドポイント
| 種類 | 命名規則 | 例 |
|------|---------|-----|
| リソース | 複数形、kebab-case | `/api/tasks`, `/api/users` |
| アクション | 動詞、kebab-case | `/api/tasks/reorder` |
| パラメータ | camelCase | `?sortBy=createdAt` |

## コーディング規約

### TypeScript
```typescript
// 1. インポートの順序
import React from 'react';                    // 1. React
import { useState, useEffect } from 'react';  // 2. React hooks
import axios from 'axios';                    // 3. 外部ライブラリ
import { TaskItem } from '@/components';      // 4. 内部コンポーネント
import { useAuth } from '@/hooks';            // 5. 内部フック
import { Task } from '@/types';               // 6. 型定義
import { formatDate } from '@/utils';         // 7. ユーティリティ
import './TaskList.css';                      // 8. スタイル

// 2. 型定義を先に記述
interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}

// 3. コンポーネントは関数式で定義
export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdate }) => {
  // 実装
};

// 4. 早期リターンを活用
if (!data) return null;
if (loading) return <Loading />;

// 5. オプショナルチェーン・Nullish Coalescing を活用
const userName = user?.name ?? 'Guest';
```

### React コンポーネント
```typescript
// 1. コンポーネントの基本構造
const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  // 1. State
  const [isEditing, setIsEditing] = useState(false);
  
  // 2. Store / Context
  const { user } = useAuth();
  
  // 3. Effects
  useEffect(() => {
    // 副作用処理
  }, [dependency]);
  
  // 4. ハンドラー関数
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  // 5. レンダリング
  return (
    <div className="task-item">
      {/* JSX */}
    </div>
  );
};
```

### API 通信
```typescript
// 1. サービス層で API 通信を抽象化
export const taskService = {
  async getTasks(): Promise<Task[]> {
    const { data } = await api.get('/tasks');
    return data;
  },
  
  async createTask(content: string): Promise<Task> {
    const { data } = await api.post('/tasks', { content });
    return data;
  },
};

// 2. エラーハンドリング
try {
  const tasks = await taskService.getTasks();
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data);
  }
}
```

### 状態管理 (Zustand)
```typescript
interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (content: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskService.getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },
}));
```

## Git コミットメッセージ規約

### フォーマット
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `style`: フォーマット変更
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルドプロセスや補助ツールの変更

### 例
```
feat(tasks): ドラッグ&ドロップによる並び替え機能を追加

- @dnd-kit ライブラリを導入
- TaskList コンポーネントに DnD 機能を実装
- 並び替え後の順序を API で永続化

Closes #123
```

## テスト規約

### テストファイルの配置
```
src/
├── components/
│   └── TaskItem/
│       ├── TaskItem.tsx
│       └── TaskItem.test.tsx  # コンポーネントと同じディレクトリ
```

### テストの書き方
```typescript
describe('TaskItem', () => {
  it('should render task content', () => {
    // Arrange
    const task = { id: '1', content: 'Test task', completed: false };
    
    // Act
    render(<TaskItem task={task} />);
    
    // Assert
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });
  
  it('should call onUpdate when checkbox is clicked', () => {
    // テスト実装
  });
});
```

## セキュリティ規約

### 環境変数
- 機密情報は環境変数で管理
- `.env` ファイルは Git に含めない
- `.env.example` で必要な変数を明示

### 入力値検証
- フロントエンド・バックエンド両方で検証
- Zod を使用したスキーマ検証
- SQLインジェクション対策（Prisma が自動対応）

### 認証・認可
- JWT トークンは httpOnly Cookie で管理
- トークンの有効期限を設定
- すべての API エンドポイントで認証チェック