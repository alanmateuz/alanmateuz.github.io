/* =========================================================
   Portfólio "console": ligar → abertura → menu → cartão de memória → save (projeto)
   Experiência original inspirada na ideia de menu de console dos anos 2000.
   ========================================================= */
import * as THREE from 'three';
import './console.css';
import {projects, type Projeto} from '../projects';
import {ICONES} from './icones';
import {som} from './som';

const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]!));

/* ---------- Cena ---------- */
const canvas = $<HTMLCanvasElement>('#cena');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const cena = new THREE.Scene();
cena.background = new THREE.Color('#02030a');
cena.fog = new THREE.FogExp2('#02030a', 0.055);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
camera.position.set(0, 1.2, 14);
const alvoCamera = new THREE.Vector3(0, 0.6, 0);

cena.add(new THREE.AmbientLight('#4a5cff', 0.35));
const luz = new THREE.PointLight('#9fb4ff', 40, 30); luz.position.set(2, 5, 6); cena.add(luz);
const luzFundo = new THREE.PointLight('#ff7a2f', 18, 30); luzFundo.position.set(-6, -2, -6); cena.add(luzFundo);

/* Poeira de luz flutuando no vazio */
const poeira = (() => {
 const n = 900, pos = new Float32Array(n * 3);
 for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 60; pos[i * 3 + 1] = (Math.random() - 0.5) * 30; pos[i * 3 + 2] = (Math.random() - 0.5) * 60; }
 const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
 const p = new THREE.Points(geo, new THREE.PointsMaterial({color: '#8fa6ff', size: 0.06, transparent: true, opacity: 0.7, depthWrite: false}));
 cena.add(p); return p;
})();

/* Abertura: anel de colunas de luz de alturas diferentes, que crescem em volta de um núcleo */
const abertura = new THREE.Group(); cena.add(abertura);
const colunas: THREE.Mesh[] = [];
{
 const geo = new THREE.BoxGeometry(0.22, 1, 0.22);
 for (let i = 0; i < 48; i++) {
  const ang = (i / 48) * Math.PI * 2, raio = 4 + (i % 3) * 1.6;
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color: '#3d5bff', emissive: i % 7 === 0 ? '#ff7a2f' : '#2b46ff', emissiveIntensity: 0.9, transparent: true, opacity: 0.55, roughness: 0.2}));
  m.position.set(Math.cos(ang) * raio, -2, Math.sin(ang) * raio);
  m.userData = {altura: 1 + ((i * 37) % 11) / 2.2, atraso: (i % 12) * 0.08};
  m.scale.y = 0.001;
  abertura.add(m); colunas.push(m);
 }
}
const nucleo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 3), new THREE.MeshPhysicalMaterial({color: '#cfd8ff', emissive: '#7f95ff', emissiveIntensity: 1.4, transparent: true, opacity: 0.9, roughness: 0.1}));
nucleo.position.y = 0.4; nucleo.scale.setScalar(0.001); abertura.add(nucleo);

