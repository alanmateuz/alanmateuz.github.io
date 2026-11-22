import {useEffect, useRef, useState, type ReactNode} from 'react';
import type {Acoes, CasoDesign} from './projects';

/* ---------- Ícones (traço único, 24px, herdam a cor do texto) ---------- */
const caminhos: Record<string, ReactNode> = {
 user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></>,
 github: <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>,
 mail: <><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></>,
 linkedin: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></>,
 sol: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
 lua: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>,
 github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></>,
 figma: <><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5Z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2Z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0Z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0Z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5Z"/></>,
 design: <><path d="M13 7 8.7 2.7a2.4 2.4 0 0 0-3.4 0L2.7 5.3a2.4 2.4 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2M18 16l2-2"/><path d="m17 11 4.3 4.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L11 17"/><path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8L2 21.4a.5.5 0 0 0 .6.6l4.4-1.3a2 2 0 0 0 .8-.5Z"/><path d="m15 5 4 4"/></>,
 pitch: <><path d="M9.5 18.5h5M10.5 21.5h3"/><path d="M12 6.5a5 5 0 0 0-3 9c.6.5 1 1.2 1 2h4c0-.8.4-1.5 1-2a5 5 0 0 0-3-9Z"/><path d="M12 1.5V3M4.6 4.1l1.1 1.1M19.4 4.1l-1.1 1.1M2 11.5h1.5M20.5 11.5H22"/></>,
 acess: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="7" r="1.3"/><path d="M7 9.6l5 1 5-1M12 10.6v3.9l-2.4 4M12 14.5l2.4 4"/></>,
 letra: <><path d="M4 19 9 5l5 14M5.8 14h6.4M15 19l3-8 3 8M15.8 16.6h4.4"/></>,
 contraste: <><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/></>,
 app: <><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18.5h2"/></>,
 web: <><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></>,
 seta: <path d="M5 12h14m-6-6 6 6-6 6"/>,
 cima: <path d="M12 19V5m-6 6 6-6 6 6"/>,
 externo: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>,
 foto: <><rect x="3" y="5" width="18" height="15" rx="2.5"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 5l1.5-2h5L16 5"/></>,
 fechar: <path d="M6 6l12 12M18 6 6 18"/>,
 pausa: <path d="M9 5v14M15 5v14"/>,
 certo: <path d="m5 12.5 4.5 4.5L19 7"/>,
 copiar: <><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
 play: <path d="M8 5v14l11-7L8 5Z"/>,
};
export function Icone({nome, tamanho = 20}: {nome: string; tamanho?: number}) {
 return <svg className="icone" width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{caminhos[nome]}</svg>;
}

/** Texto só para leitor de tela. */
export const SoLeitor = ({children}: {children: ReactNode}) => <span className="sr-only">{children}</span>;

/* ---------- Janela (dialog nativo: foco preso, Esc fecha, foco volta ao botão) ---------- */
function useJanela() {
 const ref = useRef<HTMLDialogElement>(null);
 const [aberta, setAberta] = useState(false);
 useEffect(() => {
  if (!aberta) return;
  const antes = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = antes; };
 }, [aberta]);
 // Ao fechar, o foco volta para o botão que abriu a janela
 const origem = useRef<HTMLElement | null>(null);
 const devolverFoco = () => { const o = origem.current; if (o && document.contains(o)) requestAnimationFrame(() => o.focus({preventScroll: true})); };
 return {ref, aberta,
  abrir: () => { origem.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null; ref.current?.showModal(); setAberta(true); },
  fechar: () => { ref.current?.close(); setAberta(false); },
  aoFechar: () => { setAberta(false); devolverFoco(); }};
}

function Janela({j, titulo, rotulo, children}: {j: ReturnType<typeof useJanela>; titulo: string; rotulo: string; children: ReactNode}) {
 const id = useRef(`janela-${Math.random().toString(36).slice(2, 8)}`).current;
 return <dialog ref={j.ref} className="janela" aria-labelledby={id} onClose={j.aoFechar} onClick={(e) => { if (e.target === e.currentTarget) j.fechar(); }}>
  {j.aberta && <div className="janela-corpo">
   <header className="janela-topo"><div><p className="sobretitulo">{rotulo}</p><h2 id={id}>{titulo}</h2></div>
    <button type="button" className="botao-fechar" onClick={j.fechar} autoFocus><Icone nome="fechar"/><SoLeitor>Fechar</SoLeitor></button></header>
   {children}
  </div>}
 </dialog>;
}

