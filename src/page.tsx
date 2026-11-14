import {useEffect, useRef, useState} from 'react';
import {projects, type ItemGaleria, type Projeto} from './projects';
import {AcoesProjeto, Icone, SoLeitor} from './project-actions';

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
 const restaurar = () => { setTexto('1'); setContraste('nao'); setLegivel('nao'); setEspaco('nao'); setLinks('nao'); setParado('nao'); };
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
   <button type="button" className="a11y-restaurar" onClick={restaurar}>Restaurar padrão</button>
  </div>}
 </div>;
}

/* ---------- Pedaços ---------- */
function Pilula({href, icone, children, externo}: {href: string; icone: string; children: string; externo?: boolean}) {
 return <a className="pilula" href={href} {...(externo ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
  {children}<Icone nome={icone} tamanho={18}/>{externo && <SoLeitor> (abre em nova aba)</SoLeitor>}
 </a>;
}

function Imagem({item, nome}: {item: ItemGaleria; nome: string}) {
 if (!item.img) {
  // Foto ainda não enviada: espaço reservado, fácil de trocar depois
  return <figure className={`midia midia-${item.tipo} reservado`}>
   <div className="reservado-caixa" role="img" aria-label={`${item.legenda}: foto em breve`}><Icone nome="foto" tamanho={28}/><span>Foto em breve</span></div>
   <figcaption>{item.legenda}</figcaption>
  </figure>;
 }
 return <figure className={`midia midia-${item.tipo}`}>
  <div className="midia-caixa"><img src={`./assets/${item.img}.webp`} alt={`${nome}: ${item.legenda}`} loading="lazy" decoding="async"/></div>
  <figcaption>{item.legenda}</figcaption>
 </figure>;
}

function Galeria({p}: {p: Projeto}) {
 const celulares = p.galeria.filter((g) => g.tipo === 'celular').length;
 return <div className="galeria" style={{['--colunas-celular' as string]: celulares >= 4 ? 3 : celulares === 3 ? 4 : 6}}>
  {p.galeria.map((g, i) => <div key={i} className={`galeria-item ${g.largo ? 'largo' : ''} item-${g.tipo}`}><Imagem item={g} nome={p.name}/></div>)}
 </div>;
}

/* Quadradinhos dos projetos, numa fileira que rola para o lado */
function FileiraProjetos() {
 const trilho = useRef<HTMLUListElement>(null);
 const [pontas, setPontas] = useState({inicio: true, fim: false});
 const medir = () => { const t = trilho.current; if (t) setPontas({inicio: t.scrollLeft < 4, fim: t.scrollLeft + t.clientWidth > t.scrollWidth - 4}); };
 useEffect(() => { medir(); addEventListener('resize', medir); return () => removeEventListener('resize', medir); }, []);
 const andar = (dir: number) => trilho.current?.scrollBy({left: dir * (trilho.current.clientWidth * 0.8), behavior: 'smooth'});
 return <div className="fileira">
  <ul ref={trilho} className="fileira-trilho" onScroll={medir} tabIndex={0} aria-label="Lista de projetos. Role para o lado para ver todos.">
   {projects.map((p) => <li key={p.id} className="quadrado" style={{['--cor' as string]: p.cor}}>
    <a href={`#${p.id}`}>
     <span className={`quadrado-imagem capa-${p.capa}`}><img src={`./assets/${p.image}.webp`} alt="" loading="lazy" decoding="async"/></span>
     <span className="quadrado-texto"><span className="quadrado-nome">{p.name}</span><span className="quadrado-resumo">{p.summary}</span></span>
    </a>
   </li>)}
  </ul>
  {!(pontas.inicio && pontas.fim) && <div className="fileira-setas">
   <button type="button" onClick={() => andar(-1)} disabled={pontas.inicio} aria-label="Projetos anteriores"><Icone nome="seta" tamanho={20}/></button>
   <button type="button" onClick={() => andar(1)} disabled={pontas.fim} aria-label="Próximos projetos"><Icone nome="seta" tamanho={20}/></button>
  </div>}
 </div>;
}

/* Faixa decorativa: quartos de círculo que giram cada um no seu tempo, alternando o sentido. Usa a cor do projeto. */
function Faixa() {
 return <div className="faixa-formas" aria-hidden="true">
  {Array.from({length: 28}, (_, i) => <span key={i} className={`forma ${i % 2 ? 'forma-b anti' : 'forma-a'}`}
   style={{['--atraso' as string]: `${((i * 7 + 3) % 13) * 0.42}s`, ['--duracao' as string]: `${5 + ((i * 5) % 4)}s`}}/>)}
 </div>;
}

function DetalheProjeto({p}: {p: Projeto}) {
 return <section id={p.id} className="projeto" style={{['--cor' as string]: p.cor}} aria-labelledby={`${p.id}-titulo`}>
  <div className="container">
   <div className="projeto-cabeca">
    <h2 id={`${p.id}-titulo`} className="titulo">{p.name}</h2>
    <Faixa/>
   </div>
   <div className="projeto-texto">
    <p>{p.description}</p>
    <p>{p.role}</p>
   </div>
   <Galeria p={p}/>
   <AcoesProjeto id={p.id} nome={p.name} acoes={p.acoes} caso={p.design}/>
   <hr className="divisor"/>
  </div>
 </section>;
}

/* Fotos do "Sobre": as que já existem + espaços para as próximas */
const FOTOS_SOBRE = [
 {img: 'foto-evento-1', legenda: 'Em evento de tecnologia'},
 {img: 'foto-mdb-equipe', legenda: 'Equipe no desafio da M. Dias Branco'},
 {img: 'foto-hackathon-mdb', legenda: 'Hackathon da M. Dias Branco'},
 {img: '', legenda: 'Foto em breve'},
 {img: '', legenda: 'Foto em breve'},
];

function FaixaFotos() {
 const [pausada, setPausada] = useState(false);
 const lista = (copia: boolean) => FOTOS_SOBRE.map((f, i) => <li key={`${copia}-${i}`} aria-hidden={copia || undefined}>
  {f.img ? <img src={`./assets/${f.img}.webp`} alt={copia ? '' : f.legenda} loading="lazy"/> : <div className="reservado-caixa"><Icone nome="foto" tamanho={26}/><span>Foto em breve</span></div>}
 </li>);
 return <div className={`faixa ${pausada ? 'pausada' : ''}`}>
  <div className="faixa-trilho"><ul className="faixa-lista">{lista(false)}{lista(true)}</ul></div>
  <button type="button" className="faixa-pausa" onClick={() => setPausada(!pausada)} aria-pressed={pausada}>
   <Icone nome={pausada ? 'play' : 'pausa'} tamanho={16}/>{pausada ? 'Continuar fotos' : 'Pausar fotos'}
  </button>
 </div>;
}

export default function Home() {
 const [tema, setTema] = useSalvo<'escuro' | 'claro'>('tema', 'escuro', 'tema');
 useEffect(() => { document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'escuro' ? '#1c1c1e' : '#ffffff'); }, [tema]);
 const [rolou, setRolou] = useState(false);
 useEffect(() => {
  const aoRolar = () => setRolou(window.scrollY > 700);
  aoRolar();
  window.addEventListener('scroll', aoRolar, {passive: true});
  return () => window.removeEventListener('scroll', aoRolar);
 }, []);

 return <>
  <a className="pular" href="#projetos">Pular para os projetos</a>
  <header className="topo" id="topo">
   <PainelAcessibilidade/>
   <button type="button" className="botao-topo" onClick={() => setTema(tema === 'escuro' ? 'claro' : 'escuro')} aria-pressed={tema === 'claro'}
    aria-label={tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'} title={tema === 'escuro' ? 'Modo claro' : 'Modo escuro'}>
    <Icone nome={tema === 'escuro' ? 'sol' : 'lua'} tamanho={24}/>
   </button>
  </header>

  <main id="conteudo">
   <section className="hero" aria-labelledby="nome">
    <div className="container hero-grade">
     <img className="foto-hero" src="./assets/alan-preta.webp" alt="Alan Mateus Queiroz sorrindo, de camisa preta e braços cruzados" width="1044" height="1194"/>
     <div className="hero-texto">
      <h1 id="nome" className="titulo">Alan Mateus Queiroz</h1>
      <p className="hero-sub">Estudante de ADS na UNIFOR | Bolsista pesquisador na M. Dias Branco | Desenvolvimento de software e IA aplicada</p>
      <nav aria-label="Sobre e contatos"><ul className="pilulas">
       <li><Pilula href="#sobre" icone="user">Sobre</Pilula></li>
       <li><Pilula href={CONTATOS.github} icone="github" externo>GitHub</Pilula></li>
       <li><Pilula href={CONTATOS.email} icone="mail">Email</Pilula></li>
       <li><Pilula href={CONTATOS.linkedin} icone="linkedin" externo>LinkedIn</Pilula></li>
      </ul></nav>
     </div>
    </div>
   </section>

   <div className="folha">
    <section id="projetos" className="resumo" aria-labelledby="projetos-titulo">
     <div className="container"><h2 id="projetos-titulo" className="titulo">Projetos</h2></div>
     <FileiraProjetos/>
    </section>

    {projects.map((p) => <DetalheProjeto key={p.id} p={p}/>)}

    <section id="sobre" className="sobre" aria-labelledby="sobre-titulo">
     <div className="container sobre-texto">
      <h2 id="sobre-titulo" className="titulo">Sobre</h2>
      <p>Sou estudante de Análise e Desenvolvimento de Sistemas na UNIFOR e estou construindo minha carreira em tecnologia. Tenho interesse em desenvolvimento de software, automação de processos, inteligência artificial e produtos digitais. Minha trajetória combina estudos, pesquisa aplicada e colaboração em iniciativas de inovação.</p>
      <p>Atualmente, atuo como bolsista pesquisador na M. Dias Branco. Gosto de compreender desafios, aprender continuamente e contribuir para a criação de soluções úteis e bem estruturadas. Quero crescer na área de tecnologia e contribuir especialmente em desenvolvimento de software, automação, produtos digitais e inteligência artificial.</p>
     </div>
     <FaixaFotos/>
    </section>
   </div>
  </main>

  <footer className="rodape" id="contato">
   <div className="container rodape-grade">
    <div>
     <p className="titulo rodape-chamada">Vamos conversar?</p>
     <ul className="pilulas">
      <li><Pilula href={CONTATOS.email} icone="mail">Email</Pilula></li>
      <li><Pilula href={CONTATOS.linkedin} icone="linkedin" externo>LinkedIn</Pilula></li>
      <li><Pilula href={CONTATOS.github} icone="github" externo>GitHub</Pilula></li>
     </ul>
    </div>
    <nav aria-label="Atalhos" className="atalhos">
     <a href="#topo"><Icone nome="cima" tamanho={18}/>Voltar ao topo</a>
     <a href="#projetos">Projetos</a>
     <a href="#sobre">Sobre</a>
     <a href="#contato">Contatos</a>
    </nav>
   </div>
   <p className="container rodape-final">Alan Mateus Queiroz · Fortaleza, CE · 2026</p>
  </footer>

  <a href="#topo" className={`volta-topo ${rolou ? 'visivel' : ''}`} aria-label="Voltar ao topo" tabIndex={rolou ? 0 : -1}><Icone nome="cima" tamanho={20}/></a>
 </>;
}
