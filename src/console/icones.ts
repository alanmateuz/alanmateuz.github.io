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

/** Alui: a arara azul mascote do app, em 3D (cabeça grande, olhos com aro amarelo, bico escuro, topete). */
function arara() {
 const g = new THREE.Group();
 const azul = new THREE.MeshPhysicalMaterial({color: '#1d4dff', emissive: '#0b2bd6', emissiveIntensity: 0.35, roughness: 0.35, clearcoat: 0.6});
 const azulEscuro = new THREE.MeshStandardMaterial({color: '#1235b8', emissive: '#0a1f80', emissiveIntensity: 0.3, roughness: 0.4});
 const branco = new THREE.MeshStandardMaterial({color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.15, roughness: 0.3});
 const preto = new THREE.MeshStandardMaterial({color: '#111318', roughness: 0.2});
 const amarelo = new THREE.MeshStandardMaterial({color: '#ffd23a', emissive: '#ffb800', emissiveIntensity: 0.35, roughness: 0.35});
 const cinza = new THREE.MeshStandardMaterial({color: '#3a3f4b', roughness: 0.45});
 // Corpo e cabeça
 const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 28), azul); corpo.scale.set(0.95, 1.1, 0.9); corpo.position.y = -0.55; g.add(corpo);
 const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 32), azul); cabeca.position.y = 0.35; g.add(cabeca);
 // Topete: três penas inclinadas para trás
 for (let i = 0; i < 3; i++) {
  const pena = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.55, 16), azulEscuro);
  pena.position.set((i - 1) * 0.15, 1.05, -0.12); pena.rotation.set(-0.55, 0, (i - 1) * -0.35); g.add(pena);
 }
 // Olhos: aro amarelo, branco grande e pupila
 for (const lado of [-1, 1]) {
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 12, 32), amarelo); aro.position.set(lado * 0.3, 0.48, 0.6); aro.rotation.y = lado * 0.35; g.add(aro);
  const olho = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 16), branco); olho.position.set(lado * 0.3, 0.48, 0.58); g.add(olho);
  const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), preto); pupila.position.set(lado * 0.28, 0.48, 0.74); g.add(pupila);
  const reflexo = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), branco); reflexo.position.set(lado * 0.25 + 0.04, 0.53, 0.83); g.add(reflexo);
 }
 // Bico curvo escuro com a parte de baixo mais clara
 const bico = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), cinza); bico.scale.set(1, 1.2, 1.05); bico.position.set(0, 0.16, 0.66); g.add(bico);
 const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 16), cinza); ponta.position.set(0, -0.06, 0.78); ponta.rotation.x = Math.PI - 0.5; g.add(ponta);
 const boca = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), preto); boca.scale.set(1.2, 0.5, 0.6); boca.position.set(0, 0.0, 0.66); g.add(boca);
 // Asas e cauda
 for (const lado of [-1, 1]) {
  const asa = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 16), azulEscuro); asa.scale.set(0.45, 1, 0.8); asa.position.set(lado * 0.56, -0.55, 0); asa.rotation.z = lado * 0.25; g.add(asa);
 }
 const cauda = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 16), azulEscuro); cauda.position.set(0, -1.15, -0.35); cauda.rotation.x = 2.6; g.add(cauda);
 // Patinhas amarelas
 for (const lado of [-1, 1]) {
  const pe = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), amarelo); pe.scale.set(1.3, 0.6, 1.4); pe.position.set(lado * 0.2, -1.2, 0.18); g.add(pe);
 }
 g.scale.setScalar(0.85);
 return g;
}
ICONES.alui = arara;
