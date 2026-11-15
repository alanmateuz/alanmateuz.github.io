import {useEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import {somCarta} from './som';
import {projects, type ItemGaleria, type Projeto} from './projects';
import {AcoesProjeto, Caso, Icone, SoLeitor} from './project-actions';
import {podeMover, Inclina, usePilha, useRevela, useAberturaRolagem, TelaFluxo, useTocaFluxos} from './movimento';

const CONTATOS = {
 github: 'https://github.com/alanmateuz',
 email: 'mailto:alanmateusqueiroz@gmail.com',
 linkedin: 'https://linkedin.com/in/alanmateusqueiroz',
};

/* ---------- Preferências salvas neste navegador ---------- */
function useSalvo<T extends string>(chave: string, padrao: T, atributo: string) {
 const [valor, setValor] = useState<T>(() => (document.documentElement.dataset[atributo] as T) || padrao);
 useEffect(() => {
  document.documentElement.dataset[atributo] = valor;
  try { localStorage.setItem(chave, valor); } catch { /* navegação privada */ }
 }, [valor, chave, atributo]);
 return [valor, setValor] as const;
}

/* Tema: começa sempre no escuro; só muda para o claro se a pessoa apertar o botão (a escolha fica salva) */
function useTema() {
 const [tema, setTemaEstado] = useState<'escuro' | 'claro'>(() => (document.documentElement.dataset.tema as 'escuro' | 'claro') || 'escuro');
 useEffect(() => { document.documentElement.dataset.tema = tema; }, [tema]);
 const escolher = (t: 'escuro' | 'claro') => { setTemaEstado(t); try { localStorage.setItem('tema-manual', t); } catch { /* navegação privada */ } };
 return [tema, escolher] as const;
}

/* ---------- Painel de acessibilidade ---------- */
const TAMANHOS = [['1', 'Normal'], ['2', 'Grande'], ['3', 'Maior']] as const;
function PainelAcessibilidade() {
 const [aberto, setAberto] = useState(false);
 const [texto, setTexto] = useSalvo<string>('a11y-texto', '1', 'texto');
 const [contraste, setContraste] = useSalvo<string>('a11y-contraste', 'nao', 'contraste');
 const [legivel, setLegivel] = useSalvo<string>('a11y-legivel', 'nao', 'legivel');
 const [espaco, setEspaco] = useSalvo<string>('a11y-espaco', 'nao', 'espaco');
 const [links, setLinks] = useSalvo<string>('a11y-links', 'nao', 'links');
 const [parado, setParado] = useSalvo<string>('a11y-parado', 'nao', 'parado');
 const [sons, setSons] = useSalvo<string>('a11y-sons', 'sim', 'sons');
 const caixa = useRef<HTMLDivElement>(null);
 const botao = useRef<HTMLButtonElement>(null);
 useEffect(() => {
  if (!aberto) return;
  caixa.current?.querySelector<HTMLElement>('button, input')?.focus();
  const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAberto(false); botao.current?.focus(); } };
  const fora = (e: MouseEvent) => { if (!caixa.current?.contains(e.target as Node) && !botao.current?.contains(e.target as Node)) setAberto(false); };
  document.addEventListener('keydown', tecla); document.addEventListener('mousedown', fora);
  return () => { document.removeEventListener('keydown', tecla); document.removeEventListener('mousedown', fora); };
 }, [aberto]);
 const Opcao = ({rotulo, ligado, mudar, dica}: {rotulo: string; ligado: boolean; mudar: () => void; dica: string}) =>
  <button type="button" role="switch" aria-checked={ligado} className="a11y-opcao" onClick={mudar}>
   <span><b>{rotulo}</b><small>{dica}</small></span><span className="a11y-chave" aria-hidden="true"/>
  </button>;
 const alternar = (v: string, f: (x: string) => void) => () => f(v === 'sim' ? 'nao' : 'sim');
 const restaurar = () => { setTexto('1'); setContraste('nao'); setLegivel('nao'); setEspaco('nao'); setLinks('nao'); setParado('nao'); setSons('sim'); };
 return <div className="a11y">
  <button ref={botao} type="button" className="botao-topo" aria-expanded={aberto} aria-controls="painel-a11y" onClick={() => setAberto(!aberto)}>
   <Icone nome="acess" tamanho={24}/><SoLeitor>Acessibilidade</SoLeitor>
  </button>
  {aberto && <div ref={caixa} id="painel-a11y" className="a11y-painel" role="dialog" aria-label="Opções de acessibilidade">
   <p className="a11y-titulo">Acessibilidade</p>
   <fieldset className="a11y-tamanho"><legend>Tamanho do texto</legend>
    <div>{TAMANHOS.map(([v, r]) => <button key={v} type="button" aria-pressed={texto === v} onClick={() => setTexto(v)}>
     <span aria-hidden="true" style={{fontSize: `${0.85 + Number(v) * 0.2}rem`}}>A</span>{r}</button>)}</div>
   </fieldset>
   <Opcao rotulo="Alto contraste" dica="Preto e branco, bordas fortes" ligado={contraste === 'sim'} mudar={alternar(contraste, setContraste)}/>
   <Opcao rotulo="Fonte mais legível" dica="Letras mais abertas e distintas" ligado={legivel === 'sim'} mudar={alternar(legivel, setLegivel)}/>
   <Opcao rotulo="Mais espaço no texto" dica="Linhas e letras mais afastadas" ligado={espaco === 'sim'} mudar={alternar(espaco, setEspaco)}/>
   <Opcao rotulo="Destacar links" dica="Sublinha tudo que é clicável" ligado={links === 'sim'} mudar={alternar(links, setLinks)}/>
   <Opcao rotulo="Parar animações" dica="Sem movimento na página" ligado={parado === 'sim'} mudar={alternar(parado, setParado)}/>
   <Opcao rotulo="Sons" dica="Som curto quando o card do projeto vira" ligado={sons === 'sim'} mudar={() => setSons(sons === 'sim' ? 'nao' : 'sim')}/>
   <button type="button" className="a11y-restaurar" onClick={restaurar}>Restaurar padrão</button>
  </div>}
 </div>;
}

