/*
 * Pixel-art scenes drawn on a small canvas and scaled up with crisp pixels.
 *   RT_SCENE.travel(canvas)          the scrolling trail with the Chrono-Cart
 *   RT_SCENE.landmark(canvas, kind)  a still picture for each historic stop
 */
window.RT_SCENE = (function () {
  'use strict';

  const PW = 320, PH = 120;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SKY = {
    winter: ['#8ea6bd', '#b3c3d1', '#d3dce4'], spring: ['#6aa3dc', '#93c0ea', '#c4e0f5'],
    summer: ['#4f95dc', '#7fb7ec', '#b9dcf6'], fall: ['#7c9fcb', '#b7bfc4', '#ecc999'],
    rain: ['#5f6b78', '#7c8792', '#9ea7af'], snow: ['#a9b5c0', '#c5ced6', '#e1e6ea'], night: ['#0f1530', '#1c2448', '#2e3561']
  };
  const HILL = { winter: ['#b9c6d0', '#9fb0bd'], spring: ['#7aa860', '#5d8f4c'], summer: ['#5b9450', '#467a3f'], fall: ['#b58a45', '#93703a'] };
  const GROUND = { winter: '#e8edf1', spring: '#7aab59', summer: '#679d4b', fall: '#b5904c' };
  const ROAD = { winter: '#b7a68c', spring: '#8a6a45', summer: '#94744b', fall: '#86653f' };
  const LEAF = { spring: ['#79b45a', '#5e9a48'], summer: ['#3f7f3a', '#326a30'], fall: ['#d0702a', '#e0a030'] };
  const BOOKS = ['#c8442f', '#3d6fb6', '#e0b040', '#4f9a5a', '#8a4fb0', '#e07a3a', '#2d8c8c'];

  function rect(ctx, c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

  function sky(ctx, colors, h) {
    const band = Math.ceil((h || PH) / colors.length);
    colors.forEach(function (c, i) { rect(ctx, c, 0, i * band, PW, band + 1); });
  }

  function hills(ctx, colors, base, shift) {
    for (let x = 0; x < PW; x++) {
      const y = base + Math.sin((x + shift * 0.15) / 38) * 7 + Math.sin((x + shift * 0.15) / 15) * 3;
      rect(ctx, colors[0], x, y, 1, PH - y);
      const y2 = base + 10 + Math.sin((x + shift * 0.4) / 27) * 5;
      rect(ctx, colors[1], x, y2, 1, PH - y2);
    }
  }

  function pine(ctx, x, y, s, winter) {
    const g = winter ? '#3d5f4a' : '#2f5d3a';
    rect(ctx, '#5a4030', x - 1, y - 4, 2, 4);
    for (let i = 0; i < 4; i++) {
      const w = Math.round((10 - i * 2) * s);
      rect(ctx, g, x - w / 2, y - 6 - i * 5 * s, w, 5 * s);
      if (winter) rect(ctx, '#f4f7f9', x - w / 2 + 1, y - 6 - i * 5 * s, Math.max(2, w - 2), 1);
    }
  }

  function leafTree(ctx, x, y, s, season) {
    rect(ctx, '#5a4030', x - 1, y - 8 * s, 2, 8 * s);
    if (season === 'winter') {
      rect(ctx, '#6b5240', x - 4 * s, y - 14 * s, 1, 6 * s);
      rect(ctx, '#6b5240', x + 3 * s, y - 15 * s, 1, 7 * s);
      rect(ctx, '#6b5240', x - 4 * s, y - 14 * s, 8 * s, 1);
      return;
    }
    const c = LEAF[season];
    rect(ctx, c[1], x - 6 * s, y - 16 * s, 12 * s, 9 * s);
    rect(ctx, c[0], x - 4 * s, y - 19 * s, 8 * s, 6 * s);
  }

  function kid(ctx, x, y, frame, shirt, skin, hair) {
    rect(ctx, hair, x, y - 13, 5, 2);
    rect(ctx, skin, x, y - 11, 5, 3);
    rect(ctx, '#1b1b22', x + 3, y - 10, 1, 1);
    rect(ctx, shirt, x, y - 8, 5, 4);
    rect(ctx, '#2b3550', x, y - 4, 2, frame ? 4 : 3);
    rect(ctx, '#2b3550', x + 3, y - 4, 2, frame ? 3 : 4);
  }

  function cart(ctx, x, y, spin) {
    rect(ctx, '#7c8796', x, y - 18, 26, 2);
    rect(ctx, '#7c8796', x, y - 9, 26, 2);
    rect(ctx, '#7c8796', x, y - 18, 2, 14);
    rect(ctx, '#7c8796', x + 24, y - 18, 2, 14);
    for (let i = 0; i < 10; i++) {
      rect(ctx, BOOKS[i % BOOKS.length], x + 3 + i * 2, y - 16 + (i % 3 === 0 ? 1 : 0), 2, 7 - (i % 3 === 0 ? 1 : 0));
      rect(ctx, BOOKS[(i + 3) % BOOKS.length], x + 3 + i * 2, y - 7 + (i % 4 === 1 ? 1 : 0), 2, 3);
    }
    rect(ctx, '#e8ffb0', x + 20, y - 21, 4, 3); // C.A.R.T.'s little screen
    [x + 4, x + 18].forEach(function (wx) {
      rect(ctx, '#2a2a33', wx, y - 4, 5, 5);
      rect(ctx, '#c9ccd4', wx + (spin % 2 ? 1 : 3), y - 3 + (spin % 2 ? 2 : 0), 1, 1);
    });
  }

  function town(ctx, x, base) {
    const c = '#4a4458';
    [[0, 16, 14], [16, 12, 10], [30, 18, 16], [50, 14, 12], [66, 20, 14]].forEach(function (b) {
      rect(ctx, c, x + b[0], base - b[2], b[1], b[2]);
      for (let i = 0; i < b[1] / 2; i++) rect(ctx, c, x + b[0] + i, base - b[2] - i / 2 - 1, b[1] - i * 2, 1);
      rect(ctx, '#f2c25e', x + b[0] + 3, base - b[2] + 4, 2, 2);
    });
    rect(ctx, c, x + 88, base - 34, 6, 34);
    for (let i = 0; i < 8; i++) rect(ctx, c, x + 91 - i / 3, base - 34 - i * 2, Math.max(1, 6 - i * 0.7), 2);
  }

  function seasonOf(month) {
    if (month === 11 || month <= 1) return 'winter';
    if (month <= 4) return 'spring';
    if (month <= 7) return 'summer';
    return 'fall';
  }

  function travel(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = PW; canvas.height = PH;
    const opts = { season: 'winter', weather: 'clear', townIn: 0, coats: 0 };
    let shift = 0, tick = 0, running = false, raf = 0;
    const trees = [];
    for (let i = 0; i < 12; i++) trees.push({ x: i * 34 + (i * 53) % 17, pine: i % 3 !== 1, s: 0.8 + ((i * 7) % 5) / 10 });
    const drops = [];
    for (let i = 0; i < 60; i++) drops.push({ x: (i * 97) % PW, y: (i * 61) % PH, v: 0.5 + (i % 5) / 4 });

    function draw() {
      const s = opts.season;
      const skyKey = opts.weather === 'rain' || opts.weather === 'storm' ? 'rain' : opts.weather === 'snow' ? 'snow' : s;
      sky(ctx, SKY[skyKey], 70);
      hills(ctx, HILL[s], 56, shift);
      rect(ctx, GROUND[s], 0, 86, PW, PH - 86);
      trees.forEach(function (t) {
        const x = ((t.x - shift * 0.9) % (PW + 60) + PW + 60) % (PW + 60) - 30;
        if (t.pine) pine(ctx, x, 88, t.s, s === 'winter'); else leafTree(ctx, x, 88, t.s, s);
      });
      if (opts.townIn > 0) town(ctx, PW - opts.townIn * 130, 88);
      rect(ctx, ROAD[s], 0, 96, PW, 12);
      for (let x = -20; x < PW + 20; x += 22) rect(ctx, 'rgba(0,0,0,0.12)', x - (shift % 22), 101, 8, 1);
      const frame = Math.floor(tick / 8) % 2;
      const coatA = opts.coats > 0 ? '#7a5634' : '#2d8c8c';
      const coatB = opts.coats > 1 ? '#5c4a7a' : '#e07a3a';
      kid(ctx, 140, 104, frame, coatA, '#a0673f', '#2a1c14');
      cart(ctx, 147, 104, Math.floor(tick / 4));
      kid(ctx, 179, 104, 1 - frame, coatB, '#e2b48a', '#6b3f1f');
      if (opts.weather === 'rain' || opts.weather === 'storm') {
        drops.forEach(function (d) { rect(ctx, 'rgba(210,225,240,0.7)', d.x, d.y, 1, 3); });
      } else if (opts.weather === 'snow') {
        drops.forEach(function (d) { rect(ctx, '#ffffff', d.x, d.y, 1, 1); });
      }
    }

    function step() {
      if (!running) return;
      tick++;
      shift += 0.7;
      drops.forEach(function (d) {
        d.y += opts.weather === 'snow' ? d.v * 0.6 : d.v * 3;
        d.x -= opts.weather === 'snow' ? 0.3 : 1;
        if (d.y > PH) { d.y = 0; d.x = (d.x + 137) % PW; }
        if (d.x < 0) d.x += PW;
      });
      draw();
      raf = window.requestAnimationFrame(step);
    }

    draw();
    return {
      set: function (o) { Object.assign(opts, o); if (!running) draw(); },
      start: function () { if (running || reduceMotion) { draw(); return; } running = true; raf = window.requestAnimationFrame(step); },
      stop: function () { running = false; window.cancelAnimationFrame(raf); draw(); }
    };
  }

  function landmark(canvas, kind, season) {
    const ctx = canvas.getContext('2d');
    canvas.width = PW; canvas.height = PH;
    const s = season || 'summer';
    const brick = '#9c4a35', trim = '#efe6d2', dark = '#3a3346';
    switch (kind) {
      case 'harbor': {
        sky(ctx, SKY.night, 80);
        for (let i = 0; i < 30; i++) rect(ctx, '#e8e2c8', (i * 53) % PW, (i * 29) % 50, 1, 1);
        rect(ctx, '#f2e7b0', 268, 14, 8, 8);
        rect(ctx, '#1d2c4a', 0, 78, PW, 42);
        for (let i = 0; i < 18; i++) rect(ctx, '#2f4470', (i * 41) % PW, 84 + (i * 7) % 30, 10, 1);
        rect(ctx, '#4a3626', 0, 72, 70, 8);
        [[90, 1], [165, 0.9], [235, 1.1]].forEach(function (sh) {
          const x = sh[0], k = sh[1];
          rect(ctx, '#2a1f18', x, 70, 50 * k, 10);
          rect(ctx, '#3d2d22', x + 4, 66, 42 * k, 5);
          rect(ctx, '#2a1f18', x + 14 * k, 26, 2, 42);
          rect(ctx, '#2a1f18', x + 32 * k, 32, 2, 36);
          rect(ctx, '#2a1f18', x + 6, 38, 34 * k, 1);
          rect(ctx, '#f2c25e', x + 10, 72, 2, 2);
        });
        for (let i = 0; i < 6; i++) rect(ctx, '#8a6a3c', 96 + i * 26, 86 + (i % 3) * 6, 6, 4);
        break;
      }
      case 'hall': {
        sky(ctx, SKY[s], 90);
        rect(ctx, GROUND[s], 0, 92, PW, 28);
        rect(ctx, brick, 70, 50, 180, 44);
        for (let i = 0; i < 9; i++) { rect(ctx, trim, 80 + i * 19, 58, 8, 11); rect(ctx, trim, 80 + i * 19, 76, 8, 11); }
        rect(ctx, '#5a2c22', 70, 46, 180, 5);
        rect(ctx, brick, 146, 24, 28, 28);
        rect(ctx, trim, 150, 30, 20, 4);
        rect(ctx, trim, 152, 12, 16, 12);
        rect(ctx, '#e0d6bf', 156, 2, 8, 10);
        rect(ctx, '#5a2c22', 159, 0, 2, 3);
        rect(ctx, '#3a2a20', 154, 82, 12, 12);
        leafTree(ctx, 40, 94, 1.4, s); leafTree(ctx, 285, 94, 1.3, s);
        break;
      }
      case 'green': {
        sky(ctx, ['#e8a87c', '#f0c79a', '#f6e1bf'], 80);
        rect(ctx, '#f5e6a0', 40, 30, 10, 10);
        hills(ctx, HILL.spring, 64, 0);
        rect(ctx, '#7aab59', 0, 88, PW, 32);
        rect(ctx, trim, 200, 54, 60, 36);
        rect(ctx, '#7a3a2a', 196, 50, 68, 5);
        rect(ctx, trim, 222, 28, 16, 26);
        rect(ctx, trim, 226, 12, 8, 16);
        rect(ctx, '#3a3346', 229, 4, 2, 9);
        for (let i = 0; i < 9; i++) kid(ctx, 40 + i * 14, 106, i % 2, '#5c6f8a', i % 2 ? '#a0673f' : '#e2b48a', '#2a1c14');
        for (let i = 0; i < 6; i++) kid(ctx, 250 + i * 10, 112, i % 2, '#c8442f', '#e2b48a', '#d8d8d8');
        break;
      }
      case 'river': {
        const icy = s === 'winter';
        sky(ctx, icy ? SKY.snow : SKY[s], 60);
        rect(ctx, GROUND[s], 0, 58, PW, 14);
        for (let i = 0; i < 8; i++) { if (i % 2 || icy) pine(ctx, 10 + i * 40, 66, 0.8, icy); else leafTree(ctx, 10 + i * 40, 66, 0.8, s); }
        rect(ctx, icy ? '#41566e' : '#3e5f86', 0, 72, PW, 48);
        for (let i = 0; i < 24; i++) rect(ctx, icy ? '#dfe8ee' : '#5f80a8', (i * 67) % PW, 76 + (i * 13) % 40, 6 + (i % 4) * 3, icy ? 2 : 1);
        rect(ctx, '#3a2a20', 100, 92, 110, 8);
        rect(ctx, '#5a4030', 104, 90, 102, 3);
        for (let i = 0; i < 9; i++) kid(ctx, 108 + i * 11, 92, i % 2, i === 4 ? '#3d6fb6' : '#6a5a4a', '#e2b48a', '#2a1c14');
        rect(ctx, '#5a4030', 214, 76, 1, 24);
        break;
      }
      case 'battlefield': {
        sky(ctx, SKY.fall, 70);
        hills(ctx, HILL.fall, 52, 30);
        rect(ctx, GROUND.fall, 0, 90, PW, 30);
        for (let x = 0; x < PW; x += 12) { rect(ctx, '#6b5034', x, 96, 1, 8); rect(ctx, '#6b5034', x, 98, 12, 1); }
        [[40, '#efe6d2'], [70, '#efe6d2'], [100, '#efe6d2']].forEach(function (t) {
          for (let i = 0; i < 10; i++) rect(ctx, t[1], t[0] + i, 88 - i, 20 - i * 2, 1);
        });
        rect(ctx, '#3a2a20', 240, 50, 1, 40);
        rect(ctx, '#3d6fb6', 241, 50, 16, 10);
        rect(ctx, '#3a2a20', 200, 58, 1, 32);
        rect(ctx, '#c8442f', 201, 58, 14, 9);
        leafTree(ctx, 160, 92, 1.5, 'fall'); leafTree(ctx, 290, 92, 1.3, 'fall');
        break;
      }
      case 'camp': {
        sky(ctx, SKY.winter, 70);
        hills(ctx, HILL.winter, 54, 60);
        rect(ctx, GROUND.winter, 0, 84, PW, 36);
        for (let row = 0; row < 2; row++) {
          for (let i = 0; i < 7; i++) {
            const x = 18 + i * 44 + row * 20, y = 92 + row * 16;
            rect(ctx, '#6b4a30', x, y - 12, 26, 12);
            for (let k = 0; k < 4; k++) rect(ctx, '#553a26', x, y - 12 + k * 3, 26, 1);
            rect(ctx, '#f4f7f9', x - 2, y - 14, 30, 3);
            rect(ctx, '#3a2a20', x + 10, y - 7, 5, 7);
            for (let k = 0; k < 4; k++) rect(ctx, 'rgba(200,205,210,0.7)', x + 22 + (k % 2), y - 18 - k * 4, 3, 3);
          }
        }
        break;
      }
      case 'siege': {
        sky(ctx, SKY.fall, 70);
        rect(ctx, '#3e5f86', 0, 60, PW, 12);
        for (let i = 0; i < 4; i++) { rect(ctx, '#2a1f18', 30 + i * 70, 54, 24, 6); rect(ctx, '#2a1f18', 40 + i * 70, 36, 1, 18); rect(ctx, '#efe6d2', 41 + i * 70, 38, 8, 10); }
        rect(ctx, '#9b7c4a', 0, 72, PW, 48);
        for (let r = 0; r < 3; r++) rect(ctx, '#7a5f38', 0, 82 + r * 12, PW, 4);
        for (let i = 0; i < 5; i++) {
          const x = 30 + i * 58;
          rect(ctx, '#2a2a33', x, 104, 18, 4);
          rect(ctx, '#5a4030', x + 2, 107, 4, 4);
          rect(ctx, '#5a4030', x + 12, 107, 4, 4);
        }
        rect(ctx, '#3a2a20', 270, 40, 1, 32);
        rect(ctx, '#ffffff', 271, 40, 14, 9);
        break;
      }
      case 'city': {
        sky(ctx, SKY.spring, 70);
        rect(ctx, '#9aa0a8', 0, 96, PW, 24);
        [[0, 34, 50], [36, 30, 44], [216, 32, 46], [250, 36, 52], [288, 32, 44]].forEach(function (b) {
          rect(ctx, b[0] % 2 ? brick : '#7a5a4a', b[0], 96 - b[2], b[1], b[2]);
          for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) rect(ctx, trim, b[0] + 6 + c * 14, 96 - b[2] + 8 + r * 13, 6, 7);
        });
        rect(ctx, '#d8cfbd', 82, 40, 120, 56);
        for (let i = 0; i < 6; i++) rect(ctx, '#efe6d2', 90 + i * 19, 52, 6, 44);
        rect(ctx, '#b8ae9b', 78, 34, 128, 7);
        rect(ctx, '#3a3346', 120, 62, 44, 3);
        rect(ctx, '#3d6fb6', 140, 54, 3, 8);
        for (let i = 0; i < 26; i++) kid(ctx, 6 + i * 12, 118, i % 2, BOOKS[i % BOOKS.length], i % 3 ? '#e2b48a' : '#a0673f', '#2a1c14');
        break;
      }
      default:
        sky(ctx, SKY[s], PH);
    }
  }

  return { travel: travel, landmark: landmark, seasonOf: seasonOf };
})();
