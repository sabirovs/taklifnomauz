/* 3D surg'uch muhrning tushishi — JavaScript bilan (har kadrda), CSS kalit kadrlarisiz.
   Nega: iPhone (eski iOS WebKit / Telegram) `translate(-50%, calc(-50% + 33vh))` kabi foiz + vh aralash
   calc() li kalit kadrlarni bajarmay, muhr taklifnoma ustida qotib qolardi. Bu yerda faqat oddiy px qiymatlar.
   Tugagach muhr va soyasi DOM'dan butunlay olib tashlanadi (iOS'da eski 3D qatlam ekranda qolmasin).

   SealFall({ seal, shadow, fallVh, bounceVh, dur })
     fallVh   — qancha pastga tushadi (ekran balandligidan %)
     bounceVh — yerga tekkach qancha sakraydi
     dur      — umumiy davomiylik (ms) */
(function () {
  "use strict";
  // cubic-bezier(x1,y1,x2,y2) — CSS'dagi kabi easing
  function bez(x1, y1, x2, y2) {
    return function (t) {
      var s = t;
      for (var i = 0; i < 8; i++) {
        var x = ((1 - 3 * x2 + 3 * x1) * s + (3 * x2 - 6 * x1)) * s * s + 3 * x1 * s - t;
        var dx = 3 * (1 - 3 * x2 + 3 * x1) * s * s + 2 * (3 * x2 - 6 * x1) * s + 3 * x1;
        if (Math.abs(dx) < 1e-6) break;
        s = Math.max(0, Math.min(1, s - x / dx));
      }
      return ((1 - 3 * y2 + 3 * y1) * s + (3 * y2 - 6 * y1)) * s * s + 3 * y1 * s;
    };
  }
  var FALL = bez(.5, 0, .9, .55),   // tortishish: sekin boshlanib tezlashadi
      UP = bez(.1, .5, .4, 1),      // sakrash yuqoriga
      DOWN = bez(.6, 0, .9, .5),    // qayta tushish
      GONE = bez(.42, 0, 1, 1);     // yo'qolish
  function lerp(a, b, k) { return a + (b - a) * k; }

  window.SealFall = function (o) {
    var seal = o.seal, sh = o.shadow;
    if (!seal || seal.__falling) return;
    seal.__falling = true;
    var H = window.innerHeight, D = (o.fallVh || 30) * H / 100, B = (o.bounceVh || 4) * H / 100, dur = o.dur || 3000;
    seal.style.animation = "none";
    if (sh) sh.style.animation = "none";

    // [y px, rotateY, rotateX, scaleX, scaleY, soya opacity, soya scale]
    function state(p) {
      var k;
      if (p < .7)  { k = FALL(p / .7);         return [lerp(0, D, k), lerp(0, 320, k), lerp(8, 14, k), 1, 1, lerp(0, 1, k), lerp(.25, 1, k)]; }
      if (p < .8)  { k = UP((p - .7) / .1);    return [lerp(D, D - B, k), lerp(320, 348, k), lerp(14, 10, k), 1, 1, lerp(1, .65, k), lerp(1, .82, k)]; }
      if (p < .88) { k = DOWN((p - .8) / .08); return [lerp(D - B, D, k), lerp(348, 360, k), lerp(10, 12, k), 1, lerp(1, .94, k), lerp(.65, 1, k), lerp(.82, 1.06, k)]; }
      k = GONE((p - .88) / .12);                return [D, 360, 12, lerp(1, .001, k), lerp(.94, .001, k), lerp(1, 0, k), lerp(1.06, .3, k)];
    }
    var t0 = 0, finished = false;
    function done() {
      if (finished) return; finished = true;
      if (seal.parentNode) seal.parentNode.removeChild(seal);
      if (sh && sh.parentNode) sh.parentNode.removeChild(sh);
    }
    function frame(now) {
      if (finished) return;
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / dur), s = state(p);
      seal.style.transform = "translate(-50%,-50%) translateY(" + s[0].toFixed(1) + "px) rotateY(" + s[1].toFixed(1) + "deg) rotateX(" +
        s[2].toFixed(1) + "deg) scale(" + s[3].toFixed(3) + "," + s[4].toFixed(3) + ")";
      if (sh) { sh.style.opacity = s[5].toFixed(3); sh.style.transform = "translateX(-50%) scale(" + s[6].toFixed(3) + ")"; }
      if (p < 1) requestAnimationFrame(frame); else done();
    }
    requestAnimationFrame(frame);
    // KAFOLAT: kadrlar to'xtab qolsa ham (sahifa fonda va h.k.), vaqti kelganda muhr baribir olib tashlanadi
    setTimeout(done, dur + 400);
  };
})();
