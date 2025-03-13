// Foundation
import ImRobotImg from "$lib/assets/books/foundation/1_im-robot.jpeg";
import TheCaveOfSteelImg from "$lib/assets/books/foundation/2_the-caves-of-steel.jpg";
import TheNakedSunImg from "$lib/assets/books/foundation/3_the-naked-sun.jpeg";

// Geralt
import TheLastWishImg from "$lib/assets/books/geralt/thelastwish.webp";
import SwordOfDestinyImg from "$lib/assets/books/geralt/swordofdestiny.jpg";
import BloodOfElvesImg from "$lib/assets/books/geralt/bloodofelves.jpg";
import TimeOfContemptImg from "$lib/assets/books/geralt/timeofcontempt.jpg";
import BaptismOfFireImg from "$lib/assets/books/geralt/baptismoffire.jpg";
import TheTowerOfSwallowsImg from "$lib/assets/books/geralt/thetowerofswallows.jpg";
import TheLadyOfTheLakeImg from "$lib/assets/books/geralt/theladyofthelake.webp";
import LoveInTheTimeOfColeraImg from "$lib/assets/books/generic/loveinthetimeofcolera.jpg";

// Generic
import AnimalFarmImg from "$lib/assets/books/generic/animalfarm.jpg";
import TheIllustratedManImg from "$lib/assets/books/generic/theillustratedman.jpg";
import ElonMuskImg from "$lib/assets/books/generic/elonmusk.jpg";
import TheClovenViscountImg from "$lib/assets/books/generic/theclovenviscount.jpg";

// Technical
import DeekSeekImg from "$lib/assets/books/technical/deepseek.png";
import RustAtomicsAndLocksImg from "$lib/assets/books/technical/rustatomicsandlocks.jpg";
import TheRustProgrammingLanguageImg from "$lib/assets/books/technical/therustprogramminglanguage.jpg";
import ZeroToProductionRustImg from "$lib/assets/books/technical/zerotoproductionrust.png";

// Comics
import BatmanTheDarkKnightReturnsImg from "$lib/assets/books/comics/batmanthedarkknightreturns.jpg";
import DoomsdayClockImg from "$lib/assets/books/comics/doomsdayclock.jpg";
import WatchmenImg from "$lib/assets/books/comics/watchmen.jpg";

export interface Book {
  title: string;
  author: string;
  genre: string;
  image: ImageMetadata;
  technical: boolean;
  description: string;
  comic: boolean;
  paper: boolean;
  publishedYear: number;
}