/* ---------- E-mail: copiar ou abrir no Gmail (mailto não funciona sem app de e-mail) ---------- */
const EMAIL = CONTATOS.email.replace('mailto:', '');

/* ---------- Pedaços ---------- */
function Pilula({href, icone, children, externo}: {href: string; icone: string; children: string; externo?: boolean}) {
 return <a className="pilula" href={href} {...(externo ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
  {children}<Icone nome={icone} tamanho={18}/>{externo && <SoLeitor> (abre em nova aba)</SoLeitor>}
 </a>;
}

/* Página inteira (landing) que rola sozinha enquanto está na tela, independente dos celulares */
function PaginaRolando({item, nome}: {item: ItemGaleria; nome: string}) {
 const ref = useRef<HTMLElement>(null);
 useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const io = new IntersectionObserver(([e]) => el.classList.toggle('ativo', e.isIntersecting), {threshold: 0.45});
  io.observe(el);
  // Clique: começa a rolar na hora (pula a pausa do início)
  const agora = () => {
   if (!podeMover()) return;
   el.classList.add('ativo');
   requestAnimationFrame(() => el.querySelector('img')?.getAnimations().forEach((a) => { a.currentTime = 1000; a.play(); }));
  };
  const tecla = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); agora(); } };
  el.addEventListener('click', agora); el.addEventListener('keydown', tecla);
  return () => { io.disconnect(); el.removeEventListener('click', agora); el.removeEventListener('keydown', tecla); };
 }, []);
 return <figure ref={ref} className="midia midia-tela midia-pagina" tabIndex={0} role="button" aria-label={`Rolar a ${item.legenda.toLowerCase()}`}>
  <div className="midia-caixa"><img src={`./assets/${item.img}.webp`} alt={`${nome}: ${item.legenda}`} loading="lazy" decoding="async"/></div>
  <figcaption>{item.legenda}</figcaption>
 </figure>;
}

