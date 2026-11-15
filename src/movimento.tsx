/* =========================================================
   Movimento do portfólio
   - Inclinação 3D nas imagens (acompanha o mouse, para o lado contrário)
   - Cards dos projetos que se empilham ao rolar
   - Sequência das telas: uma tela "funciona" de cada vez
   - Revelação suave ao entrar na tela
   Tudo desliga com "reduzir movimento" do sistema ou "Parar animações" do painel.
   ========================================================= */
import {useEffect, useRef, type ReactNode} from 'react';

export const podeMover = () =>
 !matchMedia('(prefers-reduced-motion: reduce)').matches && document.documentElement.dataset.parado !== 'sim';

/* ---------- Inclinação 3D ---------- */
export function Inclina({children, className = '', forca = 8}: {children: ReactNode; className?: string; forca?: number}) {
 const ref = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const el = ref.current;
  if (!el || !matchMedia('(pointer: fine)').matches) return;
  let raf = 0;
  const mover = (e: PointerEvent) => {
   if (!podeMover()) return;
   const r = el.getBoundingClientRect();
   const x = (e.clientX - r.left) / r.width - 0.5;
   const y = (e.clientY - r.top) / r.height - 0.5;
   cancelAnimationFrame(raf);
   raf = requestAnimationFrame(() => {
    // Gira afastando-se do mouse; a imagem de dentro desliza para o lado contrário (profundidade)
    el.style.setProperty('--rx', `${(y * forca).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(-x * forca).toFixed(2)}deg`);
    el.style.setProperty('--px', `${(-x * 10).toFixed(1)}px`);
    el.style.setProperty('--py', `${(-y * 10).toFixed(1)}px`);
    el.style.setProperty('--brilho-x', `${((x + 0.5) * 100).toFixed(0)}%`);
    el.style.setProperty('--brilho-y', `${((y + 0.5) * 100).toFixed(0)}%`);
    el.classList.add('inclinando');
   });
  };
  const sair = () => {
   cancelAnimationFrame(raf);
   el.classList.remove('inclinando');
   ['--rx', '--ry', '--px', '--py'].forEach((v) => el.style.setProperty(v, '0'));
  };
  el.addEventListener('pointermove', mover);
  el.addEventListener('pointerleave', sair);
  return () => { el.removeEventListener('pointermove', mover); el.removeEventListener('pointerleave', sair); cancelAnimationFrame(raf); };
 }, []);
 return <div ref={ref} className={`inclina ${className}`}>{children}</div>;
}

/* ---------- Cards que se empilham ---------- */
export function usePilha(seletor: string) {
 useEffect(() => {
  let raf = 0;
  const atualizar = () => {
   raf = 0;
   const cards = [...document.querySelectorAll<HTMLElement>(seletor)];
   const alturaTela = innerHeight;
   cards.forEach((card, i) => {
    // Card mais alto que a tela gruda pela base: dá para ler tudo antes do próximo cobrir
    const h = card.offsetHeight;
    const topo = Math.min(24 + i * 14, alturaTela - h - 24);
    card.style.top = `${topo}px`;
    const corpo = card.firstElementChild as HTMLElement | null;
    const proximo = cards[i + 1];
    if (!corpo) return;
    if (!proximo || !podeMover()) { corpo.style.transform = ''; corpo.style.filter = ''; return; }
    // Quanto o próximo card já subiu por cima deste (0 a 1)
    const r = proximo.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, 1 - (r.top - 24) / (alturaTela * 0.8)));
    corpo.style.transform = `scale(${1 - p * 0.06})`;
    corpo.style.filter = `brightness(${1 - p * 0.35})`;
   });
  };
  const pedir = () => { if (!raf) raf = requestAnimationFrame(atualizar); };
  atualizar();
  addEventListener('scroll', pedir, {passive: true});
  addEventListener('resize', pedir);
  const ro = new ResizeObserver(pedir);
  document.querySelectorAll(seletor).forEach((c) => ro.observe(c));
  return () => { removeEventListener('scroll', pedir); removeEventListener('resize', pedir); ro.disconnect(); cancelAnimationFrame(raf); };
 }, [seletor]);
}