/* Menu: dois objetos (cartão de memória e sistema) */
const menu = new THREE.Group(); menu.visible = false; cena.add(menu);
const cartao3d = (() => {
 const g = new THREE.Group();
 const corpo = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.9, 0.22), new THREE.MeshPhysicalMaterial({color: '#20263f', emissive: '#2b46ff', emissiveIntensity: 0.25, roughness: 0.25, clearcoat: 1}));
 g.add(corpo);
 const etiqueta = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), new THREE.MeshBasicMaterial({color: '#e8ecff'}));
 etiqueta.position.set(0, 0.35, 0.115); g.add(etiqueta);
 const faixa = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.14), new THREE.MeshBasicMaterial({color: '#2f6bff'}));
 faixa.position.set(0, 0.2, 0.116); g.add(faixa);
 for (let i = 0; i < 7; i++) {
  const pino = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.02), new THREE.MeshStandardMaterial({color: '#d9b45a', metalness: 0.8, roughness: 0.3}));
  pino.position.set(-0.45 + i * 0.15, -0.75, 0.12); g.add(pino);
 }
 return g;
})();
const sistema3d = (() => {
 const g = new THREE.Group();
 const esfera = new THREE.Mesh(new THREE.SphereGeometry(0.75, 48, 32), new THREE.MeshPhysicalMaterial({color: '#bdb4ff', emissive: '#7a6bff', emissiveIntensity: 0.5, transmission: 0.3, thickness: 1, roughness: 0.1, transparent: true, opacity: 0.9}));
 g.add(esfera);
 for (let i = 0; i < 3; i++) {
  const anel = new THREE.Mesh(new THREE.TorusGeometry(1.05 + i * 0.12, 0.02, 8, 80), new THREE.MeshBasicMaterial({color: '#cfc8ff', transparent: true, opacity: 0.6 - i * 0.15}));
  anel.rotation.set(Math.PI / 2 + i * 0.5, i * 0.7, 0); g.add(anel);
 }
 return g;
})();
cartao3d.position.set(-2.2, 0.6, 0); sistema3d.position.set(2.2, 0.6, 0);
menu.add(cartao3d, sistema3d);
const opcoesMenu = [cartao3d, sistema3d];

/* Saves: um ícone 3D por projeto, em pedestais de luz */
type Item = {id: string; titulo: string; subtitulo: string; grupo: THREE.Group; projeto?: Projeto};
function fazerFileira(dados: Omit<Item, 'grupo'>[], z: number) {
 const raiz = new THREE.Group(); raiz.visible = false; raiz.position.z = z; cena.add(raiz);
 const itens: Item[] = dados.map((d, i) => {
  const g = new THREE.Group();
  const icone = ICONES[d.id](); icone.name = 'icone'; g.add(icone);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1, 0.12, 48), new THREE.MeshStandardMaterial({color: '#141a33', emissive: '#2b46ff', emissiveIntensity: 0.35, transparent: true, opacity: 0.8}));
  pedestal.position.y = -1.35; g.add(pedestal);
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.95, 1.08, 64), new THREE.MeshBasicMaterial({color: '#7f95ff', transparent: true, opacity: 0, side: THREE.DoubleSide}));
  halo.rotation.x = -Math.PI / 2; halo.position.y = -1.28; halo.name = 'halo'; g.add(halo);
  g.position.x = (i - (dados.length - 1) / 2) * 3.4;
  raiz.add(g);
  return {...d, grupo: g};
 });
 return {raiz, itens};
}
const cartao = fazerFileira(projects.map((p) => ({id: p.id, titulo: p.name, subtitulo: p.summary, projeto: p})), -18);
const sistema = fazerFileira([
 {id: 'sobre', titulo: 'Sobre mim', subtitulo: 'Quem eu sou e o que estudo'},
 {id: 'contato', titulo: 'Contato', subtitulo: 'E-mail, LinkedIn e GitHub'},
], -18);

/* ---------- Animação: tweens simples ---------- */
type Tween = {de: number; para: number; dur: number; t0: number; aplicar: (v: number) => void; fim?: () => void};
const tweens: Tween[] = [];
const suave = (x: number) => 1 - Math.pow(1 - x, 4);
function tween(dur: number, aplicar: (v: number) => void, fim?: () => void) {
 if (semMovimento) dur = 1;
 tweens.push({de: 0, para: 1, dur, t0: performance.now(), aplicar, fim});
}
function voarCamera(pos: THREE.Vector3, olhar: THREE.Vector3, dur = 1600) {
 const p0 = camera.position.clone(), o0 = alvoCamera.clone();
 if (!semMovimento) som.passagem();
 tween(dur, (v) => { camera.position.lerpVectors(p0, pos, v); alvoCamera.lerpVectors(o0, olhar, v); });
}

