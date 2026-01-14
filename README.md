# タスク管理アプリケーション

## 概要
シンプルで直感的なタスク管理により、個人やチームの生産性を最大化するWebアプリケーションです。

## 主な機能
- ユーザー認証（登録・ログイン）
- タスクの作成・編集・削除
- タスクのステータス管理（未着手/進行中/完了）
- 優先度設定（高/中/低）
- カテゴリー分類
- タグ付け機能
- フィルタリング・検索機能
- ダッシュボード表示

## 技術スタック

### フロントエンド
- React 18.3 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Axios

### バックエンド
- Node.js 20 LTS + TypeScript
- Express 4
- Prisma ORM
- PostgreSQL 15
- JWT認証

## プロジェクト構造
```
.
├── frontend/          # フロントエンドアプリケーション
├── backend/           # バックエンドAPI
├── docs/             # ドキュメント類
└── CLAUDE.md         # 開発標準ルール
```

## セットアップ手順

### 必要要件
- Node.js 20.x 以上
- npm 10.x 以上
- PostgreSQL 15.x 以上

### インストール

1. リポジトリをクローン
```bash
git clone [repository-url]
cd task-management-app
```

2. バックエンドのセットアップ
```bash
cd backend
npm install
cp .env.example .env
# .envファイルを編集して環境変数を設定
npm run prisma:migrate
npm run dev
```

3. フロントエンドのセットアップ
```bash
cd frontend
npm install
cp .env.example .env
# .envファイルを編集して環境変数を設定
npm run dev
```

## 開発コマンド

### バックエンド
```bash
npm run dev         # 開発サーバー起動
npm run build       # ビルド
npm run start       # 本番サーバー起動
npm run lint        # リント実行
npm run typecheck   # 型チェック
npm run test        # テスト実行
```

### フロントエンド
```bash
npm run dev         # 開発サーバー起動
npm run build       # ビルド
npm run preview     # ビルドプレビュー
npm run lint        # リント実行
npm run typecheck   # 型チェック
```

## ドキュメント

- [プロダクト企画書](docs/product.md)
- [要求仕様書](docs/requirements.md)
- [機能設計書](docs/design.md)
- [技術仕様書](docs/tech.md)
- [アプリ構造定義書](docs/structure.md)

## ライセンス
MIT
