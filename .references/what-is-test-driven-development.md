# テスト駆動開発（Test-Driven Development, TDD）

## 概要

テスト駆動開発（TDD）は、ソフトウェア開発手法の一つで、実装コードを書く前にテストコードを書くことを基本とする開発プラクティスです。Kent Beckによって提唱され、アジャイル開発の重要な実践手法として広く採用されています。

## 基本原則

### TDDの3つの黄金律（Three Laws of TDD）
Robert C. Martin（Uncle Bob）が提唱する3つの原則：

1. **失敗するテストを書くまで、プロダクションコードを書いてはならない**
2. **失敗するテストは、失敗するのに十分な量だけ書く**
3. **現在失敗しているテストを通すのに十分な量だけ、プロダクションコードを書く**

## Red-Green-Refactorサイクル

TDDの基本的な開発サイクルは以下の3つのフェーズで構成されます：

### 1. Red（レッド）フェーズ
- **目的**: 失敗するテストを書く
- **内容**: 
  - これから実装する機能のテストを先に書く
  - テストは必ず失敗する（実装がまだないため）
  - テストの失敗により、要求仕様が明確になる
- **確認事項**:
  - テストが正しい理由で失敗しているか
  - テストが期待する振る舞いを正しく表現しているか

### 2. Green（グリーン）フェーズ
- **目的**: テストを通す最小限のコードを書く
- **内容**:
  - テストが成功する最小限の実装を行う
  - この段階では完璧なコードである必要はない
  - とにかくテストを通すことが最優先
- **注意点**:
  - 過度な実装を避ける（YAGNI原則）
  - テストが通ればOKという考え方

### 3. Refactor（リファクタ）フェーズ
- **目的**: コードを改善する
- **内容**:
  - 重複を除去する
  - 可読性を向上させる
  - 設計を改善する
- **制約**:
  - テストが通り続けることを保証する
  - 機能を変更しない

## 詳細な実践手順

### ステップ1: 要求分析とテストリスト作成
```
1. 実装する機能を明確にする
2. 必要なテストケースをリストアップする
3. 最も簡単なケースから始める
```

### ステップ2: 最初のテスト作成
```javascript
// 例: 計算機能の加算メソッド
describe('Calculator', () => {
  it('should return 0 when adding 0 and 0', () => {
    const calculator = new Calculator();
    expect(calculator.add(0, 0)).toBe(0);
  });
});
```

### ステップ3: テスト実行（失敗確認）
```bash
# テスト実行
npm test
# エラー: Calculator is not defined
```

### ステップ4: 最小限の実装
```javascript
class Calculator {
  add(a, b) {
    return 0; // 最小限の実装
  }
}
```

### ステップ5: テスト成功確認
```bash
# テスト実行
npm test
# ✓ should return 0 when adding 0 and 0
```

### ステップ6: 次のテストケース追加
```javascript
it('should return 2 when adding 1 and 1', () => {
  const calculator = new Calculator();
  expect(calculator.add(1, 1)).toBe(2);
});
```

### ステップ7: 実装の改善
```javascript
class Calculator {
  add(a, b) {
    return a + b; // 一般化した実装
  }
}
```

### ステップ8: リファクタリング
```javascript
// 必要に応じてコードを整理
class Calculator {
  add(a, b) {
    this.validateNumbers(a, b);
    return a + b;
  }
  
  validateNumbers(...numbers) {
    numbers.forEach(num => {
      if (typeof num !== 'number') {
        throw new TypeError('引数は数値である必要があります');
      }
    });
  }
}
```

## テストの種類と粒度

### 1. 単体テスト（Unit Test）
- **対象**: 個々の関数、メソッド、クラス
- **特徴**: 
  - 高速実行
  - 独立性が高い
  - TDDの主要な対象
- **例**:
```javascript
test('数値の検証', () => {
  expect(isNumber(123)).toBe(true);
  expect(isNumber('123')).toBe(false);
});
```

### 2. 統合テスト（Integration Test）
- **対象**: 複数のコンポーネントの連携
- **特徴**:
  - 実行時間がやや長い
  - 外部依存の考慮が必要
- **例**:
```javascript
test('ユーザー登録フロー', async () => {
  const user = await userService.register({
    email: 'test@example.com',
    password: 'password123'
  });
  expect(user.id).toBeDefined();
  expect(await userService.authenticate(user.email, 'password123')).toBe(true);
});
```

### 3. 受け入れテスト（Acceptance Test）
- **対象**: システム全体の振る舞い
- **特徴**:
  - エンドユーザー視点
  - BDD（振る舞い駆動開発）との親和性
- **例**:
```gherkin
Feature: ユーザーログイン
  Scenario: 正しい認証情報でログイン
    Given ログインページを開いている
    When メールアドレス "user@example.com" を入力
    And パスワード "correct_password" を入力
    And ログインボタンをクリック
    Then ダッシュボードページが表示される
```

## TDDのメリット

### 1. 品質向上
- **バグの早期発見**: 開発段階でバグを検出
- **リグレッション防止**: 既存機能の破壊を防ぐ
- **信頼性**: テストによる動作保証

### 2. 設計改善
- **疎結合**: テストしやすいコードは疎結合になりやすい
- **単一責任**: 小さく独立したコンポーネント
- **インターフェース重視**: 実装より振る舞いに注目

### 3. 開発効率
- **デバッグ時間削減**: バグの原因特定が容易
- **リファクタリングの安全性**: テストがセーフティネットとなる
- **ドキュメント化**: テストが仕様書として機能

