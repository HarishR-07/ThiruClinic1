(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var NUM = '918608541110';
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine = matchMedia('(hover:hover)').matches;
  var wa = function (t) { return 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(t); };

  $$('[data-wa]').forEach(function (a) { a.href = wa('Hello, I would like to book a physiotherapy visit.'); });
  $('#map').href = 'https://www.google.com/maps/search/?api=1&query=Thiru+Physiotherapy+Clinic+Ganapathy+Coimbatore';

  // header background after scroll
  var nav = $('#nav');
  var onScroll = function () { nav.classList.toggle('on', scrollY > 30); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // 3D spine: 12 vertebrae following a natural curve
  var rig = $('#rig'), spine = $('#spine'), N = 12, vs = [];
  for (var i = 0; i < N; i++) {
    var v = document.createElement('div');
    var w = 170 - i * 6, h = 50 - i * 1.2;
    v.className = 'v';
    v.style.cssText = 'width:' + w + 'px;height:' + h + 'px;margin-left:' + (-w / 2) + 'px';
    v.style.transform = 'translate3d(' + (Math.sin(i * 0.55) * 30) + 'px,' + (i * 0.145 * spine.clientHeight * 0.62 + 20) + 'px,' + (Math.cos(i * 0.55) * 14) + 'px) rotateX(64deg)';
    rig.appendChild(v); vs.push(v);
  }
  var ry = -22, rx = 10, ty = -22, tx = 10, t0 = 0, active = false;
  var move = function (e) {
    var p = e.touches ? e.touches[0] : e, r = spine.getBoundingClientRect();
    ty = ((p.clientX - r.left) / r.width - .5) * 70;
    tx = 10 - ((p.clientY - r.top) / r.height - .5) * 30;
    active = true;
  };
  spine.addEventListener('pointermove', move);
  spine.addEventListener('pointerleave', function () { active = false; });
  var loop = function (t) {
    if (!active) { ty = -22 + Math.sin(t / 1600) * 22; tx = 10; }
    ry += (ty - ry) * .08; rx += (tx - rx) * .08;
    rig.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    var k = (t / 700) | 0;
    if (!active && k !== t0) { t0 = k; vs.forEach(function (v, i) { v.classList.toggle('hot', i === k % N); }); }
    if (active) vs.forEach(function (v) { v.classList.remove('hot'); });
    requestAnimationFrame(loop);
  };
  if (rm) rig.style.transform = 'rotateX(10deg) rotateY(-22deg)'; else requestAnimationFrame(loop);

  // hero orbs parallax
  var orbs = $$('.orb');
  if (fine && !rm) addEventListener('pointermove', function (e) {
    var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    orbs.forEach(function (o) { var d = +o.dataset.d; o.style.transform = 'translate(' + x * d + 'px,' + y * d + 'px)'; });
  });

  // 3D tilt cards
  if (fine && !rm) $$('.tilt').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transition = 'transform .08s';
      c.style.transform = 'perspective(900px) rotateY(' + x * 14 + 'deg) rotateX(' + -y * 14 + 'deg) translateY(-6px)';
    });
    c.addEventListener('pointerleave', function () { c.style.transition = ''; c.style.transform = ''; });
  });

  // magnetic buttons
  if (fine && !rm) $$('.mag').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .18 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)';
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });

  // reveal on scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  $$('.rv').forEach(function (el) { io.observe(el); });

  // count-up numbers
  $$('[data-n]').forEach(function (el) {
    var end = parseFloat(el.dataset.n), dec = String(el.dataset.n).indexOf('.') > -1 ? 1 : 0;
    if (rm) return;
    var s = performance.now() + 500;
    (function tick(t) {
      var p = Math.min(Math.max((t - s) / 1400, 0), 1), e = 1 - Math.pow(1 - p, 3);
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
    var msg = 'Hello, I would like to book a visit.\nName: ' + n + '\nPhone: ' + p + '\nProblem: ' + m + (t ? '\nPreferred time: ' + t : '');
    window.open(wa(msg), '_blank', 'noopener');
  });
})();
