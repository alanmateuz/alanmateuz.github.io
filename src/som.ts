/* Único som do site: uma carta sendo puxada quando o card do projeto vira.
   Sintetizado na hora (Web Audio), sem arquivo. Desligável no painel de acessibilidade. */
let ctx: AudioContext | null = null;

export function somCarta() {
 if (document.documentElement.dataset.sons === 'nao') return;
 try {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  const c = ctx, t = c.currentTime;
  const saida = c.createGain(); saida.gain.value = 0.55; saida.connect(c.destination);

  // "Fffp": atrito do papel, ruído filtrado que desce rápido
  const dur = 0.16;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
  const ruido = c.createBufferSource(); ruido.buffer = buf;
  const banda = c.createBiquadFilter(); banda.type = 'bandpass'; banda.Q.value = 0.9;
  banda.frequency.setValueAtTime(5200, t); banda.frequency.exponentialRampToValueAtTime(1400, t + dur);
  const gRuido = c.createGain();
  gRuido.gain.setValueAtTime(0, t); gRuido.gain.linearRampToValueAtTime(0.5, t + 0.012); gRuido.gain.exponentialRampToValueAtTime(0.001, t + dur);
  ruido.connect(banda); banda.connect(gRuido); gRuido.connect(saida); ruido.start(t);

  // "Pá": estalo curto e grave da carta batendo
  const osc = c.createOscillator(); osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, t + 0.05); osc.frequency.exponentialRampToValueAtTime(90, t + 0.13);
  const gOsc = c.createGain();
  gOsc.gain.setValueAtTime(0, t + 0.05); gOsc.gain.linearRampToValueAtTime(0.35, t + 0.056); gOsc.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.connect(gOsc); gOsc.connect(saida); osc.start(t + 0.05); osc.stop(t + 0.18);
 } catch { /* sem áudio: segue em silêncio */ }
}
