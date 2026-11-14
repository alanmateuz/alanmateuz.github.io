export type Decisao = {titulo:string;antes:string;depois:string;porque:string};
export type CasoDesign = {problema:string;processo:string[];decisoes:Decisao[];telas:{img:string;legenda:string}[];resultado:string};
/** Imagem da galeria. tipo 'tela' = print de computador; 'celular' = print de celular; 'foto' = foto de evento.
 *  img vazio = foto ainda não enviada (aparece um espaço reservado). */
/** toques: pontos (em % da tela) onde o "dedo" toca, em ordem; rolar: a tela desliza como se rolasse. */
/** Um passo do fluxo animado: tela, rolagem (desce até o fim) e toque (x,y em % da tela visível). */
export type Passo = {img:string;rolar?:boolean;toque?:[number,number][]};
export type ItemGaleria = {fluxo?:Passo[];img:string;legenda:string;tipo:'tela'|'celular'|'foto';largo?:boolean;toques?:[number,number][];rolar?:boolean};
export type Acoes = {app?:string;prototipo?:{rotulo:string;url:string}[];design?:boolean;pitch?:number};
/** Logos de parceiros (PNG branco, fundo transparente), mostrados ao lado do título. */
/** img = PNG branco; ou texto = logo redesenhado em texto (nítido em qualquer tamanho). */
export type Logo = {img?:string;texto?:[string,string];nome:string};
export type Projeto = {logos?:Logo[];id:string;name:string;client:string;category:string;number:string;headline:string;description:string;role:string;tags:string[];image:string;summary:string;cor:string;capa:'tela'|'celular';galeria:ItemGaleria[];acoes:Acoes;design?:CasoDesign};