function Imagem({item, nome}: {item: ItemGaleria; nome: string}) {
 if (item.pagina && item.img) return <PaginaRolando item={item} nome={nome}/>;
 if (!item.img) {
  // Foto ainda não enviada: espaço reservado, fácil de trocar depois
  return <figure className={`midia midia-${item.tipo} reservado`}>
   <div className="reservado-caixa" role="img" aria-label={`${item.legenda}: foto em breve`}><Icone nome="foto" tamanho={28}/><span>Foto em breve</span></div>
   <figcaption>{item.legenda}</figcaption>
  </figure>;
 }
 const anima = Boolean(item.toques || item.rolar);
 return <figure className={`midia midia-${item.tipo} ${item.rolar ? 'rola' : ''}`} {...(anima ? {'data-seq': ''} : {})}>
  <Inclina className="midia-caixa">
   <img src={`./assets/${item.img}.webp`} alt={`${nome}: ${item.legenda}`} loading="lazy" decoding="async"/>
   {item.toques?.map(([x, y], i) => <span key={i} className="toque" aria-hidden="true" style={{left: `${x}%`, top: `${y}%`, ['--n' as string]: i}}/>)}
  </Inclina>
  <figcaption>{item.legenda}</figcaption>
 </figure>;
}

function Galeria({p}: {p: Projeto}) {
 const celulares = p.galeria.filter((g) => g.tipo === 'celular').length;
 const ref = useRef<HTMLDivElement>(null);
 useTocaFluxos(ref);
 return <div ref={ref} className="galeria" style={{['--colunas-celular' as string]: celulares >= 4 ? 3 : celulares === 3 ? 4 : 6}}>
  {p.galeria.map((g, i) => <div key={i} style={{['--i' as string]: i}} className={`galeria-item revela ${g.largo ? 'largo' : ''} item-${g.tipo}`}>{g.fluxo ? <TelaFluxo passos={g.fluxo} legenda={g.legenda} nome={p.name}/> : <Imagem item={g} nome={p.name}/>}</div>)}
 </div>;
}

/* Quadradinhos dos projetos, numa fileira que rola para o lado */
/* Projetos em "coverflow": o card ativo fica de frente, os dos lados giram com a borda de fora indo para longe.
   Todos dividem a mesma perspectiva, então a transição continua em 3D enquanto troca de card. */
function FileiraProjetos() {
 // O Safra (projeto principal) fica no meio, com um projeto de cada lado
 const base = [projects[1], projects[0], ...projects.slice(2)].filter(Boolean);
 const lista = base;
 const [ativo, setAtivo] = useState(Math.floor((lista.length - 1) / 2));
 const ir = (i: number) => setAtivo(Math.max(0, Math.min(lista.length - 1, i)));
 // Arrastar para o lado (dedo ou mouse) troca de card
 const inicio = useRef<number | null>(null);
 const soltar = (x: number) => { if (inicio.current === null) return; const dx = x - inicio.current; inicio.current = null; if (Math.abs(dx) > 40) ir(ativo + (dx < 0 ? 1 : -1)); };
 return <div className="fileira fileira-curva">
  <ul className="cf-palco" aria-label="Projetos. Use as setas para ver os outros." aria-roledescription="carrossel"
   onPointerDown={(e) => { inicio.current = e.clientX; }} onPointerUp={(e) => soltar(e.clientX)} onPointerCancel={() => { inicio.current = null; }}
   onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); ir(ativo + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); ir(ativo - 1); } }}>
   {lista.map((p, n) => {
    // Cada card fica na superfície de um cilindro: ângulo fixo entre vizinhos, então todos seguem a mesma curva
    const o = n - ativo, a = Math.abs(o), ang = o * 34, rad = ang * Math.PI / 180, R = 1.72;
    const x = R * Math.sin(rad), z = R * (Math.cos(rad) - 1); // em "larguras de card"
    return <li key={p.id + n} className={`quadrado cf-card ${o === 0 ? 'cf-ativo' : o < 0 ? 'cf-esq' : 'cf-dir'}`} aria-hidden={a > 1 || undefined}
     style={{['--cor' as string]: p.cor, zIndex: 10 - a, opacity: a > 1 ? 0 : 1, visibility: a > 1 ? "hidden" : undefined,
      transform: `translateX(calc(var(--card) * ${x.toFixed(3)})) translateZ(calc(var(--card) * ${z.toFixed(3)})) rotateY(${ang}deg)`}}>
     <a href={`#${p.id}`} tabIndex={a > 1 ? -1 : 0} onFocus={() => ir(n)} onClick={(e) => { if (o !== 0) { e.preventDefault(); ir(n); } }}>
      <span className={`quadrado-imagem quadrado-marca marca-${p.id}`}><img src={`./assets/marca-${p.id}.webp`} alt="" loading="lazy" decoding="async"/></span>
      <span className="quadrado-texto"><span className="quadrado-nome">{p.name}</span><span className="quadrado-resumo">{p.summary}</span></span>
     </a>
    </li>;
   })}
  </ul>
  <div className="fileira-setas">
   <button type="button" onClick={() => ir(ativo - 1)} disabled={ativo === 0} aria-label="Projeto anterior"><Icone nome="seta" tamanho={20}/></button>
   <button type="button" onClick={() => ir(ativo + 1)} disabled={ativo === lista.length - 1} aria-label="Próximo projeto"><Icone nome="seta" tamanho={20}/></button>
  </div>
 </div>;
}

