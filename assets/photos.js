/* =========================================================
   写真マニフェスト（実写差し替え用）
   ボタニカルビューティデザイナー養成講座 LP ／ Lスタジオ 2026-08-09
   ---------------------------------------------------------
   ★撮影後の差し替えは、この1ファイルだけで完結します。

   【いちばん簡単なやり方】
     assets/img/photo/ に、下の表の「ファイル名」どおりの名前で
     写真を置くだけ。HTMLもCSSも触りません。
     （ファイルが無いスロットは、いまの仮画像がそのまま出ます）

   【ファイル名を変えたいとき】
     下の PHOTOS の右側（"..." の中）を書き換えるだけ。1行で差し替わります。
     外部URL（https://〜）を直接書いてもOKです。

   ※対応表・撮影の構図メモは docs/撮影指示書_12カット.md を参照。
   ※OGP画像（SNSシェア用）だけはJSでは差し替えられません。
     各HTMLの <meta property="og:image"> を1行直してください。
   ========================================================= */

var PHOTO_DIR = "img/photo/";   /* assets/ からの相対。フォルダを変えるならここ1行 */

var PHOTOS = {
  /* --- スロットID ----------------- ファイル名 ------------------ 撮影カット --- */
  "01_counseling"       : "01_counseling.jpg",        /* 1. カウンセリング風景 */
  "01_counseling_wide"  : "01_counseling_wide.jpg",   /*    └ PC用の横長切り出し */
  "01_counseling_mob"   : "01_counseling_mob.jpg",    /*    └ スマホ用の4:3切り出し */
  "02_ai_analysis"      : "02_ai_analysis.jpg",       /* 2. AI肌分析画面 */
  "03_extracts"         : "03_extracts.jpg",          /* 3. 植物エキス24種類 */
  "03_extracts_wide"    : "03_extracts_wide.jpg",     /*    └ 全幅の帯用（超横長） */
  "04_blending"         : "04_blending.jpg",          /* 4. コスメ調合風景 */
  "05_hirao_labo"       : "05_hirao_labo.jpg",        /* 5. 平尾ラボ */
  /* 2026-08-10 B案「学ぶ内容」右の縦写真は専用スロットに分離。
     05_hirao_labo は start（これから向け）の POINT 03 でも使っており、
     共用のままだと片方を差し替えるともう片方まで変わってしまうため。 */
  "05_hirao_labo_learn" : "05_hirao_labo_learn.jpg",  /*    └ B案「学ぶ内容」専用（縦4:5） */
  "06_products"         : "06_products.jpg",          /* 6. 実際のコスメ */
  "07_club"             : "07_club.jpg",              /* 7. 植物美容クラブ開催風景 */
  "08_teatime"          : "08_teatime.jpg",           /* 8. お茶を飲みながら話す様子 */
  "08_teatime_wide"     : "08_teatime_wide.jpg",      /*    └ 背景敷き用の横長切り出し */
  "09_hadaiku_lesson"   : "09_hadaiku_lesson.jpg",    /* 9. 肌育レッスン風景 */
  "10_kouza"            : "10_kouza.jpg",             /* 10. 養成講座受講風景 */
  "10_kouza_wide"       : "10_kouza_wide.jpg",        /*     └ ヒーロー用の横長切り出し */

  /* --- PCヒーロー専用（左半分をアイボリーに溶かした横長）2026-08-09 ---
     文字が写真に溶け込む見せ方にするため、通常の切り出しとは別に持っている。
     撮影後は、同じ構図の引きを同じように左を溶かして同名で置けば入れ替わる。 */
  "01_counseling_hero"  : "01_counseling_hero.jpg",   /* A案・B案のPCヒーロー */
  "10_kouza_hero"       : "10_kouza_hero.jpg",        /* start（これから向け）のPCヒーロー */
  "11_lab_research"     : "11_lab_research.jpg",      /* 11. 製造ラボ・研究風景 */
  "12_lab_equipment"    : "12_lab_equipment.jpg",     /* 12. 製造ラボ機材・設備 */

  /* 動画サムネだけは撮影ではなく、実際の説明動画から切り出した1コマを使う */
  "video_thumb"         : "video_thumb.jpg",

  /* --- C案（c/index.html）専用スロット 2026-08-11 -------------------
     C案は黒×白×ゴールドで写真のトーンが他の3本と違うため、共有スロットとは
     別のファイルを持つ。上の 01〜12 を上書きするとA案・B案・startにも
     影響するので、C案の写真を替えるときは必ずこちら側を触ること。 */
  "c_hero"              : "c6_hero.jpg",          /* FV（スポイトの1滴） */
  "c_worry"             : "c8_worry.jpg",         /* 悩み（縦・モノクロ表示） */
  "c_lesson"            : "c9_lesson.jpg",        /* SOLUTION主画 */
  "c_ai"                : "c10_ai.jpg",           /* カード01 AI肌分析 */
  "c_blend"             : "c7_blend_hands.jpg",   /* カード02 ボタニカル処方 */
  "c_product"           : "c1_bottle_serum.jpg",  /* カード03（支給写真） */
  "c_learn"             : "c11_learn.jpg",        /* 学ぶこと */
  "c_cta"               : "c12_cta.jpg",          /* 最終CTAの背景 */
  "c_band"              : "c13_band.jpg",         /* 全幅の帯 */
  "c_movie"             : "c14_movie.jpg",        /* 動画サムネ */
  "c_voice_a"           : "c15_voice_a.jpg",
  "c_voice_b"           : "c15_voice_b.jpg",
  "c_voice_c"           : "c15_voice_c.jpg"
};

