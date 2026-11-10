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
