/* =========================================================
   Sons originais, sintetizados na hora (Web Audio, sem arquivos)
   - ligar: acorde grave que abre devagar, com brilho de vidro
   - ambiente: zumbido suave e contínuo
   - mover / confirmar / voltar: toques curtos de interface
   ========================================================= */
let ctx: AudioContext | null = null;
let mestre: GainNode | null = null;
let ambiente: {parar: () => void} | null = null;
let mudo = (() => { try { return localStorage.getItem('console-mudo') === 'sim'; } catch { return false; } })();

function audio() {
 if (!ctx) {
  ctx = new AudioContext();
  mestre = ctx.createGain();
  mestre.gain.value = mudo ? 0 : 0.7;
  // Eco curto deixa tudo com cara de "espaço"
  const eco = ctx.createDelay(1); eco.delayTime.value = 0.28;
  const retorno = ctx.createGain(); retorno.gain.value = 0.32;
  const filtro = ctx.createBiquadFilter(); filtro.type = 'lowpass'; filtro.frequency.value = 2400;
  mestre.connect(ctx.destination);
  mestre.connect(eco); eco.connect(filtro); filtro.connect(retorno); retorno.connect(eco); retorno.connect(ctx.destination);
 }
 if (ctx.state === 'suspended') ctx.resume();
 return {c: ctx, m: mestre!};
}

function nota(freq: number, inicio: number, dur: number, vol: number, tipo: OscillatorType = 'sine', ataque = 0.01) {
 const {c, m} = audio();
 const t = c.currentTime + inicio;
 const o = c.createOscillator(); o.type = tipo; o.frequency.value = freq;
 const g = c.createGain();
 g.gain.setValueAtTime(0, t);
 g.gain.linearRampToValueAtTime(vol, t + ataque);
 g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
 o.connect(g); g.connect(m);
 o.start(t); o.stop(t + dur + 0.05);
}

export const som = {
 get mudo() { return mudo; },
 alternarMudo() {
  mudo = !mudo;
  try { localStorage.setItem('console-mudo', mudo ? 'sim' : 'nao'); } catch { /* sem armazenamento */ }
  if (mestre && ctx) mestre.gain.setTargetAtTime(mudo ? 0 : 0.7, ctx.currentTime, 0.05);
  return mudo;
 },
 /** Acorde de abertura: sobe devagar e deixa um brilho no fim. */
 ligar() {
  [55, 82.5, 110, 164.8].forEach((f, i) => nota(f, i * 0.12, 5.5, 0.16, i % 2 ? 'triangle' : 'sine', 1.6));
  [659.3, 880, 1318.5].forEach((f, i) => nota(f, 1.8 + i * 0.18, 2.6, 0.035, 'sine', 0.02));
 },
 /** Zumbido contínuo bem baixo, como um aparelho ligado. */
 ambienteLigar() {
  if (ambiente) return;
  const {c, m} = audio();
  const g = c.createGain(); g.gain.value = 0;
  g.gain.linearRampToValueAtTime(0.05, c.currentTime + 3);
  const oscs = [55, 55.4, 110.3].map((f) => { const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.connect(g); o.start(); return o; });
  // Leve respiração no volume
  const lfo = c.createOscillator(); lfo.frequency.value = 0.08;
  const prof = c.createGain(); prof.gain.value = 0.02; lfo.connect(prof); prof.connect(g.gain); lfo.start();
  g.connect(m);
  ambiente = {parar: () => { g.gain.setTargetAtTime(0, c.currentTime, 0.4); setTimeout(() => { oscs.forEach((o) => o.stop()); lfo.stop(); }, 1500); }};
 },
 ambienteParar() { ambiente?.parar(); ambiente = null; },
 mover() { nota(1046.5, 0, 0.09, 0.05, 'sine'); nota(1567.98, 0.01, 0.07, 0.02, 'sine'); },
 confirmar() { [523.25, 783.99, 1046.5].forEach((f, i) => nota(f, i * 0.06, 0.5, 0.07, 'triangle')); },
 voltar() { [783.99, 523.25].forEach((f, i) => nota(f, i * 0.07, 0.3, 0.06, 'triangle')); },
 /** Sopro curto para as transições de câmera. */
 passagem() {
  const {c, m} = audio();
  const dur = 1.1;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const fonte = c.createBufferSource(); fonte.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
  f.frequency.setValueAtTime(300, c.currentTime); f.frequency.exponentialRampToValueAtTime(2400, c.currentTime + dur);
  const g = c.createGain(); g.gain.value = 0.06;
  fonte.connect(f); f.connect(g); g.connect(m); fonte.start();
 },
};
