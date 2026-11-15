/* =========================================================
   Portfólio "console" — fundo preto, luzes que orbitam, menu em texto,
   cubos de vidro, cartão de memória com os projetos como saves.
   Composição, modelos e sons originais.
   ========================================================= */
import * as THREE from 'three';
import './console.css';
import {projects, type Projeto} from '../projects';
import {som} from './som';
import {ICONES} from './icones';

const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]!));
const EMAIL = 'alanmateusqueiroz@gmail.com';

/* ---------- Cena ---------- */
const canvas = $<HTMLCanvasElement>('#cena');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const cena = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 10);
cena.add(new THREE.AmbientLight('#6f86ff', 0.6));
const luz = new THREE.PointLight('#9fb4ff', 30, 30); luz.position.set(-2, 3, 6); cena.add(luz);

/* Textura de brilho (círculo com borda suave) para as luzes */
const texBrilho = (() => {
 const c = document.createElement('canvas'); c.width = c.height = 128;
 const g = c.getContext('2d')!;
 const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
 r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.18, 'rgba(160,210,255,.95)'); r.addColorStop(0.45, 'rgba(40,120,255,.35)'); r.addColorStop(1, 'rgba(0,40,255,0)');
 g.fillStyle = r; g.fillRect(0, 0, 128, 128);
 return new THREE.CanvasTexture(c);
})();
const matBrilho = (opacidade = 1) => new THREE.SpriteMaterial({map: texBrilho, color: '#7fc4ff', blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: opacidade});

/* ---------- Luzes que orbitam, deixando um rastro curto ---------- */
type Orbe = {cabeca: THREE.Sprite; rastro: THREE.Sprite[]; hist: THREE.Vector3[]; raio: number; vel: number; fase: number; incl: number};
function fazerOrbes(n: number, escala = 1) {
 const g = new THREE.Group();
 const orbes: Orbe[] = [];
 for (let i = 0; i < n; i++) {
  const cabeca = new THREE.Sprite(matBrilho()); cabeca.scale.setScalar(0.55 * escala); g.add(cabeca);
  const rastro = Array.from({length: 14}, (_, k) => { const s = new THREE.Sprite(matBrilho(1 - k / 14)); s.scale.setScalar(0.42 * escala * (1 - k / 18)); g.add(s); return s; });
  orbes.push({cabeca, rastro, hist: [], raio: (1.1 + i * 0.35) * escala, vel: 0.55 + i * 0.17, fase: i * 2.1, incl: 0.5 + i * 0.35});
 }
 return {g, orbes};
}
function moverOrbes(o: {orbes: Orbe[]}, t: number) {
 for (const b of o.orbes) {
  const a = t * b.vel + b.fase;
  const p = new THREE.Vector3(Math.cos(a) * b.raio, Math.sin(a) * b.raio * 0.55, Math.sin(a) * b.raio * 0.6);
  p.applyAxisAngle(new THREE.Vector3(0, 0, 1), b.incl);
  b.cabeca.position.copy(p);
  b.hist.unshift(p.clone()); if (b.hist.length > 30) b.hist.pop();
  b.rastro.forEach((s, k) => s.position.copy(b.hist[Math.min(b.hist.length - 1, (k + 1) * 2)] || p));
 }
}

/* ---------- Tela inicial ---------- */
const inicio = fazerOrbes(3);
cena.add(inicio.g);