/* ---------- Sequência das telas (uma de cada vez) ---------- */
export function useSequencia(ref: React.RefObject<HTMLElement | null>, intervalo = 2800) {
 useEffect(() => {
  const raiz = ref.current;
  if (!raiz) return;
  const itens = [...raiz.querySelectorAll<HTMLElement>('[data-seq]')];
  if (!itens.length) return;
  let i = -1, timer = 0, visivel = false;
  let pausado = false;
  // Pausa enquanto a pessoa está olhando de perto (mouse ou foco do teclado em cima)
  const pausa = () => { pausado = true; }, segue = () => { pausado = false; };
  raiz.addEventListener('pointerenter', pausa); raiz.addEventListener('pointerleave', segue);
  raiz.addEventListener('focusin', pausa); raiz.addEventListener('focusout', segue);
  const passo = () => {
   if (pausado) return;
   if (!visivel || !podeMover()) { itens.forEach((el) => el.classList.remove('ativo')); return; }
   itens.forEach((el) => el.classList.remove('ativo'));
   i = (i + 1) % itens.length;
   // Reinicia as animações da tela ativa
   const el = itens[i];
   void el.offsetWidth;
   el.classList.add('ativo');
  };
  const io = new IntersectionObserver(([e]) => {
   visivel = e.isIntersecting;
   clearInterval(timer);
   if (visivel) { passo(); timer = window.setInterval(passo, intervalo); }
   else itens.forEach((el) => el.classList.remove('ativo'));
  }, {threshold: 0.35});
  io.observe(raiz);
  return () => { io.disconnect(); clearInterval(timer); raiz.removeEventListener('pointerenter', pausa); raiz.removeEventListener('pointerleave', segue); raiz.removeEventListener('focusin', pausa); raiz.removeEventListener('focusout', segue); };
 }, [ref, intervalo]);
}

/* ---------- Revelação ao entrar na tela ---------- */
export function useRevela() {
 useEffect(() => {
  const els = document.querySelectorAll('.revela');
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), {threshold: 0.12, rootMargin: '0px 0px -8% 0px'});
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
 }, []);
}

/* ---------- Abertura: foto encolhe e texto sobe um pouco ao rolar ---------- */
export function useAberturaRolagem(ref: React.RefObject<HTMLElement | null>) {
 useEffect(() => {
  let raf = 0;
  const atualizar = () => {
   raf = 0;
   const el = ref.current;
   if (!el) return;
   const p = podeMover() ? Math.min(1, Math.max(0, scrollY / (el.offsetHeight * 0.9))) : 0;
   el.style.setProperty('--rolagem', p.toFixed(3));
  };
  const pedir = () => { if (!raf) raf = requestAnimationFrame(atualizar); };
  atualizar();
  addEventListener('scroll', pedir, {passive: true});
  return () => { removeEventListener('scroll', pedir); cancelAnimationFrame(raf); };
 }, [ref]);
}

/* =========================================================
   Telas que "funcionam": cada celular toca o seu fluxo real
   (toque no botão → próxima tela entra deslizando, como no iOS → rola).
   A galeria toca um celular de cada vez.
   ========================================================= */
type Passo = {img: string; rolar?: boolean; toque?: [number, number][]};
type ElTocavel = HTMLElement & {tocar?: (sinal: AbortSignal) => Promise<void>};

const espera = (ms: number, sinal: AbortSignal) => new Promise<void>((ok, falha) => {
 const t = setTimeout(ok, ms);
 sinal.addEventListener('abort', () => { clearTimeout(t); falha(new DOMException('parou', 'AbortError')); }, {once: true});
});
const anima = (el: Element, quadros: Keyframe[], opcoes: KeyframeAnimationOptions, sinal: AbortSignal) => {
 const a = el.animate(quadros, {fill: 'forwards', ...opcoes});
 sinal.addEventListener('abort', () => a.cancel(), {once: true});
 return a.finished.then(() => undefined);
};
const MOLA = 'cubic-bezier(.32, .72, 0, 1)'; // curva das transições do iOS

