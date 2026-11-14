import {useEffect, useState} from 'react';
import {projects, type ItemGaleria, type Projeto} from './projects';
import {AcoesProjeto, Icone, SoLeitor} from './project-actions';

const CONTATOS = {
 github: 'https://github.com/alanmateuz',
 email: 'mailto:alanmateusqueiroz@gmail.com',
 linkedin: 'https://linkedin.com/in/alanmateusqueiroz',
};

/* ---------- Tema claro/escuro (escolha fica salva neste navegador) ---------- */
type Tema = 'escuro' | 'claro';
function useTema() {
 const [tema, setTema] = useState<Tema>(() => (document.documentElement.dataset.tema as Tema) || 'escuro');
 useEffect(() => {
  document.documentElement.dataset.tema = tema;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'escuro' ? '#161616' : '#f6f6f4');
  try { localStorage.setItem('tema', tema); } catch { /* navegação privada */ }
 }, [tema]);
 return [tema, () => setTema((t) => (t === 'escuro' ? 'claro' : 'escuro'))] as const;
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

function CartaoProjeto({p, destaque}: {p: Projeto; destaque?: boolean}) {
 return <li className={`cartao ${destaque ? 'cartao-destaque' : ''}`} style={{['--cor' as string]: p.cor}}>
  <a href={`#${p.id}`} className="cartao-link">
   <div className={`cartao-imagem capa-${p.capa}`}><img src={`./assets/${p.image}.webp`} alt="" loading="lazy" decoding="async"/></div>
   <div className="cartao-texto">
    <span className="sobretitulo">{p.number} · {p.category}</span>
    <h3>{p.name}</h3>
    <p>{p.summary}</p>
    <span className="cartao-ver" aria-hidden="true">Ver projeto <Icone nome="seta" tamanho={16}/></span>
   </div>
  </a>
 </li>;
}

function DetalheProjeto({p, proximo}: {p: Projeto; proximo?: Projeto}) {
 return <section id={p.id} className="projeto" style={{['--cor' as string]: p.cor}} aria-labelledby={`${p.id}-titulo`}>
  <div className="container">
   <header className="projeto-topo">
    <p className="sobretitulo projeto-num">{p.number} · {p.category}</p>
    <h2 id={`${p.id}-titulo`}>{p.name}</h2>
    <p className="projeto-cliente">{p.client}</p>
   </header>
   <div className="projeto-texto">
    <p className="projeto-chamada">{p.headline}</p>
    <p>{p.description}</p>
    <p className="projeto-papel">{p.role}</p>
    <ul className="etiquetas" aria-label="Tecnologias e áreas">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
   </div>
   <Galeria p={p}/>
   <AcoesProjeto id={p.id} nome={p.name} acoes={p.acoes} caso={p.design}/>
   {proximo && <a className="proximo" href={`#${proximo.id}`}><span>Próximo projeto: <b>{proximo.name}</b></span><span className="proximo-linha" aria-hidden="true"><Icone nome="seta" tamanho={22}/></span></a>}
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
 const [tema, alternarTema] = useTema();
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
   <button type="button" className="botao-tema" onClick={alternarTema} aria-pressed={tema === 'claro'}
    aria-label={tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'} title={tema === 'escuro' ? 'Modo claro' : 'Modo escuro'}>
    <Icone nome={tema === 'escuro' ? 'sol' : 'lua'} tamanho={24}/>
   </button>
  </header>

  <main id="conteudo">
   <section className="hero container" aria-labelledby="nome">
    <img className="foto-perfil" src="./assets/alan.webp" alt="Alan Mateus sorrindo, de camisa preta" width="140" height="140"/>
    <div className="hero-texto">
     <h1 id="nome">Alan Mateus</h1>
     <p className="hero-sub">Estudante de ADS na UNIFOR <span aria-hidden="true">·</span> Bolsista pesquisador na M. Dias Branco <span aria-hidden="true">·</span> Desenvolvimento de software e IA aplicada</p>
     <nav aria-label="Sobre e contatos"><ul className="pilulas">
      <li><Pilula href="#sobre" icone="user">Sobre</Pilula></li>
      <li><Pilula href={CONTATOS.github} icone="github" externo>GitHub</Pilula></li>
      <li><Pilula href={CONTATOS.email} icone="mail">Email</Pilula></li>
      <li><Pilula href={CONTATOS.linkedin} icone="linkedin" externo>LinkedIn</Pilula></li>
     </ul></nav>
    </div>
   </section>

   <div className="folha">
    <section id="projetos" className="resumo container" aria-labelledby="projetos-titulo">
     <h2 id="projetos-titulo" className="titulo-secao">Projetos</h2>
     <ul className="cartoes">{projects.map((p, i) => <CartaoProjeto key={p.id} p={p} destaque={i === 0}/>)}</ul>
    </section>

    {projects.map((p, i) => <DetalheProjeto key={p.id} p={p} proximo={projects[i + 1]}/>)}

    <section id="sobre" className="sobre" aria-labelledby="sobre-titulo">
     <div className="container sobre-texto">
      <h2 id="sobre-titulo" className="titulo-secao">Sobre</h2>
      <p className="sobre-destaque">Sou estudante de Análise e Desenvolvimento de Sistemas na UNIFOR e estou construindo minha carreira em tecnologia.</p>
      <p>Tenho interesse em desenvolvimento de software, automação de processos, inteligência artificial e produtos digitais. Minha trajetória combina estudos, pesquisa aplicada e colaboração em iniciativas de inovação.</p>
      <p>Atualmente, atuo como bolsista pesquisador na M. Dias Branco. Gosto de compreender desafios, aprender continuamente e contribuir para a criação de soluções úteis e bem estruturadas. Quero crescer na área de tecnologia, especialmente em desenvolvimento de software, automação, produtos digitais e inteligência artificial.</p>
     </div>
     <FaixaFotos/>
    </section>
   </div>
  </main>

  <footer className="rodape" id="contato">
   <div className="container rodape-grade">
    <div>
     <p className="rodape-chamada">Vamos conversar?</p>
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
    </nav>
   </div>
   <p className="container rodape-final">Alan Mateus · Fortaleza, CE · 2026</p>
  </footer>

  <a href="#topo" className={`volta-topo ${rolou ? 'visivel' : ''}`} aria-label="Voltar ao topo" tabIndex={rolou ? 0 : -1}><Icone nome="cima" tamanho={20}/></a>
 </>;
}