/* ---------- Cubos e colunas de vidro (Sobre / Contato) ---------- */
const cubos = new THREE.Group(); cubos.visible = false; cena.add(cubos);
{
 const vidro = (cor: string, op: number) => new THREE.MeshPhysicalMaterial({color: cor, emissive: cor, emissiveIntensity: 0.25, transparent: true, opacity: op, roughness: 0.2, depthWrite: false});
 const formas: [number, number, number, number, number, number, string][] = [
  // largura, altura, profundidade, x, y, z, cor
  [0.9, 0.9, 0.9, -1.4, 1.5, -0.4, '#3a4cff'], [0.7, 0.7, 0.7, -1.9, -1.4, 0.3, '#3a4cff'], [0.8, 0.8, 0.8, -1.7, 0.1, 0.8, '#5b5bff'],
  [0.35, 0.35, 2.4, 0.3, 0.6, 0, '#49b7ff'], [0.32, 0.32, 2.0, -0.3, -0.5, 0.4, '#49b7ff'], [0.3, 0.3, 1.8, 0.6, -0.9, -0.5, '#3a8cff'],
  [0.28, 0.28, 2.2, -0.1, 1.2, 0.6, '#49b7ff'], [1.6, 0.18, 0.18, -1.1, 0.4, 0.2, '#29e3ff'], [0.6, 0.6, 0.6, 1.1, 1.3, 0.2, '#4e4eff'],
 ];
 formas.forEach(([w, h, d, x, y, z, cor], i) => {
  const geo = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, vidro(cor, i === 7 ? 0.85 : 0.32));
  m.position.set(x, y, z); m.rotation.set(i * 0.7, i * 1.3, i * 0.4);
  const borda = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({color: '#8fb6ff', transparent: true, opacity: 0.45}));
  m.add(borda); m.userData.giro = (i % 2 ? 1 : -1) * (0.1 + (i % 3) * 0.05);
  cubos.add(m);
 });
}
const orbesCubos = fazerOrbes(3, 0.8); cubos.add(orbesCubos.g);

/* ---------- Cartão de memória: um "save" por projeto ---------- */
const saves = new THREE.Group(); saves.visible = false; cena.add(saves);
type Save = {p: Projeto; malha: THREE.Group; brilho: THREE.Sprite; base: THREE.Vector3};
const listaSaves: Save[] = projects.map((p, i) => {
 const malha = (ICONES[p.id] || ICONES.sobre)();
 const base = new THREE.Vector3((i - (projects.length - 1) / 2) * 2.7, 0.9, 0);
 malha.position.copy(base);
 // materiais próprios por save, para poder apagar os não escolhidos
 malha.traverse((o) => { const mesh = o as THREE.Mesh; if (mesh.material) { mesh.material = (mesh.material as THREE.Material).clone(); (mesh.material as THREE.Material).transparent = true; } });
 const brilho = new THREE.Sprite(matBrilho(0)); brilho.scale.set(2.8, 1.4, 1);
 saves.add(malha, brilho);
 return {p, malha, brilho, base};
});

/* ---------- Interface ---------- */
const ui = $<HTMLDivElement>('#interface');
ui.innerHTML = `
 <div class="veu" id="veu" aria-hidden="true"></div>
 <main id="tela" class="tela"></main>
 <footer class="barra" id="barra" hidden>
  <span class="barra-centro"><span class="tecla">ENTER</span><span id="rotulo-enter">Selecionar</span><span class="tecla">ESC</span>Voltar</span>
  <span class="barra-dir"><span class="tecla-seta" aria-hidden="true">▲<br>▼</span>Navegar</span>
  <button type="button" class="barra-som" id="b-som" aria-pressed="false"></button>
 </footer>
 <p class="sr-only" id="anuncio" aria-live="polite"></p>`;
const tela = $<HTMLElement>('#tela');
const anunciar = (t: string) => { $('#anuncio').textContent = t; };

/* ---------- Estados ---------- */
type Estado = 'desligado' | 'inicio' | 'sobre' | 'cartao' | 'save' | 'contato';
let estado: Estado = 'desligado';
let sel = 0, selSave = 0, selInicio = 0;
let opcoes: {rotulo: string; acao: () => void}[] = [];

const MENU: {rotulo: string; ir: Estado | 'simples'}[] = [
 {rotulo: 'Sobre', ir: 'sobre'}, {rotulo: 'Projetos', ir: 'cartao'}, {rotulo: 'Contato', ir: 'contato'}, {rotulo: 'Versão simples', ir: 'simples'},
];

