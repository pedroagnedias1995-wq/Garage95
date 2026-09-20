import { User, Vehicle, Post, Story, MarketplaceListing, ClubEvent, CommunityGroup, NotificationItem } from '../types';

export const NEUTRAL_USER: User = {
  id: 'neutral-demo-user',
  name: 'Conteúdo de demonstração',
  handle: '@conteudo_demo',
  avatar: '',
  coverImage: '',
  bio: 'Registro estrutural de demonstração sem usuário associado.',
  location: '',
  collectorTier: 'Entusiasta Clássico',
  memberSince: '',
  garageCount: 0,
  followersCount: 0,
  followingCount: 0,
  totalLikes: 0,
  reputationScore: 0,
  verifiedCollector: false,
  friends: []
};

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_1',
    ownerId: 'usr_me',
    ownerName: 'Eduardo Vasconcellos',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    brand: 'Ford',
    model: 'Mustang Fastback GTA 390',
    year: 1967,
    category: 'carro',
    plateType: 'preta',
    engine: 'FE 390 V8 Big Block (6.4L)',
    horsepower: 335,
    transmission: 'C6 Automático SelectShift',
    fuel: 'Gasolina Podium',
    mileage: 48200,
    color: 'Highland Green (Bullitt Spec)',
    zeroToHundred: '6.2 s',
    topSpeed: '215 km/h',
    restorationHistory: 'Restauração completa "frame-off" finalizada em 2022. Lataria tratada por imersão cataforética, tapeçaria original em couro Saddle, instrumentos Smiths recondicionados e certificado de originalidade 98.4 pontos.',
    modifications: [
      'Coletor de admissão Edelbrock Performer',
      'Escapamento duplo Flowmaster American Thunder 2.5"',
      'Ignição eletrônica MSD 6AL oculta no cofre',
      'Radiador de alumínio de 4 colmeias'
    ],
    trophies: [
      '1º Lugar Categoria Americanos - Encontro Paulista de Autos Antigos 2023',
      'Melhor Som de Motor V8 - Track Day Clássicos Interlagos 2024'
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'garage',
    valuationEstimate: 'R$ 480.000',
    chassisMasked: '7R02S******',
    authenticityScore: 98
  },
  {
    id: 'veh_2',
    ownerId: 'usr_me',
    ownerName: 'Eduardo Vasconcellos',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    brand: 'Volkswagen',
    model: 'SP2 1700',
    year: 1974,
    category: 'carro',
    plateType: 'preta',
    engine: '1.7L Boxer 4 Cilindros Dupla Carburação',
    horsepower: 75,
    transmission: 'Manual 4 marchas',
    fuel: 'Gasolina',
    mileage: 36400,
    color: 'Vermelho Granada Metálico',
    zeroToHundred: '14.2 s',
    topSpeed: '161 km/h',
    restorationHistory: 'Ícone supremo do design nacional. Mantido 100% original, incluindo os bancos esportivos em couro canelado e as raras rodas de liga leve originais de época.',
    modifications: ['Totalmente original sem modificações estruturais'],
    trophies: [
      'Troféu Destaque Nacional - Encontro Nacional de Veículos Antigos Araxá 2022'
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'garage',
    valuationEstimate: 'R$ 160.000',
    chassisMasked: 'SP2-004****',
    authenticityScore: 99
  },
  {
    id: 'veh_3',
    ownerId: 'usr_me',
    ownerName: 'Eduardo Vasconcellos',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    brand: 'Chevrolet',
    model: 'Opala SS 4100',
    year: 1976,
    category: 'carro',
    plateType: 'preta',
    engine: '4.1L 6 Cilindros em Linha 250-S',
    horsepower: 171,
    transmission: 'Manual 4 marchas na coluna/assoalho',
    fuel: 'Gasolina',
    mileage: 62000,
    color: 'Laranja Boreal com Faixas Negras SS',
    zeroToHundred: '9.8 s',
    topSpeed: '190 km/h',
    restorationHistory: 'Carburador DFV 446 regulado a laser, tucho mecânico 250-S original de fábrica. Faixas laterais com gabarito GM original.',
    modifications: [
      'Escapamento 6x2 com abafador Mercedes',
      'Volante SS 3 raios original restaurado'
    ],
    trophies: [
      '1º Lugar Opala SS Clássico - Salão de Campinas 2024'
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'garage',
    valuationEstimate: 'R$ 220.000',
    chassisMasked: '5N87E******',
    authenticityScore: 97
  },
  {
    id: 'veh_4',
    ownerId: 'usr_me',
    ownerName: 'Eduardo Vasconcellos',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    brand: 'Puma',
    model: 'GTS Conversível 1600',
    year: 1978,
    category: 'carro',
    plateType: 'preta',
    engine: '1600 Boxer Dupla Carburação Solex 32/34',
    horsepower: 70,
    transmission: 'Manual 4 marchas',
    fuel: 'Gasolina',
    mileage: 41000,
    color: 'Branco Pérola com Capota Marrom Café',
    zeroToHundred: '13.5 s',
    topSpeed: '160 km/h',
    restorationHistory: 'Fibra de vidro íntegra sem trincas, instrumentos Puma VDO originais com grafismo verde, bancos concha esportivos em couro nobuck.',
    modifications: ['Rodas Scorro "Tijolinho" originais de época restauradas'],
    trophies: [],
    coverPhoto: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'garage',
    valuationEstimate: 'R$ 115.000',
    chassisMasked: 'PUMA-GTS-****',
    authenticityScore: 96
  },
  // Vehicles from other collectors
  {
    id: 'veh_5',
    ownerId: 'usr_2',
    ownerName: 'Helena von Sternberg',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    brand: 'Porsche',
    model: '911 Carrera RS 2.7 Lightweight',
    year: 1973,
    category: 'carro',
    plateType: 'preta',
    engine: '2.7L Flat-6 Boxer MFI (MFI Bosch)',
    horsepower: 210,
    transmission: 'Manual Tipo 915 de 5 marchas',
    fuel: 'Gasolina Podium',
    mileage: 51200,
    color: 'Grand Prix White com Faixas Viper Green',
    zeroToHundred: '5.6 s',
    topSpeed: '245 km/h',
    restorationHistory: 'Certificado Porsche Classic com número de motor e chassi batendo (Matching Numbers). Aerofólio rabo de pato (Ducktail) original em fibra.',
    modifications: ['Gaiola de proteção bolt-in histórica FIA'],
    trophies: [
      'Best of Show - Porsche Club Sul 2023',
      'Troféu Elegância - Rali da Serra 2024'
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'garage',
    valuationEstimate: 'R$ 2.400.000',
    chassisMasked: '9113600***',
    authenticityScore: 100
  },
  {
    id: 'veh_6',
    ownerId: 'usr_3',
    ownerName: 'Carlos "Caito" Pires',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    brand: 'Dodge',
    model: 'Charger R/T 440 Magnum',
    year: 1969,
    category: 'carro',
    plateType: 'preta',
    engine: '440ci (7.2L) V8 Magnum Big Block',
    horsepower: 375,
    transmission: 'TorqueFlite 727 Automático 3 marchas',
    fuel: 'Gasolina Octanagem Alta',
    mileage: 55300,
    color: 'Top Banana Yellow com Teto Vinil Preto',
    zeroToHundred: '5.9 s',
    topSpeed: '228 km/h',
    restorationHistory: 'Importado com documentação histórica completa. Grade dianteira com faróis escamoteáveis funcionando perfeitamente a vácuo.',
    modifications: ['Coletores cerâmicos Doug’s Headers', 'Pneus BF Goodrich Radial T/A letras brancas'],
    trophies: ['Campeão Arrancada Clássica Velopark 2023'],
    coverPhoto: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'garage',
    valuationEstimate: 'R$ 550.000',
    chassisMasked: 'XS29L9B******',
    authenticityScore: 98
  },
  {
    id: 'veh_7',
    ownerId: 'usr_4',
    ownerName: 'Pietro Moretti',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    brand: 'Ferrari',
    model: 'Testarossa Monospecchio',
    year: 1986,
    category: 'carro',
    plateType: 'preta',
    engine: '4.9L Flat-12 48 Válvulas Bosch K-Jetronic',
    horsepower: 390,
    transmission: 'Manual 5 marchas Gated Shifter em H',
    fuel: 'Gasolina Podium',
    mileage: 24800,
    color: 'Rosso Corsa com Interior Crema',
    zeroToHundred: '5.2 s',
    topSpeed: '290 km/h',
    restorationHistory: 'Exemplar "Flying Mirror" raro de um espelho único elevado e fixação de roda por cubo rápido central. Revisão de correias em concessionária oficial Ferrari.',
    modifications: ['Sistema de escape Tubi Style em inox polido'],
    trophies: ['Premiação Concorso d’Eleganza Villa d’Este Brasil 2024'],
    coverPhoto: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'garage',
    valuationEstimate: 'R$ 1.950.000',
    chassisMasked: 'ZFFSA17A******',
    authenticityScore: 100
  },
  {
    id: 'veh_8',
    ownerId: 'usr_5',
    ownerName: 'Renata Albuquerque',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    brand: 'Honda',
    model: 'CBX 1050 Super Sport',
    year: 1979,
    category: 'moto',
    plateType: 'preta',
    engine: '1.047cc 6 Cilindros em Linha 24 Válvulas DOHC',
    horsepower: 105,
    transmission: 'Manual 5 marchas',
    fuel: 'Gasolina',
    mileage: 18900,
    color: 'Silver Metallic com Faixas Azuis e Vermelhas',
    zeroToHundred: '4.6 s',
    topSpeed: '225 km/h',
    restorationHistory: 'A lendária "Seis Canecos". Bateria de 6 carburadores Keihin sincronizados por manômetro de mercúrio. Escape 6x2 cromado original intacto.',
    modifications: ['Amortecedores Koni Classic de época'],
    trophies: ['1º Lugar Categoria Duas Rodas - Encontro de Motos Clássicas 2023'],
    coverPhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'garage',
    valuationEstimate: 'R$ 145.000',
    chassisMasked: 'CB1-200****',
    authenticityScore: 99
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'st_1',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[0],
    mediaUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    title: 'Acerto do Carburador Holley 750',
    subtitle: 'Marcha lenta afinada nos 850 RPM! Pronto pro comboio.',
    engineRevAudio: 'v8_rumble',
    timestamp: 'Há 45 min',
    viewed: false
  },
  {
    id: 'st_2',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[4],
    mediaUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    title: 'Subida da Serra da Graciosa',
    subtitle: 'O som do Flat-6 ecoando nas curvas fechadas!',
    engineRevAudio: 'flat6_scream',
    timestamp: 'Há 2 horas',
    viewed: false
  },
  {
    id: 'st_3',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[5],
    mediaUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    title: 'Queima de borracha no dinamômetro',
    subtitle: '440 Magnum cravando 392cv nas rodas traseiras.',
    engineRevAudio: 'mopar_growl',
    timestamp: 'Há 4 horas',
    viewed: false
  },
  {
    id: 'st_4',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[6],
    mediaUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    title: 'Testarossa na Estrada dos Romeiros',
    subtitle: 'A melhor sensação analógica dos anos 80.',
    engineRevAudio: 'v12_symphony',
    timestamp: 'Há 6 horas',
    viewed: false
  },
  {
    id: 'st_5',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[7],
    mediaUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    title: '6 canecos roncando como F1',
    subtitle: 'Sincronização dos Keihin concluída com sucesso.',
    engineRevAudio: 'inline6_f1',
    timestamp: 'Há 7 horas',
    viewed: false
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[0],
    content: 'Manhã de domingo com o Mustang Fastback 1967. Nada substitui o peso da direção mecânica e o borbulhar grave do motor 390 Big Block ecoando nas estradas secundárias de São Paulo. Restaurar cada detalhe original deste carro levou 3 anos, mas cada quilômetro rodado vale cada hora na oficina. Quem aí também coloca os clássicos na estrada todo fim de semana?',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80',
        caption: 'Mustang Fastback 1967 Bullitt Spec - Sol matinal na serra'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=80',
        caption: 'Cofre do FE 390 V8 polido com filtros de época'
      }
    ],
    createdAt: 'Há 2 horas',
    likesCount: 342,
    isLiked: false,
    commentsCount: 28,
    sharesCount: 14,
    hashtags: ['#mustang', '#fastback67', '#v8bigblock', '#bullitt', '#placapreta', '#musclecar'],
    isExclusiveClub: true,
    location: 'Estrada dos Romeiros, SP',
    soundTrackTitle: 'V8 Big Block 390ci Cold Start & Idle',
    comments: [
      {
        id: 'c_1',
        author: {
          id: NEUTRAL_USER.id,
          name: NEUTRAL_USER.name,
          handle: NEUTRAL_USER.handle,
          avatar: NEUTRAL_USER.avatar,
          collectorTier: NEUTRAL_USER.collectorTier
        },
        text: 'Espetacular, Eduardo! Esse tom Highland Green com as rodas originais é a perfeição. Vamos marcar um encontro Mopar vs Ford no próximo mês?',
        createdAt: 'Há 1 hora',
        likesCount: 19
      },
      {
        id: 'c_2',
        author: {
          id: NEUTRAL_USER.id,
          name: NEUTRAL_USER.name,
          handle: NEUTRAL_USER.handle,
          avatar: NEUTRAL_USER.avatar,
          collectorTier: NEUTRAL_USER.collectorTier
        },
        text: 'O alinhamento dos frisos laterais está impecável. Trabalho de restauração nível Concours d’Elegance!',
        createdAt: 'Há 40 min',
        likesCount: 12
      }
    ]
  },
  {
    id: 'post_2',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[4],
    content: 'O 911 Carrera RS 1973 completou hoje 50 anos de história rodando no Track Day de Curitiba. Leveza absoluta (apenas 960 kg), tração traseira viva e o famoso "Ducktail" mantendo a traseira grudada nas curvas rápidas. Carro clássico foi feito para acelerar, não apenas para ficar guardado em redoma de vidro!',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80',
        caption: 'Porsche 911 Carrera RS 2.7 no Autódromo Internacional'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
        caption: 'Cockpit minimalista e volante de competição Momo Prototipo'
      }
    ],
    createdAt: 'Há 5 horas',
    likesCount: 589,
    isLiked: true,
    isSaved: true,
    commentsCount: 45,
    sharesCount: 39,
    hashtags: ['#porsche911', '#carrerars', '#aircooled', '#trackday', '#classicracing', '#luftgekuhlt'],
    isExclusiveClub: false,
    location: 'Autódromo Internacional de Curitiba, PR',
    soundTrackTitle: 'Porsche Flat-6 2.7 MFI at 7200 RPM',
    comments: [
      {
        id: 'c_3',
        author: {
          id: NEUTRAL_USER.id,
          name: NEUTRAL_USER.name,
          handle: NEUTRAL_USER.handle,
          avatar: NEUTRAL_USER.avatar,
          collectorTier: NEUTRAL_USER.collectorTier
        },
        text: 'Uma verdadeira obra de arte sobre rodas, Helena. Essa cor Grand Prix White com verde é a mais lendária da Porsche!',
        createdAt: 'Há 3 horas',
        likesCount: 24
      }
    ]
  },
  {
    id: 'post_3',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[5],
    content: 'Dodge Charger R/T 1969 com motor 440ci Magnum. O som dos 8 cilindros com escape direto e comando esportivo faz o chão tremer no encontro de quinta-feira. Nada se compara ao torque instantâneo da era de ouro de Detroit.',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
        caption: 'Dodge Charger R/T 440 Magnum no Encontro Noturno'
      }
    ],
    createdAt: 'Há 1 dia',
    likesCount: 712,
    isLiked: false,
    commentsCount: 62,
    sharesCount: 51,
    hashtags: ['#dodgecharger', '#mopar', '#440magnum', '#v8power', '#anos60', '#musclecarbr'],
    isExclusiveClub: false,
    location: 'Belo Horizonte, MG',
    soundTrackTitle: 'Chrysler 440 Magnum Cammed Idle Rumble',
    comments: []
  },
  {
    id: 'post_4',
    author: NEUTRAL_USER,
    vehicleTagged: INITIAL_VEHICLES[7],
    content: 'Ouvir uma Honda CBX 1050 6 cilindros cortando giro é o mais próximo que chegamos do som de um carro de Fórmula 1 dos anos 90 em duas rodas. Toda a carburação regulada milimetricamente!',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
        caption: 'Honda CBX 1050 seis cilindros em linha 1979'
      }
    ],
    createdAt: 'Há 2 dias',
    likesCount: 420,
    isLiked: false,
    commentsCount: 31,
    sharesCount: 22,
    hashtags: ['#hondacbx', '#6cilindros', '#motosclassicas', '#cbx1000', '#vintagebike'],
    isExclusiveClub: false,
    location: 'Florianópolis, SC',
    comments: []
  }
];

