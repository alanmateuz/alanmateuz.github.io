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
 figma: <><path d="M9 3h3v6H9a3 3 0 0 1 0-6ZM12 3h3a3 3 0 0 1 0 6h-3V3ZM9 9h3v6H9a3 3 0 0 1 0-6Z"/><circle cx="15" cy="12" r="3"/><path d="M9 15h3v3a3 3 0 1 1-3-3Z"/></>,
 design: <><path d="m14 4 6 6-10 10H4v-6L14 4Z"/><path d="m11 7 6 6"/></>,
 pitch: <><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.1 1.3 1.1 2.2h5c0-.9.3-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/></>,
 app: <><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18.5h2"/></>,
 web: <><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></>,
 seta: <path d="M5 12h14m-6-6 6 6-6 6"/>,
 cima: <path d="M12 19V5m-6 6 6-6 6 6"/>,
 externo: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>,
 foto: <><rect x="3" y="5" width="18" height="15" rx="2.5"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 5l1.5-2h5L16 5"/></>,
 fechar: <path d="M6 6l12 12M18 6 6 18"/>,
 pausa: <path d="M9 5v14M15 5v14"/>,
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
 return {ref, aberta, abrir: () => { ref.current?.showModal(); setAberta(true); }, fechar: () => { ref.current?.close(); setAberta(false); }, aoFechar: () => setAberta(false)};
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
function Caso({nome, caso}: {nome: string; caso: CasoDesign}) {
 return <div className="caso">
  <section><h3>O problema</h3><p className="caso-problema">{caso.problema}</p></section>
  <section><h3>Processo</h3><ol className="caso-passos">{caso.processo.map((p, i) => <li key={i}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><p>{p}</p></li>)}</ol></section>
  <section><h3>Decisões de design</h3><div className="caso-decisoes">{caso.decisoes.map((d) => <article key={d.titulo} className="decisao"><h4>{d.titulo}</h4>
   {d.antes && <p><b className="antes">Antes</b>{d.antes}</p>}<p><b className="depois">{d.antes ? 'Depois' : 'Decisão'}</b>{d.depois}</p><p><b className="porque">Por quê</b>{d.porque}</p></article>)}</div></section>
  <section><h3>Telas</h3><div className="caso-telas" tabIndex={0} role="region" aria-label={`Telas do ${nome}. Role para o lado para ver todas.`}>{caso.telas.map((t) => <figure key={t.img}><img src={`./assets/${t.img}.webp`} alt={`${nome}: ${t.legenda}`} loading="lazy"/><figcaption>{t.legenda}</figcaption></figure>)}</div></section>
  <section><h3>Resultado</h3><p className="caso-resultado">{caso.resultado}</p></section>
 </div>;
}

/* ---------- Botões "Ver ..." de cada projeto ---------- */
function Acao({icone, rotulo, href, onClick}: {icone: string; rotulo: string; href?: string; onClick?: () => void}) {
 const dentro = <><span className="acao-icone"><Icone nome={icone} tamanho={30}/></span><span className="acao-rotulo">{rotulo}{href && <Icone nome="externo" tamanho={15}/>}</span></>;
 return href
  ? <a className="acao" href={href} target="_blank" rel="noopener noreferrer">{dentro}<SoLeitor> (abre em nova aba)</SoLeitor></a>
  : <button className="acao" type="button" onClick={onClick} aria-haspopup="dialog">{dentro}</button>;
}

export function AcoesProjeto({id, nome, acoes, caso}: {id: string; nome: string; acoes: Acoes; caso?: CasoDesign}) {
 const design = useJanela();
 const pitch = useJanela();
 return <div className="acoes">
  {acoes.app && <Acao icone="app" rotulo="Abrir o app" href={acoes.app}/>}
  {acoes.prototipo?.map((p) => <Acao key={p.url} icone={/landing/i.test(p.rotulo) ? 'web' : 'figma'} rotulo={p.rotulo} href={p.url}/>)}
  {acoes.design && caso && <Acao icone="design" rotulo="Ver design" onClick={design.abrir}/>}
  {acoes.pitch && <Acao icone="pitch" rotulo="Ver pitch" onClick={pitch.abrir}/>}
  {caso && <Janela j={design} titulo={nome} rotulo="Estudo de caso · design"><Caso nome={nome} caso={caso}/></Janela>}
  {acoes.pitch && <Janela j={pitch} titulo={nome} rotulo="Pitch"><Slides id={id} nome={nome} total={acoes.pitch}/></Janela>}
 </div>;
}
