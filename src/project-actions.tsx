'use client';
import {useEffect, useRef, useState} from 'react';
import type {CasoDesign} from './projects';
export const prototypeLinks = {
 alui:'https://www.figma.com/proto/ZeNsOeWOFET5LWMfR5YyH0/Alui?page-id=0%3A1&node-id=1-13&p=f&viewport=-666%2C-351%2C0.58&t=AQnSTbWyQMpqOOsO-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2',
 reuseWeb:'https://www.figma.com/proto/6uBMFvv39cWSeVa7tP3Wlk/ReUni?node-id=1-6&page-id=1%3A2&starting-point-node-id=1%3A6&t=uOS88tqX22zY3Xhk-1',
 reuseMobile:'https://www.figma.com/proto/6uBMFvv39cWSeVa7tP3Wlk/ReUni?node-id=1-3&t=D99ocYFHTxDUHz3N-1',
 provaizi:'https://prova-izi.vercel.app'
};

/** "Ver o design": o estudo de caso de UI/UX do projeto, para quem quiser se aprofundar. */
export function DesignCase({id,name,caso}:{id:string;name:string;caso:CasoDesign}){
 const dialog=useRef<HTMLDialogElement>(null);const [open,setOpen]=useState(false);
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[open]);
 const close=()=>{dialog.current?.close();setOpen(false)};
 return <><button className="project-cta design-cta" type="button" onClick={()=>{dialog.current?.showModal();setOpen(true)}}>Ver o design</button>
 <dialog ref={dialog} className="design-dialog" aria-labelledby={`${id}-design-title`} onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}>
 {open&&<article className="design-case">
  <header><div><p className="eyebrow">ESTUDO DE CASO · UI/UX</p><h2 id={`${id}-design-title`}>{name}</h2></div><button autoFocus onClick={close} className="dialog-close" aria-label="Fechar estudo de caso">Fechar <span aria-hidden="true">×</span></button></header>
  <section className="case-problem"><h3>O problema</h3><p>{caso.problema}</p></section>
  <section><h3>Processo</h3><ol className="case-steps">{caso.processo.map((p,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{p}</p></li>)}</ol></section>
  <section><h3>Decisões de design</h3><div className="case-decisions">{caso.decisoes.map(d=><div key={d.titulo} className="decision"><h4>{d.titulo}</h4>{d.antes&&<p className="before"><b>Antes</b>{d.antes}</p>}<p className="after"><b>{d.antes?'Depois':'Decisão'}</b>{d.depois}</p><p className="why"><b>Por quê</b>{d.porque}</p></div>)}</div></section>
  <section><h3>Telas</h3><div className="case-screens" tabIndex={0} role="region" aria-label={`Telas do ${name}`}>{caso.telas.map(t=><figure key={t.img}><img src={`./assets/${t.img}.webp`} alt={`${name}: ${t.legenda}`} loading="lazy"/><figcaption>{t.legenda}</figcaption></figure>)}</div></section>
  <section className="case-result"><h3>Resultado</h3><p>{caso.resultado}</p></section>
 </article>}
 </dialog></>
}
export function ProjectActions({id,name,caso}:{id:string;name:string;caso?:CasoDesign}){
 const dialog=useRef<HTMLDialogElement>(null);const [slide,setSlide]=useState(0);const [open,setOpen]=useState(false);const total=id==='alui'?10:15;
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[open]);
 const close=()=>{dialog.current?.close();setOpen(false)};
 const external=(label:string,url:string)=><a className="project-cta" href={url} target="_blank" rel="noopener noreferrer">{label}</a>;
 const design=caso?<DesignCase id={id} name={name} caso={caso}/>:null;
 if(id==='provaizi')return <div className="project-actions">{external('Abrir o app',prototypeLinks.provaizi)}{design}</div>;
 return <div className="project-actions">{id==='reuse'?<>{design}{external('Protótipo da landing page',prototypeLinks.reuseWeb)}{external('Protótipo mobile',prototypeLinks.reuseMobile)}</>:<><button className="project-cta" type="button" onClick={()=>{setSlide(0);dialog.current?.showModal();setOpen(true)}}>Visualizar slides</button>{id==='alui'&&external('Explorar protótipo',prototypeLinks.alui)}{id!=='reuse'&&design}
 <dialog ref={dialog} className="slide-dialog" aria-labelledby={`${id}-slides-title`} onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();setSlide(s=>Math.min(total-1,s+1))}if(e.key==='ArrowLeft'){e.preventDefault();setSlide(s=>Math.max(0,s-1))}}}>
 {open&&<div className="slide-dialog-content"><header><h2 id={`${id}-slides-title`}>{name} · Apresentação</h2><button autoFocus onClick={close} className="dialog-close" aria-label="Fechar apresentação">Fechar <span aria-hidden="true">×</span></button></header><div className="slide-display"><img src={`./assets/${id}-slide-${slide+1}.webp`} alt={`${name}, slide ${slide+1} de ${total}`}/></div><div className="slide-controls"><button onClick={()=>setSlide(s=>s-1)} disabled={slide===0}>Anterior</button><span role="status" aria-live="polite">{slide+1} / {total}</span><button onClick={()=>setSlide(s=>s+1)} disabled={slide===total-1}>Próximo</button></div><div className="slide-thumbnails" aria-label="Selecionar slide">{Array.from({length:total},(_,n)=><button key={n} onClick={()=>setSlide(n)} aria-label={`Slide ${n+1}`} aria-current={slide===n?'true':undefined}><img src={`./assets/${id}-slide-${n+1}.webp`} alt="" loading="lazy"/><span>{n+1}</span></button>)}</div></div>}
 </dialog></>}</div>
}
export function SafraSlides(){
 const track=useRef<HTMLDivElement>(null);const drag=useRef<{x:number;scroll:number}|null>(null);
 const move=(direction:number)=>{const el=track.current;if(el)el.scrollBy({left:direction*((el.querySelector('figure')?.getBoundingClientRect().width||400)+20),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
 const release=()=>{drag.current=null;track.current?.classList.remove('dragging')};
 return <div className="safra-slides reveal"><div className="safra-slides-heading"><p>Conheça a solução</p><div><button onClick={()=>move(-1)} aria-label="Slides anteriores do Safra">Anterior</button><button onClick={()=>move(1)} aria-label="Próximos slides do Safra">Próximo</button></div></div><div ref={track} className="safra-slide-track" role="region" aria-label="Slides do Safra. Arraste ou use as setas do teclado." tabIndex={0} onPointerDown={e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag.current={x:e.clientX,scroll:e.currentTarget.scrollLeft};e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.classList.add('dragging')}} onPointerMove={e=>{if(drag.current)e.currentTarget.scrollLeft=drag.current.scroll-(e.clientX-drag.current.x)}} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}}}>{Array.from({length:15},(_,i)=><figure key={i}><img draggable={false} src={`./assets/safra-slide-${i+1}.webp`} alt={`Safra — slide ${i+1} de 15`} loading="lazy"/></figure>)}</div></div>
}
