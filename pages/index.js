import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import LuxuryFAQ from '../components/LuxuryFAQ'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { gsap } from 'gsap'
import { animations } from '../lib/gsapUtils'
import { utils } from '../lib/lodashUtils'
import { useCart } from '../lib/CartContext'
import { ArrowLeft, X, ChevronRight, RotateCcw } from 'lucide-react'
import NewsletterSignup from '../components/NewsletterSignup'
import LoadingSpinner from '../components/LoadingSpinner'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import PaymentIcons from '../components/PaymentIcons'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isSubscription, setIsSubscription] = useState(false)
  const [quizStep, setQuizStep] = useState(1)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizRecommendation, setQuizRecommendation] = useState(null)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const router = useRouter()
  const { addToCart } = useCart()

  const headerRef = useRef(null)

  // Add testimonials data
  const testimonials = [
    {
      name: 'Алексей М.',
      text: 'После месяца приема ARPOZAN почувствовал прилив энергии и уверенности. Результат превзошел ожидания!',
      rating: 5,
    },
    {
      name: 'Дмитрий К.',
      text: 'Отличное качество продукции. Заметил улучшение в тренировках и общем самочувствии.',
      rating: 5,
    },
    {
      name: 'Михаил П.',
      text: 'ARPOZAN помог вернуть энергию молодости. Рекомендую всем мужчинам после 30!',
      rating: 5,
    },
  ]

  const recommendations = {
    energy: {
      name: 'ARPOZAN Yohimbe',
      image: '/assets/imgs/Yohimbin 1.png',
      description: 'Адреналиновый заряд',
      price: '2990₽',
      route: '/Yohimbin',
      product: {
        id: 'yohimbin',
        name: 'ARPOZAN Yohimbe',
        price: 2990,
        img: '/assets/imgs/Yohimbin 1.png',
        quantity: 1,
      },
    },
    libido: {
      name: 'ARPOZAN Maca',
      image: '/assets/imgs/Maka peruvian.png',
      description: 'Бустер либидо',
      price: '1990₽',
      route: '/maca',
      product: {
        id: 'maca',
        name: 'ARPOZAN Maca',
        price: 1990,
        img: '/assets/imgs/Maka peruvian.png',
        quantity: 1,
      },
    },
    testosterone: {
      name: 'ARPOZAN Tongkat Ali',
      image: '/assets/imgs/Tongkat Ali.png',
      description: 'Стимулятор тестостерона',
      price: '2990₽',
      route: '/Long-jack',
      product: {
        id: 'tongkat-ali',
        name: 'ARPOZAN Tongkat Ali',
        price: 2990,
        img: '/assets/imgs/Tongkat Ali.png',
        quantity: 1,
      },
    },
  }

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrolled = window.scrollY > 50
        headerRef.current.classList.toggle('bg-black/50', scrolled)
        headerRef.current.classList.toggle('backdrop-blur-lg', scrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lead modal timer
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      sessionStorage.getItem('leadModalShown') !== 'true'
    ) {
      const timer = setTimeout(() => {
        setIsLeadModalOpen(true)
        sessionStorage.setItem('leadModalShown', 'true')
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  // GSAP animations
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => {
      animations.scrollReveal(el)
    })
  }, [])

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // Show loading for 1.5 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleOrderClick = () => {
    // Smooth scroll to catalog section
    const catalogSection = document.getElementById('catalog')
    if (catalogSection) {
      catalogSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const handleAddToCart = (product) => {
    // Assuming utils and addToCart are defined
    if (utils.isEmpty(product.name) || !utils.isNumber(product.price)) {
      console.log('Ошибка: некорректные данные товара')
      return
    }
    // addToCart(product)
    console.log(`✅ ${product.name} добавлен в корзину!`)

    // GSAP animation
    const btn = document.querySelector('.glow-button')
    if (btn) {
      const tl = gsap.timeline()
      tl.to(btn, { scale: 0.95, duration: 0.1 }).to(btn, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
      })
    }
  }

  const productData = {
    id: 'ultimate-pack',
    name: 'ARPOZAN Ultimate Pack',
    oneTimePrice: 8990,
    subscriptionPrice: 8091,
  }

  const currentPrice = isSubscription
    ? productData.subscriptionPrice
    : productData.oneTimePrice
  const originalPrice = isSubscription ? productData.oneTimePrice : 9960
  const savings = originalPrice - currentPrice

  // Quiz questions and logic
  const quizQuestions = [
    {
      id: 1,
      question: 'Какая ваша основная цель?',
      options: [
        {
          id: 'energy',
          text: '💪 Повысить энергию и выносливость',
          points: { yohimbe: 3, maca: 2, tongkat: 2, zinc: 1, ultimate: 3 },
        },
        {
          id: 'testosterone',
          text: '🔥 Увеличить тестостерон',
          points: { tongkat: 3, zinc: 3, yohimbe: 1, maca: 1, ultimate: 3 },
        },
        {
          id: 'libido',
          text: '❤️ Улучшить либидо и сексуальное здоровье',
          points: { maca: 3, tongkat: 2, zinc: 2, yohimbe: 1, ultimate: 3 },
        },
        {
          id: 'focus',
          text: '🧠 Повысить концентрацию и фокус',
          points: { yohimbe: 3, zinc: 2, tongkat: 1, maca: 1, ultimate: 2 },
        },
      ],
    },
    {
      id: 2,
      question: 'Ваш возраст?',
      options: [
        {
          id: 'young',
          text: '18-25 лет',
          points: { zinc: 3, maca: 2, yohimbe: 2, tongkat: 1, ultimate: 2 },
        },
        {
          id: 'adult',
          text: '26-35 лет',
          points: { tongkat: 2, zinc: 2, maca: 2, yohimbe: 2, ultimate: 3 },
        },
        {
          id: 'mature',
          text: '36-45 лет',
          points: { tongkat: 3, zinc: 3, maca: 2, yohimbe: 1, ultimate: 4 },
        },
        {
          id: 'senior',
          text: '45+ лет',
          points: { tongkat: 3, zinc: 3, maca: 3, yohimbe: 1, ultimate: 5 },
        },
      ],
    },
    {
      id: 3,
      question: 'Ваш уровень физической активности?',
      options: [
        {
          id: 'low',
          text: '🪑 Низкий (сидячий образ жизни)',
          points: { zinc: 3, maca: 2, tongkat: 2, yohimbe: 1, ultimate: 3 },
        },
        {
          id: 'moderate',
          text: '🚶 Умеренный (2-3 раза в неделю)',
          points: { tongkat: 2, zinc: 2, maca: 2, yohimbe: 2, ultimate: 3 },
        },
        {
          id: 'high',
          text: '🏃 Высокий (4-5 раз в неделю)',
          points: { yohimbe: 3, tongkat: 3, zinc: 2, maca: 1, ultimate: 4 },
        },
        {
          id: 'athlete',
          text: '💪 Профессиональный спорт',
          points: { yohimbe: 3, tongkat: 3, zinc: 3, maca: 2, ultimate: 5 },
        },
      ],
    },
    {
      id: 4,
      question: 'Какие проблемы вас больше всего беспокоят?',
      options: [
        {
          id: 'fatigue',
          text: '😴 Усталость и низкая энергия',
          points: { yohimbe: 3, maca: 2, tongkat: 2, zinc: 2, ultimate: 4 },
        },
        {
          id: 'stress',
          text: '😰 Стресс и тревожность',
          points: { zinc: 3, maca: 2, tongkat: 2, yohimbe: 1, ultimate: 3 },
        },
        {
          id: 'performance',
          text: '📉 Снижение физической работоспособности',
          points: { tongkat: 3, yohimbe: 3, zinc: 2, maca: 1, ultimate: 4 },
        },
        {
          id: 'recovery',
          text: '🔄 Медленное восстановление',
          points: { zinc: 3, tongkat: 2, maca: 2, yohimbe: 2, ultimate: 4 },
        },
      ],
    },
    {
      id: 5,
      question: 'Каков ваш бюджет?',
      options: [
        {
          id: 'budget',
          text: '💰 До 2000₽',
          points: { zinc: 3, maca: 3, tongkat: 0, yohimbe: 0, ultimate: 0 },
        },
        {
          id: 'mid',
          text: '💳 2000-3000₽',
          points: { zinc: 2, maca: 2, tongkat: 3, yohimbe: 3, ultimate: 1 },
        },
        {
          id: 'premium',
          text: '💎 Без ограничений (хочу лучшее)',
          points: { tongkat: 3, yohimbe: 3, zinc: 2, maca: 2, ultimate: 6 },
        },
      ],
    },
  ]

  const products = {
    zinc: {
      id: 'zinc',
      name: 'ARPOZAN Zinc',
      price: 1990,
      description: 'Базовый элемент мужского здоровья и тестостерона',
      benefits: [
        'Поддержка иммунитета',
        'Увеличение тестостерона',
        'Улучшение качества кожи',
        'Базовая поддержка организма',
      ],
      image: '/assets/imgs/Zink.png',
      href: '/zinc',
      bgGradient: 'from-blue-600/20 to-cyan-600/20',
    },
    maca: {
      id: 'maca',
      name: 'ARPOZAN Maca',
      price: 1990,
      description: 'Природный бустер либидо и сексуальной энергии',
      benefits: [
        'Повышение либидо',
        'Улучшение настроения',
        'Природная энергия',
        'Гормональный баланс',
      ],
      image: '/assets/imgs/Maka peruvian.png',
      href: '/maca',
      bgGradient: 'from-purple-600/20 to-pink-600/20',
    },
    tongkat: {
      id: 'tongkat',
      name: 'ARPOZAN Tongkat Ali',
      price: 2990,
      description: 'Природный стимулятор тестостерона и мышечного роста',
      benefits: [
        'Мощное повышение тестостерона',
        'Увеличение мышечной массы',
        'Улучшение силовых показателей',
        'Повышение уверенности',
      ],
      image: '/assets/imgs/Tongkat Ali.png',
      href: '/Long-jack',
      bgGradient: 'from-orange-600/20 to-red-600/20',
    },
    yohimbe: {
      id: 'yohimbe',
      name: 'ARPOZAN Yohimbe',
      price: 2990,
      description: 'Адреналиновый заряд для ваших самых амбициозных целей',
      benefits: [
        'Максимальная энергия',
        'Жиросжигание',
        'Улучшение фокуса',
        'Повышение выносливости',
      ],
      image: '/assets/imgs/Yohimbin 1.png',
      href: '/Yohimbin',
      bgGradient: 'from-green-600/20 to-emerald-600/20',
    },
    ultimate: {
      id: 'ultimate',
      name: 'ULTIMATE MEN\'S PACK',
      price: 7990,
      description: 'Комплексное решение для максимального результата во всех сферах мужского здоровья',
      benefits: [
        'Все продукты в одном пакете',
        'Синергетический эффект',
        'Максимальная эффективность',
        'Экономия до 2000₽',
      ],
      image: '/assets/imgs/Ultimate Pack.png',
      href: '#ultimate-pack',
      bgGradient: 'from-white/30 to-white/10',
    },
  }

  const handleQuizAnswer = (questionId, optionId) => {
    const question = quizQuestions.find((q) => q.id === questionId)
    const option = question.options.find((o) => o.id === optionId)

    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: {
        optionId,
        points: option.points,
      },
    }))

    // Add smooth transition animation
    const quizContent = document.querySelector('.quiz-content')
    if (quizContent) {
      gsap.to(quizContent, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          if (questionId === quizQuestions.length) {
            // Calculate recommendation
            calculateRecommendation({
              ...quizAnswers,
              [questionId]: {
                optionId,
                points: option.points,
              },
            })
          } else {
            setQuizStep(questionId + 1)
          }

          // Animate back in
          gsap.fromTo(
            quizContent,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
          )
        },
      })
    } else {
      // Fallback without animation
      if (questionId === quizQuestions.length) {
        calculateRecommendation({
          ...quizAnswers,
          [questionId]: {
            optionId,
            points: option.points,
          },
        })
      } else {
        setQuizStep(questionId + 1)
      }
    }
  }

  const calculateRecommendation = (answers) => {
    const scores = { zinc: 0, maca: 0, tongkat: 0, yohimbe: 0, ultimate: 0 }

    Object.values(answers).forEach((answer) => {
      Object.entries(answer.points).forEach(([product, points]) => {
        scores[product] += points
      })
    })

    // Find top 3 products including Ultimate Pack
    let sortedProducts = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([productId]) => products[productId])

    setQuizRecommendation(sortedProducts)
    setQuizStep('result')
  }

  const resetQuiz = () => {
    setQuizStep(1)
    setQuizAnswers({})
    setQuizRecommendation(null)
  }

  const faqs = [
    {
      question: "Чем ULTIMATE MEN'S PACK лучше отдельных добавок?",
      answer: 'Комплекс обеспечивает синергетический эффект — компоненты усиливают действие друг друга. Йохимбин улучшает кровообращение, тонгкат али повышает тестостерон, мака увеличивает энергию, а цинк поддерживает все системы организма.'
    },
    {
      question: 'Нужно ли делать перерыв в приеме?',
      answer: 'Мы рекомендуем принимать продукты курсами по 2-3 месяца с перерывом в 1 месяц. Это позволяет избежать привыкания и поддерживать максимальную эффективность добавок.'
    },
    {
      question: 'Есть ли противопоказания?',
      answer: 'Не рекомендуется лицам до 18 лет, при заболеваниях сердца, повышенном давлении, тревожных расстройствах. Перед применением обязательно проконсультируйтесь со специалистом.'
    },
    {
      question: 'Можно ли принимать добавки по отдельности?',
      answer: 'Да, каждый продукт эффективен и по отдельности. Однако максимальный результат достигается при комплексном приеме, когда компоненты работают синергично и усиливают эффект друг друга.'
    },
    {
      question: 'Через сколько времени будет заметен результат?',
      answer: 'Первые изменения в энергии и самочувствии заметны через 1-2 недели. Полный эффект на либидо, тестостерон и физическую форму проявляется через 4-6 недель регулярного приема.'
    },
    {
      question: 'Безопасно ли принимать все добавки одновременно?',
      answer: 'При соблюдении рекомендуемых дозировок комплексный прием безопасен. Все наши продукты протестированы и соответствуют международным стандартам качества. Начинайте с минимальных доз.'
    }
  ]

  return (
    <Layout>
      <Head>
        <title>ARPOZAN - Энергия для победителей</title>
        <meta
          name="description"
          content="ARPOZAN - комплекс натуральных добавок для повышения энергии, тестостерона и либидо. Йохимбин, Мака, Тонгкат Али. Заказать с доставкой."
        />
        <meta
          name="keywords"
          content="мужское здоровье, тестостерон, энергия, либидо, натуральные добавки, ARPOZAN"
        />
        <link rel="canonical" href="https://arpozan.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ARPOZAN',
              url: 'https://arpozan.com',
              description:
                'Комплекс натуральных добавок для повышения энергии, тестостерона и либидо',
              product: [
                {
                  '@type': 'Product',
                  name: 'ARPOZAN Ultimate Pack',
                  description:
                    'Полный набор натуральных добавок для мужского здоровья',
                  offers: {
                    '@type': 'Offer',
                    price: '8990',
                    priceCurrency: 'RUB',
                  },
                },
              ],
            }),
          }}
        />
      </Head>

      {isLoading ? (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <LoadingSpinner size="lg" text="Загрузка ARPOZAN..." />
        </div>
      ) : (
        <div className="antialiased">
          <div className="bg-black fixed inset-0 -z-10"></div>

          {/* Assuming Header component is defined */}
          {/* <Header
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setIsQuizModalOpen={setIsQuizModalOpen}
          handleOrderClick={handleOrderClick}
          headerRef={headerRef}
        /> */}

          {/* Mobile Menu - Similar to index.html */}
          <div
            id="mobile-menu"
            className={`fixed inset-0 z-40 flex flex-col items-end justify-center bg-black/95 backdrop-blur-xl text-white transition-all duration-500 pr-8 ${
              isMenuOpen
                ? 'active opacity-100 visible scale-100'
                : 'opacity-0 invisible scale-95'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Мобильная навигация"
          >
            <div className="flex flex-col items-end space-y-6 text-right">
              <a
                href="#science"
                className="mobile-link text-2xl"
                onClick={() => setIsMenuOpen(false)}
              >
                Наука
              </a>
              <a
                href="#catalog"
                className="mobile-link text-2xl"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </a>
              <a
                href="#pricing"
                className="mobile-link text-2xl"
                onClick={() => setIsMenuOpen(false)}
              >
                Цены
              </a>
              <a
                href="#faq"
                className="mobile-link text-2xl"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <button
                onClick={() => {
                  handleOrderClick()
                  setIsMenuOpen(false)
                }}
                className="mobile-link glow-button text-black font-bold uppercase px-8 py-3 rounded-lg text-base sm:text-lg tracking-wider order-btn min-h-[48px] touch-manipulation"
              >
                Заказать
              </button>
            </div>
          </div>

          <main className="relative overflow-hidden">
            <div className="container mx-auto px-6">
              {/* Hero Section */}
              <section
                id="hero"
                className="grid grid-cols-12 gap-x-6 py-16 md:py-24 reveal"
              >
                <div className="col-span-12 md:col-span-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          aria-hidden="true"
                          focusable="false"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="#F59E0B"
                        >
                          <path d="M12 1.25a.91.91 0 01.8.4l2.5 5.2 5.8.8c.9.1 1.3 1.2.6 1.8l-4.2 4.1.9 5.8c.1.9-.8 1.6-1.6 1.2l-5.2-2.7-5.2 2.7c-.8.4-1.7-.3-1.6-1.2l.9-5.8-4.2-4.1c-.6-.6-.2-1.7.6-1.8l5.8-.8 2.5-5.2a.91.91 0 01.8-.4z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">
                      Более 10,000+ довольных клиентов
                    </p>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 sm:mb-6 leading-tight">
                    Твоя энергия —{' '}
                    <span className="gradient-text">твой капитал</span>
                  </h1>
                  <p className="text-base sm:text-lg text-gray-400 max-w-lg mb-6 sm:mb-8 leading-relaxed">
                    Разработано экспертами-нутрициологами для обеспечения вас
                    всеми необходимыми питательными веществами в течение дня.
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
                    <button
                      onClick={handleOrderClick}
                      className="glow-button w-full sm:w-auto text-black font-bold text-sm sm:text-base uppercase px-8 sm:px-10 py-4 rounded-lg tracking-wider order-btn min-h-[48px] touch-manipulation"
                    >
                      Купить ARPOZAN
                    </button>
                    <button
                      onClick={() => {
                        resetQuiz()
                        setIsQuizModalOpen(true)
                      }}
                      className="w-full sm:w-auto bg-transparent border border-white/30 text-white font-bold text-sm sm:text-base uppercase px-8 sm:px-10 py-4 rounded-lg tracking-wider hover:bg-white/10 transition-colors min-h-[48px] touch-manipulation"
                    >
                      Подобрать продукт
                    </button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6 product-image-container flex items-center justify-center mt-8 md:mt-0 px-4 md:px-0">
                  <Image
                    id="productImage"
                    src="/assets/imgs/Maka peruvian.png"
                    alt="ARPOZAN Maca - Natural Energy Supplement"
                    width={300}
                    height={600}
                    className="h-[350px] sm:h-[450px] md:h-[600px] object-contain drop-shadow-2xl max-w-full"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                </div>
              </section>

              {/* Science Section */}
              <section
                id="science"
                className="py-16 sm:py-20 md:py-32 reveal px-4 md:px-0"
              >
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white font-heading mb-4 tracking-tight">
                    Научный подход{' '}
                    <span className="gradient-text">ARPOZAN</span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20 mx-auto mb-6"></div>
                  <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Мы отказались от компромиссов. ARPOZAN — это чистые, мощные
                    экстракты в дозировках, подтвержденных исследованиями, для
                    тех, кто требует от жизни большего.
                  </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  
                  {/* Lab Tested */}
                  <div className="glass-card rounded-3xl p-6 sm:p-8 h-full border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-all duration-500">
                    <div className="flex flex-col h-full">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/15 transition-colors duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 11H7v8a2 2 0 002 2h2v-2H9v-8zm4-4h2a2 2 0 002-2V3a2 2 0 00-2-2h-2v2h2v2h-2v2zm0 4h2v8a2 2 0 002 2h2v-2h-2v-8h2a2 2 0 002-2V7a2 2 0 00-2-2h-2v2h2v2h-2v2zm-8 0h2V9H5a2 2 0 00-2 2v2a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-heading">
                        Проверено в лаборатории
                      </h3>
                      <p className="text-gray-300 leading-relaxed flex-grow">
                        Каждая партия проходит строгий контроль качества и
                        чистоты в независимых лабораториях Европы.
                      </p>
                      
                      {/* Stats */}
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Чистота</span>
                          <span className="text-white font-bold">99.9%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Natural Ingredients */}
                  <div className="glass-card rounded-3xl p-6 sm:p-8 h-full border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-all duration-500">
                    <div className="flex flex-col h-full">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/15 transition-colors duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L6 8v10c0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4V8l-6-6zm0 3.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zm0 10.5c-2.5 0-4.5-1.5-4.5-3v-1.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5V13c0 1.5-2 3-4.5 3z"/>
                        </svg>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-heading">
                        Натуральные ингредиенты
                      </h3>
                      <p className="text-gray-300 leading-relaxed flex-grow">
                        Мы используем только силу природы, без синтетических
                        добавок и искусственных наполнителей.
                      </p>
                      
                      {/* Stats */}
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Природность</span>
                          <span className="text-white font-bold">100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Effective Dosages */}
                  <div className="glass-card rounded-3xl p-6 sm:p-8 h-full border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-all duration-500">
                    <div className="flex flex-col h-full">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/15 transition-colors duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16a6.5 6.5 0 010-13zm0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z"/>
                        </svg>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-heading">
                        Эффективные дозировки
                      </h3>
                      <p className="text-gray-300 leading-relaxed flex-grow">
                        Только рабочие дозы, подтвержденные клиническими
                        исследованиями для реального результата.
                      </p>
                      
                      {/* Stats */}
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Эффективность</span>
                          <span className="text-white font-bold">Научно доказана</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Research Credentials */}
                <div className="mt-12 sm:mt-16">
                  <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 backdrop-blur-xl">
                    <div className="text-center mb-8">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                        Подтверждено исследованиями
                      </h3>
                      <p className="text-gray-300 max-w-2xl mx-auto">
                        Каждый ингредиент в составе ARPOZAN имеет научное обоснование 
                        и подтвержден клиническими испытаниями.
                      </p>
                    </div>
                    
                    {/* Research Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-white mb-2">50+</div>
                        <div className="text-sm text-gray-400">Научных исследований</div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-white mb-2">15</div>
                        <div className="text-sm text-gray-400">Лет разработки</div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-white mb-2">GMP</div>
                        <div className="text-sm text-gray-400">Стандарт качества</div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-white mb-2">EU</div>
                        <div className="text-sm text-gray-400">Сертификация</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Catalog Section */}
              <section
                id="catalog"
                className="grid grid-cols-12 gap-4 sm:gap-6 py-12 sm:py-16 md:py-24 reveal px-4 md:px-0"
              >
                <div className="col-span-12">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-white font-heading">
                    Наша линейка продуктов
                  </h2>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <div className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col text-center items-center h-full">
                    <Image
                      src="/assets/imgs/Yohimbin 1.png"
                      alt="ARPOZAN Yohimbe - Natural Energy and Focus Supplement"
                      width={160}
                      height={160}
                      className="h-32 sm:h-40 w-32 sm:w-40 object-contain mb-3 sm:mb-4"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                    />
                    <h3 className="font-bold text-lg sm:text-xl text-white font-heading">
                      ARPOZAN Yohimbe
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm my-2 flex-grow leading-relaxed">
                      Адреналиновый заряд для ваших самых амбициозных целей.
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white my-3 sm:my-4">2990₽</p>
                    <div className="w-full mt-auto">
                      <Link
                        href="/Yohimbin"
                        className="w-full inline-block text-center bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-transform hover:-translate-y-1 text-sm sm:text-base min-h-[44px] touch-manipulation"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <div className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col text-center items-center h-full">
                    <Image
                      src="/assets/imgs/Maka peruvian.png"
                      alt="ARPOZAN Maca - Natural Libido and Energy Booster"
                      width={160}
                      height={160}
                      className="h-32 sm:h-40 w-32 sm:w-40 object-contain mb-3 sm:mb-4"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                    />
                    <h3 className="font-bold text-lg sm:text-xl text-white font-heading">
                      ARPOZAN Maca
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm my-2 flex-grow leading-relaxed">
                      Природный бустер либидо и сексуальной энергии.
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white my-3 sm:my-4">1990₽</p>
                    <div className="w-full mt-auto">
                      <Link
                        href="/maca"
                        className="w-full inline-block text-center bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-transform hover:-translate-y-1 text-sm sm:text-base min-h-[44px] touch-manipulation"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <div className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col text-center items-center h-full">
                    <Image
                      src="/assets/imgs/Zink.png"
                      alt="ARPOZAN Zinc - Essential Men's Health Supplement"
                      width={160}
                      height={160}
                      className="h-32 sm:h-40 w-32 sm:w-40 object-contain mb-3 sm:mb-4"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                    />
                    <h3 className="font-bold text-lg sm:text-xl text-white font-heading">
                      ARPOZAN Zinc
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm my-2 flex-grow leading-relaxed">
                      Базовый элемент мужского здоровья и тестостерона.
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white my-3 sm:my-4">1990₽</p>
                    <div className="w-full mt-auto">
                      <Link
                        href="/zinc"
                        className="w-full inline-block text-center bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-transform hover:-translate-y-1 text-sm sm:text-base min-h-[44px] touch-manipulation"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <div className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col text-center items-center h-full">
                    <Image
                      src="/assets/imgs/Tongkat Ali.png"
                      alt="ARPOZAN Tongkat Ali - Natural Testosterone Booster"
                      width={160}
                      height={160}
                      className="h-32 sm:h-40 w-32 sm:w-40 object-contain mb-3 sm:mb-4"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                    />
                    <h3 className="font-bold text-lg sm:text-xl text-white font-heading">
                      ARPOZAN Tongkat Ali
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm my-2 flex-grow leading-relaxed">
                      Природный стимулятор тестостерона и мышечного роста.
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white my-3 sm:my-4">2990₽</p>
                    <div className="w-full mt-auto">
                      <Link
                        href="/Long-jack"
                        className="w-full inline-block text-center bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-transform hover:-translate-y-1 text-sm sm:text-base min-h-[44px] touch-manipulation"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* Ultimate Men's Pack Section */}
              <section
                id="pricing"
                className="py-16 sm:py-20 md:py-32 reveal px-4 md:px-0"
              >
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white font-heading mb-4 tracking-tight">
                    ULTIMATE <span className="gradient-text">MEN&apos;S PACK</span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20 mx-auto mb-6"></div>
                  <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Премиальный комплекс для мужчин, которые не идут на компромиссы
                  </p>
                </div>

                {/* Main Content */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10 backdrop-blur-xl">
                  <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Product Image */}
                    <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
                      <div className="relative group">
                        {/* Decorative elements */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <Image
                            src="/assets/imgs/Ultimate Pack.png"
                            alt="ARPOZAN Ultimate Men's Pack - Complete Natural Health Solution"
                            width={600}
                            height={600}
                            className="w-full max-w-md mx-auto drop-shadow-2xl"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
                      
                      {/* Premium Badge */}
                      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/20 rounded-full px-4 py-2 mb-6">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-sm font-medium text-white uppercase tracking-wider">Premium Collection</span>
                      </div>

                      {/* Description */}
                      <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed">
                        Синергетическая формула из четырех мощнейших природных адаптогенов. 
                        Максимальная концентрация активных веществ для достижения пиковой формы.
                      </p>

                      {/* Benefits Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-300">Максимальный тестостерон</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-300">Взрывная энергия</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-300">Мощное либидо</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-300">Быстрое восстановление</span>
                        </div>
                      </div>

                      {/* Subscription Toggle */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">Разовая покупка</span>
                            <label className="relative inline-flex items-center cursor-pointer w-14 h-7 touch-manipulation">
                              <input
                                type="checkbox"
                                checked={isSubscription}
                                onChange={(e) => setIsSubscription(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-full h-full bg-white/20 rounded-full peer-checked:bg-white transition-colors duration-300"></div>
                              <div className="absolute top-1 left-1 bg-black w-5 h-5 rounded-full shadow-md transform peer-checked:translate-x-7 transition-transform duration-300"></div>
                            </label>
                            <span className="font-semibold text-white text-sm">
                              Подписка <span className="text-gray-400">(-10%)</span>
                            </span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-end justify-between">
                          <div>
                            {isSubscription && (
                              <p className="text-gray-500 line-through text-lg mb-1">
                                {originalPrice.toLocaleString('ru-RU')} ₽
                              </p>
                            )}
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl sm:text-5xl font-black text-white">
                                {currentPrice.toLocaleString('ru-RU')}
                              </span>
                              <span className="text-xl text-gray-400">₽</span>
                            </div>
                            {isSubscription && (
                              <p className="text-white/80 font-medium text-sm mt-1">
                                Экономия {savings.toLocaleString('ru-RU')} ₽
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={handleOrderClick}
                            className="glow-button text-black font-bold uppercase px-8 py-4 rounded-xl tracking-wider text-sm min-h-[48px] touch-manipulation hover:scale-105 transition-transform duration-200"
                          >
                            Заказать сейчас
                          </button>
                        </div>
                      </div>

                      {/* Payment Icons */}
                      <div className="flex items-center justify-center lg:justify-start">
                        <PaymentIcons size="default" className="opacity-60" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-8 mt-12 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">10K+</div>
                    <div className="text-sm text-gray-400">Довольных клиентов</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">100%</div>
                    <div className="text-sm text-gray-400">Натуральные компоненты</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">30</div>
                    <div className="text-sm text-gray-400">Дней гарантии</div>
                  </div>
                </div>
              </section>

              {/* Enhanced Testimonials Section */}
              <TestimonialsCarousel autoPlay={true} interval={6000} />

              {/* FAQ Section */}
              <LuxuryFAQ 
                faqs={faqs}
                title="Часто задаваемые вопросы"
                variant="default"
                theme="dark"
              />
            </div>
          </main>

          {/* Lead Modal */}
          {isLeadModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
              <div className="glass-card rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center relative">
                <button
                  onClick={() => setIsLeadModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
                  Добро пожаловать!
                </h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Получите{' '}
                  <span className="text-amber-400 font-bold">скидку 10%</span>{' '}
                  на первый заказ.
                </p>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Ваш E-mail"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 min-h-[44px] touch-manipulation"
                  />
                  <button
                    type="submit"
                    className="glow-button w-full text-black font-bold py-3 rounded-lg min-h-[44px] touch-manipulation"
                  >
                    Получить скидку
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Premium Quiz Modal */}
          {isQuizModalOpen && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
              <div className="glass-card rounded-3xl shadow-2xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto border border-white/10 backdrop-blur-xl">
                <button
                  onClick={() => {
                    setIsQuizModalOpen(false)
                    resetQuiz()
                  }}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 touch-manipulation"
                >
                  <X size={20} />
                </button>

                {quizStep !== 'result' ? (
                  <div className="p-8 lg:p-12 quiz-content">
                    {/* Quiz Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading mb-4">
                        Подбор <span className="gradient-text">идеального продукта</span>
                      </h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20 mx-auto mb-4"></div>
                      <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Ответьте на несколько вопросов, и мы подберем продукты именно для ваших целей
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400 font-medium">Прогресс</span>
                        <span className="text-sm text-white font-bold">
                          {quizStep}/{quizQuestions.length}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-white via-white/80 to-white/60 h-3 rounded-full transition-all duration-500 shadow-lg"
                          style={{
                            width: `${(quizStep / quizQuestions.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Question */}
                    {quizQuestions[quizStep - 1] && (
                      <div>
                        <div className="glass-card rounded-2xl p-6 lg:p-8 mb-8 border border-white/10 backdrop-blur-xl">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center leading-tight font-heading">
                            {quizQuestions[quizStep - 1].question}
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {quizQuestions[quizStep - 1].options.map((option, index) => (
                            <button
                              key={option.id}
                              onClick={() =>
                                handleQuizAnswer(quizStep, option.id)
                              }
                              className="w-full p-5 lg:p-6 glass-card border border-white/10 hover:border-white/30 rounded-2xl text-left transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98] min-h-[60px] touch-manipulation backdrop-blur-xl"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="text-white text-base sm:text-lg font-medium group-hover:text-white transition-colors flex-1">
                                  {option.text}
                                </span>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Premium Results */
                  <div className="p-8 lg:p-12">
                    <div className="text-center mb-10">
                      <div className="w-20 h-20 bg-gradient-to-r from-white to-white/80 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black text-white font-heading mb-4">
                        Ваши рекомендации <span className="gradient-text">готовы!</span>
                      </h3>
                      <div className="w-24 h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20 mx-auto mb-6"></div>
                      <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        На основе ваших ответов мы подобрали идеальные продукты
                        для достижения ваших целей
                      </p>
                    </div>

                    {quizRecommendation && (
                      <div className="space-y-6">
                        {quizRecommendation.map((product, index) => (
                          <div
                            key={product.id}
                            className={`relative glass-card p-6 lg:p-8 rounded-3xl bg-gradient-to-r ${product.bgGradient} border border-white/20 group hover:scale-[1.02] transition-all duration-300 backdrop-blur-xl`}
                          >
                            {index === 0 && (
                              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-white to-white/80 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                #1 РЕКОМЕНДАЦИЯ
                              </div>
                            )}

                            <div className="flex flex-col lg:flex-row items-center gap-6">
                              <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-colors duration-300">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={60}
                                  height={60}
                                  className="object-contain"
                                />
                              </div>

                              <div className="flex-1 text-center lg:text-left">
                                <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 font-heading">
                                  {product.name}
                                </h4>
                                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                                  {product.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                  {product.benefits.map((benefit, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-center lg:justify-start text-sm text-gray-300"
                                    >
                                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                                      {benefit}
                                    </div>
                                  ))}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <div className="text-2xl sm:text-3xl font-black text-white">
                                    {product.price.toLocaleString()} ₽
                                  </div>
                                  <Link
                                    href={product.href}
                                    onClick={() => setIsQuizModalOpen(false)}
                                    className="glow-button text-black font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 text-center min-h-[48px] touch-manipulation uppercase tracking-wider"
                                  >
                                    Заказать сейчас
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                          <button
                            onClick={resetQuiz}
                            className="flex-1 glass-card border border-white/20 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:border-white/40 min-h-[48px] touch-manipulation backdrop-blur-xl"
                          >
                            Пройти тест заново
                          </button>
                          <button
                            onClick={() => {
                              setIsQuizModalOpen(false)
                              handleOrderClick()
                            }}
                            className="flex-1 glow-button text-black font-bold py-4 rounded-2xl min-h-[48px] touch-manipulation uppercase tracking-wider"
                          >
                            Посмотреть все продукты
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