export const projects:Projeto[] = [
 {id:'safra',name:'Safra',client:'M. Dias Branco',category:'AUTOMAÇÃO · DADOS · GESTÃO',number:'01',headline:'Dados que viram decisões.',description:'Uma plataforma para consolidar dados de treinamentos corporativos e simplificar a rotina da Educação Corporativa. Nascido em um desafio de inovação da M. Dias Branco, o Safra avançou para a implementação de um projeto piloto.',role:'Minha participação: coordenação de equipe, definição de prioridades, interface e implementação do piloto.',tags:['Power Apps','Power Automate','SharePoint'],image:'safra-capa',summary:'Plataforma que reúne os dados de treinamentos corporativos da M. Dias Branco.',
  cor:'#4F86F7',logos:[{img:'logo-unifor',nome:'Unifor'},{img:'logo-mdb',nome:'M. Dias Branco'},{img:'logo-hackathon',nome:'O-Hackathon M. Dias Branco'}],capa:'tela',acoes:{pitch:15},
  galeria:[{img:'safra-capa',legenda:'O desafio: gestão integrada de treinamentos',tipo:'tela'},{img:'safra-como-funciona',legenda:'Como funciona',tipo:'tela'},{img:'foto-safra-unifor-hub',legenda:'Participantes no Unifor Hub',tipo:'foto',largo:true}],},
 {id:'alui',name:'Alui',client:'Hackatudo · equipe reThink',category:'EDUCAÇÃO · GAMIFICAÇÃO · IA',number:'02',headline:'O celular também pode ensinar.',description:'Uma plataforma educacional gamificada para transformar o celular em aliado da aula. Professores criam turmas e trilhas, geram questões com IA e acompanham resultados. Alunos aprendem com cartões, desafios e rankings.',role:'Projeto colaborativo desenvolvido no Hackatudo, com foco em uma relação mais consciente entre tecnologia e educação.',tags:['Java 17','Spring Boot','PostgreSQL','Figma'],image:'alui-slide-1',summary:'Plataforma gamificada que transforma o celular em aliado da sala de aula.',
  cor:'#FF7A2F',logos:[{texto:['HACKTUDO','FESTIVAL DE CULTURA DIGITAL'],nome:'Hacktudo, Festival de Cultura Digital'}],capa:'tela',acoes:{prototipo:[{rotulo:'Ver protótipo',url:'https://www.figma.com/proto/ZeNsOeWOFET5LWMfR5YyH0/Alui?page-id=0%3A1&node-id=1-13&p=f&viewport=-666%2C-351%2C0.58&t=AQnSTbWyQMpqOOsO-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2'}],design:true,pitch:10},
  galeria:[
   {img:'fluxo/s1-inicio',legenda:'Entrar na aula ao vivo',tipo:'celular',fluxo:[{img:'s1-inicio',toque:[[34,30]]},{img:'a1-entrar',toque:[[50,93]]},{img:'a2-aguardando'}]},
   {img:'fluxo/a4-multipla',legenda:'Responder e ver o resultado',tipo:'celular',fluxo:[{img:'a4-multipla',toque:[[50,42],[50,93]]},{img:'a5-certa'}]},
   {img:'fluxo/a9-aberta',legenda:'Mandar uma dúvida anônima',tipo:'celular',fluxo:[{img:'a9-aberta',toque:[[71,8]]},{img:'a12c-duvida',toque:[[50,93]]}]},
   {img:'fluxo/p3-gerar',legenda:'Professor gera a trilha com IA',tipo:'celular',fluxo:[{img:'p3-gerar',toque:[[50,93]]},{img:'p4-revisar',toque:[[50,93]]},{img:'p5-ao-vivo'}]}],
  design:{
   problema:'O celular costuma ser a maior distração da aula. O desafio era transformá-lo em aliado, para alunos e para professores.',
   processo:['Dois públicos, dois fluxos: o aluno aprende e o professor cria turmas, trilhas e acompanha métricas.','Marca com mascote (a arara) e paleta em que cada cor tem um significado: azul é o dia a dia, laranja é modo especial.','Protótipo navegável no Figma, com animações e modo claro e escuro.'],
   decisoes:[
    {titulo:'Um tom para cada público',antes:'O lado do professor tão colorido quanto o do aluno.',depois:'Aluno lúdico e colorido; professor sóbrio e claro.',porque:'Um adulto com muitas tarefas precisa de foco, não de festa.'},
    {titulo:'Modo foco com cara de modo',antes:'Só o título "Modo foco" em preto e um parágrafo.',depois:'Cor do modo, ícone e um controle de estado visível.',porque:'A pessoa precisa sentir que entrou num lugar diferente.'},
    {titulo:'Barra de abas branca e flutuante',antes:'Testes com barra laranja e com efeito de vidro.',depois:'Barra branca, arredondada, com a aba ativa numa pílula na cor da marca.',porque:'Fica leve e não disputa atenção com o conteúdo.'},
   ],
   telas:[{img:'alui-inicio',legenda:'Início do aluno'},{img:'alui-multipla',legenda:'Múltipla escolha'},{img:'alui-aberta',legenda:'Pergunta aberta'},{img:'alui-duvida',legenda:'Dúvida anônima'},{img:'alui-metrics-crop',legenda:'Métricas do professor'}],
   resultado:'56 telas em modo claro e escuro e um protótipo navegável com animações.'}},
 {id:'reuse',name:'ReUse',client:'Unifor',category:'UI/UX · ECONOMIA CIRCULAR',number:'03',headline:'Novas histórias para o que já existe.',description:'Uma proposta de re-commerce universitário que conecta estudantes da Unifor para comprar, vender e doar materiais, com interfaces mobile que aproximam a economia circular da vida no campus.',role:'Minha participação: UI/UX e prototipagem das jornadas de compra e venda, dos anúncios, das mensagens e dos indicadores de impacto.',tags:['Figma','Protótipo navegável'],image:'reuse-landing',summary:'App para estudantes da Unifor comprarem, venderem e doarem materiais.',
  cor:'#2F6BFF',logos:[{img:'logo-unifor',nome:'Unifor'}],capa:'tela',acoes:{prototipo:[{rotulo:'Ver protótipo',url:'https://www.figma.com/proto/6uBMFvv39cWSeVa7tP3Wlk/ReUni?node-id=1-3&t=D99ocYFHTxDUHz3N-1'},{rotulo:'Ver landing page',url:'https://www.figma.com/proto/6uBMFvv39cWSeVa7tP3Wlk/ReUni?node-id=1-6&page-id=1%3A2&starting-point-node-id=1%3A6&t=uOS88tqX22zY3Xhk-1'}],design:true},
  galeria:[
   {img:'fluxo/r-home',legenda:'Encontrar um material do curso',tipo:'celular',fluxo:[{img:'r-home',toque:[[17,69]]},{img:'r-anuncio',rolar:true}]},
   {img:'fluxo/r-anuncio',legenda:'Conversar com quem vende',tipo:'celular',fluxo:[{img:'r-anuncio',toque:[[72,92]]},{img:'r-mensagens',rolar:true}]},
   {img:'fluxo/r-pagamento',legenda:'Pagar e combinar a entrega',tipo:'celular',fluxo:[{img:'r-pagamento',rolar:true,toque:[[50,86]]},{img:'r-concluida'}]},
   {img:'fluxo/r-revisao',legenda:'Anunciar um material',tipo:'celular',fluxo:[{img:'r-revisao',rolar:true,toque:[[50,89]]}]},
   {img:'reuse-landing',legenda:'Landing page',tipo:'tela',largo:true}],
  design:{
   problema:'Materiais de estudo em bom estado ficam parados enquanto outros estudantes do mesmo campus precisam deles.',
   processo:['Jornadas de compra, venda e doação entre estudantes.','Card de anúncio pensado a partir da pergunta "o que preciso saber aqui?".','Identidade ligada à Unifor e protótipos navegáveis da landing page e do app.'],
   decisoes:[
    {titulo:'Hierarquia por cor no anúncio',antes:'',depois:'Quem vende em azul, preço em vermelho com o desconto à vista e o título do produto em preto.',porque:'O olho acha cada informação sem ler tudo.'},
    {titulo:'Card que responde o essencial',antes:'',depois:'Foto, preço, nome do produto e quem vende, nessa ordem.',porque:'É o que decide uma compra entre colegas.'},
    {titulo:'Identidade do campus',antes:'',depois:'Cores e ícones ligados à Unifor.',porque:'Aproxima a ideia da vida de quem estuda ali.'},
   ],
   telas:[{img:'reuse-inicio',legenda:'Início'},{img:'reuse-anuncio',legenda:'Detalhes do anúncio'},{img:'reuse-revisao',legenda:'Revisão do anúncio'},{img:'reuse-compra',legenda:'Compra concluída'}],
   resultado:'Protótipos navegáveis do app e da landing page, em modo claro e escuro.'}}
];