export function TelaFluxo({passos, legenda, nome}: {passos: Passo[]; legenda: string; nome: string}) {
 const fig = useRef<ElTocavel>(null);
 useEffect(() => {
  const el = fig.current;
  if (!el) return;
  const tela = el.querySelector<HTMLElement>('.fluxo-tela')!;
  const imgs = [...tela.querySelectorAll<HTMLImageElement>('.passo')];
  const dedo = tela.querySelector<HTMLElement>('.toque')!;
  const reset = () => {
   imgs.forEach((im, i) => { im.getAnimations().forEach((a) => a.cancel()); im.style.transform = i ? 'translateX(100%)' : ''; im.style.filter = ''; im.style.opacity = ''; });
   dedo.getAnimations().forEach((a) => a.cancel());
  };
  reset();
  el.tocar = async (sinal) => {
   reset();
   el.classList.add('ativo');
   try {
    for (let i = 0; i < passos.length; i++) {
     const p = passos[i], im = imgs[i];
     await espera(i ? 500 : 700, sinal);
     if (p.rolar) {
      const desce = Math.max(0, im.offsetHeight - tela.clientHeight);
      await anima(im, [{transform: 'translate(0, 0)'}, {transform: `translate(0, -${desce}px)`}], {duration: 600 + desce * 2.2, easing: 'cubic-bezier(.45, 0, .2, 1)'}, sinal);
      await espera(300, sinal);
     }
     for (const [x, y] of p.toque || []) {
      dedo.style.left = `${x}%`; dedo.style.top = `${y}%`;
      await anima(dedo, [
       {opacity: 0, transform: 'scale(1.5)'}, {opacity: 1, transform: 'scale(1)', offset: .35},
       {transform: 'scale(.78)', offset: .55}, {opacity: 1, transform: 'scale(1)', offset: .75}, {opacity: 0, transform: 'scale(1.1)'}], {duration: 900, easing: 'ease-out'}, sinal);
      await espera(150, sinal);
     }
     const prox = imgs[i + 1];
     if (prox) {
      // Próxima tela entra pela direita; a atual recua um pouco e escurece (push do iOS)
      const atual = p.rolar ? getComputedStyle(im).transform : 'none';
      await Promise.all([
       anima(prox, [{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}], {duration: 520, easing: MOLA}, sinal),
       anima(im, [{transform: atual === 'none' ? 'translateX(0)' : atual, filter: 'brightness(1)'}, {transform: `${atual === 'none' ? '' : atual} translateX(-28%)`, filter: 'brightness(.75)'}], {duration: 520, easing: MOLA}, sinal),
      ]);
     }
    }
    await espera(1400, sinal);
    // Volta ao início com um fade curto
    await anima(tela, [{opacity: 1}, {opacity: 0}], {duration: 260, fill: 'none'}, sinal);
    reset();
    await anima(tela, [{opacity: 0}, {opacity: 1}], {duration: 260, fill: 'none'}, sinal);
   } finally {
    el.classList.remove('ativo');
   }
  };
  return () => { delete el.tocar; };
 }, [passos]);
 return <figure ref={fig} className="midia midia-celular fluxo" data-seq="">
  <Inclina className="midia-caixa">
   <div className="fluxo-tela">
    {passos.map((p, i) => <img key={p.img + i} className="passo" src={`./assets/fluxo/${p.img}.webp`} loading="lazy" decoding="async"
     alt={i === 0 ? `${nome}: ${legenda}` : ''} aria-hidden={i ? true : undefined}/>)}
    <span className="toque" aria-hidden="true"/>
   </div>
  </Inclina>
  <figcaption>{legenda}</figcaption>
 </figure>;
}

/** Toca um celular de cada vez enquanto a galeria está visível; pausa com o mouse ou o foco em cima. */
export function useTocaFluxos(ref: React.RefObject<HTMLElement | null>) {
 useEffect(() => {
  const raiz = ref.current;
  if (!raiz) return;
  let ctrl: AbortController | null = null, pausado = false, visivel = false;
  const rodar = async () => {
   ctrl?.abort();
   const meu = new AbortController(); ctrl = meu;
   const itens = [...raiz.querySelectorAll<ElTocavel>('[data-seq]')];
   if (!itens.length) return; // galeria sem telas animadas: nada a tocar (evita laço infinito)
   try {
    for (let volta = 0; ; volta++) {
     for (const el of itens) {
      while (pausado || !podeMover()) await espera(400, meu.signal);
      if (el.tocar) await el.tocar(meu.signal);
      else { el.classList.add('ativo'); try { await espera(Number(el.dataset.dur) || 2600, meu.signal); } finally { el.classList.remove('ativo'); } }
      await espera(350, meu.signal);
     }
    }
   } catch { /* parou: saiu da tela ou desmontou */ }
  };
  const io = new IntersectionObserver(([e]) => {
   if (e.isIntersecting && !visivel) { visivel = true; rodar(); }
   else if (!e.isIntersecting && visivel) { visivel = false; ctrl?.abort(); }
  }, {threshold: 0, rootMargin: '0px 0px -20% 0px'}); // começa assim que a galeria entra na tela
  io.observe(raiz);
  const pausa = () => { pausado = true; }, segue = () => { pausado = false; };
  raiz.addEventListener('pointerenter', pausa); raiz.addEventListener('pointerleave', segue);
  raiz.addEventListener('focusin', pausa); raiz.addEventListener('focusout', segue);
  return () => { io.disconnect(); ctrl?.abort(); raiz.removeEventListener('pointerenter', pausa); raiz.removeEventListener('pointerleave', segue); raiz.removeEventListener('focusin', pausa); raiz.removeEventListener('focusout', segue); };
 }, [ref]);
}