export const books: Book[] = [
  {
    title: "I, Robot",
    author: "Isaac Asimov",
    genre: "Science Fiction",
    comic: false,
    image: ImRobotImg,
    technical: false,
    description:
      "A collection of science fiction short stories that established the famous Three Laws of Robotics.",
    paper: false,
    publishedYear: 1950,
  },
  {
    title: "The Caves of Steel",
    author: "Isaac Asimov",
    genre: "Science Fiction",
    comic: false,
    image: TheCaveOfSteelImg,
    technical: false,
    description:
      "The first Robot series novel featuring detective Elijah Baley",
    paper: false,
    publishedYear: 1954,
  },
  {
    title: "The Naked Sun",
    author: "Isaac Asimov",
    genre: "Science Fiction",
    comic: false,
    image: TheNakedSunImg,
    technical: false,
    description:
      "The second Robot series novel featuring detective Elijah Baley",
    paper: false,
    publishedYear: 1957,
  },

  {
    title: "Love in the Time of Cholera",
    author: "Gabriel García Márquez",
    genre: "Literary Fiction",
    comic: false,
    image: LoveInTheTimeOfColeraImg,
    technical: false,
    description:
      "A love story spanning fifty years, following Florentino Ariza and Fermina Daza.",
    paper: false,
    publishedYear: 1985,
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    genre: "Political Satire",
    comic: false,
    image: AnimalFarmImg,
    technical: false,
    description:
      "An allegorical novella reflecting events leading up to the Russian Revolution.",
    paper: false,
    publishedYear: 1945,
  },
  {
    title: "The Illustrated Man",
    author: "Ray Bradbury",
    genre: "Science Fiction",
    comic: false,
    image: TheIllustratedManImg,
    technical: false,
    description:
      "A collection of science fiction short stories connected by the frame story of a tattooed man.",
    paper: false,
    publishedYear: 1951,
  },
  {
    title: "DeepSeek R1",
    author: "DeepSeek Team",
    genre: "Technical Paper",
    comic: false,
    image: DeekSeekImg,
    technical: true,
    description:
      "Technical paper describing DeepSeek's R1 model and its approach towards AGI.",
    paper: true,
    publishedYear: 2024,
  },
  {
    title: "The Cloven Viscount",
    author: "Italo Calvino",
    genre: "Fantasy",
    comic: false,
    image: TheClovenViscountImg,
    technical: false,
    description:
      "A fantasy novel about a viscount who is split in two by a cannonball.",
    paper: false,
    publishedYear: 1952,
  },

  {
    title: "Elon Musk",
    author: "Ashlee Vance",
    genre: "Biography",
    comic: false,
    image: ElonMuskImg,
    technical: false,
    description: "The biography of tech entrepreneur and innovator Elon Musk.",
    paper: false,
    publishedYear: 2023,
  },
  {
    title: "Rust Atomics and Locks",
    author: "Mara Bos",
    genre: "Technical",
    comic: false,
    image: RustAtomicsAndLocksImg,
    technical: true,
    description: "A deep dive into low-level concurrency in Rust",
    paper: false,
    publishedYear: 2023,
  },
  {
    title: "The Rust Programming Language",
    author: "Steve Klabnik and Carol Nichols",
    genre: "Technical",
    comic: false,
    image: TheRustProgrammingLanguageImg,
    technical: true,
    description: "The official book about the Rust programming language",
    paper: false,
    publishedYear: 2019,
  },
  {
    title: "Zero To Production In Rust",
    author: "Luca Palmieri",
    genre: "Technical",
    comic: false,
    image: ZeroToProductionRustImg,
    technical: true,
    description: "A hands-on introduction to backend development in Rust",
    paper: false,
    publishedYear: 2021,
  },

  {
    title: "Batman: The Dark Knight Returns",
    author: "Frank Miller",
    genre: "Comics",
    comic: true,
    image: BatmanTheDarkKnightReturnsImg,
    technical: false,
    description:
      "An aging Batman comes out of retirement to fight crime once more",
    paper: false,
    publishedYear: 1986,
  },
  {
    title: "Doomsday Clock",
    author: "Geoff Johns",
    genre: "Comics",
    comic: true,
    image: DoomsdayClockImg,
    technical: false,
    description: "A sequel to the original Watchmen series",
    paper: false,
    publishedYear: 2017,
  },
  {
    title: "Watchmen",
    author: "Alan Moore",
    genre: "Comics",
    comic: true,
    image: WatchmenImg,
    technical: false,
    description:
      "A groundbreaking graphic novel that deconstructs the superhero genre",
    paper: false,
    publishedYear: 1986,
  },
  {
    title: "The Last Wish",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: TheLastWishImg,
    comic: false,
    technical: false,
    description:
      "The first book in The Witcher series following monster hunter Geralt of Rivia.",
    paper: false,
    publishedYear: 1993,
  },
  {
    title: "Sword of Destiny",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    image: SwordOfDestinyImg,
    comic: false,
    technical: false,
    description:
      "The second collection of short stories in The Witcher series.",
    paper: false,
    publishedYear: 1992,
  },
  {
    title: "Blood of Elves",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    comic: false,
    image: BloodOfElvesImg,
    technical: false,
    description: "The first novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1994,
  },
  {
    title: "Time of Contempt",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    comic: false,
    image: TimeOfContemptImg,
    technical: false,
    description: "The second novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1995,
  },
  {
    title: "Baptism of Fire",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    comic: false,
    image: BaptismOfFireImg,
    technical: false,
    description: "The third novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1996,
  },
  {
    title: "The Tower of Swallows",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    comic: false,
    image: TheTowerOfSwallowsImg,
    technical: false,
    description: "The fourth novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1997,
  },
  {
    title: "The Lady of the Lake",
    author: "Andrzej Sapkowski",
    genre: "Fantasy",
    comic: false,
    image: TheLadyOfTheLakeImg,
    technical: false,
    description: "The fifth and final novel in the main Witcher saga.",
    paper: false,
    publishedYear: 1999,
  },
];
