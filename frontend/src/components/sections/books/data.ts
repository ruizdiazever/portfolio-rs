import ImRobotImg from "$lib/assets/books/imrobot.jpeg";
import TheLastWishImg from "$lib/assets/books/thelastwish.webp";
import SwordOfDestinyImg from "$lib/assets/books/swordofdestiny.jpg";
import BloodOfElvesImg from "$lib/assets/books/bloodofelves.jpg";
import DeekSeekImg from "$lib/assets/books/deepseek.png";
import TimeOfContemptImg from "$lib/assets/books/timeofcontempt.jpg";
import BaptismOfFireImg from "$lib/assets/books/baptismoffire.jpg";
import TheTowerOfSwallowsImg from "$lib/assets/books/thetowerofswallows.jpg";
import TheLadyOfTheLakeImg from "$lib/assets/books/theladyofthelake.webp";
import LoveInTheTimeOfColeraImg from "$lib/assets/books/loveinthetimeofcolera.jpg";
import AnimalFarmImg from "$lib/assets/books/animalfarm.jpg";
import TheIllustratedManImg from "$lib/assets/books/theillustratedman.jpg";
import ElonMuskImg from "$lib/assets/books/elonmusk.jpg";
import TheClovenViscountImg from "$lib/assets/books/theclovenviscount.jpg";

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  image: ImageMetadata;
  technical: boolean;
  description: string;
  paper: boolean;
  publishedYear: number;
}

export const books: Book[] = [
  {
    id: 1,
    title: "The Last Wish",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: TheLastWishImg,
    technical: false,
    description:
      "The first book in The Witcher series following monster hunter Geralt of Rivia.",
    paper: false,
    publishedYear: 1993,
  },
  {
    id: 2,
    title: "Sword of Destiny",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: SwordOfDestinyImg,
    technical: false,
    description:
      "The second collection of short stories in The Witcher series.",
    paper: false,
    publishedYear: 1992,
  },
  {
    id: 3,
    title: "Blood of Elves",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: BloodOfElvesImg,
    technical: false,
    description: "The first novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1994,
  },
  {
    id: 4,
    title: "Time of Contempt",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: TimeOfContemptImg,
    technical: false,
    description: "The second novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1995,
  },
  {
    id: 5,
    title: "Baptism of Fire",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: BaptismOfFireImg,
    technical: false,
    description: "The third novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1996,
  },
  {
    id: 6,
    title: "The Tower of Swallows",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: TheTowerOfSwallowsImg,
    technical: false,
    description: "The fourth novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1997,
  },
  {
    id: 7,
    title: "The Lady of the Lake",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: TheLadyOfTheLakeImg,
    technical: false,
    description: "The fifth and final novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1999,
  },
  {
    id: 8,
    title: "Love in the Time of Cholera",
    author: "Gabriel García Márquez",
    genre: "Literary Fiction",
    image: LoveInTheTimeOfColeraImg,
    technical: false,
    description:
      "A love story spanning fifty years, following Florentino Ariza and Fermina Daza.",
    paper: false,
    publishedYear: 1985,
  },
  {
    id: 9,
    title: "Animal Farm",
    author: "George Orwell",
    genre: "Political Satire",
    image: AnimalFarmImg,
    technical: false,
    description:
      "An allegorical novella reflecting events leading up to the Russian Revolution.",
    paper: false,
    publishedYear: 1945,
  },
  {
    id: 10,
    title: "The Illustrated Man",
    author: "Ray Bradbury",
    genre: "Science Fiction",
    image: TheIllustratedManImg,
    technical: false,
    description:
      "A collection of science fiction short stories connected by the frame story of a tattooed man.",
    paper: false,
    publishedYear: 1951,
  },
  {
    id: 11,
    title: "DeepSeek R1",
    author: "DeepSeek Team",
    genre: "Technical Paper",
    image: DeekSeekImg,
    technical: true,
    description:
      "Technical paper describing DeepSeek's R1 model and its approach towards AGI.",
    paper: true,
    publishedYear: 2024,
  },
  {
    id: 12,
    title: "The Cloven Viscount",
    author: "Italo Calvino",
    genre: "Fantasy",
    image: TheClovenViscountImg,
    technical: false,
    description:
      "A fantasy novel about a viscount who is split in two by a cannonball.",
    paper: false,
    publishedYear: 1952,
  },
  {
    id: 13,
    title: "I, Robot",
    author: "Isaac Asimov",
    genre: "Science Fiction",
    image: ImRobotImg,
    technical: false,
    description:
      "A collection of science fiction short stories that established the famous Three Laws of Robotics.",
    paper: false,
    publishedYear: 1950,
  },
  {
    id: 14,
    title: "Elon Musk",
    author: "Ashlee Vance",
    genre: "Biography",
    image: ElonMuskImg,
    technical: true,
    description: "The biography of tech entrepreneur and innovator Elon Musk.",
    paper: false,
    publishedYear: 2023,
  },
];