### 4. 心理的安全性
- **自信を持った変更**: テストが通れば安心
- **実験的な改善**: 失敗してもすぐ戻せる
- **チーム開発**: 他人のコードも安心して変更可能

## TDDのデメリットと課題

### 1. 初期コスト
- **学習曲線**: 習得に時間がかかる
- **開発速度**: 初期は開発が遅く感じる
- **テストコードのメンテナンス**: テスト自体の保守が必要

### 2. 適用の難しさ
- **UI/UXテスト**: 視覚的要素のテストは困難
- **レガシーコード**: 既存コードへの適用は困難
- **外部システム連携**: モック化の複雑さ

### 3. 過度なテスト
- **100%カバレッジの罠**: すべてをテストする必要はない
- **脆弱なテスト**: 実装に依存しすぎたテスト
- **テストの重複**: 同じことを複数回テスト

## 実践的なテクニック

### 1. テストダブル（Test Double）

#### モック（Mock）
```javascript
// 外部APIのモック
const apiMock = jest.fn().mockResolvedValue({ data: 'test' });
```

#### スタブ（Stub）
```javascript
// 固定値を返すスタブ
const dateStub = sinon.stub(Date, 'now').returns(1234567890);
```

#### スパイ（Spy）
```javascript
// メソッド呼び出しを監視
const spy = jest.spyOn(console, 'log');
expect(spy).toHaveBeenCalledWith('expected message');
```

### 2. テストデータの管理

#### フィクスチャ（Fixture）
```javascript
// テスト用の固定データ
const userFixture = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com'
};
```

#### ファクトリ（Factory）
```javascript
// 動的なテストデータ生成
function createUser(overrides = {}) {
  return {
    id: Math.random(),
    name: 'Default Name',
    email: 'default@example.com',
    ...overrides
  };
}
```

### 3. テストの構造化

#### AAA パターン
```javascript
test('ユーザー作成', () => {
  // Arrange（準備）
  const userData = { name: 'John', email: 'john@example.com' };
  
  // Act（実行）
  const user = createUser(userData);
  
  // Assert（検証）
  expect(user.name).toBe('John');
  expect(user.email).toBe('john@example.com');
});
```

#### Given-When-Then パターン
```javascript
describe('Calculator', () => {
  describe('Given two positive numbers', () => {
    const a = 5;
    const b = 3;
    
    describe('When adding them', () => {
      const result = calculator.add(a, b);
      
      it('Then returns their sum', () => {
        expect(result).toBe(8);
      });
    });
  });
});
```

## TDD実践のベストプラクティス

### 1. テストの命名規則
```javascript
// 良い例：何をテストしているか明確
test('should throw error when dividing by zero');
test('returns null when user is not found');

// 悪い例：曖昧
test('test1');
test('works correctly');
```

### 2. 一つのテストで一つのことだけをテスト
```javascript
// 良い例
test('should calculate subtotal', () => {
  expect(calculateSubtotal([10, 20])).toBe(30);
});

test('should apply tax', () => {
  expect(applyTax(100, 0.1)).toBe(110);
});

// 悪い例：複数のことをテスト
test('should calculate total', () => {
  const subtotal = calculateSubtotal([10, 20]);
  expect(subtotal).toBe(30);
  const total = applyTax(subtotal, 0.1);
  expect(total).toBe(33);
  const formatted = formatCurrency(total);
  expect(formatted).toBe('$33.00');
});
```

### 3. テストの独立性
```javascript
// 良い例：各テストが独立
beforeEach(() => {
  database.clear();
  database.seed();
});

test('should create user', () => {
  const user = createUser({ name: 'Alice' });
  expect(database.users.count()).toBe(1);
});

// 悪い例：テスト間で状態を共有
let counter = 0;
test('increment counter', () => {
  counter++;
  expect(counter).toBe(1); // 他のテストの実行順序に依存
});
```

### 4. 読みやすいアサーション
```javascript
// 良い例：自己説明的
expect(user.isActive).toBe(true);
expect(items).toHaveLength(3);
expect(result).toBeGreaterThan(0);

// 悪い例：意図が不明確
expect(user.status === 1).toBe(true);
expect(items.length === 3).toBe(true);
```

## TDD導入戦略

### 1. 段階的導入
1. **新機能から開始**: 既存コードには触らず新機能でTDDを実践
2. **バグ修正時に追加**: バグ修正時にテストを追加
3. **重要な部分から**: ビジネスロジックなど重要な部分から適用
4. **チーム全体へ展開**: 成功事例を共有し徐々に展開

### 2. 環境整備
- **CI/CD統合**: 自動テスト実行環境の構築
- **カバレッジ測定**: テストカバレッジの可視化
- **テストツール選定**: 適切なテストフレームワークの選択

### 3. チーム教育
- **ペアプログラミング**: TDD経験者とのペア作業
- **コードレビュー**: テストコードもレビュー対象に
- **勉強会**: TDDの原則と実践方法の共有

## まとめ

テスト駆動開発は単なるテスト手法ではなく、設計手法であり、思考プロセスです。「テストファースト」の考え方により、以下を実現します：

1. **明確な要求定義**: テストを書くことで要求が明確になる
2. **シンプルな設計**: 必要十分な実装に留まる
3. **安全なリファクタリング**: テストがセーフティネットとなる
4. **生きたドキュメント**: テストが仕様書として機能する

TDDの習得には時間がかかりますが、長期的には開発効率と品質の向上をもたらします。重要なのは、完璧を求めず、小さく始めて徐々に改善していくことです。