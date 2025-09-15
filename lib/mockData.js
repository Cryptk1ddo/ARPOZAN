// Mock data for admin dashboard

export const growthMetricsData = [
  { label: 'Продажи', value: '2.5K', change: '+12%', color: 'emerald' },
  { label: 'Доход', value: '$45.2K', change: '+8%', color: 'blue' },
  { label: 'Новые клиенты', value: '156', change: '+23%', color: 'purple' },
  { label: 'Конверсия', value: '3.2%', change: '+5%', color: 'orange' }
];

export const keyMetricsData = [
  { label: 'Средний чек', value: '$89', change: '+15%', color: 'green' },
  { label: 'ROAS', value: '4.2x', change: '+18%', color: 'blue' },
  { label: 'LTV', value: '$340', change: '+7%', color: 'purple' },
  { label: 'CAC', value: '$25', change: '-12%', color: 'red' }
];

export const inventoryData = [
  { label: 'Общий запас', value: '1.2K', change: '+5%', color: 'blue' },
  { label: 'Низкий остаток', value: '23', change: '+3', color: 'orange' },
  { label: 'Нет в наличии', value: '5', change: '-2', color: 'red' },
  { label: 'Новые товары', value: '8', change: '+8', color: 'green' }
];

export const mockProducts = [
  {
    id: '1',
    name: 'Цинк пиколинат',
    price: 1990,
    stock: 45,
    status: 'В наличии',
    category: 'Добавки',
    image: '/assets/imgs/Zink.png'
  },
  {
    id: '2',
    name: 'Мака перуанская',
    price: 1990,
    stock: 8,
    status: 'Мало на складе',
    category: 'Добавки',
    image: '/assets/imgs/Maka peruvian.png'
  },
  {
    id: '3',
    name: 'Тонгкат Али',
    price: 2990,
    stock: 32,
    status: 'В наличии',
    category: 'Добавки',
    image: '/assets/imgs/Tongkat Ali.png'
  },
  {
    id: '4',
    name: 'Йохимбин HCl',
    price: 1990,
    stock: 0,
    status: 'Нет в наличии',
    category: 'Добавки',
    image: '/assets/imgs/Yohimbin 1.png'
  },
  {
    id: '5',
    name: 'ULTIMATE MEN\'S PACK',
    price: 7990,
    stock: 15,
    status: 'В наличии',
    category: 'Комплексы',
    image: '/assets/imgs/Ultimate Pack.png'
  }
];

export const mockOrders = [
  {
    id: 'ARZ-001',
    customerName: 'Алексей Петров',
    email: 'alexey@example.com',
    total: 2990,
    status: 'Доставлен',
    date: '2025-09-12',
    items: [
      { name: 'Тонгкат Али', quantity: 1, price: 2990 }
    ]
  },
  {
    id: 'ARZ-002',
    customerName: 'Дмитрий Иванов',
    email: 'dmitry@example.com',
    total: 7990,
    status: 'В ожидании',
    date: '2025-09-14',
    items: [
      { name: 'ULTIMATE MEN\'S PACK', quantity: 1, price: 7990 }
    ]
  },
  {
    id: 'ARZ-003',
    customerName: 'Михаил Сидоров',
    email: 'mikhail@example.com',
    total: 3980,
    status: 'Отправлен',
    date: '2025-09-13',
    items: [
      { name: 'Цинк пиколинат', quantity: 1, price: 1990 },
      { name: 'Мака перуанская', quantity: 1, price: 1990 }
    ]
  }
];