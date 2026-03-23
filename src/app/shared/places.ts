export type PlaceInfoSection = {
  title: string;
  content: string;
};

export type Place = {
  id: string;
  name: string;
  country: string;
  distanceKm: number;
  price: number;
  image: string;
  images: string[];
  blurb: string;
  coordinates: { lat: number; lng: number };
  type: string;
  popularFor: string;

  tags: string[];
  info: PlaceInfoSection[];
};

export const places: Place[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    distanceKm: 8350,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 2000,
    blurb: 'Whitewashed cliffs, cobalt domes, and sunset views.',
    coordinates: { lat: 36.3932, lng: 25.4615 },

    type: 'Island',
    popularFor: 'Sunsets',

    tags: ['Caldera views', 'Sunsets', 'Cliffside villages'],
    info: [
      {
        title: 'History',
        content:
          'A volcanic island shaped by ancient eruptions, with villages rebuilt over centuries.',
      },
      {
        title: 'Famous For',
        content: 'Blue-domed churches, caldera cruises, and golden sunsets.',
      },
      {
        title: 'Best Time',
        content: 'Late spring to early fall for warm water and bright skies.',
      },
    ],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    distanceKm: 10500,
    image:
      'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 7000,
    blurb: 'Temples, bamboo groves, and timeless lantern streets.',
    coordinates: { lat: 35.0116, lng: 135.7681 },

    type: 'Heritage',
    popularFor: 'Culture',

    tags: ['Shrines', 'Gardens', 'Tea culture'],
    info: [
      {
        title: 'History',
        content: 'Former imperial capital with centuries of art, craftsmanship, and ceremony.',
      },
      {
        title: 'Famous For',
        content: 'Fushimi Inari gates, Arashiyama bamboo, and Zen gardens.',
      },
      {
        title: 'Best Time',
        content: 'Spring for blossoms and autumn for vivid maple leaves.',
      },
    ],
  },
  {
    id: 'banff',
    name: 'Banff',
    country: 'Canada',
    distanceKm: 3100,
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 7500,
    blurb: 'Turquoise lakes and alpine peaks in every direction.',
    coordinates: { lat: 51.1784, lng: -115.5708 },

    type: 'Mountain',
    popularFor: 'Nature',

    tags: ['Lakes', 'Hikes', 'Wildlife'],
    info: [
      {
        title: 'History',
        content: 'Canada’s oldest national park, founded around natural hot springs.',
      },
      {
        title: 'Famous For',
        content: 'Lake Louise, Moraine Lake, and rugged alpine trails.',
      },
      {
        title: 'Best Time',
        content: 'Summer for hikes, winter for snow sports and frozen lakes.',
      },
    ],
  },

  {
    id: 'cappadocia',
    name: 'Cappadocia',
    country: 'Turkey',
    distanceKm: 6300,
    image:
      'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 6000,
    blurb: 'Hot-air balloons over surreal volcanic valleys.',
    coordinates: { lat: 38.6431, lng: 34.8289 },

    type: 'Valley',
    popularFor: 'Hot Air Balloons',

    tags: ['Balloons', 'Caves', 'Valleys'],
    info: [
      {
        title: 'History',
        content: 'Ancient volcanic eruptions created the fairy chimneys and caves.',
      },
      {
        title: 'Famous For',
        content: 'Sunrise balloon rides and underground cities.',
      },
      {
        title: 'Best Time',
        content: 'April to June and September to October for clear skies.',
      },
    ],
  },

  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    distanceKm: 9700,
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 1000,
    blurb: 'Terraced rice fields and tranquil beach temples.',
    coordinates: { lat: -8.3405, lng: 115.092 },

    type: 'Island',
    popularFor: 'Beaches',

    tags: ['Temples', 'Beaches', 'Wellness'],
    info: [
      {
        title: 'History',
        content: 'A spiritual hub blending Hindu culture with island life.',
      },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    distanceKm: 7400,
    image:
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522098543979-ffc7f79d6d36?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8000,
    blurb: 'Romantic boulevards, art, and timeless architecture.',
    coordinates: { lat: 48.8566, lng: 2.3522 },

    type: 'Heritage',
    popularFor: 'Architecture',

    tags: ['Eiffel Tower', 'Museums', 'Cafés'],

    info: [
      {
        title: 'Overview',
        content:
          'Paris is globally admired for its historic landmarks, elegant streets, and cultural heritage.',
      },
      {
        title: 'Famous For',
        content: 'The Eiffel Tower, Louvre Museum, Seine River, and world-class cuisine.',
      },
      {
        title: 'Best Time',
        content: 'Spring and early autumn offer pleasant weather and beautiful city views.',
      },
    ],
  },

  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    distanceKm: 6800,
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1521292270410-a8c3a6b6e2f5?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 3000,
    blurb: 'Snow peaks, lakes, and postcard villages.',
    coordinates: { lat: 46.8182, lng: 8.2275 },

    type: 'Mountain',
    popularFor: 'Scenery',

    tags: ['Mountains', 'Lakes', 'Skiing'],

    info: [
      {
        title: 'Landscape',
        content:
          'The Swiss Alps feature dramatic mountain ranges, crystal-clear lakes, and charming alpine towns.',
      },
      {
        title: 'Popular Activities',
        content: 'Skiing, snowboarding, hiking, mountaineering, and scenic rail journeys.',
      },
      {
        title: 'Best Time',
        content: 'Winter for snow sports, summer for hiking and panoramic views.',
      },
    ],
  },

  

  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    distanceKm: 1510,
    image:
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1496566084516-c5b96fcbd5c8?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    price: 10000,
    blurb: 'Golden beaches and vibrant nightlife.',
    coordinates: { lat: 15.2993, lng: 74.124 },

    type: 'Beach',
    popularFor: 'Nightlife',

    tags: ['Beaches', 'Shacks', 'Portuguese heritage'],

    info: [
      {
        title: 'Atmosphere',
        content:
          'Goa is known for its relaxed coastal lifestyle, beach culture, and lively entertainment scene.',
      },
      {
        title: 'Famous For',
        content: 'Beach parties, seafood, colonial architecture, and water sports.',
      },
      {
        title: 'Best Time',
        content: 'November to February for pleasant weather and peak tourism.',
      },
    ],
  },

  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    distanceKm: 2480,
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9000,

    blurb: 'Snowy mountains and adventure escapes.',
    coordinates: { lat: 32.2432, lng: 77.1892 },

    type: 'Mountain',
    popularFor: 'Adventure',

    tags: ['Snow', 'Hiking', 'Valleys'],

    info: [
      {
        title: 'Overview',
        content:
          'Manali is a Himalayan resort town famous for mountain scenery and adventure tourism.',
      },
      {
        title: 'Activities',
        content: 'Trekking, skiing, paragliding, river rafting, and scenic drives.',
      },
      {
        title: 'Best Time',
        content: 'Winter for snow lovers, summer for outdoor exploration.',
      },
    ],
  },

  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    distanceKm: 280,
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9500,

    blurb: 'The Pink City of forts and palaces.',
    coordinates: { lat: 26.9124, lng: 75.7873 },

    type: 'Heritage',
    popularFor: 'Architecture',

    tags: ['Hawa Mahal', 'Amber Fort', 'Culture'],

    info: [
      {
        title: 'History',
        content:
          'Jaipur is a historic royal city known for its palaces, forts, and vibrant traditions.',
      },
      {
        title: 'Famous For',
        content: 'Hawa Mahal, City Palace, Amber Fort, and colorful bazaars.',
      },
      {
        title: 'Best Time',
        content: 'October to March for comfortable sightseeing weather.',
      },
    ],
  },

  {
    id: 'agra',
    name: 'Agra',
    country: 'India',
    distanceKm: 210,
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8500,

    blurb: 'Home of the iconic Taj Mahal.',
    coordinates: { lat: 27.1767, lng: 78.0081 },

    type: 'Heritage',
    popularFor: 'Monuments',

    tags: ['Taj Mahal', 'Mughal history'],

    info: [
      {
        title: 'Significance',
        content: 'Agra houses one of the Seven Wonders of the World, the Taj Mahal.',
      },
      {
        title: 'Famous For',
        content: 'Taj Mahal, Agra Fort, and Mughal architecture.',
      },
      {
        title: 'Best Time',
        content: 'Winter months for pleasant exploration.',
      },
    ],
  },

  {
    id: 'kerala',
    name: 'Kerala Backwaters',
    country: 'India',
    distanceKm: 2300,
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8500,
    blurb: 'Serene canals, houseboats, and palm-lined waters.',
    coordinates: { lat: 9.4981, lng: 76.3388 },

    type: 'Nature',
    popularFor: 'Relaxation',

    tags: ['Houseboats', 'Lagoons', 'Greenery'],

    info: [
      {
        title: 'Overview',
        content:
          'Kerala’s backwaters are a network of tranquil canals, rivers, and lakes along the Arabian Sea coast.',
      },
      {
        title: 'Experience',
        content: 'Houseboat stays, village views, coconut groves, and slow-paced scenic cruising.',
      },
      {
        title: 'Best Time',
        content: 'September to March for pleasant weather and lush landscapes.',
      },
    ],
  },

  {
    id: 'ladakh',
    name: 'Ladakh',
    country: 'India',
    distanceKm: 3200,
    image:
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9000,

    blurb: 'High-altitude deserts and dramatic Himalayan landscapes.',
    coordinates: { lat: 34.1526, lng: 77.577 },

    type: 'Mountain',
    popularFor: 'Road Trips',

    tags: ['Monasteries', 'Lakes', 'Biking'],

    info: [
      {
        title: 'Landscape',
        content:
          'Ladakh features rugged mountains, vast valleys, and surreal high-altitude deserts.',
      },
      {
        title: 'Famous For',
        content: 'Pangong Lake, Nubra Valley, Buddhist monasteries, and legendary bike journeys.',
      },
      {
        title: 'Best Time',
        content: 'May to September when roads are open and weather is favorable.',
      },
    ],
  },

  {
    id: 'varanasi',
    name: 'Varanasi',
    country: 'India',
    distanceKm: 680,
    image:
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 500,
    blurb: 'Ancient ghats and timeless spiritual energy.',
    coordinates: { lat: 25.3176, lng: 82.9739 },

    type: 'Heritage',
    popularFor: 'Spirituality',

    tags: ['Ganga Aarti', 'Ghats', 'Temples'],

    info: [
      {
        title: 'Significance',
        content:
          'Varanasi is one of the world’s oldest living cities and a major spiritual center of India.',
      },
      {
        title: 'Famous For',
        content: 'Ganga Aarti rituals, sacred ghats, narrow lanes, and ancient temples.',
      },
      {
        title: 'Best Time',
        content: 'October to March for comfortable exploration.',
      },
    ],
  },

  {
    id: 'andaman',
    name: 'Andaman Islands',
    country: 'India',
    distanceKm: 2480,
    image:
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 200,
    blurb: 'Crystal-clear waters and untouched beaches.',
    coordinates: { lat: 11.7401, lng: 92.6586 },

    type: 'Beach',
    popularFor: 'Beaches',

    tags: ['Snorkeling', 'Coral reefs', 'Tropical waters'],

    info: [
      {
        title: 'Overview',
        content:
          'The Andaman Islands are famous for turquoise waters, white sand beaches, and rich marine life.',
      },
      {
        title: 'Activities',
        content: 'Snorkeling, scuba diving, island hopping, and beach relaxation.',
      },
      {
        title: 'Best Time',
        content: 'November to May for clear skies and calm seas.',
      },
    ],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    distanceKm: 2200,
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 11000,
    blurb: 'Skyline icons, desert adventures, and luxury waterfront nights.',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    type: 'City',
    popularFor: 'Luxury',
    tags: ['Burj Khalifa', 'Desert Safari', 'Shopping'],
    info: [
      {
        title: 'Overview',
        content: 'Dubai blends futuristic architecture with desert landscapes and global hospitality.',
      },
      {
        title: 'Famous For',
        content: 'Burj Khalifa, Palm Jumeirah, luxury malls, and desert excursions.',
      },
      {
        title: 'Best Time',
        content: 'November to March for pleasant weather and outdoor activities.',
      },
    ],
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    distanceKm: 2500,
    image:
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 14000,
    blurb: 'Private villas, turquoise lagoons, and postcard-perfect island calm.',
    coordinates: { lat: 3.2028, lng: 73.2207 },
    type: 'Beach',
    popularFor: 'Honeymoon',
    tags: ['Water Villas', 'Lagoon', 'Diving'],
    info: [
      {
        title: 'Overview',
        content: 'The Maldives is known for secluded island resorts and exceptionally clear waters.',
      },
      {
        title: 'Famous For',
        content: 'Water villas, coral reefs, marine life, and luxury stays.',
      },
      {
        title: 'Best Time',
        content: 'November to April for sunny skies and calm seas.',
      },
    ],
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    distanceKm: 6100,
    image:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9800,
    blurb: 'Ancient ruins, piazzas, and timeless streets full of history.',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    type: 'Heritage',
    popularFor: 'History',
    tags: ['Colosseum', 'Vatican', 'Piazzas'],
    info: [
      {
        title: 'Overview',
        content: 'Rome offers layers of history, architecture, and food across every neighborhood.',
      },
      {
        title: 'Famous For',
        content: 'Colosseum, Roman Forum, Vatican City, and classic Italian cuisine.',
      },
      {
        title: 'Best Time',
        content: 'April to June and September to October for comfortable city walks.',
      },
    ],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    distanceKm: 4200,
    image:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1496939376851-89342e90adcd?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8900,
    blurb: 'Garden city energy, skyline views, and incredibly easy urban travel.',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    type: 'Heritage',
    popularFor: 'Food',
    tags: ['Marina Bay', 'Gardens', 'Street Food'],
    info: [
      {
        title: 'Overview',
        content: 'Singapore is a polished city-state known for efficiency, greenery, and modern design.',
      },
      {
        title: 'Famous For',
        content: 'Marina Bay Sands, Gardens by the Bay, hawker centers, and clean city life.',
      },
      {
        title: 'Best Time',
        content: 'Year-round travel works well, with February to April often feeling most comfortable.',
      },
    ],
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    distanceKm: 7200,
    image:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9300,
    blurb: 'Beachfront energy, Gaudi landmarks, and late-night city life.',
    coordinates: { lat: 41.3851, lng: 2.1734 },
    type: 'Heritage',
    popularFor: 'Nightlife',
    tags: ['Sagrada Familia', 'Beach', 'Tapas'],
    info: [
      {
        title: 'Overview',
        content: 'Barcelona mixes Mediterranean coastal charm with bold architecture and lively streets.',
      },
      {
        title: 'Famous For',
        content: 'Gaudi buildings, La Rambla, tapas culture, and a vibrant beach scene.',
      },
      {
        title: 'Best Time',
        content: 'May to June and September to October for pleasant weather and easier sightseeing.',
      },
    ],
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    distanceKm: 4600,
    image:
      'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8400,
    blurb: 'Grand mosques, bazaars, and a city split across two continents.',
    coordinates: { lat: 41.0082, lng: 28.9784 },
    type: 'City',
    popularFor: 'Culture',
    tags: ['Hagia Sophia', 'Bazaars', 'Bosporus'],
    info: [
      {
        title: 'Overview',
        content: 'Istanbul brings together layered history, waterfront views, and deeply rooted culture.',
      },
      {
        title: 'Famous For',
        content: 'Hagia Sophia, Blue Mosque, Grand Bazaar, and Bosporus cruises.',
      },
      {
        title: 'Best Time',
        content: 'April to May and September to October for comfortable city exploration.',
      },
    ],
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    country: 'India',
    distanceKm: 850,
    image:
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 7800,
    blurb: 'Houseboats, mountain air, and serene lakeside mornings.',
    coordinates: { lat: 34.0837, lng: 74.7973 },
    type: 'Nature',
    popularFor: 'Scenery',
    tags: ['Dal Lake', 'Houseboats', 'Gardens'],
    info: [
      {
        title: 'Overview',
        content: 'Srinagar is known for peaceful lakes, Mughal gardens, and Himalayan backdrops.',
      },
      {
        title: 'Famous For',
        content: 'Dal Lake, shikara rides, houseboats, and blooming gardens.',
      },
      {
        title: 'Best Time',
        content: 'April to October for pleasant weather and clear valley views.',
      },
    ],
  },
  {
    id: 'phuket',
    name: 'Phuket',
    country: 'Thailand',
    distanceKm: 3200,
    image:
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8600,
    blurb: 'Island beaches, cliff viewpoints, and easy tropical getaways.',
    coordinates: { lat: 7.8804, lng: 98.3923 },
    type: 'Beach',
    popularFor: 'Beaches',
    tags: ['Islands', 'Water Sports', 'Night Markets'],
    info: [
      {
        title: 'Overview',
        content: 'Phuket is a popular island destination with beaches, viewpoints, and boat excursions.',
      },
      {
        title: 'Famous For',
        content: 'Phi Phi tours, beach stays, snorkeling, and lively local markets.',
      },
      {
        title: 'Best Time',
        content: 'November to April for sunny beach days and calmer seas.',
      },
    ],
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    distanceKm: 4700,
    image:
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1538485399081-7c8971a6e1ab?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9100,
    blurb: 'Modern neighborhoods, palace history, and nonstop food culture.',
    coordinates: { lat: 37.5665, lng: 126.978 },
    type: 'City',
    popularFor: 'Food',
    tags: ['Palaces', 'Street Food', 'Shopping'],
    info: [
      {
        title: 'Overview',
        content: 'Seoul blends high-energy modern districts with deep heritage and local food culture.',
      },
      {
        title: 'Famous For',
        content: 'Gyeongbokgung Palace, Myeongdong, Han River, and Korean street food.',
      },
      {
        title: 'Best Time',
        content: 'Spring and autumn for comfortable weather and colorful city views.',
      },
    ],
  },
  {
    id: 'new-york',
    name: 'New York City',
    country: 'USA',
    distanceKm: 11700,
    image:
      'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 15000,
    blurb: 'Iconic skyline, museums, theatre, and fast-paced city energy.',
    coordinates: { lat: 40.7128, lng: -74.006 },
    type: 'City',
    popularFor: 'Landmarks',
    tags: ['Times Square', 'Broadway', 'Central Park'],
    info: [
      {
        title: 'Overview',
        content: 'New York City delivers iconic sights, neighborhoods with character, and endless things to do.',
      },
      {
        title: 'Famous For',
        content: 'Times Square, Central Park, Statue of Liberty, and Broadway shows.',
      },
      {
        title: 'Best Time',
        content: 'April to June and September to November for enjoyable city walks and events.',
      },
    ],
  },
  {
    id: 'seychelles',
    name: 'Seychelles',
    country: 'Seychelles',
    distanceKm: 4300,
    image:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 12800,
    blurb: 'Granite shores, clear lagoons, and slow island days.',
    coordinates: { lat: -4.6796, lng: 55.492 },
    type: 'Island',
    popularFor: 'Beaches',
    tags: ['Blue Water', 'Island Hopping', 'Luxury Stays'],
    info: [
      {
        title: 'Overview',
        content: 'Seychelles offers tropical island escapes with striking beaches and turquoise waters.',
      },
      {
        title: 'Famous For',
        content: 'Granite boulders, coral reefs, quiet coves, and luxury island resorts.',
      },
      {
        title: 'Best Time',
        content: 'April to May and October to November for pleasant island weather.',
      },
    ],
  },
  {
    id: 'mauritius',
    name: 'Mauritius',
    country: 'Mauritius',
    distanceKm: 5800,
    image:
      'https://images.unsplash.com/photo-1502101872923-d48509bff386?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1502101872923-d48509bff386?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 11900,
    blurb: 'Volcanic island landscapes, reef lagoons, and calm luxury stays.',
    coordinates: { lat: -20.3484, lng: 57.5522 },
    type: 'Island',
    popularFor: 'Honeymoon',
    tags: ['Reefs', 'Lagoon', 'Resorts'],
    info: [
      {
        title: 'Overview',
        content: 'Mauritius combines scenic beaches, lush interiors, and comfortable island resorts.',
      },
      {
        title: 'Famous For',
        content: 'Lagoon views, reef adventures, mountain backdrops, and honeymoon travel.',
      },
      {
        title: 'Best Time',
        content: 'May to December for cooler breezes and clear travel conditions.',
      },
    ],
  },
  {
    id: 'yosemite-valley',
    name: 'Yosemite Valley',
    country: 'USA',
    distanceKm: 12400,
    image:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 13200,
    blurb: 'Granite cliffs, waterfalls, and valley views that feel cinematic.',
    coordinates: { lat: 37.7456, lng: -119.5936 },
    type: 'Valley',
    popularFor: 'Nature',
    tags: ['Waterfalls', 'Granite Cliffs', 'Hikes'],
    info: [
      {
        title: 'Overview',
        content: 'Yosemite Valley is a dramatic glacial valley famous for waterfalls and towering cliffs.',
      },
      {
        title: 'Famous For',
        content: 'El Capitan, Half Dome, Yosemite Falls, and legendary hiking routes.',
      },
      {
        title: 'Best Time',
        content: 'Late spring to early autumn for waterfalls, hiking, and road access.',
      },
    ],
  },
  {
    id: 'nubra-valley',
    name: 'Nubra Valley',
    country: 'India',
    distanceKm: 3270,
    image:
      'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8800,
    blurb: 'Cold desert dunes, mountain passes, and surreal Himalayan valley drives.',
    coordinates: { lat: 34.6256, lng: 77.5619 },
    type: 'Valley',
    popularFor: 'Road Trips',
    tags: ['Sand Dunes', 'Mountain Passes', 'Bactrian Camels'],
    info: [
      {
        title: 'Overview',
        content: 'Nubra Valley offers high-altitude desert landscapes and remote Himalayan routes.',
      },
      {
        title: 'Famous For',
        content: 'Diskit Monastery, Hunder dunes, scenic passes, and dramatic valley views.',
      },
      {
        title: 'Best Time',
        content: 'June to September when roads remain open and conditions are friendlier.',
      },
    ],
  },
  {
    id: 'spiti-valley',
    name: 'Spiti Valley',
    country: 'India',
    distanceKm: 2420,
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9200,
    blurb: 'Remote monasteries, stark terrain, and unforgettable valley roads.',
    coordinates: { lat: 32.2462, lng: 78.0347 },
    type: 'Valley',
    popularFor: 'Adventure',
    tags: ['Monasteries', 'Road Trips', 'High Altitude'],
    info: [
      {
        title: 'Overview',
        content: 'Spiti Valley is a rugged Himalayan region with raw landscapes and isolated villages.',
      },
      {
        title: 'Famous For',
        content: 'Key Monastery, remote drives, stargazing, and stark mountain scenery.',
      },
      {
        title: 'Best Time',
        content: 'June to October for road access and clearer weather.',
      },
    ],
  },
  {
    id: 'lake-bled',
    name: 'Lake Bled',
    country: 'Slovenia',
    distanceKm: 6750,
    image:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9700,
    blurb: 'Emerald lake views, forested trails, and postcard calm.',
    coordinates: { lat: 46.3625, lng: 14.0938 },
    type: 'Nature',
    popularFor: 'Scenery',
    tags: ['Lake', 'Castle', 'Boat Rides'],
    info: [
      {
        title: 'Overview',
        content: 'Lake Bled is a scenic alpine retreat known for its lake, island church, and calm setting.',
      },
      {
        title: 'Famous For',
        content: 'Bled Castle, rowboat rides, lakeside walks, and mountain-framed views.',
      },
      {
        title: 'Best Time',
        content: 'May to September for outdoor walks and green landscapes.',
      },
    ],
  },
  {
    id: 'coorg',
    name: 'Coorg',
    country: 'India',
    distanceKm: 2160,
    image:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 7400,
    blurb: 'Coffee estates, misty hills, and lush green weekend escapes.',
    coordinates: { lat: 12.3375, lng: 75.8069 },
    type: 'Nature',
    popularFor: 'Relaxation',
    tags: ['Coffee Estates', 'Waterfalls', 'Hills'],
    info: [
      {
        title: 'Overview',
        content: 'Coorg is a green hill region known for plantations, waterfalls, and laid-back stays.',
      },
      {
        title: 'Famous For',
        content: 'Coffee estates, scenic drives, waterfalls, and cool-weather getaways.',
      },
      {
        title: 'Best Time',
        content: 'October to March for comfortable weather and lush views.',
      },
    ],
  },
];
