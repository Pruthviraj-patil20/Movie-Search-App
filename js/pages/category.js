/**
 * ============================================================================
 * CineSphere Movie Categories Controller
 * Technology: Vanilla JavaScript (ES Modules)
 * Features:
 *  - 8 Visual Category Cards: Bollywood, Hollywood, Hindi Movies,
 *    English Movies, South Indian Movies, Web Series, Trending, Top Rated
 *  - Interactive Click Handlers & Smooth Transition
 *  - Clean Responsive Movie Grid with Poster, Title, Release Year, and Rating
 *  - Search & Sorting within the selected category
 *  - Complete Fallback Sample Dataset (Zero-failure guarantee)
 * ============================================================================
 */

import { CONFIG } from '../config.js';
import { createMovieCard } from '../components/movieCard.js';
import { modal } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { watchlistService } from '../services/watchlistService.js';
import { getUrlParam, setUrlParam } from '../utils/urlParams.js';
import { debounce } from '../utils/debounce.js';
import { getImageUrl, getBackdropUrl } from '../utils/helpers.js';

// ============================================================================
// 1. Comprehensive Sample Movie Dataset (Organized by 8 Categories)
// ============================================================================
export const CATEGORY_DATA = {
  bollywood: {
    id: 'bollywood',
    title: 'Bollywood',
    subtitle: 'Blockbusters & Cinema',
    icon: '🇮🇳',
    bg: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 975069,
        title: 'Dangal',
        year: '2016',
        release_date: '2016-12-23',
        vote_average: 8.4,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
        overview: 'Mahavir Singh Phogat and his two daughters struggle and make their way to wrestling glory at the Commonwealth Games.'
      },
      {
        id: 346428,
        title: 'Sanju',
        year: '2018',
        release_date: '2018-06-29',
        vote_average: 7.6,
        genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'Biography' }],
        poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
        overview: 'The compelling biography of film star Sanjay Dutt, his triumphs, controversies, and personal battles.'
      },
      {
        id: 181498,
        title: 'Padmaavat',
        year: '2018',
        release_date: '2018-01-25',
        vote_average: 7.5,
        genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
        poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        overview: 'Queen Padmavati of Mewar is caught in the midst of a fierce battle between two mighty rulers.'
      },
      {
        id: 15501,
        title: 'Bajrangi Bhaijaan',
        year: '2015',
        release_date: '2015-07-17',
        vote_average: 8.1,
        genres: [{ id: 18, name: 'Drama' }, { id: 12, name: 'Adventure' }],
        poster_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
        overview: 'A compassionate Indian man embarks on a heartfelt mission to reunite a mute Pakistani girl with her family.'
      },
      {
        id: 20453,
        title: '3 Idiots',
        year: '2009',
        release_date: '2009-12-25',
        vote_average: 8.5,
        genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
        overview: 'Two college friends search for their long-lost companion while reminiscing about their innovative student days.'
      },
      {
        id: 872906,
        title: 'Jawan',
        year: '2023',
        release_date: '2023-09-07',
        vote_average: 7.9,
        genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
        poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        overview: 'A man driven by a personal vendetta seeks to right the wrongs in society while keeping a promise made years ago.'
      },
      {
        id: 864692,
        title: 'Pathaan',
        year: '2023',
        release_date: '2023-01-25',
        vote_average: 7.4,
        genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
        poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        overview: 'An exiled RAW field operative teams up with an intelligence agent to take down a rogue private terror group.'
      },
      {
        id: 493529,
        title: 'Brahmāstra: Part One – Shiva',
        year: '2022',
        release_date: '2022-09-09',
        vote_average: 7.2,
        genres: [{ id: 14, name: 'Fantasy' }, { id: 28, name: 'Action' }],
        poster_path: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80',
        overview: 'A young man on the brink of falling in love finds his world turned upside down when he learns of his special power.'
      }
    ]
  },

  hollywood: {
    id: 'hollywood',
    title: 'Hollywood',
    subtitle: 'Studio Spectacles',
    icon: '🎬',
    bg: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 27205,
        title: 'Inception',
        year: '2010',
        release_date: '2010-07-15',
        vote_average: 8.4,
        genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
        poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        overview: 'A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.'
      },
      {
        id: 157336,
        title: 'Interstellar',
        year: '2014',
        release_date: '2014-11-05',
        vote_average: 8.4,
        genres: [{ id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
        poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.'
      },
      {
        id: 155,
        title: 'The Dark Knight',
        year: '2008',
        release_date: '2008-07-16',
        vote_average: 8.5,
        genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }],
        poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        overview: 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest tests.'
      },
      {
        id: 693134,
        title: 'Dune: Part Two',
        year: '2024',
        release_date: '2024-02-27',
        vote_average: 8.2,
        genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
        poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
      },
      {
        id: 872585,
        title: 'Oppenheimer',
        year: '2023',
        release_date: '2023-07-19',
        vote_average: 8.1,
        genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
        poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        overview: 'The story of J. Robert Oppenheimer role in the development of the atomic bomb during World War II.'
      },
      {
        id: 569094,
        title: 'Spider-Man: Across the Spider-Verse',
        year: '2023',
        release_date: '2023-05-31',
        vote_average: 8.4,
        genres: [{ id: 16, name: 'Animation' }, { id: 28, name: 'Action' }],
        poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence.'
      },
      {
        id: 76600,
        title: 'Avatar: The Way of Water',
        year: '2022',
        release_date: '2022-12-14',
        vote_average: 7.7,
        genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
        poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        overview: 'Jake Sully lives with his newfound family on the planet Pandora until an ancient threat returns.'
      },
      {
        id: 361743,
        title: 'Top Gun: Maverick',
        year: '2022',
        release_date: '2022-05-24',
        vote_average: 8.2,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        overview: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator and training a new detachment.'
      }
    ]
  },

  'hindi-movies': {
    id: 'hindi-movies',
    title: 'Hindi Movies',
    subtitle: 'Classic & Modern Cinema',
    icon: '🎭',
    bg: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 111101,
        title: 'Sholay',
        year: '1975',
        release_date: '1975-08-15',
        vote_average: 8.3,
        genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
        poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        overview: 'After his family is murdered by a ruthless bandit, a former police officer enlists the help of two convicts to capture him.'
      },
      {
        id: 111102,
        title: 'Lagaan: Once Upon a Time in India',
        year: '2001',
        release_date: '2001-06-15',
        vote_average: 8.1,
        genres: [{ id: 18, name: 'Drama' }, { id: 12, name: 'Adventure' }],
        poster_path: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
        overview: 'Villagers in Victorian India stake their future on a game of cricket against ruthless British army officers.'
      },
      {
        id: 111103,
        title: 'Taare Zameen Par',
        year: '2007',
        release_date: '2007-12-21',
        vote_average: 8.4,
        genres: [{ id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }],
        poster_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        overview: 'An unconventional art teacher helps an eight-year-old boy with dyslexia uncover his true potential and inner spark.'
      },
      {
        id: 111104,
        title: 'Andhadhun',
        year: '2018',
        release_date: '2018-10-05',
        vote_average: 8.2,
        genres: [{ id: 53, name: 'Thriller' }, { id: 35, name: 'Comedy' }],
        poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        overview: 'A series of mysterious events unfold in the life of a blind pianist who must report a murder he never saw.'
      },
      {
        id: 111105,
        title: 'PK',
        year: '2014',
        release_date: '2014-12-19',
        vote_average: 8.1,
        genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
        overview: 'An alien on Earth loses the device he can use to communicate with his spaceship and questions human beliefs.'
      },
      {
        id: 111106,
        title: 'Zindagi Na Milegi Dobara',
        year: '2011',
        release_date: '2011-07-15',
        vote_average: 8.2,
        genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        overview: 'Three friends embark on a three-week road trip in Spain, facing their deepest fears and discovering the joy of life.'
      }
    ]
  },

  'english-movies': {
    id: 'english-movies',
    title: 'English Movies',
    subtitle: 'Global Masterpieces',
    icon: '🌍',
    bg: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 278,
        title: 'The Shawshank Redemption',
        year: '1994',
        release_date: '1994-09-23',
        vote_average: 8.7,
        genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
        poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
        overview: 'Imprisoned in the 1940s, banker Andy Dufresne begins a new life and creates lasting hope behind bars.'
      },
      {
        id: 680,
        title: 'Pulp Fiction',
        year: '1994',
        release_date: '1994-09-10',
        vote_average: 8.5,
        genres: [{ id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }],
        poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        overview: 'A burger-loving hit man, a philosophical partner, and a gangster moll collide in unexpected criminal capers.'
      },
      {
        id: 550,
        title: 'Fight Club',
        year: '1999',
        release_date: '1999-10-15',
        vote_average: 8.4,
        genres: [{ id: 18, name: 'Drama' }],
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something more.'
      },
      {
        id: 603,
        title: 'The Matrix',
        year: '1999',
        release_date: '1999-03-30',
        vote_average: 8.2,
        genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
        poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
      },
      {
        id: 98,
        title: 'Gladiator',
        year: '2000',
        release_date: '2000-05-01',
        vote_average: 8.2,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: '/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
        overview: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.'
      },
      {
        id: 299534,
        title: 'Avengers: Endgame',
        year: '2019',
        release_date: '2019-04-24',
        vote_average: 8.3,
        genres: [{ id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
        poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        overview: 'After the devastating events of Infinity War, the universe is in ruins and the remaining Avengers assemble once more.'
      }
    ]
  },

  'south-indian': {
    id: 'south-indian',
    title: 'South Indian Movies',
    subtitle: 'Tollywood, Kollywood & More',
    icon: '🌴',
    bg: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 721814,
        title: 'RRR',
        year: '2022',
        release_date: '2022-03-24',
        vote_average: 8.2,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
        overview: 'A fearless warrior and an ambitious British officer build an unbreakable bond before fighting for freedom.'
      },
      {
        id: 763419,
        title: 'Pushpa: The Rise',
        year: '2021',
        release_date: '2021-12-17',
        vote_average: 7.6,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        overview: 'A coolie rises through the ranks of a red sandalwood smuggling syndicate, sparking fierce rivalries.'
      },
      {
        id: 828601,
        title: 'Kantara',
        year: '2022',
        release_date: '2022-09-30',
        vote_average: 8.2,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80',
        overview: 'When greed paves the way for betrayal, a tribal youth steps up to defend his community sacred ancestral forest.'
      },
      {
        id: 692644,
        title: 'Vikram Vedha',
        year: '2017',
        release_date: '2017-09-28',
        vote_average: 8.0,
        genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
        poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        overview: 'A straight-arrow police officer sets out to hunt down and kill a notorious gangster, leading to moral ambiguities.'
      },
      {
        id: 597135,
        title: 'Drishyam',
        year: '2013',
        release_date: '2013-10-06',
        vote_average: 8.4,
        genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
        poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
        overview: 'A simple cable operator creates an airtight alibi to protect his beloved family from the wrath of law.'
      },
      {
        id: 499932,
        title: 'K.G.F: Chapter 2',
        year: '2022',
        release_date: '2022-04-14',
        vote_average: 8.1,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        overview: 'In the blood-soaked Kolar Gold Fields, Rocky name strikes fear into his foes while he builds an empire.'
      }
    ]
  },

  'web-series': {
    id: 'web-series',
    title: 'Web Series',
    subtitle: 'Binge-Worthy Epics',
    icon: '📺',
    bg: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 66732,
        title: 'Stranger Things',
        year: '2016',
        release_date: '2016-07-15',
        vote_average: 8.6,
        genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }],
        poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.'
      },
      {
        id: 1396,
        title: 'Breaking Bad',
        year: '2008',
        release_date: '2008-01-20',
        vote_average: 8.9,
        genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
        poster_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine.'
      },
      {
        id: 1399,
        title: 'Game of Thrones',
        year: '2011',
        release_date: '2011-04-17',
        vote_average: 8.4,
        genres: [{ id: 18, name: 'Drama' }, { id: 14, name: 'Fantasy' }],
        poster_path: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80',
        overview: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after millennia.'
      },
      {
        id: 79744,
        title: 'Sacred Games',
        year: '2018',
        release_date: '2018-07-06',
        vote_average: 8.5,
        genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Crime' }],
        poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        overview: 'A link in their pasts leads an honest cop to a fugitive gang boss whose cryptic warning spurs a fight to save Mumbai.'
      },
      {
        id: 87108,
        title: 'The Boys',
        year: '2019',
        release_date: '2019-07-26',
        vote_average: 8.4,
        genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }],
        poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        overview: 'A fun and irreverent take on what happens when superheroes abuse their superpowers rather than use them for good.'
      },
      {
        id: 71446,
        title: 'Money Heist (La Casa de Papel)',
        year: '2017',
        release_date: '2017-05-02',
        vote_average: 8.2,
        genres: [{ id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
        overview: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history at the Royal Mint.'
      }
    ]
  },

  trending: {
    id: 'trending',
    title: 'Trending',
    subtitle: 'Hottest Right Now',
    icon: '🔥',
    bg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 693134,
        title: 'Dune: Part Two',
        year: '2024',
        release_date: '2024-02-27',
        vote_average: 8.2,
        genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
        poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge on those who destroyed his family.'
      },
      {
        id: 872585,
        title: 'Oppenheimer',
        year: '2023',
        release_date: '2023-07-19',
        vote_average: 8.1,
        genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
        poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        overview: 'The story of J. Robert Oppenheimer role in the Manhattan Project.'
      },
      {
        id: 634649,
        title: 'Spider-Man: No Way Home',
        year: '2021',
        release_date: '2021-12-15',
        vote_average: 8.0,
        genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
        poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        overview: 'Peter Parker seeks the help of Doctor Strange when his secret identity is exposed to the whole world.'
      },
      {
        id: 603692,
        title: 'John Wick: Chapter 4',
        year: '2023',
        release_date: '2023-03-22',
        vote_average: 7.8,
        genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
        poster_path: '/vZloFAK7NKnMGKEslUsZ2VoJ7bB.jpg',
        overview: 'With the bounty on his head soaring, legendary hitman John Wick takes the fight global against the High Table.'
      },
      {
        id: 414906,
        title: 'The Batman',
        year: '2022',
        release_date: '2022-03-01',
        vote_average: 7.7,
        genres: [{ id: 80, name: 'Crime' }, { id: 9648, name: 'Mystery' }],
        poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City while pursuing the Riddler.'
      },
      {
        id: 721814,
        title: 'RRR',
        year: '2022',
        release_date: '2022-03-24',
        vote_average: 8.2,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
        overview: 'Two revolutionaries forge a friendship in 1920s India and unite against colonial oppressors.'
      }
    ]
  },

  'top-rated': {
    id: 'top-rated',
    title: 'Top Rated',
    subtitle: 'All-Time Greatest',
    icon: '⭐',
    bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 238,
        title: 'The Godfather',
        year: '1972',
        release_date: '1972-03-14',
        vote_average: 8.7,
        genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
        poster_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.'
      },
      {
        id: 278,
        title: 'The Shawshank Redemption',
        year: '1994',
        release_date: '1994-09-23',
        vote_average: 8.7,
        genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
        poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
        overview: 'Framed in the 1940s for double murder, upstanding banker Andy Dufresne discovers resilience and friendship.'
      },
      {
        id: 155,
        title: 'The Dark Knight',
        year: '2008',
        release_date: '2008-07-16',
        vote_average: 8.5,
        genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }],
        poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        overview: 'Batman raises the stakes in his war on crime when the sadistic criminal known as the Joker emerges.'
      },
      {
        id: 424,
        title: 'Schindler List',
        year: '1993',
        release_date: '1993-12-15',
        vote_average: 8.6,
        genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
        poster_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        overview: 'In German-occupied Poland during WWII, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.'
      },
      {
        id: 496243,
        title: 'Parasite',
        year: '2019',
        release_date: '2019-05-30',
        vote_average: 8.5,
        genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
        poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        overview: 'All unemployed, a family takes peculiar interest in a glamorous wealthy household until chaos unravels.'
      },
      {
        id: 27205,
        title: 'Inception',
        year: '2010',
        release_date: '2010-07-15',
        vote_average: 8.4,
        genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
        poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        overview: 'A thief who steals corporate secrets through dream-sharing is offered a chance to have his criminal history erased.'
      }
    ]
  },

  'tamil-movies': {
    id: 'tamil-movies',
    title: 'Tamil Movies',
    subtitle: 'Kollywood Powerhouses',
    icon: '🎬',
    bg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 755566,
        title: 'Vikram',
        year: '2022',
        release_date: '2022-06-03',
        vote_average: 8.3,
        genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
        poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        overview: 'A high-octane special black-ops squad led by Amar investigates a series of murders committed by a masked vigilante group.'
      },
      {
        id: 969492,
        title: 'Leo',
        year: '2023',
        release_date: '2023-10-19',
        vote_average: 7.8,
        genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],
        poster_path: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
        overview: 'A calm animal rescuer and cafe owner in Himachal Pradesh becomes the target of ruthless gangsters.'
      },
      {
        id: 987917,
        title: 'Jailer',
        year: '2023',
        release_date: '2023-08-10',
        vote_average: 7.7,
        genres: [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }],
        poster_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        overview: 'Muthuvel Pandian, a retired strict prison warden, comes out of retirement to protect his family.'
      },
      {
        id: 692644,
        title: 'Vikram Vedha',
        year: '2017',
        release_date: '2017-09-28',
        vote_average: 8.2,
        genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
        poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        overview: 'A straight-arrow police officer sets out to hunt down and kill a notorious gangster, leading to moral dilemmas.'
      },
      {
        id: 633190,
        title: 'Kaithi',
        year: '2019',
        release_date: '2019-10-25',
        vote_average: 8.4,
        genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
        poster_path: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80',
        overview: 'A recently released prisoner drives a lorry full of poisoned cops through hostile gangster territory to meet his daughter.'
      },
      {
        id: 554600,
        title: 'Ponniyin Selvan: Part 1',
        year: '2022',
        release_date: '2022-09-30',
        vote_average: 7.9,
        genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
        overview: 'Vandiyathevan sets out on a perilous mission across the Chola kingdom amidst brewing conspiracies.'
      }
    ]
  },

  'marathi-movies': {
    id: 'marathi-movies',
    title: 'Marathi Movies',
    subtitle: 'Acclaimed & Blockbusters',
    icon: '🚩',
    bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    movies: [
      {
        id: 395990,
        title: 'Sairat',
        year: '2016',
        release_date: '2016-04-29',
        vote_average: 8.3,
        genres: [{ id: 18, name: 'Drama' }, { id: 10749, name: 'Romance' }],
        poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        overview: 'In rural Maharashtra, a passionate son of a fisherman falls in love with a wealthy politician daughter.'
      },
      {
        id: 376288,
        title: 'Natsamrat',
        year: '2016',
        release_date: '2016-01-01',
        vote_average: 8.9,
        genres: [{ id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        overview: 'A retired Shakespearean stage actor and his devoted wife face rejection and heartbreak from their grown children.'
      },
      {
        id: 367683,
        title: 'Katyar Kaljat Ghusali',
        year: '2015',
        release_date: '2015-11-12',
        vote_average: 8.5,
        genres: [{ id: 18, name: 'Drama' }, { id: 10402, name: 'Musical' }],
        poster_path: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
        overview: 'A clash of artistic egos and classical ragas erupts between two royal court singers in a duel for prestige.'
      },
      {
        id: 1148281,
        title: 'Baipan Bhaari Deva',
        year: '2023',
        release_date: '2023-06-30',
        vote_average: 8.0,
        genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
        poster_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        overview: 'Six estranged sisters reunite to participate in a traditional dance competition, rediscovering their bond.'
      },
      {
        id: 1048821,
        title: 'Ved',
        year: '2022',
        release_date: '2022-12-30',
        vote_average: 7.6,
        genres: [{ id: 18, name: 'Drama' }, { id: 10749, name: 'Romance' }],
        poster_path: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
        overview: 'A former cricketer dealing with addiction and lost love finds hope and redemption through marriage.'
      },
      {
        id: 33719,
        title: 'Harishchandrachi Factory',
        year: '2009',
        release_date: '2009-10-30',
        vote_average: 8.4,
        genres: [{ id: 36, name: 'Biography' }, { id: 35, name: 'Comedy' }],
        poster_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        overview: 'The inspiring story of Dadasaheb Phalke struggle and perseverance to make India first motion picture.'
      }
    ]
  }
};

// List of all category keys in order
const CATEGORY_KEYS = [
  'hindi-movies',
  'tamil-movies',
  'marathi-movies',
  'bollywood',
  'hollywood',
  'south-indian',
  'web-series',
  'trending',
  'top-rated'
];

let activeCategoryId = 'bollywood';
let searchQuery = '';
let sortBy = 'popular';

// ============================================================================
// 2. Controller Initialization
// ============================================================================
export function initCategoryPage() {
  const cardsContainer = document.querySelector('#category-cards-grid');
  const gridMount = document.querySelector('#category-movies-grid');
  const activeTitle = document.querySelector('#category-active-title');
  const activeBadge = document.querySelector('#category-active-badge');
  const searchInput = document.querySelector('#category-search-input');
  const sortSelect = document.querySelector('#category-sort-select');
  const totalCountBadge = document.querySelector('#category-total-badge');

  if (!gridMount) return;

  // 1. Check initial category from URL (?cat=...) or default to 'bollywood'
  const paramCat = (getUrlParam('cat') || getUrlParam('category') || 'bollywood').toLowerCase();
  if (CATEGORY_DATA[paramCat]) {
    activeCategoryId = paramCat;
  }

  // 2. Render the 8 Interactive Category Cards
  renderCategoryCards();

  // 3. Setup In-Category Search
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderMoviesGrid();
    }, 200));
  }

  // 4. Setup Sorting Selector
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderMoviesGrid();
    });
  }

  // 5. Initial Render of Selected Category
  renderMoviesGrid();

  // --------------------------------------------------------------------------
  // Category Cards Generator
  // --------------------------------------------------------------------------
  function renderCategoryCards() {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';

    CATEGORY_KEYS.forEach(key => {
      const data = CATEGORY_DATA[key];
      if (!data) return;

      const card = document.createElement('div');
      card.className = `category-card ${key === activeCategoryId ? 'active' : ''}`;
      card.dataset.category = key;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View ${data.title} category`);

      card.innerHTML = `
        <div class="category-card-bg" style="background-image: url('${data.bg}');"></div>
        <div class="category-card-overlay"></div>
        
        <div class="category-card-top">
          <span class="category-card-icon">${data.icon}</span>
          <span class="category-card-count">${data.movies.length} Movies</span>
        </div>

        <div class="category-card-content">
          <h3 class="category-card-title">${data.title}</h3>
          <span class="category-card-subtitle">${data.subtitle}</span>
        </div>
      `;

      // Click Event to switch category
      const selectCategory = () => {
        if (activeCategoryId === key) return;
        activeCategoryId = key;
        setUrlParam('cat', key);

        // Update active class on all cards
        cardsContainer.querySelectorAll('.category-card').forEach(c => {
          c.classList.toggle('active', c.dataset.category === key);
        });

        // Reset search input & query on tab switch for fresh view
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
        }

        renderMoviesGrid();
      };

      card.addEventListener('click', selectCategory);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCategory();
        }
      });

      cardsContainer.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // Movie Grid Renderer
  // --------------------------------------------------------------------------
  function renderMoviesGrid() {
    const categoryInfo = CATEGORY_DATA[activeCategoryId] || CATEGORY_DATA.bollywood;
    let movies = [...categoryInfo.movies];

    // Filter by search query
    if (searchQuery) {
      movies = movies.filter(m => 
        (m.title && m.title.toLowerCase().includes(searchQuery)) ||
        (m.overview && m.overview.toLowerCase().includes(searchQuery)) ||
        (m.year && m.year.toString().includes(searchQuery))
      );
    }

    // Sort movies
    if (sortBy === 'rating.desc') {
      movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortBy === 'release.desc') {
      movies.sort((a, b) => (b.release_date || b.year || '').toString().localeCompare((a.release_date || a.year || '').toString()));
    } else if (sortBy === 'release.asc') {
      movies.sort((a, b) => (a.release_date || a.year || '').toString().localeCompare((b.release_date || b.year || '').toString()));
    } else if (sortBy === 'title.asc') {
      movies.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    // Update Header Labels
    if (activeTitle) {
      activeTitle.textContent = `${categoryInfo.icon} ${categoryInfo.title}`;
    }
    if (activeBadge) {
      activeBadge.textContent = `${movies.length} of ${categoryInfo.movies.length} Titles`;
    }
    if (totalCountBadge) {
      totalCountBadge.textContent = `${categoryInfo.title} (${movies.length})`;
    }

    // 1. Render Featured Movie Banner
    const bannerMount = document.querySelector('#category-banner-mount');
    if (bannerMount && categoryInfo.movies.length > 0) {
      const featuredMovie = movies.length > 0 ? movies[0] : categoryInfo.movies[0];
      renderFeaturedBanner(bannerMount, featuredMovie, categoryInfo);
    }

    // 2. Render Grid Cards
    gridMount.innerHTML = '';

    if (movies.length === 0) {
      gridMount.innerHTML = `
        <div class="category-empty-state">
          <div class="category-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3 class="category-empty-title">No movies match "${searchQuery}"</h3>
          <p class="category-empty-text">Try searching for a different title, year, or clear the search filter.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="clear-search-btn">Clear Filter</button>
        </div>
      `;

      const clearBtn = gridMount.querySelector('#clear-search-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          renderMoviesGrid();
        });
      }
      return;
    }

    movies.forEach(movie => {
      const card = createMovieCard(movie);
      if (card) {
        gridMount.appendChild(card);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Featured Movie Banner Renderer
  // --------------------------------------------------------------------------
  function renderFeaturedBanner(container, movie, categoryInfo) {
    const title = movie.title || 'Featured Movie';
    const year = movie.year || (movie.release_date ? movie.release_date.split('-')[0] : '2023');
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '8.0';
    const posterUrl = getImageUrl(movie.poster_path, CONFIG.IMAGE_SIZES.POSTER_LARGE);
    const backdropUrl = getBackdropUrl(movie.backdrop_path || movie.poster_path, CONFIG.IMAGE_SIZES.BACKDROP_MEDIUM);
    const overview = movie.overview || 'Explore this acclaimed cinema title on CineSphere with high-definition trailers, cast insights, and ratings.';

    const genresList = (movie.genres || []).map(g => `<span class="category-banner-genre-pill">${g.name || g}</span>`).join('');

    container.innerHTML = `
      <div class="category-banner-backdrop" style="background-image: url('${backdropUrl}');"></div>
      <div class="category-banner-overlay"></div>

      <div class="category-banner-container">
        <div class="category-banner-content">
          <div class="category-banner-badge-group">
            <span class="category-banner-tag">${categoryInfo.icon} Featured ${categoryInfo.title}</span>
            <span class="category-banner-rating">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              ${rating}
            </span>
            <span class="category-banner-year">${year}</span>
          </div>

          <h2 class="category-banner-title">${title}</h2>

          ${genresList ? `<div class="category-banner-genres">${genresList}</div>` : ''}

          <p class="category-banner-overview">${overview}</p>

          <div class="category-banner-actions">
            <button type="button" class="btn btn-primary" id="banner-play-trailer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>Watch Trailer</span>
            </button>

            <a href="movie.html?id=${movie.id}" class="btn btn-secondary" id="banner-more-details">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>Details & Cast</span>
            </a>

            <button type="button" class="btn btn-glass btn-icon" id="banner-watchlist-btn" title="Add to Watchlist" aria-label="Add to Watchlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="category-banner-poster-col">
          <div class="category-banner-poster-card">
            <img 
              src="${posterUrl}" 
              alt="${title} Poster" 
              class="category-banner-poster-img"
              onerror="this.onerror=null;this.src='${CONFIG.FALLBACK_POSTER}'"
            />
          </div>
        </div>
      </div>
    `;

    // Attach Event Handlers
    const trailerBtn = container.querySelector('#banner-play-trailer');
    if (trailerBtn) {
      trailerBtn.addEventListener('click', () => {
        modal.openTrailer(movie.id, title);
      });
    }

    const watchBtn = container.querySelector('#banner-watchlist-btn');
    if (watchBtn) {
      watchlistService.isInWatchlist(movie.id).then(inWatch => {
        if (inWatch) {
          watchBtn.classList.add('active');
          const svg = watchBtn.querySelector('svg');
          if (svg) svg.setAttribute('fill', 'currentColor');
        }
      });

      watchBtn.addEventListener('click', async () => {
        const added = await watchlistService.toggleWatchlist(movie);
        watchBtn.classList.toggle('active', added);
        const svg = watchBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
        if (added) {
          toast.success(`"${title}" added to Watchlist`);
        } else {
          toast.info(`"${title}" removed from Watchlist`);
        }
      });
    }
  }
}