/* ---------- Interface (HTML por cima da cena) ---------- */
const ui = $<HTMLDivElement>('#interface');
ui.innerHTML = `
 <div class="liga" id="liga">
  <p class="liga-marca">AMQ</p>
  <button type="button" class="liga-botao" id="b-ligar"><span class="liga-icone" aria-hidden="true"></span>Ligar</button>
  <p class="liga-dica">Com som · use as setas, Enter e Esc</p>
  <a class="liga-simples" href="../">Prefiro a versão simples</a>
 </div>
 <div class="titulo-abertura" id="titulo-abertura" aria-hidden="true"><span>Alan Mateus Queiroz</span><small>software · IA aplicada · design de produto</small></div>
 <header class="hud" id="hud" hidden>
  <p class="trilha" id="trilha">Menu</p>
  <div class="hud-dir">
   <span class="relogio" id="relogio"></span>
   <button type="button" class="hud-botao" id="b-som" aria-pressed="false">Som ligado</button>
   <a class="hud-botao" href="../">Versão simples</a>
  </div>
 </header>
 <nav class="opcoes" id="opcoes" aria-label="Opções" hidden></nav>
 <section class="painel" id="painel" hidden aria-live="polite"></section>
 <footer class="dicas" id="dicas" hidden><span><kbd>←</kbd><kbd>→</kbd> escolher</span><span><kbd>Enter</kbd> abrir</span><span><kbd>Esc</kbd> voltar</span></footer>
 <p class="sr-only" id="anuncio" aria-live="assertive"></p>`;
const anunciar = (t: string) => { $('#anuncio').textContent = t; };

/* ---------- Estados ---------- */
type Tela = 'desligado' | 'abertura' | 'menu' | 'cartao' | 'sistema' | 'detalhe';
let tela: Tela = 'desligado';
let sel = 0;
let telaAntes: 'cartao' | 'sistema' = 'cartao';

function opcoesDaTela(): {rotulo: string; sub: string}[] {
 if (tela === 'menu') return [{rotulo: 'Cartão de memória', sub: 'Projetos salvos'}, {rotulo: 'Sistema', sub: 'Sobre mim e contato'}];
 if (tela === 'cartao') return cartao.itens.map((i) => ({rotulo: i.titulo, sub: i.subtitulo}));
 if (tela === 'sistema') return sistema.itens.map((i) => ({rotulo: i.titulo, sub: i.subtitulo}));
 return [];
}

function desenharOpcoes() {
 const nav = $<HTMLElement>('#opcoes');
 const ops = opcoesDaTela();
 nav.hidden = !ops.length;
 nav.innerHTML = ops.map((o, i) => `<button type="button" class="opcao" data-i="${i}" aria-current="${i === sel}"><b>${esc(o.rotulo)}</b><small>${esc(o.sub)}</small></button>`).join('');
 nav.querySelectorAll<HTMLButtonElement>('.opcao').forEach((b) => {
  b.onmouseenter = () => selecionar(Number(b.dataset.i));
  b.onfocus = () => selecionar(Number(b.dataset.i));
  b.onclick = () => { selecionar(Number(b.dataset.i)); abrir(); };
 });
 const trilha = {menu: 'Menu', cartao: 'Menu › Cartão de memória', sistema: 'Menu › Sistema', detalhe: telaAntes === 'cartao' ? 'Menu › Cartão de memória › Save' : 'Menu › Sistema', abertura: '', desligado: ''}[tela];
 $('#trilha').textContent = trilha;
}

function selecionar(i: number, tocar = true) {
 const n = opcoesDaTela().length;
 if (!n) return;
 const novo = (i + n) % n;
 if (novo !== sel && tocar) som.mover();
 sel = novo;
 document.querySelectorAll<HTMLElement>('.opcao').forEach((b, k) => b.setAttribute('aria-current', String(k === sel)));
 anunciar(opcoesDaTela()[sel].rotulo);
}

