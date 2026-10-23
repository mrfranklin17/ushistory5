/*
 * A simplified map of the thirteen colonies, drawn as SVG from latitude and
 * longitude points. Coastlines and rivers are approximate; they are meant for
 * reading direction, distance and location, not for navigation.
 *
 * Three views share the same data:
 *   'leg'  zooms to one leg of the trip and names both towns
 *   'trip' frames all 10 stops, with numbered, labeled pins
 *   'all'  shows all thirteen colonies
 */
window.RT_MAP = (function () {
  'use strict';

  const COS = Math.cos(39 * Math.PI / 180);
  const VIEW_W = 600;
  const MILES_PER_DEG_LAT = 69;
  const BOUNDS = {
    all: { latMin: 31, latMax: 46, lonMin: -84, lonMax: -66.5 },
    trip: { latMin: 36.5, latMax: 44.2, lonMin: -79.3, lonMax: -69.3 }
  };

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
    'Chickahominy R.': [[37.24, -76.88], [37.4, -77.1], [37.55, -77.35], [37.62, -77.55]],
    'Connecticut R.': [[41.27, -72.35], [41.75, -72.65], [42.1, -72.6], [42.6, -72.55], [43.1, -72.43], [43.6, -72.3], [44.3, -72.0], [45.0, -71.5]],
    'St. Lawrence R.': [[44.2, -76.3], [45.0, -74.7], [45.5, -73.6], [46.0, -72.9]],
    'Lake Champlain': [[43.55, -73.4], [44.0, -73.35], [44.6, -73.3], [45.0, -73.25]]
  };
  // [label, lat, lon, rotation, zoomed]: zoomed labels appear only on close-up maps.
  const riverLabels = [
    ['Hudson R.', 41.65, -73.9, -90, false], ['Delaware R.', 40.75, -75.3, -70, false], ['Susquehanna R.', 40.9, -77.05, -80, false],
    ['James R.', 37.68, -78.3, 0, false], ['Mohawk R.', 43.15, -74.6, 0, false], ['Potomac R.', 39.0, -77.9, 0, false],
    ['York R.', 37.47, -76.5, -35, true], ['James R.', 37.1, -76.95, -20, true], ['Chickahominy R.', 37.47, -77.32, -40, true],
    ['Delaware R.', 40.42, -74.98, -60, true], ['Susquehanna R.', 39.75, -76.38, -60, true], ['Connecticut R.', 42.35, -72.45, -85, true],
    ['Chesapeake Bay', 38.3, -76.25, -75, true], ['Delaware Bay', 39.2, -75.1, -50, true], ['Hudson R.', 42.25, -73.62, -85, true]
  ];

  const proclamation = [[45.0, -71.8], [43.5, -74.2], [42.2, -75.6], [41.2, -77.2], [40.2, -78.6], [39.2, -79.5],
    [38.0, -80.3], [37.0, -81.3], [36.2, -82.0], [35.2, -83.0], [34.5, -83.4]];

  // [label, lat, lon, region, backup spots for close-up maps]
  const colonies = [
    ['MAINE (part of MASS.)', 45.2, -69.4, 'ne', [[44.0, -70.4]]], ['N.H.', 43.75, -71.55, 'ne', [[43.2, -71.4]]],
    ['MASS.', 42.48, -72.2, 'ne', [[42.25, -71.75]]], ['R.I.', 41.68, -71.15, 'ne', []], ['CONN.', 41.62, -72.75, 'ne', [[41.8, -72.4]]],
    ['NEW YORK', 42.6, -75.6, 'mid', [[42.95, -74.6], [41.7, -74.3]]], ['N.J.', 39.7, -74.6, 'mid', [[40.5, -74.5]]],
    ['PENNSYLVANIA', 41.15, -77.9, 'mid', [[40.35, -75.75], [40.4, -77.0]]], ['DEL.', 38.85, -75.45, 'mid', []],
    ['MD.', 38.6, -76.85, 'south', [[39.45, -76.45]]], ['VIRGINIA', 37.6, -79.6, 'south', [[37.75, -77.1]]],
    ['N. CAROLINA', 35.7, -79.6, 'south', []], ['S. CAROLINA', 33.9, -81.2, 'south', []], ['GEORGIA', 32.4, -83.2, 'south', []]
  ];

  // Approximate colony borders (rivers such as the Delaware and Potomac also served as borders).
  const borders = [
    [[42.87, -70.82], [42.75, -71.25], [42.72, -72.46], [42.75, -73.27]],                 // Mass. / N.H.
    [[43.08, -70.7], [43.6, -70.97], [44.5, -71.03], [45.3, -71.08]],                     // N.H. / Maine
    [[42.75, -73.27], [42.05, -73.49], [41.25, -73.52], [41.0, -73.66]],                  // New York / New England
    [[42.05, -73.49], [42.02, -71.8], [42.01, -71.38], [41.8, -71.34], [41.5, -71.12]],   // Mass. / Conn. and R.I.
    [[42.02, -71.8], [41.33, -71.85]],                                                    // Conn. / R.I.
    [[41.36, -74.69], [41.0, -73.9]],                                                     // New York / N.J.
    [[42.0, -79.76], [42.0, -75.36]],                                                     // Pennsylvania / New York
    [[39.72, -80.52], [39.72, -75.79], [39.84, -75.6], [39.8, -75.42]],                   // Mason-Dixon line and Delaware arc
    [[39.72, -75.79], [38.46, -75.7], [38.45, -75.05]],                                   // Del. / Md.
    [[36.55, -75.87], [36.6, -83.7]],                                                     // Virginia / N. Carolina
    [[33.85, -78.54], [34.8, -79.67], [35.2, -80.9], [35.2, -83.1]],                      // N. / S. Carolina
    [[32.03, -80.88], [33.5, -81.9], [34.6, -82.8], [35.0, -83.1]]                        // S. Carolina / Georgia
  ];

  // Approximate homelands of some Native nations. Many more nations lived here.
  const nations = [
    ['Haudenosaunee', 42.95, -76.6], ['Abenaki', 44.6, -71.0], ['Wampanoag', 41.83, -70.95],
    ['Mohegan', 41.45, -72.15], ['Lenape', 41.15, -75.75], ['Shawnee', 39.6, -82.4],
    ['Powhatan', 37.05, -77.35], ['Cherokee', 35.1, -83.25], ['Catawba', 34.75, -80.9], ['Muscogee', 32.0, -83.6]
  ];

  // Where each stop's label sits relative to its pin: [dx, dy, anchor].
  const PIN_LABEL = {
    'Boston': [9, 5, 'start'], 'Lexington': [-9, -6, 'end'], 'Philadelphia': [9, 15, 'start'], 'Trenton': [9, -5, 'start'],
    'Saratoga': [9, 5, 'start'], 'Valley Forge': [-9, -4, 'end'], 'Yorktown': [9, 6, 'start'], 'New York City': [9, 5, 'start']
  };
  const OCEAN_SPOTS = [[38.3, -72.6], [36.0, -71.0], [40.6, -70.6], [42.9, -69.4], [39.6, -73.3], [37.5, -75.0]];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function makeView(b) {
    const K = VIEW_W / ((b.lonMax - b.lonMin) * COS);
    return {
      b: b, K: K, W: VIEW_W, H: (b.latMax - b.latMin) * K,
      xy: function (lat, lon) { return [(lon - b.lonMin) * COS * K, (b.latMax - lat) * K]; },
      inside: function (lat, lon, m) { m = m || 0; return lat > b.latMin + m && lat < b.latMax - m && lon > b.lonMin + m && lon < b.lonMax - m; }
    };
  }

  // A box around one leg, padded so neighboring colonies show for context.
  function legBounds(a, z) {
    const cLat = (a.lat + z.lat) / 2, cLon = (a.lon + z.lon) / 2;
    let h = Math.max(2.6, Math.abs(a.lat - z.lat) + 1.6);
    let w = Math.max(2.2, Math.abs(a.lon - z.lon) + 2.2) * COS;
    if (w / h < 1.1) w = h * 1.1;
    if (w / h > 1.4) h = w / 1.4;
    const lonSpan = w / COS;
    return { latMin: cLat - h / 2, latMax: cLat + h / 2, lonMin: cLon - lonSpan / 2, lonMax: cLon + lonSpan / 2 };
  }

  function f(n) { return n.toFixed(1); }

  /*
   * opts.view:     'leg' | 'trip' | 'all'
   * opts.leg:      { from: {lat, lon, town}, to: {lat, lon, name} } for the leg view
   * opts.stops:    [{lat, lon, n, place, state: 'done'|'partial'|'current'|'future'}]
   * opts.legs:     [{from, to, state}] dashed lines for the trip so far
   * opts.position: {lat, lon} of the travelers, if on the trail
   * opts.native:   show approximate Native homelands
   */
  function render(opts) {
    opts = opts || {};
    const mode = opts.view === 'leg' && opts.leg ? 'leg' : opts.view === 'all' ? 'all' : 'trip';
    const v = makeView(mode === 'leg' ? legBounds(opts.leg.from, opts.leg.to) : BOUNDS[mode]);
    const zoomed = v.K > 110;
    const xy = v.xy;
    const d = function (points, close) {
      return points.map(function (p, i) { const c = xy(p[0], p[1]); return (i ? 'L' : 'M') + f(c[0]) + ' ' + f(c[1]); }).join(' ') + (close ? ' Z' : '');
    };
    const text = function (lat, lon, label, cls, rot, dx, dy, anchor) {
      const c = xy(lat, lon);
      const x = c[0] + (dx || 0), y = c[1] + (dy || 0);
      const t = rot ? ' transform="rotate(' + rot + ' ' + f(x) + ' ' + f(y) + ')"' : '';
      return '<text class="' + cls + '" x="' + f(x) + '" y="' + f(y) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + t + '>' + esc(label) + '</text>';
    };
    const out = [];
    out.push('<svg class="map-svg map-' + mode + '" viewBox="0 0 ' + v.W.toFixed(0) + ' ' + v.H.toFixed(0) + '" role="img" aria-label="' +
      esc(mode === 'leg' ? 'Map from ' + opts.leg.from.town + ' to ' + opts.leg.to.name : mode === 'trip' ? 'Map of all 10 stops' : 'Map of the thirteen colonies') + '">');
    out.push('<rect class="map-sea" x="0" y="0" width="' + v.W.toFixed(0) + '" height="' + v.H.toFixed(0) + '"/>');
    out.push('<path class="map-land" d="' + d(land, true) + '"/>');
    out.push('<path class="map-land" d="' + d(longIsland, true) + '"/>');
    Object.keys(water).forEach(function (k) { out.push('<path class="map-water" d="' + d(water[k], true) + '"/>'); });
    Object.keys(rivers).forEach(function (k) { out.push('<path class="map-river" d="' + d(rivers[k]) + '"/>'); });
    borders.forEach(function (b) { out.push('<path class="map-border" d="' + d(b) + '"/>'); });
    out.push('<path class="map-proclamation" d="' + d(proclamation) + '"/>');
    if (mode === 'all') out.push(text(36.6, -82.9, 'Proclamation Line of 1763 (approx.)', 'map-proc-label', -52));
    else if (v.inside(40.6, -78.1)) out.push(text(40.6, -78.1, 'Proclamation Line of 1763', 'map-proc-label', -50));
    riverLabels.forEach(function (r) { if (r[4] === zoomed) out.push(text(r[1], r[2], r[0], 'map-river-label', r[3])); });
    const ocean = OCEAN_SPOTS.filter(function (o) { return v.inside(o[0], o[1], 0.3); })[0];
    if (ocean) out.push(text(ocean[0], ocean[1], 'ATLANTIC OCEAN', 'map-sea-label'));
    if (mode === 'all') {
      out.push(text(43.7, -79.2, 'L. Ontario', 'map-river-label'));
      out.push(text(42.25, -81.6, 'L. Erie', 'map-river-label'));
      out.push(text(45.7, -76.5, 'QUEBEC (British)', 'map-region-label'));
      out.push(text(38.4, -82.4, 'OHIO COUNTRY', 'map-region-label'));
    }
    if (opts.native) nations.forEach(function (n) { out.push(text(n[1], n[2], n[0], 'map-nation')); });
    colonies.forEach(function (c) {
      const spot = mode === 'leg' ? [[c[1], c[2]]].concat(c[4]).filter(function (q) { return v.inside(q[0], q[1], 0.15); })[0] : [c[1], c[2]];
      if (spot) out.push(text(spot[0], spot[1], c[0], 'map-colony map-colony-' + c[3]));
    });

    if (mode === 'leg') {
      const a = opts.leg.from, z = opts.leg.to;
      const pa = xy(a.lat, a.lon), pz = xy(z.lat, z.lon);
      const westFirst = a.lon <= z.lon;
      out.push('<line class="map-leg map-leg-next" x1="' + f(pa[0]) + '" y1="' + f(pa[1]) + '" x2="' + f(pz[0]) + '" y2="' + f(pz[1]) + '"/>');
      out.push('<rect class="map-landing" x="' + f(pa[0] - 6) + '" y="' + f(pa[1] - 6) + '" width="12" height="12"/>');
      out.push('<text class="map-town" x="' + f(pa[0] + (westFirst ? -12 : 12)) + '" y="' + f(pa[1] + 5) + '" text-anchor="' + (westFirst ? 'end' : 'start') + '">' + esc(a.town.split(',')[0]) + '</text>');
      out.push('<circle class="map-dest" cx="' + f(pz[0]) + '" cy="' + f(pz[1]) + '" r="8"/>');
      out.push('<text class="map-dest-label" x="' + f(pz[0] + (westFirst ? 14 : -14)) + '" y="' + f(pz[1] + 6) + '" text-anchor="' + (westFirst ? 'start' : 'end') + '">' + esc(z.name) + '</text>');
    } else {
      (opts.legs || []).forEach(function (leg) {
        const a = xy(leg.from.lat, leg.from.lon), b = xy(leg.to.lat, leg.to.lon);
        out.push('<line class="map-leg map-leg-' + leg.state + '" x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '"/>');
      });
      (opts.stops || []).forEach(function (m) {
        const c = xy(m.lat, m.lon);
        const pl = PIN_LABEL[m.place] || [9, 5, 'start'];
        const label = m.n + ' ' + m.place;
        out.push('<g class="map-pin map-pin-' + m.state + '"><circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + (mode === 'all' ? 4.5 : 6) + '"/>' +
          '<text x="' + f(c[0] + pl[0]) + '" y="' + f(c[1] + pl[1]) + '" text-anchor="' + pl[2] + '">' + esc(label) + '</text></g>');
      });
    }

    if (opts.position) {
      const p = xy(opts.position.lat, opts.position.lon);
      out.push('<g class="map-you"><circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="6"/>' +
        '<text x="' + f(p[0]) + '" y="' + f(p[1] - 12) + '" text-anchor="middle">YOU</text></g>');
    }

    // Scale bar with a round number of miles, and a compass.
    const pxPerMile = v.K / MILES_PER_DEG_LAT;
    const miles = [10, 25, 50, 100, 200].filter(function (m) { return m * pxPerMile <= 150; }).pop() || 10;
    const bar = miles * pxPerMile;
    const sx = 18, sy = v.H - 22;
    out.push('<g class="map-scale"><rect class="map-chip" x="' + (sx - 8) + '" y="' + (sy - 26) + '" width="' + f(Math.max(bar, 70) + 16) + '" height="36" rx="3"/>' +
      '<line x1="' + sx + '" y1="' + sy + '" x2="' + f(sx + bar) + '" y2="' + sy + '"/>' +
      '<line x1="' + sx + '" y1="' + (sy - 5) + '" x2="' + sx + '" y2="' + (sy + 5) + '"/>' +
      '<line x1="' + f(sx + bar) + '" y1="' + (sy - 5) + '" x2="' + f(sx + bar) + '" y2="' + (sy + 5) + '"/>' +
      '<text x="' + sx + '" y="' + (sy - 9) + '">' + miles + ' miles</text></g>');
    const cx = v.W - 40, cy = v.H - 58;
    out.push('<g class="map-compass"><circle class="map-chip" cx="' + cx + '" cy="' + cy + '" r="38"/>' +
      '<polygon points="' + cx + ',' + (cy - 24) + ' ' + (cx - 7) + ',' + cy + ' ' + (cx + 7) + ',' + cy + '"/>' +
      '<polygon class="map-compass-s" points="' + cx + ',' + (cy + 24) + ' ' + (cx - 7) + ',' + cy + ' ' + (cx + 7) + ',' + cy + '"/>' +
      '<text x="' + cx + '" y="' + (cy - 27) + '">N</text><text x="' + cx + '" y="' + (cy + 36) + '">S</text>' +
      '<text x="' + (cx - 21) + '" y="' + (cy + 5) + '">W</text><text x="' + (cx + 21) + '" y="' + (cy + 5) + '">E</text></g>');
    out.push('</svg>');
    return out.join('');
  }

  // Position partway along a straight line between two points.
  function lerp(a, b, t) {
    return { lat: a.lat + (b.lat - a.lat) * t, lon: a.lon + (b.lon - a.lon) * t };
  }

  return { render: render, lerp: lerp };
})();