/** Troca de tela com um véu escuro rápido. */
function trocar(novo: Estado) {
 const veu = $<HTMLElement>('#veu');
 veu.classList.add('ativo');
 setTimeout(() => { estado = novo; montar(); veu.classList.remove('ativo'); }, semMovimento ? 0 : 280);
}

function listaOpcoes(classe = 'opcoes') {
 return `<ul class="${classe}" role="listbox" aria-label="Opções">${opcoes.map((o, i) => `<li role="option" aria-selected="${i === sel}" data-i="${i}" tabindex="${i === sel ? 0 : -1}">${esc(o.rotulo)}</li>`).join('')}</ul>`;
}
function ligarOpcoes() {
 tela.querySelectorAll<HTMLElement>('[role=option]').forEach((li) => {
  li.onmouseenter = () => escolher(Number(li.dataset.i));
  li.onclick = () => { escolher(Number(li.dataset.i), false); confirmar(); };
 });
}
function escolher(i: number, tocar = true) {
 if (!opcoes.length) return;
 const n = (i + opcoes.length) % opcoes.length;
 if (n !== sel && tocar) som.mover();
 sel = n;
 if (estado === 'inicio') selInicio = sel;
 tela.querySelectorAll<HTMLElement>('[role=option]').forEach((li, k) => { li.setAttribute('aria-selected', String(k === sel)); li.tabIndex = k === sel ? 0 : -1; });
 tela.querySelector<HTMLElement>(`[role=option][data-i="${sel}"]`)?.focus({preventScroll: true});
 const t = $('#cartao-titulo'); if (t && estado === 'cartao') t.textContent = listaSaves[sel].p.name;
 anunciar(opcoes[sel].rotulo);
}
function confirmar() { if (opcoes[sel]) { som.confirmar(); opcoes[sel].acao(); } }