function DetalheProjeto({p, i}: {p: Projeto; i: number}) {
 const [virado, setVirado] = useState(false);
 // Na metade do giro, o lado visível passa a definir a altura do card (uma rolagem só, a da página)
 const [lado, setLado] = useState<'frente' | 'verso'>('frente');
 const virador = useRef<HTMLDivElement>(null);
 // Enquanto aberto, o card não gruda na tela; só volta a grudar depois que a animação termina
 const [aberto, setAberto] = useState(false);
 useEffect(() => {
  const novo = virado ? 'verso' : 'frente';
  if (novo === lado) return;
  const el = virador.current;
  const trocar = () => {
   // Troca o lado que define a altura e anima a altura, sem pulo
   const antes = el?.offsetHeight ?? 0;
   if (el && podeMover()) el.style.height = antes + 'px';
   setLado(novo);
   requestAnimationFrame(() => {
    if (!el || !podeMover()) return;
    el.style.height = '';
    const depois = el.offsetHeight;
    if (Math.abs(depois - antes) > 2) el.animate([{height: antes + 'px'}, {height: depois + 'px'}], {duration: 520, easing: 'cubic-bezier(.32, .72, 0, 1)'});
   });
   if (novo === 'frente') setTimeout(() => setAberto(false), podeMover() ? 700 : 0);
   requestAnimationFrame(() => dispatchEvent(new Event('scroll')));
  };
  const t = setTimeout(trocar, podeMover() ? 380 : 0);
  return () => clearTimeout(t);
 }, [virado]);
 const verso = useRef<HTMLDivElement>(null);
 const frente = useRef<HTMLDivElement>(null);
 const virar = (v: boolean) => {
  const sec = frente.current?.closest('.projeto') as HTMLElement | null;
  // Ao voltar, primeiro sobe até o topo do card; depois ele gira
  if (!v && sec && sec.getBoundingClientRect().top < -40 && podeMover()) {
   sec.scrollIntoView({behavior: 'smooth', block: 'start'});
   setTimeout(() => virar2(v), 650);
   return;
  }
  virar2(v);
 };
 const virar2 = (v: boolean) => {
  if (v) setAberto(true);
  somCarta();
  setVirado(v);
  // Depois do giro, o foco vai para o lado que ficou visível
  setTimeout(() => {
   if (v) verso.current?.querySelector<HTMLElement>('.verso-titulo')?.focus({preventScroll: true});
   else frente.current?.querySelector<HTMLElement>('[data-acao="design"]')?.focus({preventScroll: true});
  }, 60);
  if (v) frente.current?.closest('.projeto')?.scrollIntoView({behavior: podeMover() ? 'smooth' : 'auto', block: 'start'});
 };
 // Depois de ler o design e seguir rolando: quando o próximo card cobre este, ele desvira sozinho,
 // sem animação e sem mexer no que está na tela
 useEffect(() => {
  if (!virado) return;
  const sec = frente.current?.closest('.projeto') as HTMLElement | null;
  if (!sec) return;
  const prox = sec.nextElementSibling as HTMLElement | null;
  const checar = () => {
   const coberto = prox ? prox.getBoundingClientRect().top < 60 : sec.getBoundingClientRect().bottom < 0;
   if (!coberto) return;
   const antes = sec.offsetHeight;
   sec.classList.add('sem-giro');
   flushSync(() => { setVirado(false); setLado('frente'); setAberto(false); });
   const diferenca = antes - sec.offsetHeight;
   if (diferenca > 0) scrollBy({top: -diferenca, behavior: 'instant'});
   requestAnimationFrame(() => { sec.classList.remove('sem-giro'); dispatchEvent(new Event('scroll')); });
  };
  addEventListener('scroll', checar, {passive: true});
  return () => removeEventListener('scroll', checar);
 }, [virado]);
 useEffect(() => {
  if (!virado) return;
  const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') virar(false); };
  addEventListener('keydown', esc); return () => removeEventListener('keydown', esc);
 }, [virado]);
 return <section id={p.id} className={`projeto ${aberto ? 'aberto' : ''}`} style={{['--cor' as string]: p.cor, zIndex: i + 1}} aria-labelledby={`${p.id}-titulo`}>
  <div ref={virador} className={`projeto-virador ${virado ? 'virado' : ''} lado-${lado}`}>
  <div ref={frente} className="projeto-card projeto-frente" inert={virado}>
   <div className="projeto-cabeca">
    <div>
     <h2 id={`${p.id}-titulo`} className="titulo">{p.name}</h2>
     <p className="stack">{p.tags.join(' · ')}</p>
    </div>
    {p.logos && <ul className="logos" aria-label="Parceiros">{p.logos.map((l) => <li key={l.nome}>{l.texto
     ? <svg className="logo-texto" viewBox="0 0 240 48" role="img" aria-label={l.nome}>
       <text x="0" y="31" textLength="240" lengthAdjust="spacingAndGlyphs" className="logo-texto-1">{l.texto[0]}</text>
       <text x="1" y="46" textLength="238" lengthAdjust="spacingAndGlyphs" className="logo-texto-2">{l.texto[1]}</text>
      </svg>
     : <img src={`./assets/${l.img}.png`} alt={l.nome}/>}</li>)}</ul>}
   </div>
   <div className="projeto-texto revela">
    <p>{p.description}</p>
    <p>{p.role}</p>
   </div>
   <Galeria p={p}/>
   <AcoesProjeto id={p.id} nome={p.name} acoes={p.acoes} caso={p.design} onDesign={p.design ? () => virar(true) : undefined}/>
  </div>
  {p.design && <div ref={verso} className="projeto-card projeto-verso" inert={!virado} aria-hidden={!virado}>
   <div className="verso-topo">
    <div>
     <p className="verso-rotulo">Estudo de caso · design</p>
     <h3 className="titulo verso-titulo" tabIndex={-1}>{p.name}</h3>
    </div>
    <button type="button" className="verso-voltar" onClick={() => virar(false)}><Icone nome="seta" tamanho={18}/>Voltar ao projeto</button>
   </div>
   <Caso nome={p.name} caso={p.design}/>
  </div>}
  </div>
 </section>;
}

