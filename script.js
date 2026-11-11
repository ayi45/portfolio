// Shared page behavior: image lightbox + "copy email" button.

// Lightbox: any <button class="zoom"> wrapping an <img> opens a larger view.
(function () {
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<figure style="margin:0"><img alt=""><p></p></figure>';
  document.body.appendChild(box);
  var big = box.querySelector('img'), cap = box.querySelector('p'), last;

  document.querySelectorAll('.zoom').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      last = btn;
      big.src = img.src;
      big.alt = img.alt;
      cap.textContent = img.alt;
      box.classList.add('open');
    });
  });
  function close() { box.classList.remove('open'); if (last) last.focus(); }
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

// Copy email
(function () {
  var btn = document.getElementById('copy-btn');
  if (!btn) return;
  var email = document.getElementById('email');
  btn.addEventListener('click', function () {
    function done(msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = 'Copy email'; }, 1600); }
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(email);
      var s = getSelection(); s.removeAllRanges(); s.addRange(r); done('Press ⌘C');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email.textContent.trim()).then(function () { done('Copied'); }, fallback);
    } else { fallback(); }
  });
})();

// "My work" dropdown: hover opens it on desktop (CSS); tap/click or keyboard toggles it everywhere.
(function () {
  var drop = document.querySelector('.nav-drop');
  if (!drop) return;
  var btn = drop.querySelector('.nav-drop-btn');
  function set(open) { drop.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(!drop.classList.contains('open')); });
  document.addEventListener('click', function (e) { if (!drop.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drop.classList.contains('open')) { set(false); btn.focus(); } });
  drop.addEventListener('focusout', function (e) { if (!drop.contains(e.relatedTarget)) set(false); });
})();

// About: the headshot polaroid hangs from its lanyard and can be nudged with the cursor.
// It plays a short settle-swing on load (CSS), then a small spring takes over: brushing the
// mouse across it pushes it the way you moved, and it swings back to rest.
(function () {
  var card = document.querySelector('.badge .portrait');
  if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var REST = -2, angle = REST, vel = 0, running = false, lastX = null, lastKick = 0;

  function loop() {
    var force = (REST - angle) * 0.015;    // softer pull back toward resting tilt (slower swing)
    vel = (vel + force) * 0.78;           // heavy damping: eases out and back with no real rebound
    angle += vel;
    card.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';
    if (Math.abs(vel) < 0.01 && Math.abs(angle - REST) < 0.02) { running = false; return; }
    requestAnimationFrame(loop);
  }
  function kick(dv) {
    vel += dv;
    vel = Math.max(-0.6, Math.min(0.6, vel));
    if (!running) { running = true; requestAnimationFrame(loop); }
  }
  function takeOver() { card.style.animation = 'none'; card.style.transform = 'rotate(' + angle + 'deg)'; }

  // let the load swing finish first, then hand control to the spring
  card.addEventListener('animationend', takeOver, { once: true });
  setTimeout(takeOver, 4500);

  card.addEventListener('pointerenter', function (e) {
    var r = card.getBoundingClientRect();
    // coming in from the left pushes the bottom right (counter-clockwise), and vice versa
    var side = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    var now = Date.now();
    if (now - lastKick > 700) { takeOver(); kick(side * 0.35); lastKick = now; }
    lastX = e.clientX;
  });
  card.addEventListener('pointermove', function (e) {
    if (lastX !== null) kick(-(e.clientX - lastX) * 0.002);
    lastX = e.clientX;
  });
  card.addEventListener('pointerleave', function () { lastX = null; });
})();