function irPara(nova: Tela) {
 tela = nova;
 $<HTMLElement>('#dicas').hidden = false;
 if (nova !== 'detalhe') sel = 0;
 menu.visible = nova === 'menu';
 cartao.raiz.visible = nova === 'cartao' || (nova === 'detalhe' && telaAntes === 'cartao');
 sistema.raiz.visible = nova === 'sistema' || (nova === 'detalhe' && telaAntes === 'sistema');
 $<HTMLElement>('#painel').hidden = nova !== 'detalhe';
 desenharOpcoes();
 if (nova === 'menu') voarCamera(new THREE.Vector3(0, 1.1, 8.5), new THREE.Vector3(0, 0.5, 0));
 if (nova === 'cartao' || nova === 'sistema') voarCamera(new THREE.Vector3(0, 1.2, -9.5), new THREE.Vector3(0, 0, -18));
}

function abrir() {
 if (tela === 'menu') { som.confirmar(); irPara(sel === 0 ? 'cartao' : 'sistema'); return; }
 if (tela === 'cartao' || tela === 'sistema') {
  som.confirmar();
  telaAntes = tela;
  const fileira = tela === 'cartao' ? cartao : sistema;
  const item = fileira.itens[sel];
  tela = 'detalhe';
  desenharOpcoes();
  mostrarDetalhe(item);
  const p = item.grupo.getWorldPosition(new THREE.Vector3());
  // Câmera recua e desloca o objeto para a esquerda, deixando a direita para o painel
  const largo = innerWidth > 700;
  voarCamera(new THREE.Vector3(p.x + (largo ? 2.6 : 0), p.y + (largo ? 0.3 : 1.6), p.z + 7.5), new THREE.Vector3(p.x + (largo ? 2.6 : 0), p.y + (largo ? 0.1 : 1.4), p.z), 1300);
 }
}

function voltar() {
 if (tela === 'detalhe') { som.voltar(); const s = sel; irPara(telaAntes); selecionar(s, false); (document.querySelectorAll<HTMLElement>('.opcao')[s])?.focus(); return; }
 if (tela === 'cartao' || tela === 'sistema') { som.voltar(); irPara('menu'); return; }
}

function mostrarDetalhe(item: Item) {
 $<HTMLElement>('#dicas').hidden = true;
 const painel = $<HTMLElement>('#painel');
 const p = item.projeto;
 const link = (rotulo: string, href: string, externo = true) => `<a class="acao" href="${esc(href)}" ${externo ? 'target="_blank" rel="noopener noreferrer"' : ''}>${esc(rotulo)}</a>`;
 let corpo = '';
 if (p) {
  const fotos = p.galeria.filter((g) => g.img).slice(0, 4).map((g) => `<img src="../assets/${esc(g.img)}.webp" alt="${esc(p.name)}: ${esc(g.legenda)}" loading="lazy"/>`).join('');
  const acoes = [
   ...(p.acoes.prototipo || []).map((x) => link(x.rotulo, x.url)),
   link('Ver no portfólio', `../#${p.id}`, false),
  ].join('');
  corpo = `<p class="painel-meta">Save · ${esc(p.number)} · ${esc(p.tags.join(' · '))}</p>
   <h1>${esc(p.name)}</h1>
   <p>${esc(p.description)}</p>
   <p class="painel-papel">${esc(p.role)}</p>
   <div class="painel-fotos">${fotos}</div>
   <div class="painel-acoes">${acoes}</div>`;
 } else if (item.id === 'sobre') {
  corpo = `<p class="painel-meta">Sistema · Sobre</p><h1>Alan Mateus Queiroz</h1>
   <p>Estudo Análise e Desenvolvimento de Sistemas na UNIFOR e sou bolsista pesquisador na M. Dias Branco.</p>
   <p>Gosto de pegar um problema da sala de aula, do campus ou de uma empresa e transformar em algo que as pessoas usam de verdade, juntando desenvolvimento de software, IA aplicada e design de produto.</p>
   <div class="painel-acoes">${link('Ver portfólio completo', '../#sobre', false)}</div>`;
 } else {
  corpo = `<p class="painel-meta">Sistema · Contato</p><h1>Vamos conversar?</h1>
   <p class="painel-email">alanmateusqueiroz@gmail.com</p>
   <div class="painel-acoes"><button type="button" class="acao" id="b-copiar">Copiar e-mail</button>
    ${link('LinkedIn', 'https://linkedin.com/in/alanmateusqueiroz')}${link('GitHub', 'https://github.com/alanmateuz')}</div>`;
 }
 painel.innerHTML = `<button type="button" class="painel-voltar" id="b-voltar">← Voltar <kbd>Esc</kbd></button>${corpo}`;
 painel.hidden = false;
 $<HTMLButtonElement>('#b-voltar').onclick = voltar;
 const copiar = painel.querySelector<HTMLButtonElement>('#b-copiar');
 if (copiar) copiar.onclick = async () => { try { await navigator.clipboard.writeText('alanmateusqueiroz@gmail.com'); } catch { /* sem permissão */ } copiar.textContent = 'E-mail copiado'; som.confirmar(); };
 $<HTMLButtonElement>('#b-voltar').focus();
}

