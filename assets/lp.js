/* =========================================================
   ボタニカルビューティデザイナー養成講座 LP  共通スクリプト
   Lスタジオ 2026-08
   ---------------------------------------------------------
   ★ LINE登録URLはここ1か所だけ直せば全ボタンに反映されます。
   ========================================================= */

var LINE_URL = "https://lin.ee/XXXXXXX"; // ←★講座用LINE公式の友だち追加URLに差し替え
var VIMEO_ID = "";                       // ←★Vimeoの動画ID（数字だけ。例: "123456789"）

/* ★計測（Meta Pixel / GA4）のマスタースイッチ -----------------------------
   2026-09-02 先方回答＝保守のみ契約（計測は今回見送り）につき false で無効化。
   ・false のあいだ、計測イベント（LPView / ViewContent / ClickLINE …）は一切飛ばない
   ・<head> のピクセルタグ（現在コメントアウト中）を誤って有効化しても、
     ここが false なら送信されない＝二重ロック
   ・再有効化の手順は README.md「計測（Meta広告）の再有効化手順」を見る */
var TRACKING_ENABLED = false;

(function () {
  "use strict";

  /* 計測の一本口。fbq / gtag への送信は必ずここを通す（個別に直接呼ばない）。
     TRACKING_ENABLED=false なら何もしない。タグ未設置（fbq/gtag未定義）でも安全 */
  function lpTrack(fbType, fbName, fbParams, gaName, gaParams) {
    if (!TRACKING_ENABLED) return;
    if (typeof window.fbq === "function" && fbName) window.fbq(fbType, fbName, fbParams);
    if (typeof window.gtag === "function" && gaName) window.gtag("event", gaName, gaParams || fbParams);
  }

  /* 0) A/Bパターンの判定 -------------------------------------------
     ・各HTMLの <body data-lp-variant="a"> / "b" が既定値
     ・URLに ?v=a / ?v=b が付いていれば、そちらを優先（広告側で付けられる）
     判定結果は、下のCTA計測イベントに lp_variant として必ず乗ります。 */
  var variant = (document.body.getAttribute("data-lp-variant") || "a").toLowerCase();
  var q = (location.search.match(/[?&]v=([a-z0-9]+)/i) || [])[1];
  if (q) variant = q.toLowerCase();
  window.LP_VARIANT = variant;
  document.documentElement.setAttribute("data-lp-variant", variant);
  try { sessionStorage.setItem("lp_variant", variant); } catch (e) {}
  lpTrack("trackCustom", "LPView", { lp_variant: variant }, "lp_view");

  /* 0-2) ページ内リンクにも ?v= を引き継ぐ（A↔B切替・法務ページ） */
  if (q) {
    var inner = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([data-act="line"])');
    for (var z = 0; z < inner.length; z++) {
      var h = inner[z].getAttribute("href");
      if (h.indexOf("v=") === -1) {
        inner[z].setAttribute("href", h + (h.indexOf("?") === -1 ? "?" : "&") + "v=" + variant);
      }
    }
  }

  /* 1) LINE URL を「LINEへ行くボタン」だけに流し込む ---------------- */
  var btns = document.querySelectorAll('[data-act="line"]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].setAttribute("href", LINE_URL);
  }

  /* 1-2) 動画：サムネをクリックしたらVimeoを読み込んで再生 ---------
     最初からiframeを置かないのは、ページの表示を重くしないため。 */
  var vf = document.querySelector(".vframe");
  if (vf) {
    vf.setAttribute("role", "button");
    vf.setAttribute("tabindex", "0");
    vf.setAttribute("aria-label", "講座説明動画を再生する");
    var play = function () {
      // 2026-08-11 C案用：再生を押したことをCSSへ伝える（LINE導線を再生後に出すため）。
      // A案・B案には対応するCSSが無いので影響なし。
      vf.classList.add("tapped");
      if (!VIMEO_ID) {
        var n = vf.parentNode.querySelector(".vnote");
        if (!n) {
          n = document.createElement("p");
          n.className = "vnote";
          n.textContent = "※動画は準備中です（Vimeoの動画IDを設定すると、ここでそのまま再生されます）";
          vf.parentNode.insertBefore(n, vf.nextSibling);
        }
        return;
      }
      var f = document.createElement("iframe");
      f.src = "https://player.vimeo.com/video/" + VIMEO_ID +
              "?autoplay=1&title=0&byline=0&portrait=0&dnt=1";
      f.title = "講座説明動画";
      f.allow = "autoplay; fullscreen; picture-in-picture";
      f.allowFullscreen = true;
      f.className = "vplayer";
      vf.innerHTML = "";
      vf.classList.add("playing");
      vf.appendChild(f);
      lpTrack("track", "ViewContent", { content_name: "movie-play", lp_variant: variant }, "movie_play", { lp_variant: variant });
    };
    vf.addEventListener("click", play);
    vf.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });
  }

  /* 2) CTAクリック計測（広告の最適化に使う） ----------------------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-cta]") : null;
    if (!a) return;
    var pos = a.getAttribute("data-cta") || "unknown";
    var kind = a.getAttribute("data-act") || "";   // line / movie
    // ⚠️ 2026-09-02 付け替え：CTAクリックは Lead ではなく ClickLINE（カスタムイベント）。
    //    Lead は「実際の登録」用に温存する（クリックにLeadを付けたままAdvantage+を回すと
    //    「クリックしただけの人」に最適化される誤学習の既知バグ＝docs/18の指摘）。
    lpTrack("trackCustom", "ClickLINE",
            { content_name: pos, lp_variant: variant, cta_type: kind },
            "line_friend_add",
            { cta_position: pos, lp_variant: variant, cta_type: kind });
  });

  /* 3) スクロールで出現 -------------------------------------------- */
  var targets = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
  } else {
    for (var k = 0; k < targets.length; k++) targets[k].classList.add("in");
  }
  // 保険：何かの理由で監視が働かなくても、本文が消えたままにならないようにする
  setTimeout(function () {
    for (var n = 0; n < targets.length; n++) targets[n].classList.add("in");
  }, 2500);

  /* 4) 固定CTAバー（ファーストビューを抜けたら出す / フッター手前で引っ込める） */
  var sticky = document.querySelector(".sticky");
  var hero = document.querySelector(".hero") || document.querySelector(".bhero");
  var lastCta = document.querySelector("#cta-last");
  if (sticky) {
    var onScroll = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var heroH = hero ? hero.offsetHeight - 120 : 400;
      var show = y > heroH;
      if (lastCta) {
        var r = lastCta.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show = false;
      }
      sticky.classList.toggle("show", show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* 5) FAQ：ひとつ開いたら他は閉じる ------------------------------- */
  var ds = document.querySelectorAll(".faq details");
  for (var m = 0; m < ds.length; m++) {
    ds[m].addEventListener("toggle", function () {
      if (!this.open) return;
      for (var n = 0; n < ds.length; n++) if (ds[n] !== this) ds[n].open = false;
    });
  }
})();
