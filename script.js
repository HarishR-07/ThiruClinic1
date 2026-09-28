(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var NUM = '918608541110';
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine = matchMedia('(hover:hover)').matches;
  var wa = function (t) { return 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(t); };
  var mode = 0, px = 0, py = 0;

  $$('[data-wa]').forEach(function (a) { a.href = wa('Hello, I would like to book a physiotherapy visit.'); });
  $('#map').href = 'https://www.google.com/maps/search/?api=1&query=Thiru+Physiotherapy+Clinic+Ganapathy+Coimbatore';

  // split headline into words for the entrance
  $$('[data-split]').forEach(function (h) {
    h.setAttribute('aria-label', h.textContent);
    h.innerHTML = h.textContent.split(' ').map(function (w, i) {
      return '<span class="w" aria-hidden="true"><i style="--i:' + i + '">' + w + '</i></span>';
    }).join('');
  });

  // header, progress bar
  var nav = $('#nav'), prog = $('#prog');
  var onScroll = function () {
    nav.classList.toggle('on', scrollY > 30);
    var m = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (m > 0 ? scrollY / m : 0) + ')';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // treatment accordion drives the 3D scene
  $$('#acc button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#acc button').forEach(function (o) { o.classList.remove('open'); o.setAttribute('aria-expanded', 'false'); });
      b.classList.add('open'); b.setAttribute('aria-expanded', 'true');
      mode = +b.dataset.m;
    });
  });

  addEventListener('pointermove', function (e) {
    px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5;
    var g = $('.glow'); g.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  });

  // 3D 
  function scene() {
    var T = window.THREE; if (!T) return;
    var cv = $('#gl'), r;
    try { r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { return; }
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    var s = new T.Scene(), cam = new T.PerspectiveCamera(40, 1, .1, 50); cam.position.z = 8;
    var rig = new T.Group(); s.add(rig);
    s.add(new T.AmbientLight(0xffffff, .55));
    var l1 = new T.PointLight(0x6ef0dc, 1.6, 30); l1.position.set(3, 3, 5); s.add(l1);
    var l2 = new T.PointLight(0xffc069, .9, 30); l2.position.set(-4, -2, 4); s.add(l2);

    var N = 13, vs = [], base = new T.MeshStandardMaterial({ color: 0xe6fbf7, roughness: .22, metalness: .15, emissive: 0x2ad6c0, emissiveIntensity: .2 });
    for (var i = 0; i < N; i++) {
      var g = new T.Group(), m = base.clone(), k = 1 - i * .028;
      var b = new T.Mesh(new T.SphereGeometry(1, 28, 18), m); b.scale.set(.62 * k, .15, .5 * k); g.add(b);
      var sp = new T.Mesh(new T.CylinderGeometry(.045, .07, .62, 10), m); sp.rotation.x = Math.PI / 2.6; sp.position.set(0, .05, -.5 * k); g.add(sp);
      var tp = new T.Mesh(new T.CylinderGeometry(.04, .04, 1.3 * k, 10), m); tp.rotation.z = Math.PI / 2; tp.position.z = -.28 * k; g.add(tp);
      g.position.set(Math.sin(i * .5) * .3, (i - N / 2) * .36, 0); g.rotation.z = Math.cos(i * .5) * .07;
      rig.add(g); vs.push(m);
    }
    var rings = [0, 1, 2].map(function (i) {
      var o = new T.Mesh(new T.TorusGeometry(1, .009, 8, 120), new T.MeshBasicMaterial({ color: 0x6ef0dc, transparent: true, opacity: 0 }));
      o.rotation.x = Math.PI / 2; o.position.y = (i - 1) * 1.3; rig.add(o); return o;
    });
    var pn = 260, pa = new Float32Array(pn * 3);
    for (var j = 0; j < pn * 3; j += 3) { pa[j] = (Math.random() - .5) * 16; pa[j + 1] = (Math.random() - .5) * 10; pa[j + 2] = (Math.random() - .5) * 8; }
    var pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pa, 3));
    var pts = new T.Points(pg, new T.PointsMaterial({ color: 0x9ff5ea, size: .04, transparent: true, opacity: .7 })); s.add(pts);

    var cols = [0x2ad6c0, 0xffb454, 0x4db8ff, 0xb9a6ff].map(function (c) { return new T.Color(c); });
    var cur = cols[0].clone(), rot = 0, X = 0, Y = 0, sc = 1, mob = false, ry = 0, rx = 0;
    var size = function () {
      r.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix();
      mob = innerWidth < 760; sc = mob ? .72 : 1;
    };
    size(); addEventListener('resize', size);

    var draw = function (t) {
      var k = Math.min(scrollY / innerHeight, 1), m = Math.max(document.documentElement.scrollHeight - innerHeight, 1), p = scrollY / m;
      var tx = mob ? 0 : (1 - k) * 2.3, ty = mob ? (1 - k) * 1.5 : 0;
      X += (tx - X) * .06; Y += (ty - Y) * .06;
      rig.position.set(X, Y, 0); rig.scale.setScalar(sc);
      rot += ([0, .9, 1.9, 3] [mode] - rot) * .04;
      ry += (rot + p * Math.PI * 4 + px * .8 - ry) * .08; rx += (py * .35 - rx) * .08;
      rig.rotation.y = ry; rig.rotation.x = rx;
      cur.lerp(cols[mode], .05);
      vs.forEach(function (m, i) { m.emissive.copy(cur); m.emissiveIntensity = .15 + .45 * Math.max(0, Math.sin(t * .0022 - i * .55)); });
      l1.color.copy(cur);
      rings.forEach(function (o, i) {
        var q = ((t * .00028 + i / 3) % 1);
        o.scale.setScalar(.7 + q * 3); o.material.opacity = (1 - q) * .5 * (mode === 2 ? 1 : .35); o.material.color.copy(cur);
      });
      pts.rotation.y = t * .00005; pts.position.y = Math.sin(t * .0003) * .3;
      cv.style.opacity = 1 - .62 * k;
      r.render(s, cam);
    };
    if (rm) { draw(0); addEventListener('scroll', function () { draw(0); }, { passive: true }); }
    else (function loop(t) { draw(t); requestAnimationFrame(loop); })(0);
  }
  scene();

  // 3D tilt panels and magnetic buttons
  if (fine && !rm) {
    $$('.tilt').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        c.style.transition = 'transform .08s';
        c.style.transform = 'perspective(900px) rotateY(' + x * 14 + 'deg) rotateX(' + -y * 14 + 'deg) translateY(-6px)';
      });
      c.addEventListener('pointerleave', function () { c.style.transition = ''; c.style.transform = ''; });
    });
    $$('.mag').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .2 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  // reveal on scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  $$('.rv').forEach(function (el) { io.observe(el); });

  // count-up
  $$('[data-n]').forEach(function (el) {
    var end = parseFloat(el.dataset.n), dec = el.dataset.n.indexOf('.') > -1 ? 1 : 0;
    if (rm) return;
    var s0 = performance.now() + 900;
    (function tick(t) {
      var p = Math.min(Math.max((t - s0) / 1500, 0), 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  });

  // booking form to WhatsApp
  var f = $('#book'), err = f.querySelector('.err');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(f), n = (d.get('n') || '').trim(), p = (d.get('p') || '').trim(), m = (d.get('m') || '').trim(), t = (d.get('t') || '').trim();
    if (!n || !p || !m) { err.textContent = 'Please fill in your name, phone number and the problem.'; return; }
    if (p.replace(/\D/g, '').length < 10) { err.textContent = 'Enter a phone number with at least 10 digits.'; return; }
    err.textContent = '';
    window.open(wa('Hello, I would like to book a visit.\nName: ' + n + '\nPhone: ' + p + '\nProblem: ' + m + (t ? '\nPreferred time: ' + t : '')), '_blank', 'noopener');
  });
})();