/* Fotos do "Sobre": as que já existem + espaços para as próximas */
const FOTOS_SOBRE = [
 {img: 'sobre-conexao', legenda: 'Em evento de tecnologia e inovação'},
 {img: 'sobre-mdb', legenda: 'Equipe 4Tech na M. Dias Branco'},
 {img: 'sobre-gohacks', legenda: 'Crachá do GoHacks Talent, da gogroup'},
 {img: 'sobre-certificado', legenda: 'Certificado do O-Hackathon'},
 {img: 'sobre-unifor-hub', legenda: 'Participantes no Unifor Hub'},
 {img: 'sobre-auditorio', legenda: 'Encerramento do O-Hackathon na Unifor'},
];

/* Fotos do Sobre: mesma esteira em perspectiva da abertura, espelhada (vem da esquerda e vai para a direita) */
function FaixaFotos() {
 const [pausada, setPausada] = useState(false);
 const ref = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const io = new IntersectionObserver(([e]) => el.classList.toggle('fora', !e.isIntersecting));
  io.observe(el);
  return () => io.disconnect();
 }, []);
 const fotos = FOTOS_SOBRE.filter((f) => f.img);
 return <div ref={ref} className={`faixa faixa-3d ${pausada ? 'pausada' : ''}`}>
  <ul className="faixa-palco" aria-label="Fotos de eventos e equipes">
   {fotos.map((f, i) => <li key={f.img} className="faixa-capa" style={{['--i' as string]: i, ['--n' as string]: fotos.length}}>
    <img src={`./assets/${f.img}.webp`} alt={f.legenda} loading="lazy"/>
   </li>)}
  </ul>
  <button type="button" className="faixa-pausa" onClick={() => setPausada(!pausada)} aria-pressed={pausada}>
   <Icone nome={pausada ? 'play' : 'pausa'} tamanho={16}/>{pausada ? 'Continuar fotos' : 'Pausar fotos'}
  </button>
 </div>;
}