/* ---------- Ligar e abertura ---------- */
function ligar() {
 som.ligar(); som.ambienteLigar();
 $('#liga').classList.add('saindo');
 setTimeout(() => $('#liga').remove(), 900);
 tela = 'abertura';
 const t0 = performance.now();
 const durAbertura = semMovimento ? 600 : 5200;
 colunas.forEach((c) => {
  const {altura, atraso} = c.userData as {altura: number; atraso: number};
  setTimeout(() => tween(1800, (v) => { c.scale.y = 0.001 + altura * v; c.position.y = -2 + (altura * v) / 2; }), (semMovimento ? 0 : 400) + atraso * 1000);
 });
 setTimeout(() => tween(1600, (v) => nucleo.scale.setScalar(0.001 + v)), semMovimento ? 0 : 1200);
 if (!semMovimento) tween(5200, (v) => { const a = v * Math.PI * 0.6; camera.position.set(Math.sin(a) * 14, 1.2 + v * 2.5, Math.cos(a) * 14); alvoCamera.set(0, 0.4, 0); });
 setTimeout(() => $('#titulo-abertura').classList.add('visivel'), semMovimento ? 0 : 1800);
 setTimeout(() => $('#titulo-abertura').classList.remove('visivel'), semMovimento ? 300 : 3900);
 setTimeout(() => {
  $('#titulo-abertura').classList.remove('visivel');
  tween(900, (v) => { abertura.children.forEach((m) => { const mat = (m as THREE.Mesh).material as THREE.MeshStandardMaterial; mat.opacity = (1 - v) * (m === nucleo ? 0.9 : 0.55); }); }, () => { abertura.visible = false; });
  $<HTMLElement>('#hud').hidden = false; $<HTMLElement>('#dicas').hidden = false;
  irPara('menu');
  ($('.opcao') as HTMLElement | null)?.focus();
  void t0;
 }, durAbertura);
}
$<HTMLButtonElement>('#b-ligar').onclick = ligar;
$<HTMLButtonElement>('#b-ligar').focus();

/* ---------- Controles ---------- */
addEventListener('keydown', (e) => {
 if (tela === 'desligado' || tela === 'abertura') return;
 if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); selecionar(sel + 1); (document.querySelectorAll<HTMLElement>('.opcao')[sel])?.focus(); }
 if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); selecionar(sel - 1); (document.querySelectorAll<HTMLElement>('.opcao')[sel])?.focus(); }
 if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); voltar(); }
});
const botaoSom = $<HTMLButtonElement>('#b-som');
const rotuloSom = () => { botaoSom.textContent = som.mudo ? 'Som desligado' : 'Som ligado'; botaoSom.setAttribute('aria-pressed', String(som.mudo)); };
botaoSom.onclick = () => { som.alternarMudo(); rotuloSom(); };
rotuloSom();

