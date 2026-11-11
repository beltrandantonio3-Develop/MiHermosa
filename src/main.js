import './style.css';
// Vite procesa el audio y le da una URL válida en dev y en build
import musicUrl from './audio/prodjoseph-guitar-acoustic-328453.mp3';

// ================== CONFIGURACIÓN ==================
const NOMBRE = "Mi Andy Hermosa";
// ===================================================

document.querySelectorAll('.nombre').forEach(el => el.textContent = NOMBRE);

const intro = document.getElementById('intro');
const main = document.getElementById('main');
const openBtn = document.getElementById('openBtn');
const audio = document.getElementById('bgAudio');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const layer = document.getElementById('particles');

audio.src = musicUrl;
audio.volume = 0.5;

/* ---------- Partículas ---------- */
const rand = (a, b) => Math.random() * (b - a) + a;

function spawnParticle() {
  const el = document.createElement('div');
  const t = Math.random();
  el.className = 'particle';
  el.style.left = rand(0, 100) + 'vw';
  el.style.setProperty('--sway', rand(20, 90) * (Math.random() > .5 ? 1 : -1) + 'px');
  el.style.setProperty('--rot', rand(180, 720) * (Math.random() > .5 ? 1 : -1) + 'deg');
  let dur;

  if (t < 0.35) { // corazón
    el.classList.add('p-heart');
    el.textContent = '♥';
    el.style.fontSize = rand(12, 26) + 'px';
    el.style.setProperty('--op', rand(.5, .9));
    dur = rand(9, 15);
    el.style.animation = `fall ${dur}s linear forwards`;
  } else if (t < 0.75) { // pétalo
    el.classList.add('p-petal');
    const s = rand(9, 18);
    el.style.width = s + 'px';
    el.style.height = s * 1.2 + 'px';
    el.style.setProperty('--op', rand(.6, .95));
    dur = rand(10, 17);
    el.style.animation = `fall ${dur}s linear forwards`;
  } else { // destello
    el.classList.add('p-sparkle');
    el.textContent = '✦';
    el.style.top = rand(10, 95) + 'vh';
    el.style.fontSize = rand(8, 18) + 'px';
    dur = rand(3, 6);
    el.style.animation = `twinkle ${dur}s ease-in-out forwards`;
  }

  layer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 200);
}

setInterval(spawnParticle, 420);
for (let i = 0; i < 10; i++) setTimeout(spawnParticle, i * 150);

function burst(x, y, n = 28) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'particle ' + (Math.random() > .5 ? 'p-heart' : 'p-sparkle');
    el.textContent = el.classList.contains('p-heart') ? '♥' : '✦';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.fontSize = rand(12, 28) + 'px';
    el.style.setProperty('--sway', rand(-160, 160) + 'px');
    const dur = rand(1.6, 3);
    el.style.animation = `floatUp ${dur}s ease-out forwards`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 100);
  }
}

/* ---------- Música ---------- */
let playing = false;

function setMusicUI() {
  musicIcon.textContent = playing ? '♪' : '✕';
  musicBtn.classList.toggle('playing', playing);
  musicBtn.style.opacity = playing ? '1' : '.7';
}

async function playMusic() {
  try {
    await audio.play();
    playing = true;
  } catch (e) {
    playing = false;
    console.warn('Reproducción de audio prevenida o interrumpida:', e);
  }
  setMusicUI();
}

musicBtn.addEventListener('click', async () => {
  if (audio.paused) {
    await playMusic();
  } else {
    audio.pause();
    playing = false;
    setMusicUI();
  }
});

/* ---------- Abrir la sorpresa ---------- */
openBtn.addEventListener('click', (e) => {
  playMusic();
  burst(e.clientX, e.clientY, 30);

  intro.classList.add('fade-out');
  document.body.classList.remove('locked');
  main.classList.add('show');
  musicBtn.classList.remove('opacity-0', 'pointer-events-none');
  musicBtn.style.opacity = '1';

  setTimeout(() => { intro.style.display = 'none'; initReveal(); }, 1300);
  window.scrollTo(0, 0);
});

/* ---------- Animaciones al hacer scroll ---------- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const anim = el.dataset.anim || 'animate__fadeInUp';
      if (el.dataset.delay) el.style.animationDelay = el.dataset.delay;
      el.classList.add('animate__animated', anim);
      el.style.opacity = 1;
      io.unobserve(el);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ---------- Sobre / Carta ---------- */
const envelope = document.getElementById('envelope');
const envWrap = document.getElementById('envelopeWrap');
const letter = document.getElementById('letter');
let opened = false;

function openEnvelope() {
  if (opened) return;
  opened = true;
  envelope.classList.add('open');
  const r = envelope.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 22);

  setTimeout(() => {
    envWrap.classList.add('animate__animated', 'animate__fadeOutDown');
    envWrap.style.animationDuration = '.7s';
  }, 1500);

  setTimeout(() => {
    envWrap.style.display = 'none';
    letter.classList.remove('hidden');
    letter.classList.add('animate__animated', 'animate__fadeInUp');
    letter.style.animationDuration = '1.2s';
    letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 2150);
}

envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
});

/* ---------- Detalle final ---------- */
document.getElementById('burstBtn').addEventListener('click', (e) => {
  for (let i = 0; i < 4; i++) setTimeout(() => burst(e.clientX, e.clientY, 30), i * 250);
});

/* ---------- Si una foto falla, mostrar fondo suave ---------- */
document.querySelectorAll('.polaroid img').forEach(img => {
  img.addEventListener('error', () => { img.removeAttribute('src'); });
});