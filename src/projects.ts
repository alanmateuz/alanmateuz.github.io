export type Decisao = {titulo:string;antes:string;depois:string;porque:string};
export type CasoDesign = {problema:string;processo:string[];decisoes:Decisao[];telas:{img:string;legenda:string}[];resultado:string};
/** Imagem da galeria. tipo 'tela' = print de computador; 'celular' = print de celular; 'foto' = foto de evento.
 *  img vazio = foto ainda não enviada (aparece um espaço reservado). */
export type ItemGaleria = {img:string;legenda:string;tipo:'tela'|'celular'|'foto';largo?:boolean};
export type Acoes = {app?:string;prototipo?:{rotulo:string;url:string}[];design?:boolean;pitch?:number};
export type Projeto = {id:string;name:string;client:string;category:string;number:string;headline:string;description:string;role:string;tags:string[];image:string;summary:string;cor:string;capa:'tela'|'celular';galeria:ItemGaleria[];acoes:Acoes;design?:CasoDesign};

export const projects:Projeto[] = [
 {id:'provaizi',name:'Prova Izi',client:'Projeto autoral · no ar',category:'IA · PRODUTO · ACESSIBILIDADE',number:'01',headline:'Prova pronta em minutos, para todos os alunos.',
  description:'Um app para professoras montarem provas a partir de um banco de questões e de IA, com versão adaptada para alunos com TDAH, autismo, dislexia ou deficiência intelectual, e gabarito. Funciona no celular mesmo sem internet, cria várias provas de uma vez e exporta para o Word no padrão da escola.',
  role:'Projeto autoral: produto, design de interface e desenvolvimento. IA para criar e revisar questões, leitura de livros em PDF como base e app instalável (PWA) que funciona offline.',
  tags:['IA generativa','PWA offline','JavaScript','UI/UX','Acessibilidade'],image:'provaizi-inicio',summary:'Provas, versão adaptada e gabarito em minutos, com IA.',
  cor:'#FFC93C',capa:'celular',acoes:{app:'https://prova-izi.vercel.app',design:true},
  galeria:[{img:'provaizi-inicio',legenda:'Início',tipo:'celular'},{img:'provaizi-editor',legenda:'Editor da prova',tipo:'celular'},{img:'provaizi-adaptada',legenda:'Versão adaptada',tipo:'celular'},{img:'provaizi-lote',legenda:'Várias provas de uma vez',tipo:'celular'},{img:'',legenda:'Professoras testando o app',tipo:'foto',largo:true}],
  design:{
   problema:'Montar uma prova, a versão adaptada e o gabarito toma tempo da professora, e a versão adaptada costuma ficar para depois. Muitas escolas também têm internet instável.',
   processo:['Mapa de dores e um fluxo principal: criar a prova em 4 passos curtos.','Marca: "Prova Izi" (prova fácil), amarelo de marca-texto e a fonte Nunito, arredondada, para um público de professoras.','Protótipo direto em código, testado no celular a cada rodada.','Rodadas de ajuste com o registro de cada decisão e do porquê.'],
   decisoes:[
    {titulo:'Início em blocos de atenção',antes:'Números em cores diferentes, atalhos repetindo a navegação e cartões competindo entre si.',depois:'Faixa amarela da marca, duas funções lado a lado e os números num bloco neutro.',porque:'Quem abre o app precisa ver primeiro o que fazer agora.'},
    {titulo:'Ferramentas dentro da questão',antes:'Botões soltos, sem deixar claro qual questão eles editavam.',depois:'Cada questão num bloco com contorno e as ferramentas dentro dele.',porque:'Fica óbvio o que cada botão altera.'},
    {titulo:'Versão adaptada como modo especial',antes:'Uma aba igual às outras.',depois:'Cor própria de inclusão e opções que a professora liga e desliga: letra maior, dicas e negrito.',porque:'Cada aluno precisa de um apoio diferente.'},
    {titulo:'Respeitar o que a escola já tem',antes:'Cabeçalho único, igual para todas as escolas.',depois:'O cabeçalho é importado do Word da escola, do jeito que está.',porque:'Cada escola tem o seu padrão, e a professora não deveria refazê-lo.'},
   ],
   telas:[{img:'provaizi-inicio',legenda:'Início'},{img:'provaizi-criar',legenda:'Criar prova'},{img:'provaizi-editor',legenda:'Editor da prova'},{img:'provaizi-adaptada',legenda:'Versão adaptada'},{img:'provaizi-lote',legenda:'Várias provas de uma vez'},{img:'provaizi-banco',legenda:'Banco de questões'},{img:'provaizi-inicio-escuro',legenda:'Modo escuro'}],
   resultado:'O app está no ar em prova-izi.vercel.app, funciona offline e exporta para o Word. O maior aprendizado: a interface melhorou mais com as rodadas de feedback do que com a primeira ideia.'}},
 {id:'safra',name:'Safra',client:'M. Dias Branco',category:'AUTOMAÇÃO · DADOS · GESTÃO',number:'02',headline:'Dados que viram decisões.',description:'Uma plataforma para consolidar dados de treinamentos corporativos e simplificar a rotina da Educação Corporativa. Nascido em um desafio de inovação da M. Dias Branco, o Safra avançou para a implementação de um projeto piloto.',role:'Minha participação: coordenação de equipe, definição de prioridades, interface e implementação do piloto.',tags:['Power Apps','Power Automate','SharePoint','Gestão de projeto'],image:'safra-slide-1',summary:'Gestão de treinamentos, do desafio de inovação ao piloto.',
  cor:'#5EC27A',capa:'tela',acoes:{pitch:15},
  galeria:[{img:'safra-summary',legenda:'Resumo geral',tipo:'tela'},{img:'safra-regional',legenda:'Visão por regional',tipo:'tela'},{img:'foto-mdb-equipe',legenda:'Fotos do evento',tipo:'foto',largo:true}],},
 {id:'alui',name:'Alui',client:'Hackatudo · equipe reThink',category:'EDUCAÇÃO · GAMIFICAÇÃO · IA',number:'03',headline:'O celular também pode ensinar.',description:'Uma plataforma educacional gamificada para transformar o celular em aliado da aula. Professores criam turmas e trilhas, geram questões com IA e acompanham resultados. Alunos aprendem com cartões, desafios e rankings.',role:'Projeto colaborativo desenvolvido no Hackatudo, com foco em uma relação mais consciente entre tecnologia e educação.',tags:['Java 17','Spring Boot','PostgreSQL','Figma'],image:'alui-slide-1',summary:'Trilhas, desafios e aprendizado que acontece em conjunto.',
  cor:'#4C8DFF',capa:'tela',acoes:{prototipo:[{rotulo:'Ver protótipo',url:'https://www.figma.com/proto/ZeNsOeWOFET5LWMfR5YyH0/Alui?page-id=0%3A1&node-id=1-13&p=f&viewport=-666%2C-351%2C0.58&t=AQnSTbWyQMpqOOsO-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2'}],design:true,pitch:10},
  galeria:[{img:'alui-2',legenda:'Boas-vindas',tipo:'celular'},{img:'alui-3',legenda:'Próximas aulas',tipo:'celular'},{img:'alui-4',legenda:'Ofensiva e metas',tipo:'celular'},{img:'alui-18',legenda:'Questão',tipo:'celular'},{img:'',legenda:'Fotos do Hackatudo',tipo:'foto',largo:true}],
  design:{
   problema:'O celular costuma ser a maior distração da aula. O desafio era transformá-lo em aliado, para alunos e para professores.',
   processo:['Dois públicos, dois fluxos: o aluno aprende e o professor cria turmas, trilhas e acompanha métricas.','Marca com mascote (a arara) e paleta em que cada cor tem um significado: azul é o dia a dia, laranja é modo especial.','Protótipo navegável no Figma, com animações e modo claro e escuro.'],
   decisoes:[
    {titulo:'Um tom para cada público',antes:'O lado do professor tão colorido quanto o do aluno.',depois:'Aluno lúdico e colorido; professor sóbrio e claro.',porque:'Um adulto com muitas tarefas precisa de foco, não de festa.'},
    {titulo:'Modo foco com cara de modo',antes:'Só o título "Modo foco" em preto e um parágrafo.',depois:'Cor do modo, ícone e um controle de estado visível.',porque:'A pessoa precisa sentir que entrou num lugar diferente.'},
    {titulo:'Barra de abas branca e flutuante',antes:'Testes com barra laranja e com efeito de vidro.',depois:'Barra branca, arredondada, com a aba ativa numa pílula na cor da marca.',porque:'Fica leve e não disputa atenção com o conteúdo.'},
   ],
   telas:[{img:'alui-2',legenda:'Boas-vindas'},{img:'alui-3',legenda:'Próximas aulas'},{img:'alui-4',legenda:'Ofensiva e metas'},{img:'alui-18',legenda:'Questão'},{img:'alui-metrics-crop',legenda:'Métricas do professor'}],
   resultado:'56 telas em modo claro e escuro e um protótipo navegável com animações.'}},
 {id:'reuse',name:'ReUse',client:'Unifor',category:'UI/UX · ECONOMIA CIRCULAR',number:'04',headline:'Novas histórias para o que já existe.',description:'Uma proposta de re-commerce universitário que conecta estudantes da Unifor para comprar, vender e doar materiais. Interfaces mobile que aproximam a economia circular da vida no campus.',role:'UI/UX e prototipagem: jornadas de compra e venda, anúncios, mensagens e indicadores de impacto.',tags:['Figma','UI/UX','Prototipagem'],image:'reuse-web',summary:'Materiais acadêmicos circulando entre quem estuda junto.',
  cor:'#3DD6D0',capa:'tela',acoes:{prototipo:[{rotulo:'Ver protótipo',url:'https://www.figma.com/proto/6uBMFvv39cWSeVa7tP3Wlk/ReUni?node-id=1-3&t=D99ocYFHTxDUHz3N-1'},{rotulo:'Ver landing page',url:'https://www.figma.com/proto/6uBMFvv39cWSeVa7tP3Wlk/ReUni?node-id=1-6&page-id=1%3A2&starting-point-node-id=1%3A6&t=uOS88tqX22zY3Xhk-1'}],design:true},
  galeria:[{img:'reuse-home-crop',legenda:'Início (modo escuro)',tipo:'celular'},{img:'reuse-detail-crop',legenda:'Detalhes do anúncio',tipo:'celular'},{img:'reuse-third-crop',legenda:'Início (modo claro)',tipo:'celular'},{img:'reuse-web',legenda:'Landing page',tipo:'tela',largo:true}],
  design:{
   problema:'Materiais de estudo em bom estado ficam parados enquanto outros estudantes do mesmo campus precisam deles.',
   processo:['Jornadas de compra, venda e doação entre estudantes.','Card de anúncio pensado a partir da pergunta "o que preciso saber aqui?".','Identidade ligada à Unifor e protótipos navegáveis da landing page e do app.'],
   decisoes:[
    {titulo:'Hierarquia por cor no anúncio',antes:'',depois:'Quem vende em azul, preço em vermelho com o desconto à vista e o título do produto em preto.',porque:'O olho acha cada informação sem ler tudo.'},
    {titulo:'Card que responde o essencial',antes:'',depois:'Foto, preço, nome do produto e quem vende, nessa ordem.',porque:'É o que decide uma compra entre colegas.'},
    {titulo:'Identidade do campus',antes:'',depois:'Cores e ícones ligados à Unifor.',porque:'Aproxima a ideia da vida de quem estuda ali.'},
   ],
   telas:[{img:'reuse-home-crop',legenda:'Início (modo escuro)'},{img:'reuse-detail-crop',legenda:'Detalhes do anúncio'},{img:'reuse-third-crop',legenda:'Início (modo claro)'}],
   resultado:'Protótipos navegáveis do app e da landing page, em modo claro e escuro.'}}
];
