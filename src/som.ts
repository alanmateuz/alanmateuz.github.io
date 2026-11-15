/* Único som do site: uma carta sendo puxada quando o card do projeto vira.
   Sintetizado na hora (Web Audio), sem arquivo. Desligável no painel de acessibilidade. */
let ctx: AudioContext | null = null;

export function somCarta() {
 if (document.documentElement.dataset.sons === 'nao') return;
 try {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  const c = ctx, t = c.currentTime;
  const saida = c.createGain(); saida.gain.value = 0.5; saida.connect(c.destination);

  // Deslize do papel: um sopro que cresce devagar, abre e se fecha (~0,6 s)
  const dur = 0.62;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  let suave = 0;
  for (let i = 0; i < d.length; i++) { suave = suave * 0.6 + (Math.random() * 2 - 1) * 0.4; d[i] = suave; }
  const ruido = c.createBufferSource(); ruido.buffer = buf;
  const filtro = c.createBiquadFilter(); filtro.type = 'bandpass'; filtro.Q.value = 0.7;
  filtro.frequency.setValueAtTime(700, t);
  filtro.frequency.exponentialRampToValueAtTime(3200, t + 0.32);
  filtro.frequency.exponentialRampToValueAtTime(1100, t + dur);
  const gRuido = c.createGain();
  gRuido.gain.setValueAtTime(0.0001, t);
  gRuido.gain.exponentialRampToValueAtTime(0.55, t + 0.22);
  gRuido.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  ruido.connect(filtro); filtro.connect(gRuido); gRuido.connect(saida); ruido.start(t);

  // Pouso macio da carta no fim, grave e curto
  const pouso = t + 0.46;
  const osc = c.createOscillator(); osc.type = 'sine';
  osc.frequency.setValueAtTime(150, pouso); osc.frequency.exponentialRampToValueAtTime(70, pouso + 0.22);
  const gOsc = c.createGain();
  gOsc.gain.setValueAtTime(0.0001, pouso); gOsc.gain.exponentialRampToValueAtTime(0.22, pouso + 0.02); gOsc.gain.exponentialRampToValueAtTime(0.0001, pouso + 0.28);
  osc.connect(gOsc); gOsc.connect(saida); osc.start(pouso); osc.stop(pouso + 0.32);
 } catch { /* sem áudio: segue em silêncio */ }
}
