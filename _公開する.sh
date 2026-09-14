#!/usr/bin/env bash
# ============================================================================
#  koza.kalaku-labo.jp を公開する（GitHub Pages）
#  Git Bash で  bash _公開する.sh  と打つだけ。2回目以降に実行しても壊れない。
#
#  やること
#    1. GitHub に SeeD-create/kalaku-koza を作る（すでにあれば飛ばす）
#    2. このフォルダの中身を push する
#    3. GitHub Pages を有効にして、独自ドメイン koza.kalaku-labo.jp を登録する
#    4. HTTPS（鍵マーク）を有効にする
#
#  ★先方（kalaku様）のDNSに次の1行が入っていないと、独自ドメインでは開けません。
#      ホスト名 koza ／ 種別 CNAME ／ 値 seed-create.github.io
#    DNSが入るまでの間も https://seed-create.github.io/kalaku-koza/ では見られます。
# ============================================================================
set -e
cd "$(dirname "$0")"

REPO=SeeD-create/kalaku-koza
DOMAIN=koza.kalaku-labo.jp

echo "▼ 1/4 リポジトリを用意"
if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "   すでにあります: $REPO"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
else
  gh repo create "$REPO" --public \
    --description "ボタニカルビューティデザイナー養成講座 販売ページ（koza.kalaku-labo.jp）" \
    --source . --remote origin
fi

echo "▼ 2/4 push"
git push -u origin main

echo "▼ 3/4 GitHub Pages を有効化して独自ドメインを登録"
gh api -X POST "repos/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || echo "   （すでに有効でした）"
gh api -X PUT "repos/$REPO/pages" -f "cname=$DOMAIN" >/dev/null 2>&1 \
  || echo "   （ドメイン登録はDNSが入ってから通ります）"

echo "▼ 4/4 HTTPS を有効化"
sleep 5
gh api -X PUT "repos/$REPO/pages" -F "https_enforced=true" >/dev/null 2>&1 \
  || echo "   （証明書の発行待ち。DNS反映から15分〜1時間で自動的に付きます）"

echo
echo "== 公開先 =="
echo "  本命    https://$DOMAIN/apply.html        受講料とお支払い（UnivaPayへ出すURL）"
echo "  本命    https://$DOMAIN/tokushoho.html    特定商取引法に基づく表記"
echo "  つなぎ  https://seed-create.github.io/kalaku-koza/apply.html"
echo "          https://seed-create.github.io/kalaku-koza/tokushoho.html"
echo
echo "中身を直したら: cd ../bbd-lp && python publish.py --koza → このフォルダで git add -A && git commit && git push"
