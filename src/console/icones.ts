/* =========================================================
   Ícones 3D dos "saves", montados com formas simples do three.js
   (vidro colorido + brilho próprio). Nada de modelo externo.
   ========================================================= */
import * as THREE from 'three';

const vidro = (cor: string, brilho = 0.35, opacidade = 0.92) => new THREE.MeshPhysicalMaterial({
 color: cor, emissive: cor, emissiveIntensity: brilho, roughness: 0.18, metalness: 0.1,
 transmission: 0.25, thickness: 0.6, transparent: true, opacity: opacidade, clearcoat: 1, clearcoatRoughness: 0.15,
});
const solido = (cor: string, brilho = 0.25) => new THREE.MeshStandardMaterial({color: cor, emissive: cor, emissiveIntensity: brilho, roughness: 0.35, metalness: 0.2});

/** Safra: ramo de trigo dourado com folhas, nascendo de um cubo de dados azul. */
function safra() {
 const g = new THREE.Group();
 const caule = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.5, 12), solido('#c9a14a', 0.3));
 caule.position.y = 0.35; g.add(caule);
 const graoGeo = new THREE.SphereGeometry(0.11, 16, 12); graoGeo.scale(0.75, 1.35, 0.75);
 const ouro = vidro('#e8b84a', 0.5);
 for (let i = 0; i < 7; i++) {
  for (const lado of [-1, 1]) {
   const grao = new THREE.Mesh(graoGeo, ouro);
   grao.position.set(lado * 0.09, 0.55 + i * 0.13, 0);
   grao.rotation.z = -lado * 0.5;
   g.add(grao);
  }
 }
 const ponta = new THREE.Mesh(graoGeo, ouro); ponta.position.y = 1.5; g.add(ponta);
 const folhaGeo = new THREE.SphereGeometry(0.3, 16, 8); folhaGeo.scale(0.25, 1.4, 0.05);
 for (const lado of [-1, 1]) {
  const folha = new THREE.Mesh(folhaGeo, vidro('#7fbf6a', 0.25));
  folha.position.set(lado * 0.2, 0.1, 0); folha.rotation.z = lado * -0.7; g.add(folha);
 }
 const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.9, 1, 1, 1), vidro('#3d6cf0', 0.45, 0.85));
 base.position.y = -0.55; g.add(base);
 const borda = new THREE.LineSegments(new THREE.EdgesGeometry(base.geometry), new THREE.LineBasicMaterial({color: '#9fbaff'}));
 borda.position.copy(base.position); g.add(borda);
 return g;
}

/** Alui: celular com um balão de pergunta saindo da tela. */
function alui() {
 const g = new THREE.Group();
 const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.6, 0.12), solido('#2a3566', 0.35));
 g.add(corpo);
 const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 1.46), new THREE.MeshBasicMaterial({color: '#1557ff', side: THREE.DoubleSide}));
 tela.position.z = 0.065; g.add(tela);
 const cartao = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.3), new THREE.MeshBasicMaterial({color: '#ffffff', side: THREE.DoubleSide}));
 cartao.position.set(0, 0.35, 0.07); g.add(cartao);
 for (let i = 0; i < 3; i++) {
  const op = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.12), new THREE.MeshBasicMaterial({color: i === 0 ? '#ff7a2f' : '#cfe0ff', side: THREE.DoubleSide}));
  op.position.set(0, -0.05 - i * 0.17, 0.07); g.add(op);
 }
 // Balão com "?" flutuando à frente
 const balao = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), vidro('#ff7a2f', 0.55, 0.9));
 balao.scale.set(1.15, 0.85, 0.55); balao.position.set(0.55, 0.85, 0.45); g.add(balao);
 const rabo = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 12), vidro('#ff7a2f', 0.55, 0.9));
 rabo.position.set(0.32, 0.5, 0.45); rabo.rotation.z = 2.4; g.add(rabo);
 const ponto = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), solido('#ffffff', 0.8));
 ponto.position.set(0.55, 0.68, 0.7); g.add(ponto);
 const curva = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 10, 24, Math.PI * 1.3), solido('#ffffff', 0.8));
 curva.position.set(0.55, 0.92, 0.7); curva.rotation.z = -0.6; g.add(curva);
 return g;
}

/** ReUse: três setas em círculo (economia circular), em azul. */
function reuse() {
 const g = new THREE.Group();
 const cores = ['#2f6bff', '#5d8dff', '#9cb8ff'];
 for (let i = 0; i < 3; i++) {
  const arco = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.13, 16, 48, Math.PI * 0.52), vidro(cores[i], 0.5));
  arco.rotation.z = i * (Math.PI * 2 / 3);
  g.add(arco);
  const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.42, 20), vidro(cores[i], 0.5));
  const ang = i * (Math.PI * 2 / 3) + Math.PI * 0.52;
  ponta.position.set(Math.cos(ang) * 0.75, Math.sin(ang) * 0.75, 0);
  ponta.rotation.z = ang; // aponta no sentido da volta
  g.add(ponta);
 }
 const centro = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 1), vidro('#ffffff', 0.6, 0.8));
 g.add(centro);
 return g;
}

/** Sobre: uma pessoa estilizada (cabeça + ombros) dentro de um anel. */
function sobre() {
 const g = new THREE.Group();
 const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 24), vidro('#e8e4ff', 0.45));
 cabeca.position.y = 0.45; g.add(cabeca);
 const ombros = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), vidro('#9a8cff', 0.4));
 ombros.position.y = -0.45; g.add(ombros);
 const anel = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.03, 12, 64), solido('#bdb4ff', 0.9));
 g.add(anel);
 return g;
}

/** Contato: envelope com uma onda saindo. */
function contato() {
 const g = new THREE.Group();
 const env = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.14), vidro('#7de0c8', 0.4));
 g.add(env);
 const forma = new THREE.Shape(); forma.moveTo(-0.7, 0.45); forma.lineTo(0, -0.05); forma.lineTo(0.7, 0.45);
 const aba = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, {depth: 0.02, bevelEnabled: false}), solido('#ffffff', 0.7));
 aba.position.z = 0.08; g.add(aba);
 for (let i = 0; i < 2; i++) {
  const onda = new THREE.Mesh(new THREE.TorusGeometry(0.35 + i * 0.22, 0.025, 8, 32, Math.PI * 0.5), solido('#7de0c8', 0.9));
  onda.position.set(0.55, 0.45, 0); onda.rotation.z = -0.2; g.add(onda);
 }
 return g;
}

export const ICONES: Record<string, () => THREE.Group> = {safra, alui, reuse, sobre, contato};
