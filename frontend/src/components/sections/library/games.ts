export interface Game {
  title: string;
  developer: string;
  genre: string;
  year: number;
  steamAppId: number;
  description: string;
  descriptionZh: string;
}

const STEAM_IMAGE = "https://cdn.akamai.steamstatic.com/steam/apps";

export const steamPoster = (appId: number): string =>
  `${STEAM_IMAGE}/${appId}/library_600x900_2x.jpg`;

export const steamStore = (appId: number): string =>
  `https://store.steampowered.com/app/${appId}/`;

export const games: Game[] = [
  {
    title: "Aperture Desk Job",
    developer: "Valve",
    genre: "Comedy",
    year: 2022,
    steamAppId: 1902490,
    description:
      "A half-hour Steam Deck showcase that is really a Portal comedy. Every button gets a joke and a job.",
    descriptionZh:
      "半小时的 Steam Deck 演示，本质上是一出《传送门》喜剧。每个按键都有一个笑点和一个用途。",
  },
  {
    title: "Firewatch",
    developer: "Campo Santo",
    genre: "Adventure",
    year: 2016,
    steamAppId: 383870,
    description:
      "A summer watching for smoke, and a relationship built over a radio. The landscape carries as much as the dialogue.",
    descriptionZh:
      "一个看火的夏天，一段只靠对讲机建立的关系。风景和对话一样重要。",
  },
  {
    title: "Half-Life 2",
    developer: "Valve",
    genre: "FPS",
    year: 2004,
    steamAppId: 220,
    description:
      "The gravity gun, City 17, and a revolution told without cutscenes. Still the benchmark for first-person pacing.",
    descriptionZh:
      "重力枪、17 号城市，一场不靠过场动画讲述的革命。第一人称节奏的标杆。",
  },
  {
    title: "Half-Life: Alyx",
    developer: "Valve",
    genre: "VR",
    year: 2020,
    steamAppId: 546560,
    description:
      "VR used as a place, not a gimmick. The room-scale tension is the point.",
    descriptionZh:
      "VR 在这里是空间，不是噱头。房间尺度的紧张感才是重点。",
  },
  {
    title: "INSIDE",
    developer: "Playdead",
    genre: "Platformer",
    year: 2016,
    steamAppId: 304430,
    description:
      "A wordless platformer that keeps tightening the frame. The ending refuses to explain itself.",
    descriptionZh:
      "没有一句台词的平台游戏，画面越收越紧。结局拒绝解释自己。",
  },
  {
    title: "LIMBO",
    developer: "Playdead",
    genre: "Platformer",
    year: 2010,
    steamAppId: 48000,
    description:
      "A boy, a forest, and a silhouette that made monochrome feel like a genre.",
    descriptionZh:
      "男孩、森林，一个让黑白剪影成为类型的开场。",
  },
  {
    title: "Mass Effect",
    developer: "BioWare",
    genre: "RPG",
    year: 2007,
    steamAppId: 17460,
    description:
      "A galaxy, a crew, and a conversation system that made choices feel like obligations.",
    descriptionZh:
      "一个星系、一支船员，一套让选择变成责任的对白系统。",
  },
  {
    title: "Portal",
    developer: "Valve",
    genre: "Puzzle",
    year: 2007,
    steamAppId: 400,
    description:
      "A puzzle game that teaches you to think with holes, then lets the comedy do the rest.",
    descriptionZh:
      "用洞来思考的解谜游戏，剩下的交给喜剧。",
  },
  {
    title: "Portal 2",
    developer: "Valve",
    genre: "Puzzle",
    year: 2011,
    steamAppId: 620,
    description:
      "More physics, more history, and the best co-op campaign Valve has shipped.",
    descriptionZh:
      "更多物理、更多历史，以及 Valve 最好的双人合作战役。",
  },
  {
    title: "The Stanley Parable",
    developer: "Galactic Cafe",
    genre: "Narrative",
    year: 2013,
    steamAppId: 221910,
    description:
      "A game about the narrator, about choice, and about you refusing to follow instructions.",
    descriptionZh:
      "一个关于旁白、关于选择，也关于你不愿照做的游戏。",
  },
  {
    title: "The Witcher: Enhanced Edition",
    developer: "CD Projekt Red",
    genre: "RPG",
    year: 2008,
    steamAppId: 20900,
    description:
      "Rough edges, a real witcher's morality, and a story that keeps its promises.",
    descriptionZh:
      "粗糙的边缘、真正的猎魔人道德，以及一个兑现承诺的故事。",
  },
  {
    title: "The Witcher 2: Assassins of Kings Enhanced Edition",
    developer: "CD Projekt Red",
    genre: "RPG",
    year: 2012,
    steamAppId: 20920,
    description:
      "A political thriller with a sword. The choices split the second act in half.",
    descriptionZh:
      "带剑的政治惊悚片。选择会把第二幕劈成两半。",
  },
  {
    title: "The Witcher 3: Wild Hunt, Remastered",
    developer: "CD Projekt Red",
    genre: "RPG",
    year: 2015,
    steamAppId: 292030,
    description:
      "The one where the side quests are the main quest. The remaster makes the world hold up again.",
    descriptionZh:
      "支线就是主线的那个游戏。重制版让这个世界重新站得住。",
  },
];
