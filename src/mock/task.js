
const mockDestination = [
  {
    id: 1,
    description: 'Beautiful city with historic sites',
    name: 'Paris',
    pictures: ['https://loremflickr.com/248/152?random=1', 'https://loremflickr.com/248/152?random=2']
  },
  {
    id: 2,
    description: 'Modern city with vibrant culture',
    name: 'New York',
    pictures: ['https://loremflickr.com/248/152?random=3', 'https://loremflickr.com/248/152?random=4']
  }
];

const mockOffers = [
  {
    type: 'Taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120,
      },
      {
        id: 2,
        title: 'A class',
        price: 150,
      }
    ]
  },
  {
    type: 'Flight',
    offers: [
      {
        id: 1,
        title: 'B to a business class',
        price: 250,
      }
    ]
  },
  {
    type: 'Bus',
    offers: [
      {
        id: 1,
        title: 'C to a business class',
        price: 350,
      }
    ]
  }
];

const mockRoutePoints = [
  {
    id: 1,
    basePrice: 1000,
    dateFrom: new Date('2023-10-01T10:30:00'),
    dateTo: new Date('2023-10-01T11:40:00'),
    type: 'Flight',
    destination: 1,
    offers: [1],
    isFavorite: true
  },
  {
    id: 2,
    basePrice: 2000,
    dateFrom: new Date('2023-10-01T10:30:00'),
    dateTo: new Date('2023-10-01T11:00:00'),
    type: 'Taxi',
    destination: 2,
    offers: [2],
    isFavorite: false
  },
  {
    id: 3,
    basePrice: 3000,
    dateFrom: new Date('2023-10-01T10:30:00'),
    dateTo: new Date('2023-10-01T11:20:00'),
    type: 'Bus',
    destination: 2,
    offers: [1],
    isFavorite: false
  }
];

export {mockRoutePoints, mockDestination, mockOffers};