/* ---------------------------------------------------------
   ここから下は仕組み。触らなくて大丈夫です。
   [data-photo-slot="..."] が付いた要素の背景写真を差し替えます。
   ファイルが無い／読み込めない場合は、いまの仮画像のまま残します。
   （ローカルでダブルクリックして開いても動くよう、fetch は使いません）
   --------------------------------------------------------- */
(function () {
  "use strict";
  var me = document.currentScript;
  var base = (me && me.src ? me.src.replace(/[?#].*$/, "").replace(/photos\.js$/, "") : "assets/");

  /* PC幅のときだけ効かせたい背景（ヒーローの全幅写真）。
     インラインstyleにするとスマホでも効いてしまうので、@media付きのCSSを作って差し込む。 */
  function applyPc() {
    var els = document.querySelectorAll("[data-photo-slot-pc]");
    var css = "";
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var file = PHOTOS[el.getAttribute("data-photo-slot-pc")];
      if (!file) continue;
      if (!el.id) el.id = "lp-pcphoto-" + i;
      var url = /^(https?:)?\/\//.test(file) ? file : base + PHOTO_DIR + file;
      css += "@media(min-width:900px){#" + el.id + "{background-image:url('" + url + "')}}\n";
    }
    if (!css) return;
    var probeAll = document.querySelectorAll("[data-photo-slot-pc]");
    var first = PHOTOS[probeAll[0].getAttribute("data-photo-slot-pc")];
    var probe = new Image();
    probe.onload = function () {
      var st = document.createElement("style");
      st.appendChild(document.createTextNode(css));
      document.head.appendChild(st);
    };
    probe.onerror = function () { /* 未撮影＝仮画像のまま */ };
    probe.src = /^(https?:)?\/\//.test(first) ? first : base + PHOTO_DIR + first;
  }

  function apply() {
    applyPc();
    var els = document.querySelectorAll("[data-photo-slot]");
    for (var i = 0; i < els.length; i++) {
      (function (el) {
        var key = el.getAttribute("data-photo-slot");
        var file = PHOTOS[key];
        if (!file) return;
        var url = /^(https?:)?\/\//.test(file) ? file : base + PHOTO_DIR + file;
        var probe = new Image();
        probe.onload = function () {
          el.style.backgroundImage = "url('" + url + "')";
          el.classList.add("has-img");
        };
        probe.onerror = function () { /* 未撮影＝仮画像のまま。何もしない */ };
        probe.src = url;
      })(els[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