/* ---------- Pitch (slides) ---------- */
function Slides({id, nome, total}: {id: string; nome: string; total: number}) {
 const [n, setN] = useState(0);
 return <div className="slides" onKeyDown={(e) => { if (e.key === 'ArrowRight') setN((s) => Math.min(total - 1, s + 1)); if (e.key === 'ArrowLeft') setN((s) => Math.max(0, s - 1)); }}>
  <img className="slide-atual" src={`./assets/${id}-slide-${n + 1}.webp`} alt={`${nome}: slide ${n + 1} de ${total}`}/>
  <div className="slides-controles">
   <button type="button" onClick={() => setN(n - 1)} disabled={n === 0}>Anterior</button>
   <span aria-live="polite">{n + 1} de {total}</span>
   <button type="button" onClick={() => setN(n + 1)} disabled={n === total - 1}>Próximo</button>
  </div>
  <div className="slides-miniaturas" role="group" aria-label="Escolher slide">
   {Array.from({length: total}, (_, i) => <button key={i} type="button" onClick={() => setN(i)} aria-label={`Slide ${i + 1}`} aria-current={n === i ? 'true' : undefined}><img src={`./assets/${id}-slide-${i + 1}.webp`} alt="" loading="lazy"/></button>)}
  </div>
 </div>;
}

/* ---------- Estudo de caso de design ---------- */
export function Caso({nome, caso}: {nome: string; caso: CasoDesign}) {
 const Etapa = ({n, titulo, children}: {n: number; titulo: string; children: ReactNode}) =>
  <li className="etapa"><span className="etapa-num" aria-hidden="true">{n}</span><div className="etapa-corpo"><h4>{titulo}</h4>{children}</div></li>;
 return <div className="caso">
  <ol className="etapas">
   <Etapa n={1} titulo="O problema"><p>{caso.problema}</p></Etapa>
   <Etapa n={2} titulo="As dores que identifiquei"><ul className="dores">{caso.dores.map((d) => <li key={d}>{d}</li>)}</ul></Etapa>
   <Etapa n={3} titulo="Para quem"><p>{caso.publico}</p></Etapa>
   <Etapa n={4} titulo="A marca"><p>{caso.marca}</p>
    <ul className="cores-marca">{caso.cores.map((c) => <li key={c.nome}><span className="amostra" style={{background: c.hex}} aria-hidden="true"/><span><b>{c.nome}</b>{c.uso}</span></li>)}</ul></Etapa>
   <Etapa n={5} titulo="Decisões de design"><div className="decisoes">{caso.decisoes.map((d) => <div key={d.titulo} className="decisao"><h5>{d.titulo}</h5><p>{d.texto}</p></div>)}</div></Etapa>
   <Etapa n={6} titulo="Protótipo no Figma"><p>{caso.prototipo}</p>
    <div className="caso-telas" tabIndex={0} role="region" aria-label={`Telas do ${nome}. Role para o lado para ver todas.`}>{caso.telas.map((t) => <figure key={t.img}><img src={`./assets/${t.img}.webp`} alt={`${nome}: ${t.legenda}`} loading="lazy"/><figcaption>{t.legenda}</figcaption></figure>)}</div></Etapa>
  </ol>
  <p className="caso-fim"><b>Resultado</b>{caso.resultado}</p>
 </div>;
}

/* ---------- Botões "Ver ..." de cada projeto ---------- */
function Acao({icone, rotulo, href, onClick, abreJanela = true}: {icone: string; rotulo: string; href?: string; onClick?: () => void; abreJanela?: boolean}) {
 const dentro = <><span className="acao-icone"><Icone nome={icone} tamanho={64}/></span><span className="acao-rotulo">{rotulo}</span></>;
 return href
  ? <a className="acao" href={href} target="_blank" rel="noopener noreferrer">{dentro}<SoLeitor> (abre em nova aba)</SoLeitor></a>
  : <button className="acao" type="button" onClick={onClick} data-acao={icone} {...(abreJanela ? {'aria-haspopup': 'dialog' as const} : {})}>{dentro}</button>;
}

export function AcoesProjeto({id, nome, acoes, caso, onDesign}: {id: string; nome: string; acoes: Acoes; caso?: CasoDesign; onDesign?: () => void}) {
 const design = useJanela();
 const pitch = useJanela();
 return <div className="acoes">
  {acoes.app && <Acao icone="app" rotulo="Abrir o app" href={acoes.app}/>}
  {acoes.prototipo?.map((p) => <Acao key={p.url} icone={/github\.com/i.test(p.url) ? 'github' : /landing/i.test(p.rotulo) ? 'web' : 'figma'} rotulo={p.rotulo} href={p.url}/>)}
  {acoes.design && caso && <Acao icone="design" rotulo="Ver design" onClick={onDesign ?? design.abrir} abreJanela={!onDesign}/>}
  {acoes.pitch && <Acao icone="pitch" rotulo="Ver pitch" onClick={pitch.abrir}/>}
  {caso && !onDesign && <Janela j={design} titulo={nome} rotulo="Estudo de caso · design"><Caso nome={nome} caso={caso}/></Janela>}
  {acoes.pitch && <Janela j={pitch} titulo={nome} rotulo="Pitch"><Slides id={id} nome={nome} total={acoes.pitch}/></Janela>}
 </div>;
}
