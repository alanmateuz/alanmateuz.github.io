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
  const passo = () => {
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
  return () => { io.disconnect(); clearInterval(timer); };
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
