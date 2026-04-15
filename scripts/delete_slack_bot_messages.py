#!/usr/bin/env python3
"""
Slack チャンネルから bot メッセージを一括削除するスクリプト

使い方:
  1. SLACK_USER_TOKEN に Admin 権限のある User Token (xoxp-) をセット
  2. python3 scripts/delete_slack_bot_messages.py

必要な OAuth スコープ (User Token):
  - channels:history
  - chat:write
"""

import os
import sys
import time
import requests

# ============================================================
# 設定
# ============================================================
SLACK_USER_TOKEN = os.environ.get("SLACK_USER_TOKEN", "")
CHANNEL_ID = "C06JW4JC666"  # #general

# True にすると実際に削除せず対象メッセージを一覧表示のみ
DRY_RUN = False

# 除外する人間ユーザーの User ID (U-prefix)
EXCLUDED_HUMAN_USERS = {
    "U06JFJ21USK",   # Shingo Yoshida
    "U077UNS8537",   # Yutaka Omido
    "U06S24TP91Q",   # ﾆｹ
    "U06TGEPHZ16",
    "U0A0QK5FTMH",
    "U0A45J63B9R",
    "U06JYHYR0DS",
}

# 除外する人間の username パターン（インテグレーション経由の投稿）
EXCLUDED_HUMAN_NAMES = {
    "oshima / 大嶋勇樹",
    "mah / 西見公宏",
    "Shingo / 吉田真吾",
    "Shoty / 川村将太",
    "hosumi / 八角嘉紘",
    "Yutaka Omido / 大御堂裕",
    "Yutaka Omido",
    "muna / むな",
    "lemilemio",
    "mah",
}

# ============================================================

HEADERS = {
    "Authorization": f"Bearer {SLACK_USER_TOKEN}",
    "Content-Type": "application/json; charset=utf-8",
}


def get_all_bot_messages() -> list[dict]:
    """チャンネルの全メッセージを取得し、bot のものだけ返す"""
    bot_messages = []
    cursor = None
    page = 0

    while True:
        page += 1
        params = {"channel": CHANNEL_ID, "limit": 200}
        if cursor:
            params["cursor"] = cursor

        resp = requests.get(
            "https://slack.com/api/conversations.history",
            headers=HEADERS,
            params=params,
        )
        data = resp.json()

        if not data.get("ok"):
            print(f"[ERROR] conversations.history failed: {data.get('error')}")
            break

        messages = data.get("messages", [])
        for msg in messages:
            # 人間ユーザーの除外チェック
            user_id = msg.get("user", "")
            username = msg.get("username", msg.get("user", "unknown"))
            if user_id in EXCLUDED_HUMAN_USERS:
                continue
            if username in EXCLUDED_HUMAN_NAMES:
                continue

            # 純粋な bot メッセージの判定:
            #   - bot_id フィールドがある (B-prefix の bot ID)
            #   - subtype が bot_message
            is_bot = "bot_id" in msg or msg.get("subtype") == "bot_message"
            if is_bot:
                bot_messages.append(
                    {
                        "ts": msg["ts"],
                        "bot_id": msg.get("bot_id", "N/A"),
                        "username": username,
                        "text_preview": (msg.get("text", "") or "")[:80],
                    }
                )

        print(
            f"  Page {page}: {len(messages)} messages scanned, "
            f"{len(bot_messages)} bot messages found so far"
        )

        # ページネーション
        cursor = data.get("response_metadata", {}).get("next_cursor")
        if not cursor:
            break

        # conversations.history のレート制限 (Tier 3)
        time.sleep(1.0)

    return bot_messages


def delete_messages(bot_messages: list[dict]) -> None:
    """メッセージを1件ずつ削除する"""
    total = len(bot_messages)
    success = 0
    failed = 0

    for i, msg in enumerate(bot_messages, 1):
        resp = requests.post(
            "https://slack.com/api/chat.delete",
            headers=HEADERS,
            json={"channel": CHANNEL_ID, "ts": msg["ts"]},
        )
        data = resp.json()

        if data.get("ok"):
            success += 1
            print(f"  [{i}/{total}] Deleted: {msg['username']} - {msg['text_preview'][:40]}")
        else:
            failed += 1
            error = data.get("error", "unknown")
            print(f"  [{i}/{total}] FAILED ({error}): {msg['username']} ts={msg['ts']}")

            # cant_delete_message → 権限不足、停止
            if error == "cant_delete_message":
                print(
                    "\n[ERROR] 削除権限がありません。"
                    "Admin 権限のある User Token (xoxp-) を使用してください。"
                )
                break

            # ratelimited → 指定秒数待機
            if error == "ratelimited":
                retry_after = int(data.get("headers", {}).get("Retry-After", 30))
                print(f"  Rate limited. Waiting {retry_after}s...")
                time.sleep(retry_after)
                # リトライ
                resp2 = requests.post(
                    "https://slack.com/api/chat.delete",
                    headers=HEADERS,
                    json={"channel": CHANNEL_ID, "ts": msg["ts"]},
                )
                if resp2.json().get("ok"):
                    success += 1
                    failed -= 1

        # レート制限回避: ~50 req/min → 1.5秒間隔
        time.sleep(1.5)

    print(f"\n=== Done: {success} deleted, {failed} failed out of {total} ===")


def main():
    auto_yes = "--yes" in sys.argv

    if not SLACK_USER_TOKEN:
        print("Error: SLACK_USER_TOKEN 環境変数をセットしてください")
        print()
        print("  export SLACK_USER_TOKEN='xoxp-xxxx-xxxx-xxxx'")
        print("  python3 scripts/delete_slack_bot_messages.py")
        sys.exit(1)

    if not SLACK_USER_TOKEN.startswith("xoxp-"):
        print(
            "Warning: トークンが xoxp- で始まっていません。"
            "他の bot のメッセージを削除するには Admin の User Token が必要です。"
        )
        answer = input("続行しますか？ (yes/no): ")
        if answer.lower() != "yes":
            sys.exit(0)

    print(f"=== Channel: {CHANNEL_ID} の bot メッセージを検索中... ===\n")
    bot_messages = get_all_bot_messages()

    if not bot_messages:
        print("\nBot メッセージは見つかりませんでした。")
        return

    # サマリー表示
    from collections import Counter

    by_bot = Counter(m["username"] for m in bot_messages)
    print(f"\n=== Bot メッセージ合計: {len(bot_messages)} 件 ===")
    for bot_name, count in by_bot.most_common():
        print(f"  {bot_name}: {count} 件")

    if DRY_RUN:
        print(f"\n[DRY RUN] 削除は実行しません。")
        print("実際に削除するには DRY_RUN = False に変更してください。")
        print("\n--- 対象メッセージ一覧 ---")
        for msg in bot_messages:
            print(f"  {msg['username']:20s} ts={msg['ts']}  {msg['text_preview'][:50]}")
        return

    # 確認
    print()
    if auto_yes:
        print(f"{len(bot_messages)} 件の bot メッセージを削除します (--yes フラグで自動承認)")
    else:
        answer = input(f"{len(bot_messages)} 件の bot メッセージを削除しますか？ (yes/no): ")
        if answer.lower() != "yes":
            print("中止しました。")
            return

    print(f"\n=== 削除開始 ===\n")
    delete_messages(bot_messages)


if __name__ == "__main__":
    main()