export const INITIAL_MARKETPLACE: MarketplaceListing[] = [
  {
    id: 'mkt_1',
    seller: NEUTRAL_USER,
    title: '1970 Plymouth Barracuda Gran Coupe 383 V8 Placa Preta',
    category: 'veiculo',
    condition: '100% Original Placa Preta',
    price: 395000,
    currency: 'BRL',
    location: 'Belo Horizonte, MG',
    brand: 'Plymouth',
    model: 'Barracuda Gran Coupe',
    year: 1970,
    description: 'Exemplar raríssimo no Brasil com motor 383 Big Block original, câmbio mecânico Hurst 4 marchas (Pistol Grip) e interior original de fábrica com console central em madeira de nogueira. Certificado de Coleção com 99 pontos pelo Veteran Car Club. Carro de acervo particular.',
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    views: 1420,
    savesCount: 184,
    isSaved: false,
    isFeatured: true,
    specsSummary: {
      'Motor': '383ci V8 Big Block (6.3L)',
      'Potência': '330 cv',
      'Câmbio': 'Hurst 4 Marchas Manual',
      'Quilometragem': '39.800 milhas',
      'Placa': 'Placa Preta de Coleção'
    },
    certificateIncluded: true
  },
  {
    id: 'mkt_2',
    seller: NEUTRAL_USER,
    title: '1974 Volkswagen SP2 1700 Restaurado Concours',
    category: 'veiculo',
    condition: 'Restaurado Concours',
    price: 175000,
    currency: 'BRL',
    location: 'Curitiba, PR',
    brand: 'Volkswagen',
    model: 'SP2',
    year: 1974,
    description: 'Um dos modelos mais aclamados do design automotivo mundial. Restauração concluída em 2023 mantendo todas as especificações e materiais originais. Bancos em couro canelado original, relógio no teto funcionando e rádio Bosch São Francisco de época com Bluetooth oculto.',
    photos: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    views: 2190,
    savesCount: 310,
    isSaved: true,
    isFeatured: true,
    specsSummary: {
      'Motor': '1700 Boxer 4 cil',
      'Potência': '75 cv',
      'Câmbio': 'Manual 4 marchas',
      'Cor': 'Azul Astral Metálico'
    },
    certificateIncluded: true
  },
  {
    id: 'mkt_3',
    seller: NEUTRAL_USER,
    title: 'Jogo de Rodas Fuchs 16x7 e 16x8 Originais Porsche 911 1982',
    category: 'peca',
    condition: 'Restaurado Concours',
    price: 34500,
    currency: 'BRL',
    location: 'São Paulo, SP',
    brand: 'Porsche / Fuchs',
    model: 'Fuchs Forged Alloy Wheels',
    year: 1982,
    description: 'Jogo completo de rodas Fuchs originais forjadas (número de peça Porsche estampado no verso). Pétalas com acabamento anodizado acetinado e bordas polidas no padrão original de fábrica. Sem amassados, trincas ou soldas. Envio com embalagem de madeira especial.',
    photos: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    views: 840,
    savesCount: 92,
    isSaved: false,
    shippingAvailable: true
  },
  {
    id: 'mkt_4',
    seller: NEUTRAL_USER,
    title: '1988 Alfa Romeo 75 Turbo Evoluzione IMSA Heritage',
    category: 'veiculo',
    condition: 'Excelente Estado',
    price: 260000,
    currency: 'BRL',
    location: 'Petrópolis, RJ',
    brand: 'Alfa Romeo',
    model: '75 1.8 Turbo',
    year: 1988,
    description: 'Uma lenda dos ralis e campeonatos de turismo italianos. Distribuição de peso perfeita 50:50 graças ao sistema Transaxle com caixa de câmbio traseira e freios internos (inboard brakes). Motor 1.8 Twin Spark Turbo com intercooler.',
    photos: [
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    views: 1120,
    savesCount: 145,
    isSaved: false,
    certificateIncluded: true
  },
  {
    id: 'mkt_5',
    seller: NEUTRAL_USER,
    title: '1975 Triumph Bonneville T140V 750cc Britânica',
    category: 'veiculo',
    condition: 'Restaurado Concours',
    price: 88000,
    currency: 'BRL',
    location: 'Florianópolis, SC',
    brand: 'Triumph',
    model: 'Bonneville T140V',
    year: 1975,
    description: 'Autêntica café racer britânica com motor 750cc bicilíndrico paralelo, câmbio de 5 marchas com seletor no lado esquerdo. Tanque de combustível em dois tons (Preto e Dourado) com emblemas esmaltados originais.',
    photos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    views: 950,
    savesCount: 88,
    isSaved: false,
    certificateIncluded: true
  },
  {
    id: 'mkt_6',
    seller: NEUTRAL_USER,
    title: 'Quádrupla Carburação Weber 40 DCOE Italiana Original de Época',
    category: 'peca',
    condition: 'Usado Original de Época',
    price: 18500,
    currency: 'BRL',
    location: 'Belo Horizonte, MG',
    brand: 'Weber Bologna',
    model: 'Weber 40 DCOE Tipo 151',
    description: 'Par de carburadores Weber genuínos fabricados em Bolonha, Itália. Acompanha cornetas em alumínio usinado e coletor de admissão para motor 6 cilindros Opala / Dodge Slant 6. Totalmente revisados com diafragmas novos.',
    photos: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    views: 670,
    savesCount: 74,
    isSaved: false,
    shippingAvailable: true
  }
];

export const INITIAL_EVENTS: ClubEvent[] = [
  {
    id: 'evt_1',
    organizer: NEUTRAL_USER,
    title: 'X Concours d’Elegance Campos do Jordão 2026',
    type: 'exposicao',
    date: '14 de Novembro de 2026',
    time: '09:00 - 18:00',
    locationName: 'Parque Capivari & Palácio Boa Vista',
    address: 'Av. Engenheiro Diogo de Carvalho, 1200',
    city: 'Campos do Jordão',
    state: 'SP',
    coordinates: { lat: -22.7394, lng: -45.5914 },
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
    description: 'A mais prestigiada reunião de automóveis clássicos e históricos da América Latina. Julgamento de originalidade por comissão internacional com critérios FIVA, desfile com trajes de época, jantar de gala e premiação com o cobiçado Troféu Best of Show.',
    confirmedAttendees: [
      { user: NEUTRAL_USER, carModel: 'Ford Mustang Fastback GTA 390 1967', confirmedAt: 'Há 3 dias' },
      { user: NEUTRAL_USER, carModel: 'Porsche 911 Carrera RS 1973', confirmedAt: 'Há 2 dias' },
      { user: NEUTRAL_USER, carModel: 'Dodge Charger R/T 1969', confirmedAt: 'Há 1 dia' },
      { user: NEUTRAL_USER, carModel: 'Ferrari Testarossa 1986', confirmedAt: 'Hoje' }
    ],
    interestedCount: 380,
    isRegistered: true,
    checkInAvailable: true,
    entryFee: 'R$ 250 (Expositores) / Gratuito ao público',
    requirements: 'Veículos pré-1990 com índice de originalidade mínimo de 85%',
    schedule: [
      { time: '08:30', title: 'Recepção e Posicionamento dos Veículos', desc: 'Acomodação nos gramados por categoria e época.' },
      { time: '11:00', title: 'Início da Avaliação dos Juízes FIVA', desc: 'Inspeção minuciosa de cofre de motor, chassi e documentação.' },
      { time: '14:30', title: 'Desfile Oficial e Simulação de Elegância', desc: 'Passagem dos finalistas diante do pavilhão de honra.' },
      { time: '17:00', title: 'Cerimônia de Premiação e Best of Show', desc: 'Entrega dos troféus nas categorias Ouro e Prata.' }
    ]
  },
  {
    id: 'evt_2',
    organizer: NEUTRAL_USER,
    title: 'Track Day Clássicos & Históricos em Interlagos',
    type: 'track_day',
    date: '28 de Outubro de 2026',
    time: '08:00 - 17:30',
    locationName: 'Autódromo José Carlos Pace (Interlagos)',
    address: 'Av. Sen. Teotônio Vilela, 261',
    city: 'São Paulo',
    state: 'SP',
    coordinates: { lat: -23.7011, lng: -46.6974 },
    coverImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80',
    description: 'Sinta a emoção de acelerar sua máquina clássica no lendário "S do Senna" e na "Curva do Sol". Baterias divididas por potência e nível de preparação, com instrutores de pilotagem histórica e cronometragem oficial via transponder.',
    confirmedAttendees: [
      { user: NEUTRAL_USER, carModel: 'Porsche 911 Carrera RS', confirmedAt: 'Ontem' },
      { user: NEUTRAL_USER, carModel: 'Mustang Fastback GTA 390', confirmedAt: 'Hoje' }
    ],
    interestedCount: 290,
    isRegistered: true,
    checkInAvailable: false,
    entryFee: 'R$ 850 (Piloto + Carro na Pista)',
    requirements: 'Capacete homologado, cinto em bom estado e extintor no veículo.',
    schedule: [
      { time: '08:00', title: 'Briefing de Segurança e Vistoria Técnica', desc: 'Verificação de freios, pneus e fluidos.' },
      { time: '09:30', title: 'Bateria 1: Clássicos Esportivos Nacionais', desc: 'Pumas, SP2, Opalas e Mavericks na pista.' },
      { time: '11:00', title: 'Bateria 2: Gran Turismo & Importados V8', desc: 'Porsches, Ferraris, Mustangs e Corvettes.' },
      { time: '14:00', title: 'Bateria Aberta e Hot Laps', desc: 'Tomada de tempo individual sem disputa de posição.' }
    ]
  },
  {
    id: 'evt_3',
    organizer: NEUTRAL_USER,
    title: 'Feirão Noturno & Mercado de Peças Raras de Época',
    type: 'feira_pecas',
    date: '05 de Novembro de 2026',
    time: '18:00 - 23:30',
    locationName: 'Pátio Histórico da Estação da Luz',
    address: 'Praça da Luz, 1',
    city: 'São Paulo',
    state: 'SP',
    coordinates: { lat: -23.5356, lng: -46.6347 },
    coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
    description: 'Encontro noturno de compra, venda e troca de autopeças raras, manuais de época, emblemas, rodas de liga de época e memorabilia automotiva. Food trucks de comida artesanal e música rockabilly ao vivo.',
    confirmedAttendees: [
      { user: NEUTRAL_USER, carModel: 'Dodge Dart 1972', confirmedAt: 'Há 5 dias' },
      { user: NEUTRAL_USER, carModel: 'Honda CBX 1050', confirmedAt: 'Há 4 dias' }
    ],
    interestedCount: 510,
    isRegistered: false,
    checkInAvailable: false,
    entryFee: 'Entrada Franca',
    schedule: [
      { time: '18:00', title: 'Abertura das Bancas de Colecionadores', desc: 'Mais de 60 estandes especializados.' },
      { time: '20:30', title: 'Show de Música e Rodada de Negócios', desc: 'Apresentação ao vivo e troca de peças.' }
    ]
  }
];

export const INITIAL_GROUPS: CommunityGroup[] = [
  {
    id: 'grp_1',
    name: 'Muscle Cars & V8 Brasil',
    tagline: 'O templo sagrado dos Big Blocks, Small Blocks e do puro torque americano.',
    description: 'Comunidade dedicada aos amantes de Ford Mustang, Dodge Charger R/T, Chevrolet Camaro, Corvette, Maverick GT e Galaxie. Dicas de preparação mecânica clássica, carburação quádrupla, ignição e encontros de arrancada vintage.',
    bannerUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80',
    category: 'Muscle Cars / V8',
    clubType: 'brand_model',
    visibility: 'public',
    joinMode: 'free',
    memberCount: 4320,
    isMember: true,
    userRole: 'founder',
    founderId: NEUTRAL_USER.id,
    founderName: NEUTRAL_USER.name,
    tags: ['#V8', '#MuscleCar', '#Mopar', '#Ford', '#ChevyBigBlock', '#MaverickGT'],
    targetEra: '1960 - 1979',
    targetBrands: ['Ford', 'Dodge', 'Chevrolet', 'Plymouth', 'Pontiac'],
    postsCount: 1240,
    eventsCount: 18,
    inviteLink: {
      code: 'INV-V8BRASIL-77',
      url: 'https://garagemclub.app/invite/INV-V8BRASIL-77',
      expiresLabel: 'Sem expiração',
      createdAt: '15 de Janeiro de 2026',
      active: true
    },
    rules: [
      'Respeito mútuo entre marcas (rivalidade saudável apenas na pista)',
      'Anúncios de peças somente no fórum específico de Compra e Venda',
      'Fotos de alta resolução e documentação dos projetos de restauração',
      'Proibido qualquer conteúdo comercial não relacionado a clássicos'
    ],
    faqs: [
      {
        id: 'faq_1',
        question: 'Qual a pressão de combustível correta para carburadores Holley / Demon?',
        answer: 'O ideal absoluto para linhas de alimentação de carburadores Holley clássicos é entre 5.5 e 6.5 PSI. Pressões acima de 7 PSI forçam as agulhas da cuba e causam afogamento e queima irregular.'
      },
      {
        id: 'faq_2',
        question: 'Como agendar participação no comboio oficial de arrancada histórica?',
        answer: 'Os comboios são publicados na aba Eventos do clube com pelo menos 10 dias de antecedência. Basta clicar em "Confirmar Presença" e conferir o ponto de encontro no briefing.'
      },
      {
        id: 'faq_3',
        question: 'Posso anunciar peças de reposição de época no clube?',
        answer: 'Sim! Utilize a categoria "Compra e Venda entre Membros" do fórum interno. Não é permitido criar anúncios fora desse espaço.'
      }
    ],
    polls: [
      {
        id: 'poll_1',
        question: 'Qual a configuração de carburação definitiva para um V8 clássico de rua?',
        options: [
          { id: 'opt_1', text: 'Quadrijet Holley 650/750 CFM a vácuo', votes: 142 },
          { id: 'opt_2', text: 'Par de Weber 44 IDF no coletor dual plane', votes: 89 },
          { id: 'opt_3', text: 'Edelbrock AVS2 4 corpos progressiva', votes: 64 },
          { id: 'opt_4', text: 'Injeção eletrônica clássica oculta (Sniper EFI)', votes: 118 }
        ],
        totalVotes: 413,
        userVotedOptionId: 'opt_1',
        isActive: true,
        createdAt: 'Criada há 3 dias'
      },
      {
        id: 'poll_2',
        question: 'Destino preferido para o Grande Rali V8 de Primavera 2026:',
        options: [
          { id: 'p2_opt_1', text: 'Serra do Rio do Rastro (SC)', votes: 230 },
          { id: 'p2_opt_2', text: 'Circuito das Águas Paulista (SP)', votes: 145 },
          { id: 'p2_opt_3', text: 'Estrada Real / Tiradentes (MG)', votes: 198 }
        ],
        totalVotes: 573,
        userVotedOptionId: 'p2_opt_1',
        isActive: false,
        createdAt: 'Encerrada em Agosto 2026'
      }
    ],
    pinnedPoll: {
      id: 'poll_1',
      question: 'Qual a configuração de carburação definitiva para um V8 clássico de rua?',
      options: [
        { id: 'opt_1', text: 'Quadrijet Holley 650/750 CFM a vácuo', votes: 142 },
        { id: 'opt_2', text: 'Par de Weber 44 IDF no coletor dual plane', votes: 89 },
        { id: 'opt_3', text: 'Edelbrock AVS2 4 corpos progressiva', votes: 64 },
        { id: 'opt_4', text: 'Injeção eletrônica clássica oculta (Sniper EFI)', votes: 118 }
      ],
      totalVotes: 413,
      userVotedOptionId: 'opt_1',
      isActive: true
    },
    members: [
      {
        user: NEUTRAL_USER,
        role: 'founder',
        joinedAt: 'Fundador • Jan 2024',
        vehicleInClub: 'Mustang Fastback GTA 390 (1967)'
      },
      {
        user: NEUTRAL_USER, // Carlos Caito Pires
        role: 'moderator',
        joinedAt: 'Fev 2024',
        vehicleInClub: 'Dodge Dart Charger R/T (1975)'
      },
      {
        user: NEUTRAL_USER, // Helena von Sternberg
        role: 'member',
        joinedAt: 'Mar 2024',
        vehicleInClub: 'Porsche 911 Carrera RS (1973)'
      },
      {
        user: NEUTRAL_USER, // Marcelo B.
        role: 'member',
        joinedAt: 'Abr 2024',
        vehicleInClub: 'Chevrolet Opala SS 4100 (1974)'
      },
      {
        user: NEUTRAL_USER, // Ricardo Valente
        role: 'member',
        joinedAt: 'Mai 2024',
        vehicleInClub: 'Honda CBX 1050 (1979)'
      }
    ],
    forumCategories: [
      {
        id: 'cat_mecanica',
        name: 'Mecânica & Restauração',
        description: 'Debates sobre acerto de ponto de ignição, carburação, arrefecimento e usinagem de bloco.',
        topicsCount: 342,
        topics: [
          {
            id: 'top_1',
            categoryId: 'cat_mecanica',
            title: 'Regulagem fina de giclagem para comando de válvulas Bravo 288° em motor Ford 302/390',
            content: 'Pessoal, montei um comando 288 com tuchos mecânicos e carburador Holley 650. Em marcha lenta o vácuo caiu para 11 in-Hg. Qual válvula de potência (Power Valve) vocês recomendam?',
            author: NEUTRAL_USER,
            createdAt: 'Há 4 horas',
            lastActivity: 'Há 18 minutos',
            repliesCount: 14,
            viewsCount: 280,
            isPinned: true,
            replies: [
              {
                id: 'rep_1',
                author: NEUTRAL_USER,
                content: 'Use uma Power Valve de 5.5 ou 4.5 para evitar abertura precoce no trânsito urbano.',
                createdAt: 'Há 1 hora',
                likesCount: 9,
                isLiked: true
              }
            ]
          },
          {
            id: 'top_2',
            categoryId: 'cat_mecanica',
            title: 'Tabela de torque para mancais e bielas de Chrysler 318 LA',
            content: 'Compartilhando a folha técnica de fábrica com os torques recomendados em Nm e Lb-ft com óleo de montagem.',
            author: NEUTRAL_USER,
            createdAt: 'Há 2 dias',
            lastActivity: 'Ontem',
            repliesCount: 8,
            viewsCount: 450,
            replies: []
          }
        ]
      },
      {
        id: 'cat_compra_venda',
        name: 'Compra e Venda entre Membros',
        description: 'Peças originais de época com procedência verificada, manuais e acessórios de coleção.',
        topicsCount: 189,
        topics: [
          {
            id: 'top_3',
            categoryId: 'cat_compra_venda',
            title: '[VENDO] Coletor de Admissão Edelbrock Performer RPM para Ford Small Block 289/302',
            content: 'Peça nova na caixa com acabamento polido, nunca montada. Entrego em mãos nos encontros do clube.',
            author: NEUTRAL_USER,
            createdAt: 'Há 1 dia',
            lastActivity: 'Há 3 horas',
            repliesCount: 6,
            viewsCount: 310,
            replies: []
          }
        ]
      },
      {
        id: 'cat_encontros',
        name: 'Encontros e Comboios',
        description: 'Planejamento de rotas de serra, paradas técnicas e alinhamento de comboios.',
        topicsCount: 95,
        topics: [
          {
            id: 'top_4',
            categoryId: 'cat_encontros',
            title: 'Comboio Noturno para o Pátio da Luz - Sexta-feira 20h',
            content: 'Concentração às 19:30 no Posto Ipiranga da Av. 23 de Maio. Rota segura e ritmo compassado.',
            author: NEUTRAL_USER,
            createdAt: 'Há 6 horas',
            lastActivity: 'Há 30 minutos',
            repliesCount: 22,
            viewsCount: 520,
            isPinned: true,
            replies: []
          }
        ]
      },
      {
        id: 'cat_batepapo',
        name: 'Bate-papo Geral',
        description: 'Histórias de época, fotos de arquivo histórico e discussões abertas sobre a cultura V8.',
        topicsCount: 614,
        topics: [
          {
            id: 'top_5',
            categoryId: 'cat_batepapo',
            title: 'A primeira vez que você ouviu um Big Block cortando giro: onde foi?',
            content: 'Abro o tópico para relembrar as histórias de infância que nos transformaram em entusiastas!',
            author: NEUTRAL_USER,
            createdAt: 'Há 3 dias',
            lastActivity: 'Há 2 horas',
            repliesCount: 47,
            viewsCount: 890,
            replies: []
          }
        ]
      }
    ],
    clubPosts: [
      {
        id: 'cpost_1',
        author: NEUTRAL_USER,
        content: 'Acerto de carburação do Dart Charger concluído na oficina! 385 cv no dinamômetro de rolos e uma resposta imediata na pedaleira.',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
            caption: 'Dodge Dart Charger R/T regulado'
          }
        ],
        createdAt: 'Há 3 horas',
        likesCount: 88,
        isLiked: true,
        commentsCount: 14
      },
      {
        id: 'cpost_2',
        author: NEUTRAL_USER,
        content: 'Limpeza e polimento das tampas de válvulas cromadas FoMoCo do Mustang 390. Detalhes que fazem a diferença em qualquer concurso d\'Elegance.',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80',
            caption: 'Cofre do motor FE 390 V8'
          }
        ],
        createdAt: 'Ontem',
        likesCount: 142,
        isLiked: false,
        commentsCount: 26
      }
    ]
  },
  {
    id: 'grp_2',
    name: 'Aircooled Heritage & Boxer Society',
    tagline: 'Preservando a mística dos motores refrigerados a ar e sua engenharia única.',
    description: 'Espaço para proprietários e admiradores de Porsche 356/911 pré-1998, Volkswagen Fusca, Karmann Ghia, SP2, Kombi Corujinha, Brasília e esportivos artesanais com mecânica Boxer.',
    bannerUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&auto=format&fit=crop&q=80',
    category: 'Aircooled / Boxer',
    clubType: 'brand_model',
    visibility: 'public',
    joinMode: 'approval_required',
    memberCount: 6180,
    isMember: true,
    userRole: 'moderator',
    founderId: NEUTRAL_USER.id,
    founderName: NEUTRAL_USER.name,
    tags: ['#Aircooled', '#Porsche911', '#VWSP2', '#KarmannGhia', '#Fusca', '#Flat4', '#Flat6'],
    targetEra: '1950 - 1990',
    targetBrands: ['Porsche', 'Volkswagen', 'Puma', 'Karmann'],
    postsCount: 2890,
    eventsCount: 32,
    inviteLink: {
      code: 'INV-AIRCOOLED-911',
      url: 'https://garagemclub.app/invite/INV-AIRCOOLED-911',
      expiresLabel: 'Sem expiração',
      createdAt: '01 de Fevereiro de 2026',
      active: true
    },
    rules: [
      'Foco estrito em mecânica refrigerada a ar e chassis originais',
      'Compartilhe manuais técnicos de oficina e esquemas elétricos oficiais',
      'Respeito às diretrizes FIVA e preservação histórica'
    ],
    pendingRequests: [
      {
        id: 'req_1',
        user: NEUTRAL_USER, // Ricardo Valente
        requestedAt: 'Há 2 horas',
        message: 'Gostaria de participar com meu Porsche 914/4 1974 restaurado em processo de placa preta.',
        vehicleModel: 'Porsche 914/4 (1974)',
        status: 'pending'
      }
    ],
    faqs: [
      {
        id: 'faq_boxer_1',
        question: 'Qual a viscosidade de óleo recomendada para Flat-6 em clima tropical?',
        answer: 'Recomenda-se óleo mineral ou semi-sintético de alta viscosidade com alto teor de ZDDP (como 20W-50 com zinco reforçado), para proteger eixos de comando refrigerados a ar.'
      },
      {
        id: 'faq_boxer_2',
        question: 'Como funciona a aprovação de novos membros?',
        answer: 'Como somos um clube com moderação de entrada, a equipe avalia o perfil e os veículos clássicos da garagem do colecionador em até 24 horas.'
      }
    ],
    pinnedPoll: {
      id: 'poll_ac_1',
      question: 'Qual o ápice do design automotivo nacional nos anos 70?',
      options: [
        { id: 'opt_a', text: 'Volkswagen SP2 (1972-1976)', votes: 245 },
        { id: 'opt_b', text: 'Puma GTS / GTE Tubarão', votes: 187 },
        { id: 'opt_c', text: 'Karmann-Ghia TC 145', votes: 94 },
        { id: 'opt_d', text: 'Passat TS 1976', votes: 82 }
      ],
      totalVotes: 608,
      userVotedOptionId: 'opt_a',
      isActive: true
    },
    polls: [
      {
        id: 'poll_ac_1',
        question: 'Qual o ápice do design automotivo nacional nos anos 70?',
        options: [
          { id: 'opt_a', text: 'Volkswagen SP2 (1972-1976)', votes: 245 },
          { id: 'opt_b', text: 'Puma GTS / GTE Tubarão', votes: 187 },
          { id: 'opt_c', text: 'Karmann-Ghia TC 145', votes: 94 },
          { id: 'opt_d', text: 'Passat TS 1976', votes: 82 }
        ],
        totalVotes: 608,
        userVotedOptionId: 'opt_a',
        isActive: true
      }
    ],
    members: [
      {
        user: NEUTRAL_USER,
        role: 'founder',
        joinedAt: 'Fundador • Dez 2023',
        vehicleInClub: 'Porsche 911 Carrera RS 2.7 (1973)'
      },
      {
        user: NEUTRAL_USER,
        role: 'moderator',
        joinedAt: 'Jan 2024',
        vehicleInClub: 'Mustang Fastback / Entusiasta Aircooled'
      },
      {
        user: NEUTRAL_USER,
        role: 'member',
        joinedAt: 'Fev 2024',
        vehicleInClub: 'VW Fusca 1600S Bizorrão'
      }
    ],
    forumCategories: [
      {
        id: 'cat_ac_mecanica',
        name: 'Mecânica & Restauração',
        description: 'Tudo sobre folga de válvulas, sincronismo de carburadores Solex/Zenith e radiadores de óleo.',
        topicsCount: 420,
        topics: []
      },
      {
        id: 'cat_ac_encontros',
        name: 'Encontros e Comboios',
        description: 'Luftgekühlt Brasil, encontros de VW clássicos e encontros de montanha.',
        topicsCount: 110,
        topics: []
      }
    ],
    clubPosts: []
  },
  {
    id: 'grp_3',
    name: 'Puma Club & Esportivos Nacionais Fora de Série',
    tagline: 'A história dourada da indústria automobilística artesanal brasileira.',
    description: 'Dedicado à preservação e valorização dos veículos especiais brasileiros de carroceria em fibra de vidro: Puma (GT, GTE, GTS, GTB), Santa Matilde, Miura, Bianco S, Adamo, Corona e Hofstetter.',
    bannerUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&auto=format&fit=crop&q=80',
    category: 'Nacionais Fora-de-Série',
    clubType: 'specific_model',
    visibility: 'public',
    joinMode: 'free',
    memberCount: 2940,
    isMember: false,
    tags: ['#Puma', '#SantaMatilde', '#Miura', '#BiancoS', '#ForadeSerie', '#CarroceriaFibra'],
    targetEra: '1965 - 1995',
    targetBrands: ['Puma', 'Santa Matilde', 'Miura', 'Bianco'],
    postsCount: 870,
    eventsCount: 12,
    rules: [
      'Cadastre o número do chassi na lista de conservação do clube',
      'Compartilhe técnicas de restauração e polimento de fibra de vidro'
    ],
    forumCategories: [
      {
        id: 'cat_puma_restauracao',
        name: 'Mecânica & Restauração',
        description: 'Recuperação estrutural em fibra, chassis tubulares e alinhamento de painéis.',
        topicsCount: 154,
        topics: []
      }
    ],
    members: []
  },
  {
    id: 'grp_4',
    name: 'Motos Clássicas, Cafe Racers & Two-Stroke Legends',
    tagline: 'Duas rodas, motores carburados e o espírito livre do motociclismo analógico.',
    description: 'Encontros, rotas de fim de semana, peças de reposição e restauração de lendas como Honda 750 Four ("Sete Galo"), CBX 1050 6 cilindros, Yamaha RD 350 "Viúva Negra", Triumph Bonneville e BMW R-Series boxer.',
    bannerUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80',
    category: 'Motos Clássicas',
    clubType: 'general_community',
    visibility: 'public',
    joinMode: 'free',
    memberCount: 3750,
    isMember: false,
    tags: ['#MotosClassicas', '#CBX1000', '#SeteGalo', '#RD350', '#CafeRacer', '#Triumph'],
    targetEra: '1960 - 1995',
    targetBrands: ['Honda', 'Yamaha', 'Triumph', 'BMW Motorrad', 'Norton', 'Ducati'],
    postsCount: 1420,
    eventsCount: 24,
    rules: [
      'Equipamento de segurança obrigatório em todos os passeios do grupo',
      'Pilotagem defensiva e respeito à integridade das motocicletas históricas'
    ],
    forumCategories: [],
    members: []
  },
  {
    id: 'grp_5',
    name: 'Clube do Opala & Caravans 6 Cilindros (SS / Comodoro)',
    tagline: 'A paixão nacional pelo lendário motor 250-S 4100.',
    description: 'Comunidade oficial de proprietários e restauradores da linha Chevrolet Opala e Caravan. Tópicos de acerto de Weber 40/44, tuchos mecânicos, diferencial Dana 44 e originalidade de frisos e estofamentos.',
    bannerUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80',
    category: 'Clássicos Nacionais / 6 Cilindros',
    clubType: 'specific_model',
    visibility: 'public',
    joinMode: 'approval_required',
    memberCount: 5120,
    isMember: false,
    tags: ['#Opala', '#OpalaSS', '#Caravan', '#Motor250S', '#Chevy6', '#Diplomata'],
    targetEra: '1968 - 1992',
    targetBrands: ['Chevrolet', 'GM'],
    postsCount: 3100,
    eventsCount: 29,
    rules: [
      'Respeito à originalidade ou bom gosto em preparações de época',
      'Proibido anúncios sem preço explícito e fotos reais'
    ],
    forumCategories: [],
    members: []
  },
  {
    id: 'grp_6',
    name: 'Scuderia Privée: Big Blocks & High Horsepower Guild',
    tagline: 'Comunidade privada exclusiva para colecionadores e preparadores de alta potência.',
    description: 'Círculo fechado para troca de conhecimento em competições históricas, aquisição de coleções completas e agendamento de track days privados em autódromos fechados. Acesso restrito a membros convidados.',
    bannerUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&auto=format&fit=crop&q=80',
    category: 'Guild Privada de Colecionadores',
    clubType: 'general_community',
    visibility: 'private',
    joinMode: 'approval_required',
    memberCount: 48,
    isMember: true,
    userRole: 'member',
    founderId: NEUTRAL_USER.id,
    founderName: NEUTRAL_USER.name,
    tags: ['#Privado', '#Scuderia', '#BigBlock', '#HighHorsepower', '#PrivateClub'],
    targetEra: '1960 - 1985',
    targetBrands: ['Shelby', 'Ford', 'Dodge', 'Chevrolet', 'Porsche'],
    postsCount: 420,
    eventsCount: 6,
    inviteLink: {
      code: 'INV-SCUDERIA-95',
      url: 'https://garagemclub.app/invite/INV-SCUDERIA-95',
      expiresLabel: 'Sem expiração',
      createdAt: '10 de Janeiro de 2026',
      active: true
    },
    rules: [
      'Sigilo absoluto sobre negociações privadas de acervos',
      'Acesso a track days fechados mediante confirmação antecipada'
    ],
    members: [
      {
        user: NEUTRAL_USER,
        role: 'founder',
        joinedAt: 'Fundador • Jan 2024',
        vehicleInClub: 'Dodge Dart Charger R/T 440'
      },
      {
        user: NEUTRAL_USER,
        role: 'member',
        joinedAt: 'Membro • Fev 2024',
        vehicleInClub: 'Mustang Fastback GTA 390'
      }
    ],
    forumCategories: [
      {
        id: 'cat_priv_track',
        name: 'Track Days Fechados & Telemetria',
        description: 'Datas de autódromos locados com exclusividade e comparativo de telemetria.',
        topicsCount: 18,
        topics: []
      }
    ],
    faqs: []
  },
  {
    id: 'grp_7',
    name: 'Vintage Porsche 356 & Pre-A Society (Invite Only)',
    tagline: 'Círculo fechado para os primeiros esportivos de Zuffenhausen.',
    description: 'Comunidade restrita dedicada exclusivamente aos exemplares 356 Split-Window, Pre-A, Speedster, Carrera GT e 356B/C com matching numbers verificados.',
    bannerUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&auto=format&fit=crop&q=80',
    category: 'Clube Privado 356',
    clubType: 'specific_model',
    visibility: 'private',
    joinMode: 'approval_required',
    memberCount: 22,
    isMember: false,
    tags: ['#Porsche356', '#PreA', '#Speedster', '#MatchingNumbers', '#PrivateClub'],
    targetEra: '1948 - 1965',
    targetBrands: ['Porsche'],
    postsCount: 140,
    eventsCount: 4,
    inviteLink: {
      code: 'INV-PORSCHE-356',
      url: 'https://garagemclub.app/invite/INV-PORSCHE-356',
      expiresLabel: 'Sem expiração',
      createdAt: '01 de Julho de 2026',
      active: true
    },
    rules: [
      'Veículos admitidos somente após autenticação do número de chassi Kardex Porsche.'
    ],
    members: []
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'like',
    sender: NEUTRAL_USER,
    title: 'Curtida no seu Veículo',
    text: 'Helena von Sternberg curtiu as fotos recentes do seu Ford Mustang Fastback GTA 390.',
    timestamp: 'Há 15 minutos',
    read: false,
    targetId: 'veh_1',
    targetType: 'profile'
  },
  {
    id: 'notif_2',
    type: 'marketplace_offer',
    sender: NEUTRAL_USER,
    title: 'Nova Proposta no Marketplace',
    text: 'Carlos "Caito" Pires enviou uma proposta de R$ 32.000 pelo "Jogo de Rodas Fuchs 16x7 e 16x8 Originais".',
    timestamp: 'Há 1 hora',
    read: false,
    targetId: 'mkt_3',
    targetType: 'marketplace'
  },
  {
    id: 'notif_3',
    type: 'event_reminder',
    sender: NEUTRAL_USER,
    title: 'Lembrete de Evento Confirmado',
    text: 'O X Concours d’Elegance Campos do Jordão acontece em breve. O Check-in digital já está liberado!',
    timestamp: 'Há 3 horas',
    read: true,
    targetId: 'evt_1',
    targetType: 'event'
  },
  {
    id: 'notif_4',
    type: 'group_invite',
    sender: NEUTRAL_USER,
    title: 'Recomendação Automática de Comunidade',
    text: 'Identificamos o seu Volkswagen SP2 1974 na garagem. O grupo "Aircooled Heritage & Boxer Society" tem 12 novos membros com SP2!',
    timestamp: 'Ontem',
    read: true,
    targetId: 'grp_2',
    targetType: 'group'
  }
];

INITIAL_VEHICLES.forEach((vehicle) => {
  vehicle.ownerId = NEUTRAL_USER.id;
  vehicle.ownerName = NEUTRAL_USER.name;
  vehicle.ownerAvatar = NEUTRAL_USER.avatar;
});

INITIAL_EVENTS.forEach((event) => {
  event.confirmedAttendees = [];
});

INITIAL_GROUPS.forEach((group) => {
  group.members = [];
  group.pendingRequests = [];
});

export const mockUsers: User[] = [];
export const mockVehicles = INITIAL_VEHICLES;
export const mockPosts = INITIAL_POSTS;
export const mockListings = INITIAL_MARKETPLACE;
export const mockEvents = INITIAL_EVENTS;
export const mockGroups = INITIAL_GROUPS;
export const mockStories = INITIAL_STORIES;