export default function Home() {
 const [tema, setTema] = useTema();
 useEffect(() => { document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'escuro' ? '#131313' : '#ffffff'); }, [tema]);
 const [rolou, setRolou] = useState(false);
 const abertura = useRef<HTMLElement>(null);
 // O nome no topo só aparece depois que a abertura sai da tela
 const [passouAbertura, setPassouAbertura] = useState(false);
 useEffect(() => {
  const el = abertura.current?.querySelector('.hero-nome');
  if (!el) return;
  // Mede a cada rolagem (devagar ou rápido): passou quando o nome some atrás da barra do topo
  const hero = abertura.current;
  const medir = () => {
   setPassouAbertura(el.getBoundingClientRect().bottom < 64);
   // Fora da tela, a esteira de capas para de animar
   if (hero) hero.classList.toggle('fora', hero.getBoundingClientRect().bottom < 0);
  };
  medir();
  addEventListener('scroll', medir, {passive: true});
  addEventListener('resize', medir);
  return () => { removeEventListener('scroll', medir); removeEventListener('resize', medir); };
 }, []);
 usePilha('.projeto');
 useRevela();
 useAberturaRolagem(abertura);
 useEffect(() => {
  const aoRolar = () => setRolou(window.scrollY > 40);
  aoRolar();
  window.addEventListener('scroll', aoRolar, {passive: true});
  return () => window.removeEventListener('scroll', aoRolar);
 }, []);

 return <>
  <a className="pular" href="#projetos">Pular para os projetos</a>
  <header className={`topo ${rolou ? 'topo-rolou' : ''}`} id="topo">
   <a href="#conteudo" className={`topo-nome ${passouAbertura ? 'visivel' : ''}`} aria-hidden={!passouAbertura} tabIndex={passouAbertura ? 0 : -1}>Alan Mateus Queiroz</a>
   <nav aria-label="Seções" className={`topo-links ${passouAbertura ? 'visivel' : ''}`} inert={!passouAbertura}>
    <a href="#sobre">Sobre</a><a href="#projetos">Projetos</a><a href="#contato">Contato</a>
   </nav>
   <PainelAcessibilidade/>
   <button type="button" className="botao-topo" onClick={() => setTema(tema === 'escuro' ? 'claro' : 'escuro')} aria-pressed={tema === 'claro'}
    aria-label={tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'} title={tema === 'escuro' ? 'Modo claro' : 'Modo escuro'}>
    <Icone nome={tema === 'escuro' ? 'sol' : 'lua'} tamanho={24}/>
   </button>
  </header>

  <main id="conteudo">
   <section ref={abertura} className="hero" aria-labelledby="nome">
    <div className="container hero-centro">
     <div className="hero-texto">
      <p className="hero-rotulo">Portfólio · 2026</p>
      <h1 id="nome" className="hero-nome">{['Alan', 'Mateus', 'Queiroz'].map((w, i) => <span key={w}>{i > 0 && ' '}<span className="palavra" style={{['--i' as string]: i}}>{w}</span></span>)}</h1>
      <p className="hero-sub">Sou estudante de Análise e Desenvolvimento de Sistemas na UNIFOR e estou construindo minha carreira em tecnologia. Tenho interesse em desenvolvimento de software, automação de processos, inteligência artificial e produtos digitais.</p>
      <p className="hero-sub hero-sub-2">Minha trajetória combina estudos, pesquisa aplicada e colaboração em iniciativas de inovação.</p>
      <div className="hero-acoes">
       <a className="botao-cheio" href="#projetos">Ver projetos <Icone nome="seta" tamanho={18}/></a>
       <a className="botao-linha" href="#contato">Fale comigo <Icone nome="mail" tamanho={18}/></a>
      </div>
     </div>
     <div className="vitrine" aria-hidden="true">
      <div className="esteira">
       {['safra-capa', 'alui-slide-1', 'reuse-landing', 'safra-capa', 'alui-slide-1', 'reuse-landing'].map((img, i) =>
        <div key={i} className="esteira-capa" style={{['--i' as string]: i}}><img src={`./assets/${img}.webp`} alt=""/></div>)}
      </div>
     </div>
     <div className="prova">
      <p>Projetos para</p>
      <ul aria-label="Instituições e eventos">
       <li><img src="./assets/logo-mdb.png" alt="M. Dias Branco"/></li>
       <li><img src="./assets/logo-unifor.png" alt="Unifor"/></li>
       <li><img src="./assets/logo-hackathon.png" alt="O-Hackathon M. Dias Branco"/></li>
       <li><svg className="logo-texto" viewBox="0 0 240 48" role="img" aria-label="Hacktudo, Festival de Cultura Digital"><text x="0" y="31" textLength="240" lengthAdjust="spacingAndGlyphs" className="logo-texto-1">HACKTUDO</text><text x="1" y="46" textLength="238" lengthAdjust="spacingAndGlyphs" className="logo-texto-2">FESTIVAL DE CULTURA DIGITAL</text></svg></li>
      </ul>
     </div>
    </div>
   </section>

   <div className="folha">
    <section id="sobre" className="sobre" aria-labelledby="sobre-titulo">
     <div className="container sobre-texto revela">
      <h2 id="sobre-titulo" className="titulo">Sobre</h2>
      <p>Sou o Alan, estudante de Análise e Desenvolvimento de Sistemas na Unifor, em Fortaleza. Gosto de projetos que começam com perguntas simples, como quem vai usar isso e o que atrapalha essa pessoa hoje, e terminam em algo que funciona de verdade.</p>
      <p>Hoje sou bolsista pesquisador na M. Dias Branco. Nos hackathons e desafios de inovação de que participei, assumi tanto o design quanto o desenvolvimento: coordenar a equipe, desenhar as telas no Figma, prototipar e construir. Quero seguir crescendo em produtos digitais, unindo UX, desenvolvimento de software, automação e inteligência artificial.</p>
     </div>
     <FaixaFotos/>
    </section>

    <section id="projetos" className="resumo" aria-labelledby="projetos-titulo">
     <div className="container"><h2 id="projetos-titulo" className="titulo">Projetos</h2></div>
     <FileiraProjetos/>
    </section>

    <div className="pilha">{projects.map((p, i) => <DetalheProjeto key={p.id} p={p} i={i}/>)}</div>

   </div>
  </main>

  <footer className="rodape" id="contato">
   <div className="container rodape-grade">
    <div>
     <p className="titulo rodape-chamada">Vamos conversar?</p>
     <ul className="pilulas">
      <li><Pilula href={`https://mail.google.com/mail/?view=cm&to=${EMAIL}`} icone="mail" externo>E-mail</Pilula></li>
      <li><Pilula href={CONTATOS.linkedin} icone="linkedin" externo>LinkedIn</Pilula></li>
      <li><Pilula href={CONTATOS.github} icone="github" externo>GitHub</Pilula></li>
     </ul>
    </div>
   </div>
   <p className="container rodape-final">Alan Mateus Queiroz · Fortaleza, CE · 2026</p>
  </footer>

  <a href="#topo" className={`volta-topo ${rolou && typeof window !== 'undefined' && window.scrollY > 900 ? 'visivel' : ''}`} aria-label="Voltar ao topo" tabIndex={rolou ? 0 : -1}><Icone nome="cima" tamanho={20}/></a>
 </>;
}