function montar() {
 inicio.g.visible = estado === 'inicio';
 cubos.visible = estado === 'sobre' || estado === 'contato';
 saves.visible = estado === 'cartao' || estado === 'save';
 document.body.dataset.estado = estado;
 sel = 0;
 if (estado === 'inicio') {
  opcoes = MENU.map((m) => ({rotulo: m.rotulo, acao: () => (m.ir === 'simples' ? (location.href = '../') : trocar(m.ir as Estado))}));
  sel = selInicio;
  tela.innerHTML = `<h1 class="sr-only">Alan Mateus Queiroz · Portfólio</h1>${listaOpcoes('opcoes menu-inicio')}`;
 }
 if (estado === 'sobre') {
  opcoes = [{rotulo: 'Voltar', acao: voltar}];
  tela.innerHTML = `<section class="info"><h1>Sobre mim</h1>
   <p>Oi, eu sou o Alan. Estudo Análise e Desenvolvimento de Sistemas na UNIFOR e sou bolsista pesquisador na M. Dias Branco.</p>
   <p>Gosto de pegar um problema da sala de aula, do campus ou de uma empresa e transformar em algo que as pessoas usam de verdade, juntando software, IA aplicada e design de produto.</p>
   ${listaOpcoes()}</section>`;
 }
 if (estado === 'contato') {
  opcoes = [
   {rotulo: 'Copiar e-mail', acao: async () => { try { await navigator.clipboard.writeText(EMAIL); } catch { /* sem permissão */ } anunciar('E-mail copiado'); const li = tela.querySelector('[data-i="0"]'); if (li) li.textContent = 'E-mail copiado'; }},
   {rotulo: 'LinkedIn', acao: () => { open('https://linkedin.com/in/alanmateusqueiroz', '_blank', 'noopener'); }},
   {rotulo: 'GitHub', acao: () => { open('https://github.com/alanmateuz', '_blank', 'noopener'); }},
   {rotulo: 'Voltar', acao: voltar},
  ];
  tela.innerHTML = `<section class="info"><h1>Contato</h1><p>${EMAIL}</p>${listaOpcoes()}</section>`;
 }
 if (estado === 'cartao') {
  opcoes = listaSaves.map((s, i) => ({rotulo: s.p.name, acao: () => { selSave = i; trocar('save'); }}));
  sel = selSave;
  tela.innerHTML = `<header class="cartao-topo"><div><p class="cartao-nome">Cartão de memória (AMQ)/1</p><p class="cartao-uso">${listaSaves.length} saves</p></div><p class="cartao-titulo" id="cartao-titulo"></p></header>
   <ul class="sr-only" role="listbox" aria-label="Saves">${opcoes.map((o, i) => `<li role="option" aria-selected="${i === sel}" data-i="${i}" tabindex="${i === sel ? 0 : -1}">${esc(o.rotulo)}</li>`).join('')}</ul>`;
 }
 if (estado === 'save') {
  const s = listaSaves[selSave].p;
  const proto = s.acoes.prototipo?.[0];
  opcoes = [
   ...(proto ? [{rotulo: 'Abrir protótipo', acao: () => { open(proto.url, '_blank', 'noopener'); }}] : []),
   {rotulo: 'Ver no portfólio', acao: () => { location.href = `../#${s.id}`; }},
   {rotulo: 'Voltar', acao: voltar},
  ];
  tela.innerHTML = `<section class="info info-save"><h1>${esc(s.name)}</h1>
   <p class="linha">${esc(s.summary)}</p>
   <p class="linha">${esc(s.tags.join(' · '))}</p>
   <p class="linha">${esc(s.role.replace('Minha participação: ', 'Papel: '))}</p>
   ${listaOpcoes()}</section>`;
  document.body.style.setProperty('--tom', s.cor);
 }
 ligarOpcoes();
 escolher(sel, false);
 $('#rotulo-enter').textContent = estado === 'cartao' ? 'Abrir' : 'Selecionar';
}

function voltar() {
 som.voltar();
 if (estado === 'save') trocar('cartao');
 else if (estado !== 'inicio') trocar('inicio');
}

/* ---------- Teclado, mouse e toque ---------- */
addEventListener('keydown', (e) => {
 if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); escolher(sel + 1); }
 else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); escolher(sel - 1); }
 else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); confirmar(); }
 else if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); voltar(); }
});
const raio = new THREE.Raycaster(), ponteiro = new THREE.Vector2();
function saveSobPonteiro(e: MouseEvent) {
 if (estado !== 'cartao') return -1;
 ponteiro.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
 raio.setFromCamera(ponteiro, camera);
 const hit = raio.intersectObjects(listaSaves.map((s) => s.malha), true)[0];
 if (!hit) return -1;
 return listaSaves.findIndex((s) => { let o: THREE.Object3D | null = hit.object; while (o) { if (o === s.malha) return true; o = o.parent; } return false; });
}
canvas.addEventListener('pointermove', (e) => { const i = saveSobPonteiro(e); canvas.style.cursor = i >= 0 ? 'pointer' : ''; if (i >= 0 && i !== sel) escolher(i); });
canvas.addEventListener('click', (e) => { const i = saveSobPonteiro(e); if (i >= 0) { escolher(i, false); confirmar(); } });

const botaoSom = $<HTMLButtonElement>('#b-som');
const rotuloSom = () => { botaoSom.textContent = som.mudo ? 'Som: desligado' : 'Som: ligado'; botaoSom.setAttribute('aria-pressed', String(som.mudo)); };
botaoSom.onclick = () => { som.alternarMudo(); rotuloSom(); };
rotuloSom();

