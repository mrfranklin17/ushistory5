/*
 * A simplified map of the thirteen colonies, drawn as SVG from latitude and
 * longitude points. Coastlines and rivers are approximate; they are meant for
 * reading direction, distance and location, not for navigation.
 */
window.RT_MAP = (function () {
  'use strict';

  const B = { latMin: 31, latMax: 46, lonMin: -84, lonMax: -66.5 };
  const K = 40; // pixels per degree of latitude
  const COS = Math.cos(39 * Math.PI / 180);
  const W = (B.lonMax - B.lonMin) * COS * K;
  const H = (B.latMax - B.latMin) * K;
  const MILES_PER_DEG_LAT = 69;

  function xy(lat, lon) {
    return [(lon - B.lonMin) * COS * K, (B.latMax - lat) * K];
  }

  function d(points, close) {
    return points.map(function (p, i) {
      const c = xy(p[0], p[1]);
      return (i ? 'L' : 'M') + c[0].toFixed(1) + ' ' + c[1].toFixed(1);
    }).join(' ') + (close ? ' Z' : '');
  }

  // Atlantic coast from Maine (northeast) to Georgia (southwest).
  const coast = [
    [45.1, -67.0], [44.8, -67.2], [44.5, -67.8], [44.4, -68.3], [44.2, -68.8], [44.0, -69.3], [43.8, -69.8],
    [43.65, -70.25], [43.4, -70.4], [43.07, -70.72], [42.85, -70.82], [42.65, -70.62], [42.55, -70.85],
    [42.4, -70.98], [42.33, -71.03], [42.25, -70.9], [41.96, -70.67], [41.77, -70.5], [41.75, -70.15],
    [41.93, -70.03], [42.06, -70.2], [42.0, -70.05], [41.85, -69.95], [41.68, -69.94], [41.65, -70.3],
    [41.53, -70.67], [41.6, -70.9], [41.5, -71.1], [41.45, -71.42], [41.35, -71.85], [41.3, -72.1],
    [41.27, -72.5], [41.25, -72.9], [41.1, -73.3], [41.0, -73.65], [40.85, -73.8], [40.7, -74.0],
    [40.6, -74.05], [40.48, -74.0], [40.25, -74.0], [39.95, -74.08], [39.7, -74.15], [39.37, -74.42],
    [39.1, -74.7], [38.93, -74.92], [38.78, -75.08], [38.45, -75.05], [38.2, -75.18], [37.9, -75.35],
    [37.6, -75.6], [37.3, -75.82], [37.12, -75.95], [36.93, -76.0], [36.6, -75.9], [36.2, -75.75],
    [35.8, -75.55], [35.25, -75.52], [35.1, -75.95], [34.85, -76.35], [34.65, -76.6], [34.6, -77.1],
    [34.3, -77.7], [33.88, -77.98], [33.85, -78.4], [33.6, -79.0], [33.2, -79.2], [32.75, -79.88],
    [32.5, -80.4], [32.15, -80.75], [31.85, -81.1], [31.4, -81.3], [31.0, -81.4]
  ];
  const land = [[46, -84], [46, -67.75], [45.6, -67.4]].concat(coast, [[31, -84]]);

  const water = {
    chesapeake: [[37.12, -75.97], [37.4, -75.9], [37.7, -75.85], [37.95, -75.85], [38.2, -76.0], [38.45, -76.1],
      [38.75, -76.2], [39.0, -76.15], [39.3, -76.05], [39.53, -76.05], [39.4, -76.35], [39.2, -76.45],
      [38.95, -76.45], [38.6, -76.45], [38.3, -76.38], [38.0, -76.3], [37.7, -76.3], [37.4, -76.3],
      [37.1, -76.3], [36.95, -76.15]],
    delawareBay: [[38.93, -74.92], [39.1, -74.88], [39.25, -75.05], [39.45, -75.35], [39.6, -75.55],
      [39.45, -75.6], [39.25, -75.42], [39.0, -75.3], [38.78, -75.1]],
    ontario: [[43.25, -79.8], [43.6, -79.4], [43.9, -78.5], [43.95, -77.5], [44.2, -76.5], [43.9, -76.1],
      [43.45, -76.5], [43.3, -77.6], [43.3, -78.9]],
    erie: [[41.7, -83.4], [41.5, -82.5], [41.5, -81.6], [41.9, -80.5], [42.2, -79.8], [42.85, -78.9],
      [42.85, -79.6], [42.6, -80.5], [42.3, -81.6], [42.0, -82.6]]
  };
  const longIsland = [[40.6, -74.0], [40.57, -73.7], [40.62, -73.3], [40.75, -72.8], [40.87, -72.4],
    [41.07, -71.86], [41.0, -72.15], [40.98, -72.6], [40.95, -73.05], [40.9, -73.5], [40.8, -73.78], [40.7, -73.95]];

  const rivers = {
    'Hudson R.': [[40.7, -74.02], [41.0, -73.92], [41.4, -73.95], [41.9, -73.95], [42.3, -73.78], [42.65, -73.75], [43.0, -73.62], [43.3, -73.6]],
    'Mohawk R.': [[42.78, -73.68], [42.82, -73.95], [42.95, -74.4], [43.05, -74.9], [43.12, -75.25], [43.2, -75.45]],
    'Delaware R.': [[39.6, -75.55], [39.75, -75.48], [39.95, -75.14], [40.1, -74.85], [40.22, -74.77], [40.3, -74.86], [40.6, -75.2], [41.0, -75.1], [41.4, -74.75], [41.9, -75.2], [42.3, -75.4]],
    'Susquehanna R.': [[39.53, -76.08], [39.9, -76.4], [40.03, -76.52], [40.27, -76.88], [40.85, -76.8], [41.25, -76.0], [42.0, -76.2], [42.5, -75.4]],
    'Potomac R.': [[38.0, -76.3], [38.25, -76.95], [38.6, -77.2], [38.88, -77.05], [39.3, -77.6], [39.6, -78.2]],
    'James R.': [[36.95, -76.35], [37.15, -76.75], [37.3, -77.2], [37.54, -77.43], [37.6, -78.1], [37.6, -78.8]],
    'York R.': [[37.25, -76.32], [37.4, -76.65], [37.55, -76.8]],
    'Connecticut R.': [[41.27, -72.35], [41.75, -72.65], [42.1, -72.6], [42.6, -72.55], [43.1, -72.43], [43.6, -72.3], [44.3, -72.0], [45.0, -71.5]],
    'St. Lawrence R.': [[44.2, -76.3], [45.0, -74.7], [45.5, -73.6], [46.0, -72.9]],
    'Lake Champlain': [[43.55, -73.4], [44.0, -73.35], [44.6, -73.3], [45.0, -73.25]]
  };
  const riverLabels = [
    ['Hudson R.', 41.65, -73.9, -90], ['Delaware R.', 40.75, -75.3, -70], ['Susquehanna R.', 40.9, -77.05, -80],
    ['James R.', 37.68, -78.3, 0], ['Mohawk R.', 43.15, -74.6, 0], ['Potomac R.', 39.0, -77.9, 0], ['York R.', 37.55, -76.6, 0]
  ];

  const proclamation = [[45.0, -71.8], [43.5, -74.2], [42.2, -75.6], [41.2, -77.2], [40.2, -78.6], [39.2, -79.5],
    [38.0, -80.3], [37.0, -81.3], [36.2, -82.0], [35.2, -83.0], [34.5, -83.4]];

  const colonies = [
    ['MAINE (part of MASS.)', 45.2, -69.4, 'ne'], ['N.H.', 43.75, -71.55, 'ne'], ['MASS.', 42.48, -72.2, 'ne'],
    ['R.I.', 41.68, -71.15, 'ne'], ['CONN.', 41.62, -72.75, 'ne'], ['NEW YORK', 42.6, -75.6, 'mid'],
    ['N.J.', 40.15, -74.45, 'mid'], ['PENNSYLVANIA', 41.15, -77.9, 'mid'], ['DEL.', 38.85, -75.45, 'mid'],
    ['MD.', 38.6, -76.85, 'south'], ['VIRGINIA', 37.6, -79.6, 'south'], ['N. CAROLINA', 35.7, -79.6, 'south'],
    ['S. CAROLINA', 33.9, -81.2, 'south'], ['GEORGIA', 32.4, -83.2, 'south']
  ];

  // Approximate homelands of some Native nations. Many more nations lived here.
  const nations = [
    ['Haudenosaunee', 42.95, -76.6], ['Abenaki', 44.6, -71.0], ['Wampanoag', 41.83, -70.95],
    ['Mohegan', 41.45, -72.15], ['Lenape', 41.15, -75.75], ['Shawnee', 39.6, -82.4],
    ['Powhatan', 37.05, -77.35], ['Cherokee', 35.1, -83.25], ['Catawba', 34.75, -80.9], ['Muscogee', 32.0, -83.6]
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function text(lat, lon, label, cls, rot) {
    const c = xy(lat, lon);
    const t = rot ? ' transform="rotate(' + rot + ' ' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ')"' : '';
    return '<text class="' + cls + '" x="' + c[0].toFixed(1) + '" y="' + c[1].toFixed(1) + '"' + t + '>' + esc(label) + '</text>';
  }

  /*
   * opts.landmarks: [{lat, lon, name, n, state: 'done'|'current'|'future'}]
   * opts.legs:      [{from:{lat,lon,town}, to:{lat,lon}, state}]
   * opts.position:  {lat, lon} of the travelers, if on the trail
   * opts.native:    show approximate Native homelands
   * opts.labels:    show colony labels (default true)
   */
  function render(opts) {
    opts = opts || {};
    const out = [];
    out.push('<svg class="map-svg" viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '" role="img" aria-label="Map of the thirteen colonies">');
    out.push('<rect class="map-sea" x="0" y="0" width="' + W.toFixed(0) + '" height="' + H.toFixed(0) + '"/>');
    out.push('<path class="map-land" d="' + d(land, true) + '"/>');
    out.push('<path class="map-land" d="' + d(longIsland, true) + '"/>');
    Object.keys(water).forEach(function (k) { out.push('<path class="map-water" d="' + d(water[k], true) + '"/>'); });
    Object.keys(rivers).forEach(function (k) { out.push('<path class="map-river" d="' + d(rivers[k]) + '"/>'); });
    out.push('<path class="map-proclamation" d="' + d(proclamation) + '"/>');
    out.push(text(36.6, -82.9, 'Proclamation Line of 1763 (approx.)', 'map-proc-label', -52));
    riverLabels.forEach(function (r) { out.push(text(r[1], r[2], r[0], 'map-river-label', r[3])); });
    out.push(text(36.0, -71.0, 'ATLANTIC OCEAN', 'map-sea-label'));
    out.push(text(43.7, -79.2, 'L. Ontario', 'map-river-label'));
    out.push(text(42.25, -81.6, 'L. Erie', 'map-river-label'));
    out.push(text(45.7, -76.5, 'QUEBEC (British)', 'map-region-label'));
    out.push(text(38.4, -82.4, 'OHIO COUNTRY', 'map-region-label'));

    if (opts.native) {
      nations.forEach(function (n) { out.push(text(n[1], n[2], n[0], 'map-nation')); });
    }
    if (opts.labels !== false) {
      colonies.forEach(function (c) { out.push(text(c[1], c[2], c[0], 'map-colony map-colony-' + c[3])); });
    }

    (opts.legs || []).forEach(function (leg) {
      const a = xy(leg.from.lat, leg.from.lon), b = xy(leg.to.lat, leg.to.lon);
      out.push('<line class="map-leg map-leg-' + leg.state + '" x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"/>');
      out.push('<rect class="map-landing" x="' + (a[0] - 3).toFixed(1) + '" y="' + (a[1] - 3).toFixed(1) + '" width="6" height="6"/>');
      if (leg.state === 'current') {
        out.push('<text class="map-town" x="' + (a[0] + 7).toFixed(1) + '" y="' + (a[1] + 4).toFixed(1) + '">' + esc(leg.from.town.split(',')[0]) + '</text>');
      }
    });

    (opts.landmarks || []).forEach(function (m) {
      const c = xy(m.lat, m.lon);
      const label = String(m.n);
      const w = Math.max(14, 8 + label.length * 6);
      out.push('<g class="map-pin map-pin-' + m.state + '"><rect x="' + (c[0] - w / 2).toFixed(1) + '" y="' + (c[1] - 7).toFixed(1) + '" width="' + w + '" height="14" rx="7"/>' +
        '<text x="' + c[0].toFixed(1) + '" y="' + (c[1] + 3.5).toFixed(1) + '">' + esc(label) + '</text></g>');
    });

    if (opts.position) {
      const p = xy(opts.position.lat, opts.position.lon);
      out.push('<g class="map-you"><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5"/>' +
        '<text x="' + (p[0] + 8).toFixed(1) + '" y="' + (p[1] - 6).toFixed(1) + '">YOU</text></g>');
    }

    // Scale bar (100 miles) and compass.
    const bar = 100 / MILES_PER_DEG_LAT * K;
    const sx = 20, sy = H - 24;
    out.push('<g class="map-scale"><line x1="' + sx + '" y1="' + sy + '" x2="' + (sx + bar).toFixed(1) + '" y2="' + sy + '"/>' +
      '<line x1="' + sx + '" y1="' + (sy - 5) + '" x2="' + sx + '" y2="' + (sy + 5) + '"/>' +
      '<line x1="' + (sx + bar).toFixed(1) + '" y1="' + (sy - 5) + '" x2="' + (sx + bar).toFixed(1) + '" y2="' + (sy + 5) + '"/>' +
      '<text x="' + sx + '" y="' + (sy - 9) + '">0</text><text x="' + (sx + bar - 18).toFixed(1) + '" y="' + (sy - 9) + '">100 miles</text></g>');
    const cx = W - 46, cy = H - 70;
    out.push('<g class="map-compass">' +
      '<polygon points="' + cx + ',' + (cy - 26) + ' ' + (cx - 7) + ',' + cy + ' ' + (cx + 7) + ',' + cy + '"/>' +
      '<polygon class="map-compass-s" points="' + cx + ',' + (cy + 26) + ' ' + (cx - 7) + ',' + cy + ' ' + (cx + 7) + ',' + cy + '"/>' +
      '<text x="' + cx + '" y="' + (cy - 31) + '">N</text><text x="' + cx + '" y="' + (cy + 41) + '">S</text>' +
      '<text x="' + (cx - 22) + '" y="' + (cy + 4) + '">W</text><text x="' + (cx + 22) + '" y="' + (cy + 4) + '">E</text></g>');
    out.push('</svg>');
    return out.join('');
  }

  // Position partway along a straight line between two points.
  function lerp(a, b, t) {
    return { lat: a.lat + (b.lat - a.lat) * t, lon: a.lon + (b.lon - a.lon) * t };
  }

  return { render: render, lerp: lerp };
})();
