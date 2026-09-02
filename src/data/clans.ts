// Fonte: manual de regras, Capítulo 2 ("Clãs origem do personagem") — ver docs/rules/02-clas.md
import type { Clan } from '../types'

const zero = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }

export const CLANS: Clan[] = [
  {
    id: 'aburame',
    name: 'Aburame',
    quote: 'As pessoas sempre subestimam os pequenos.',
    description:
      'Vive em bosque reservado na Vila da Folha. Um dos quatro clãs nobres da Folha. Membros hospedam insetos simbióticos sob a pele desde o nascimento (alimentam-se de chakra); usam Ninjutsu baseado em insetos. Olhos geralmente obscurecidos por óculos, roupas que cobrem a maior parte do corpo.',
    bonuses: { ...zero, charisma: 2, wisdom: 1 },
    bonusText: '+2 Carisma, +1 Sabedoria',
    speed: '9 metros',
    skillProficiencies: ['Natureza', 'Lidar com Animais'],
    featuresText:
      'Idioma Extra: falar com insetos. Técnica Parasitária: conhece 1 Ninjutsu Rank-D adicional do clã. ' +
      'Jutsus Base dos Aburames: acesso à lista exclusiva de jutsus do clã, somada aos jutsus normais. ' +
      'Hospedeiro de Insetos: pode usar um turno de descanso para fazer uma jogada de resistência de Constituição e adicionar 1d6 (resistir a jutsus/venenos). ' +
      'Sentido de Chakra (1º): sente criaturas que usam chakra em raio de 10m e sabe a direção. ' +
      'Consumo de Chakra (3º): ao usar jutsu do clã, pode causar dano ou absorver o chakra do alvo. ' +
      'Foco de Inseto (7º, +1 no 11º, +1 no 15º): especializa-se em Besouros, Vespa ou Insetos Parasitas, cada um com um bônus próprio.',
    exclusiveJutsuCount: 9,
  },
  {
    id: 'akimichi',
    name: 'Akimichi',
    quote:
      'A fim de proteger tanto o Clã Yamanaka, o Clã Nara e Konoha, eu, como um Akimichi, sairei da minha crisálida e como uma borboleta abrirei minhas asas.',
    description:
      'Um dos quatro clãs nobres da Folha. Manipulam tamanho/densidade corporal via Liberação de Yang, convertendo calorias em poder bruto e chakra. Ostentam o kanji de "comida" (食). Usam as três Pílulas Coloridas em situações extremas.',
    bonuses: { ...zero, constitution: 2, strength: 1 },
    bonusText: '+2 Constituição, +1 Força',
    speed: '9 metros',
    skillProficiencies: ['Sobrevivência', 'Medicina'],
    featuresText:
      'Jutsus Base dos Akimichi: lista exclusiva de jutsus do clã (substitui, não soma, a escolha de jutsus normais). ' +
      'Intervalos para Almoço: ao descansar um pouco, recupera PV adicionais iguais às calorias atuais. ' +
      'Calorias: no 1º nível, calorias = nível + Mod. Constituição (mín. 1); recupera todas após descanso longo; gastas em jutsus/recursos do clã. ' +
      'Pílulas Alimentares (2º): Espinafre Verde (2º, +2 FOR/+2 CON por 2 rodadas, depois exaustão), Curry Amarela (4º, sobe o dado de dano desarmado/Taijutsu), Pimenta Vermelha (6º, dobra dano desarmado/Taijutsu/jutsus do clã por 3 rodadas, depois risco de morte) — não podem ser tomadas fora de ordem. ' +
      'Conversão de Gordura (6º): ação bônus converte 1 Caloria em 2 Pontos de Chakra. ' +
      'Mestre da Manipulação Metabólica (18º): reduz custo calórico de jutsus do clã em −2.',
    exclusiveJutsuCount: 10,
  },
  {
    id: 'fuma',
    name: 'Fūma',
    description:
      'Parente distante do clã Uchiha (sem Sharingan). Clã itinerante, dentro das fronteiras do País do Fogo. Especialistas na Fūma-Shuriken; filosofia "treinar para nunca errar".',
    bonuses: { ...zero, dexterity: 2, wisdom: 1 },
    bonusText: '+2 Destreza, +1 Sabedoria',
    speed: '9 metros',
    skillProficiencies: ['Percepção', 'Taijutsu', 'Bukijutsu'],
    featuresText:
      'Proficiência com Armas: todas as armas de longo alcance. Casa das Adagas Voadoras: lista exclusiva de jutsus do clã. ' +
      'Precisão Imaculada (3º): +1 em ataque e dano com armas de arremesso (+2 no 7º, +3 no 11º). ' +
      'Trabalhando os Ângulos (5º): ação bônus recupera arma de arremesso sem propriedade Retorno. ' +
      'Mestre Fūma Shuriken (7º): dados de dano fixos aumentados (Shuriken 2d4, Fūma Shuriken 2d8, Shuriken Monstruoso 2d12, todos cortante). ' +
      'Precisão Letal (11º): crítico em 19–20 com arma de arremesso à distância (18–20 no 15º).',
    exclusiveJutsuCount: 10,
  },
  {
    id: 'hatake',
    name: 'Hatake',
    description:
      'Sem linhagem sanguínea única, mas reputação por talento de combate e genialidade tática (ex.: Sakumo Hatake). Produziu o 6º Hokage. Usuários habilidosos de Liberação de Relâmpago.',
    bonuses: { ...zero, intelligence: 2, charisma: 1 },
    bonusText: '+2 Inteligência, +1 Carisma',
    speed: '10 metros',
    skillProficiencies: ['Ninjutsu', 'Percepção'],
    featuresText:
      'Afinidade Passiva: Liberação de Relâmpago (pode aprender Ninjutsu de Relâmpago). ' +
      'Chakra Branco (1º): 5 Chakra Branco, só gasto em jutsu com palavra-chave Liberação de Relâmpago; +1 por nível; recarrega em descanso longo. ' +
      'Simplicidade da Liberação de Relâmpago (3º): reduz pela metade o tempo para criar/aprender Ninjutsu de Relâmpago. ' +
      'Adepto da Liberação de Relâmpago (7º): reduz custo de Ninjutsu de Relâmpago em −1 (−2 no 15º). ' +
      'Sabre de Chakra Branco (11º): ação bônus, gasta Chakra Branco para bônus de dano e muda o tipo de dano da arma para Relâmpago; 18º: pode aplicar o bônus ao acerto em vez do dano. ' +
      'Não possui lista dedicada de jutsus exclusivos do clã (Hijutsu).',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'hyuga',
    name: 'Hyūga',
    quote: 'Em direção ao sol.',
    description:
      'Um dos quatro clãs nobres, considerado o mais forte de Konoha. Descendentes de Hamura Ōtsutsuki (primos distantes de Uchiha, Senju, Uzumaki, Kaguya). Possuem o Byakugan (visão quase 360°, enxerga através de sólidos, vê o sistema de chakra) e o estilo de Taijutsu Juuken (Punho Suave). Dividido em Casa Principal e Casa Secundária.',
    bonuses: { ...zero, wisdom: 2, dexterity: 1 },
    bonusText: '+2 Sabedoria, +1 Destreza',
    speed: '9 metros',
    skillProficiencies: ['Percepção', 'Intuição'],
    featuresText:
      '(A proficiência de perícia "Discernimento" citada no manual foi mapeada para "Intuição" — ver observações sobre ambiguidade de nomenclatura.) ' +
      'Visão no escuro: 9 metros. Hyūga Hijutsu: conhece 1 Taijutsu Rank-D adicional do clã. ' +
      'Ramo da Família (1º, escolha permanente): Casa Principal (acesso a Técnicas Secretas) ou Casa Secundária (versões avançadas do Punho Gentil/8 Trigramas). ' +
      'Byakugan (1º): 5 chakra, ação bônus, dura até 1h — Visão do Chakra (10m) e Visão de 360° (20m em combate/30m fora). No 3º (mais uma no 11º e 18º) escolhe entre Visão Penetrativa, Distância Imensa, Resiliência Perceptiva ou Discernimento no Combate. ' +
      'Postura do Punho Gentil (1º): usa Destreza em vez de Força para ataque/dano desarmado e Taijutsu do clã; dano reduz chakra do alvo em vez de PV; no 5º, se o alvo tiver 0 chakra, dobra o dano aos PV.',
    exclusiveJutsuCount: 14,
  },
  {
    id: 'inuzuka',
    name: 'Inuzuka',
    description:
      'Família conhecida pelo uso de Ninken (Cães de Caça Ninja) como companheiros; marcas vermelhas de presas nas bochechas. Sentidos aprimorados (olfato).',
    bonuses: { ...zero, wisdom: 2, strength: 1 },
    bonusText: '+1 Força, +2 Sabedoria',
    speed: '11 metros',
    skillProficiencies: ['Acrobacia', 'Lidar com Animais'],
    featuresText:
      'Idioma Extra: falar com cachorros. Jutsu do Clã Inuzuka: lista exclusiva. ' +
      'Ataque Selvagem do Cachorro Ninja: em crítico do Cachorro Ninja, rola um dado de dano extra. ' +
      'Mestre das Bestas (1º): ganha um Companheiro Canino (Cachorro Ninja), nível = metade do nível do mestre (máx. 10); age na iniciativa do mestre, comandado como ação bônus; escolha inicial entre Jovem Kugsha, Jovem Tamaskan ou Jovem Inuit do Norte. ' +
      'Habilidade de Fera (3º): adiciona metade do nível à Percepção; 11º: +10 fixo com Som/Olfato. ' +
      'Fúria Bestial (7º): ao usar jutsu do clã, se mestre ou cão acerta e o outro não agiu, o que não agiu pode gastar reação para atacar o mesmo alvo.',
    exclusiveJutsuCount: 10,
  },
  {
    id: 'kurama',
    name: 'Kurama',
    description:
      'Usuários extremamente qualificados em Genjutsu; clã antes proeminente em Konoha, hoje com poucos membros. Raramente um membro nasce capaz de fazer Genjutsu produzir efeitos físicos reais, podendo matar com Genjutsu.',
    bonuses: { ...zero, wisdom: 2, intelligence: 1 },
    bonusText: '+1 Inteligência, +2 Sabedoria ou Carisma (escolha)',
    speed: '9 metros',
    skillProficiencies: ['Genjutsu', 'Intuição'],
    featuresText:
      '(A proficiência de perícia "Discernimento" citada no manual foi mapeada para "Intuição" — ver observações sobre ambiguidade de nomenclatura.) ' +
      'Especialidade Genjutsu (1º): ganha um Talento da categoria Genjutsu (mais um no 7º e 15º). ' +
      'Resistência a Genjutsu (3º): +1d4 (1d6 no 11º, 1d8 no 18º) em testes de resistência contra Genjutsu. ' +
      'Moldagem de Genjutsu (3º): conhece 2 técnicas de moldagem (mais uma no 6º e 11º) — Genjutsu Cuidadoso, Fortalecido, Acelerado, Sutil, em Camadas; Conversões de Genjutsu (7º): converte um Ninjutsu em Genjutsu como ação bônus. ' +
      'Não possui lista dedicada de jutsus exclusivos do clã (Hijutsu).',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'nara',
    name: 'Nara',
    description:
      'Não conhecidos por grande número de shinobi ou poder destrutivo, mas pelos estrategistas mais brilhantes de Konoha; técnica hereditária de manipulação de sombras (Liberação de Yin). Parceria histórica com Akimichi e Yamanaka ("Ino-Shika-Chō").',
    bonuses: { ...zero, intelligence: 2, wisdom: 1 },
    bonusText: '+2 Inteligência, +1 Sabedoria',
    speed: '9 metros',
    skillProficiencies: ['Investigação', 'Persuasão'],
    featuresText:
      'Jutsu: aprende 1 Jutsu Rank-D adicional do Clã Nara. Jutsu Possessão das Sombras: lista exclusiva. ' +
      'Potencial Gênio: talento adicional no 3º e 15º nível. Habilidade Magistral (7º): proficiência em 2 perícias à escolha (+2 no 18º). ' +
      'Coordenar: rodada completa, teste de Inteligência — sucesso concede bônus em ataque/perícia a aliados próximos. ' +
      'Mestre Tático (1º): concede a um aliado um Dado Tático (d4, vira d6 no 11º) por 1h, usável antes de saber o resultado de uma rolagem.',
    exclusiveJutsuCount: 10,
  },
  {
    id: 'sem_cla',
    name: 'Sem Clã',
    description:
      'Ninjas sem linhagem sanguínea nobre ou técnicas secretas hereditárias; a maioria da população shinobi. Potencial ilimitado, moldado pela própria determinação.',
    bonuses: { ...zero, charisma: 2 },
    bonusText: '+2 em qualquer atributo (ou +1 em dois atributos diferentes) — padrão aplicado: +2 Carisma',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText:
      'Proficiências em Perícias: escolha 3 quaisquer. ' +
      'Perícias Autodidatas (1º): escolhe 1 perícia — ganha proficiência (ou vira "Especialista", dobrando o bônus, se já proficiente); mais uma no 7º e 15º. ' +
      'Foco Incansável (1º): 1 Talento adicional (mais nos níveis 3, 7, 11, 15; não pode ser da categoria Clã). ' +
      'Nindō (3º): escolhe um lema — Nunca Recuar, Nunca Desistir ou Nunca Abandonar um Amigo — ativável 1x por descanso longo; segundo no 11º, terceiro no 18º.',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'sarutobi',
    name: 'Sarutobi',
    description:
      'Um dos pilares mais influentes de Konoha; força vem do serviço à vila e da "Vontade do Fogo", não de um doujutsu/técnica única. Laços históricos com Akimichi, Nara e Yamanaka.',
    bonuses: { ...zero, strength: 2, constitution: 1 },
    bonusText: '+2 Força, +1 Constituição',
    speed: '9 metros',
    skillProficiencies: ['Ninjutsu', 'Taijutsu', 'Genjutsu'],
    featuresText:
      'Transformação Avançada da Natureza (1º): recebe o Talento Liberação de Natureza (de novo no 15º, podendo reaprender jutsus). ' +
      'Controle Avançado de Chakra: escolhe 1 jutsu conhecido para reduzir custo em −1 (repetível nos níveis 9º/11º/15º; +1 jutsu adicional nos níveis 3º/11º/18º). ' +
      'Proficiência Avançada em Natureza: o elemento escolhido permite adicionar Ninjutsu daquela liberação à lista de conhecidos (Rank-D no 1º, C no 3º, B no 7º, A no 15º). ' +
      'Não possui lista dedicada de jutsus exclusivos do clã (Hijutsu).',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'uchiha',
    name: 'Uchiha',
    quote: 'O orgulho será nossa ruína e nosso renascimento.',
    description:
      'Um dos quatro clãs nobres, um dos mais fortes de Konoha. Possuem o Sharingan (visão penetrante, percepção sobre-humana, capacidade de copiar técnicas). Mestres da Liberação de Fogo. Podem despertar o Mangekyō Sharingan.',
    bonuses: { ...zero, dexterity: 2, intelligence: 1 },
    bonusText: '+2 Destreza, +1 Inteligência',
    speed: '9 metros',
    skillProficiencies: ['Intuição'],
    featuresText:
      'Proficiência em Perícias: Intuição; e Ninjutsu, Taijutsu ou Genjutsu à escolha. Afinidade Passiva: Liberação de Fogo. Técnicas Uchiha: lista exclusiva de jutsus. ' +
      'Sharingan (3º): 5 chakra, ação bônus, dura 10 min. 1 Tomo (3º): Esquiva do Sharingan, Olho da Percepção, Olho Copiador ou Olho Hipnótico. 2 Tomos (7º): evoluções dessas opções. 3 Tomos (11º): evoluções adicionais + Contra-ataque de Genjutsu. ' +
      'Adaptação Avançada (3º, +1 no 7º/11º/18º): Riposte Ágil, Ataque de Tropeço, Avanço do Sharingan (repetível), Golpe de Manobra, Ataque de Finta.',
    exclusiveJutsuCount: 10,
  },
  {
    id: 'uzumaki',
    name: 'Uzumaki',
    quote: 'A corrente mais forte é aquela tecida pela vida, não pela força.',
    description:
      'Linhagem lendária do País do Redemoinho (destruído); reconhecidos por vitalidade excepcional e dom com Fuinjutsu (selos). Reservas de chakra colossais, força vital tenaz, envelhecem mais devagar.',
    bonuses: { ...zero, constitution: 2, charisma: 1 },
    bonusText: '+2 Constituição, +1 Carisma',
    speed: '9 metros',
    skillProficiencies: ['Controle de Chakra', 'Ninjutsu'],
    featuresText:
      'Uzumaki Hijutsu: conhece 1 Jutsu Rank-D adicional do clã. Técnicas de Selamento Uzumaki: lista exclusiva de jutsus. ' +
      'Mestre em Fuinjutsu (1º): reduz custo de jutsus com palavra-chave Fuinjutsu em −1 (−2 no 7º, −3 no 15º). ' +
      'Fonte de Chakra (1º): +2 no total de PC no 1º nível, +2 adicional a cada nível seguinte. ' +
      'Força Vital Inumana (11º): proficiência em salvaguardas de Constituição (ou dobra o bônus se já proficiente). ' +
      'Fortitude Incompreensível (18º): sucesso automático em uma salvaguarda de Constituição, número de vezes = metade do Mod. Constituição.',
    exclusiveJutsuCount: 6,
  },
  {
    id: 'yamanaka',
    name: 'Yamanaka',
    quote: 'Para compreender o coração alheio, primeiro se deve conhecer o próprio.',
    description:
      'Pilar da tríade Ino-Shika-Chō. Especialistas em técnicas mentais; donos de uma floricultura na vila; lideram tradicionalmente a Equipe de Barreira de Konoha. Especialistas em coleta de inteligência, espionagem, interrogatório.',
    bonuses: { ...zero, charisma: 2, intelligence: 1 },
    bonusText: '+2 Carisma, +1 Inteligência',
    speed: '9 metros',
    skillProficiencies: ['Genjutsu', 'Persuasão'],
    featuresText:
      'Yamanaka Hijutsu: conhece 1 Jutsu Rank-D adicional do clã. Conexões Mentais (1º): conhece o jutsu Transferência de Mente. Técnicas Yamanaka: lista exclusiva de jutsus. ' +
      'Dádiva Mental (3º, mais nos níveis 5º/7º/11º/15º/18º): escolhe entre uma tabela de dádivas (Transferência Adepta, Pensamentos Blindados, Mentalidade Astuta, Mente Desperta, Conexão Bestial, Enganação Sedutora, Sussurros Enfeitiçantes da Loucura, Visão Mental, Deslocamento Massivo, Máscara de Muitas Mentes, Dominação Mental, Mente Esmagadora, Mente Eficiente). ' +
      'Clareza Mental (7º): vantagem em Intuição contra Genjutsu/enganação. Mestre da Alteração Mental (18º): jutsu do clã causa 1d10 de dano psíquico adicional.',
    exclusiveJutsuCount: 7,
  },

  // Os 7 clãs abaixo aparecem apenas no "Sumário da Pontuação de Habilidade" do manual
  // (fonte dos bônus de atributo), sem ficha narrativa, traços progressivos ou lista de
  // jutsus exclusivos no restante do documento. Fichas simplificadas — ver docs/rules/00-observacoes.md.
  {
    id: 'hebi',
    name: 'Hebi',
    description: 'Clã com ficha simplificada: o manual original não traz descrição, traços progressivos ou jutsus exclusivos para este clã, apenas o bônus de atributo.',
    bonuses: { ...zero, strength: 2, constitution: 1 },
    bonusText: '+2 Força, +1 Constituição',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText: 'Sem traços progressivos documentados no manual original.',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'kaguya',
    name: 'Kaguya',
    description: 'Clã com ficha simplificada: o manual original não traz descrição, traços progressivos ou jutsus exclusivos para este clã, apenas o bônus de atributo.',
    bonuses: { ...zero, strength: 2, dexterity: 2, constitution: 1 },
    bonusText: '+2 Força, +2 Destreza, +1 Constituição',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText: 'Sem traços progressivos documentados no manual original.',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'yuki',
    name: 'Yuki',
    description: 'Clã com ficha simplificada: o manual original não traz descrição, traços progressivos ou jutsus exclusivos para este clã, apenas o bônus de atributo.',
    bonuses: { ...zero, dexterity: 2, intelligence: 1 },
    bonusText: '+2 Destreza, +1 Inteligência',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText: 'Sem traços progressivos documentados no manual original.',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'ryu',
    name: 'Ryu',
    description: 'Clã com ficha simplificada: o manual original não traz descrição, traços progressivos ou jutsus exclusivos para este clã, apenas o bônus de atributo.',
    bonuses: { ...zero, intelligence: 2, constitution: 1 },
    bonusText: '+2 Inteligência, +1 Constituição',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText: 'Sem traços progressivos documentados no manual original.',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'kuru',
    name: 'Kuru',
    description: 'Clã com ficha simplificada: o manual original não traz descrição, traços progressivos ou jutsus exclusivos para este clã, apenas o bônus de atributo.',
    bonuses: { ...zero, wisdom: 2, constitution: 1 },
    bonusText: '+2 Sabedoria, +1 Constituição',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText: 'Sem traços progressivos documentados no manual original.',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'hoshigaki',
    name: 'Hoshigaki',
    description: 'Clã com ficha simplificada: o manual original não traz descrição, traços progressivos ou jutsus exclusivos para este clã, apenas o bônus de atributo.',
    bonuses: { ...zero, constitution: 2, strength: 1 },
    bonusText: '+2 Constituição, +1 Força',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText: 'Sem traços progressivos documentados no manual original.',
    exclusiveJutsuCount: 0,
  },
  {
    id: 'tsuchigumo',
    name: 'Tsuchigumo',
    description: 'Clã com ficha simplificada: o manual original não traz descrição, traços progressivos ou jutsus exclusivos para este clã, apenas o bônus de atributo.',
    bonuses: { ...zero, wisdom: 2, dexterity: 1 },
    bonusText: '+2 Sabedoria, +1 Destreza',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText: 'Sem traços progressivos documentados no manual original.',
    exclusiveJutsuCount: 0,
  },
]