/* ---------- Começa direto no menu ---------- */
// O navegador só libera áudio depois de uma interação: o som começa no primeiro clique ou tecla
let somIniciado = false;
const iniciarSom = () => { if (somIniciado) return; somIniciado = true; som.ambienteLigar(); };
addEventListener('pointerdown', iniciarSom, {once: true});
addEventListener('keydown', iniciarSom, {once: true});
$<HTMLElement>('#barra').hidden = false;
estado = 'inicio'; montar();
if (!semMovimento) tela.classList.add('entrando');

/* ---------- Desenho ---------- */
let estreita = false;
function redimensionar() {
 renderer.setSize(innerWidth, innerHeight, false);
 camera.aspect = innerWidth / innerHeight;
 estreita = innerWidth < 700;
 // Telas estreitas: a câmera recua e a cena fica acima do texto
 camera.position.set(0, 0, estreita ? 15 : 10);
 inicio.g.position.set(estreita ? 0 : -2.6, estreita ? 2.4 : 0.2, 0);
 cubos.position.set(estreita ? 0 : -2.8, estreita ? 2.6 : 0, 0);
 // Fileira de saves mais junta no celular
 listaSaves.forEach((s, i) => { s.base.x = (i - (listaSaves.length - 1) / 2) * (estreita ? 1.75 : 2.7); s.base.y = estreita ? 1.4 : 0.9; });
 camera.updateProjectionMatrix();
}
addEventListener('resize', redimensionar); redimensionar();

const relogio = new THREE.Clock();
const v3 = new THREE.Vector3();
function quadro() {
 const dt = Math.min(relogio.getDelta(), 0.05), t = relogio.elapsedTime;
 const vel = semMovimento ? 0 : 1;
 moverOrbes(inicio, t * vel);
 moverOrbes(orbesCubos, t * vel * 0.8);
 cubos.rotation.y += dt * 0.12 * vel;
 cubos.children.forEach((m) => { if (m.userData.giro) { m.rotation.x += dt * m.userData.giro * vel; m.rotation.y += dt * m.userData.giro * 0.7 * vel; } });
 // Saves: o escolhido flutua e acende; no save aberto, ele vai para a esquerda e cresce
 listaSaves.forEach((s, i) => {
  const aberto = estado === 'save' && i === selSave;
  const ativo = (estado === 'cartao' && i === sel) || aberto;
  const alvo = aberto ? v3.set(estreita ? 0 : -2.4, estreita ? 2.2 : 0.2, 1.2) : s.base;
  s.malha.position.lerp(alvo, 0.1);
  if (ativo && !semMovimento) s.malha.position.y += Math.sin(t * 2) * 0.004;
  const tam = aberto ? (estreita ? 1.0 : 1.2) : ativo ? (estreita ? 0.72 : 1.05) : (estreita ? 0.55 : 0.82);
  s.malha.scale.lerp(new THREE.Vector3(tam, tam, tam), 0.12);
  // Balança de um lado para o outro, sempre de frente (nunca de costas)
  const giro = semMovimento ? 0 : (ativo ? Math.sin(t * 0.9) * 0.6 : Math.sin(t * 0.5 + i) * 0.2);
  s.malha.rotation.y += (giro - s.malha.rotation.y) * 0.08;
  const alvoOp = estado === 'save' && !aberto ? 0.08 : ativo ? 1 : 0.5;
  s.malha.traverse((o) => { const mat = (o as THREE.Mesh).material as THREE.Material | undefined; if (mat) mat.opacity += (alvoOp * (mat.userData.op ??= mat.opacity) - mat.opacity) * 0.12; });
  const mb = s.brilho.material as THREE.SpriteMaterial;
  mb.opacity += (((estado === 'cartao' && ativo) ? 0.9 : 0) - mb.opacity) * 0.15;
  s.brilho.position.set(s.malha.position.x, s.malha.position.y - 1.25 * s.malha.scale.y, -0.1);
 });
 renderer.render(cena, camera);
 requestAnimationFrame(quadro);
}
requestAnimationFrame(quadro);