/* Clique/toque direto nos objetos 3D */
const raio = new THREE.Raycaster(), ponteiro = new THREE.Vector2();
function objetosClicaveis(): THREE.Object3D[] {
 if (tela === 'menu') return opcoesMenu;
 if (tela === 'cartao') return cartao.itens.map((i) => i.grupo);
 if (tela === 'sistema') return sistema.itens.map((i) => i.grupo);
 return [];
}
function indiceSobPonteiro(e: PointerEvent) {
 ponteiro.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
 raio.setFromCamera(ponteiro, camera);
 const alvos = objetosClicaveis();
 const hit = raio.intersectObjects(alvos, true)[0];
 if (!hit) return -1;
 return alvos.findIndex((a) => { let o: THREE.Object3D | null = hit.object; while (o) { if (o === a) return true; o = o.parent; } return false; });
}
canvas.addEventListener('pointermove', (e) => { const i = indiceSobPonteiro(e); canvas.style.cursor = i >= 0 ? 'pointer' : ''; if (i >= 0 && i !== sel) selecionar(i); });
canvas.addEventListener('click', (e) => { const i = indiceSobPonteiro(e as PointerEvent); if (i >= 0) { selecionar(i, false); abrir(); } });

/* ---------- Relógio ---------- */
const relogio = () => { $('#relogio').textContent = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}); };
relogio(); setInterval(relogio, 15000);

/* ---------- Laço de desenho ---------- */
function redimensionar() {
 const w = innerWidth, h = innerHeight;
 renderer.setSize(w, h, false);
 camera.aspect = w / h;
 // No celular a câmera recua para caber a fileira
 camera.fov = w < 700 ? 68 : 50;
 camera.updateProjectionMatrix();
}
addEventListener('resize', redimensionar); redimensionar();

const relogioCena = new THREE.Clock();
function quadro() {
 const t = relogioCena.getElapsedTime(), agora = performance.now();
 for (let i = tweens.length - 1; i >= 0; i--) {
  const tw = tweens[i]; const x = Math.min(1, (agora - tw.t0) / tw.dur);
  tw.aplicar(suave(x));
  if (x >= 1) { tweens.splice(i, 1); tw.fim?.(); }
 }
 if (!semMovimento) { poeira.rotation.y = t * 0.01; nucleo.rotation.y = t * 0.4; abertura.rotation.y = t * 0.05; }
 // Menu: a opção escolhida gira e brilha; a outra fica parada e apagada
 opcoesMenu.forEach((o, i) => {
  const ativo = tela === 'menu' && i === sel;
  o.scale.lerp(new THREE.Vector3().setScalar(ativo ? 1.15 : 0.85), 0.12);
  if (ativo && !semMovimento) o.rotation.y += 0.012; else o.rotation.y += (0 - o.rotation.y) * 0.06;
  if (!semMovimento) o.position.y = 0.6 + Math.sin(t * 1.4 + i) * 0.08;
 });
 // Saves: o escolhido gira, sobe e acende o halo
 for (const fileira of [cartao, sistema]) {
  fileira.itens.forEach((it, i) => {
   const ativo = (tela === 'cartao' && fileira === cartao) || (tela === 'sistema' && fileira === sistema) || tela === 'detalhe' ? i === sel : false;
   const icone = it.grupo.getObjectByName('icone')!;
   const halo = it.grupo.getObjectByName('halo') as THREE.Mesh;
   icone.scale.lerp(new THREE.Vector3().setScalar(ativo ? 1.12 : 0.78), 0.1);
   if (!semMovimento) icone.rotation.y += ativo ? 0.012 : 0.003;
   icone.position.y += ((ativo ? 0.15 + (semMovimento ? 0 : Math.sin(t * 2) * 0.06) : 0) - icone.position.y) * 0.1;
   const mh = halo.material as THREE.MeshBasicMaterial; mh.opacity += ((ativo ? 0.9 : 0) - mh.opacity) * 0.12;
   it.grupo.traverse((o) => { const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined; if (m && 'emissiveIntensity' in m && o.name !== 'halo') { m.userData.base ??= m.emissiveIntensity; m.emissiveIntensity += ((ativo ? m.userData.base * 1.3 : m.userData.base * 0.45) - m.emissiveIntensity) * 0.1; } });
  });
 }
 camera.lookAt(alvoCamera);
 renderer.render(cena, camera);
 requestAnimationFrame(quadro);
}
requestAnimationFrame(quadro);
