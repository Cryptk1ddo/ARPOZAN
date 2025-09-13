import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
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

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [isSubscription, setIsSubscription] = useState(false)
  const [openFaqs, setOpenFaqs] = useState(new Set())
  const [quizStep, setQuizStep] = useState(1)
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
      name: "Алексей М.",
      text: "После месяца приема ARPOZAN почувствовал прилив энергии и уверенности. Результат превзошел ожидания!",
      rating: 5
    },
    {
      name: "Дмитрий К.",
      text: "Отличное качество продукции. Заметил улучшение в тренировках и общем самочувствии.",
      rating: 5
    },
    {
      name: "Михаил П.",
      text: "ARPOZAN помог вернуть энергию молодости. Рекомендую всем мужчинам после 30!",
      rating: 5
    }
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
        quantity: 1
      }
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
        quantity: 1
      }
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
        quantity: 1
      }
    }
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
    if (typeof window !== 'undefined' && sessionStorage.getItem('leadModalShown') !== 'true') {
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
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  // GSAP animations
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach(el => {
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

  const toggleFaq = (index) => {
    const newOpenFaqs = new Set(openFaqs)
    if (newOpenFaqs.has(index)) {
      newOpenFaqs.delete(index)
    } else {
      newOpenFaqs.add(index)
    }
    setOpenFaqs(newOpenFaqs)
  }

  const handleOrderClick = () => {
    setIsOrderModalOpen(true)
    setTimeout(() => setIsOrderModalOpen(false), 2000)
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
      tl.to(btn, { scale: 0.95, duration: 0.1 })
        .to(btn, { scale: 1, duration: 0.3, ease: "back.out(1.7)" })
    }
  }

  const productData = {
    id: 'ultimate-pack',
    name: 'ARPOZAN Ultimate Pack',
    oneTimePrice: 8990,
    subscriptionPrice: 8091
  }

  const currentPrice = isSubscription ? productData.subscriptionPrice : productData.oneTimePrice
  const originalPrice = isSubscription ? productData.oneTimePrice : 9960
  const savings = originalPrice - currentPrice

  const faqs = [
    {
      question: "Чем ULTIMATE MEN'S PACK лучше?",
      answer: "Комплекс обеспечивает синергетический эффект — компоненты усиливают действие друг друга."
    },
    {
      question: "Нужно ли делать перерыв в приеме?",
      answer: "Мы рекомендуем принимать продукты курсами по 2-3 месяца с перерывом в 1 месяц."
    },
    {
      question: "Есть ли противопоказания?",
      answer: "Не рекомендуется лицам до 18 лет. Перед применением проконсультируйтесь со специалистом."
    }
  ]

  return (
    <Layout>
      <Head>
        <title>ARPOZAN - Энергия для победителей</title>
        <meta name="description" content="ARPOZAN - комплекс натуральных добавок для повышения энергии, тестостерона и либидо. Йохимбин, Мака, Тонгкат Али. Заказать с доставкой." />
        <meta name="keywords" content="мужское здоровье, тестостерон, энергия, либидо, натуральные добавки, ARPOZAN" />
        <link rel="canonical" href="https://arpozan.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ARPOZAN",
              "url": "https://arpozan.com",
              "description": "Комплекс натуральных добавок для повышения энергии, тестостерона и либидо",
              "product": [
                {
                  "@type": "Product",
                  "name": "ARPOZAN Ultimate Pack",
                  "description": "Полный набор натуральных добавок для мужского здоровья",
                  "offers": {
                    "@type": "Offer",
                    "price": "8990",
                    "priceCurrency": "RUB"
                  }
                }
              ]
            })
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
            isMenuOpen ? 'active opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Мобильная навигация"
        >
          <div className="flex flex-col items-end space-y-6 text-right">
            <a href="#science" className="mobile-link text-2xl" onClick={() => setIsMenuOpen(false)}>Наука</a>
            <a href="#catalog" className="mobile-link text-2xl" onClick={() => setIsMenuOpen(false)}>Каталог</a>
            <a href="#pricing" className="mobile-link text-2xl" onClick={() => setIsMenuOpen(false)}>Цены</a>
            <a href="#faq" className="mobile-link text-2xl" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <button
              onClick={() => {
                handleOrderClick()
                setIsMenuOpen(false)
              }}
              className="mobile-link glow-button text-black font-bold uppercase px-8 py-3 rounded-lg text-lg tracking-wider order-btn"
            >
              Заказать
            </button>
          </div>
        </div>

        <main className="relative overflow-hidden">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <section id="hero" className="grid grid-cols-12 gap-x-6 py-16 md:py-24 reveal">
              <div className="col-span-12 md:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {Array.from({length:5}).map((_,i)=> (
                      <svg key={i} aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B">
                        <path d="M12 1.25a.91.91 0 01.8.4l2.5 5.2 5.8.8c.9.1 1.3 1.2.6 1.8l-4.2 4.1.9 5.8c.1.9-.8 1.6-1.6 1.2l-5.2-2.7-5.2 2.7c-.8.4-1.7-.3-1.6-1.2l.9-5.8-4.2-4.1c-.6-.6-.2-1.7.6-1.8l5.8-.8 2.5-5.2a.91.91 0 01.8-.4z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">Более 10,000+ довольных клиентов</p>
                </div>
                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                  Твоя энергия — <span className="gradient-text">твой капитал</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-lg mb-8">
                  Разработано экспертами-нутрициологами для обеспечения вас всеми необходимыми питательными веществами в течение дня.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <button
                    onClick={handleOrderClick}
                    className="glow-button w-full sm:w-auto text-black font-bold text-base uppercase px-10 py-4 rounded-lg tracking-wider order-btn"
                  >
                    Купить ARPOZAN
                  </button>
                  <button
                    onClick={() => setIsQuizModalOpen(true)}
                    className="w-full sm:w-auto bg-transparent border border-white/30 text-white font-bold text-base uppercase px-10 py-4 rounded-lg tracking-wider hover:bg-white/10 transition-colors"
                  >
                    Подобрать продукт
                  </button>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 product-image-container flex items-center justify-center mt-12 md:mt-0">
                <Image
                  id="productImage"
                  src="/assets/imgs/Maka peruvian.png"
                  alt="ARPOZAN Maca - Natural Energy Supplement"
                  width={300}
                  height={600}
                  className="h-[450px] md:h-[600px] object-contain drop-shadow-2xl"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                />
              </div>
            </section>

            {/* Science Section */}
            <section id="science" className="grid grid-cols-12 gap-x-6 py-16 md:py-24">
              <div className="col-span-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-heading">
                  Научный подход <span className="gradient-text">ARPOZAN</span>
                </h2>
                <p className="text-gray-400 mt-6 max-w-3xl">
                  Мы отказались от компромиссов. ARPOZAN — это чистые, мощные экстракты в дозировках, подтвержденных исследованиями, для тех, кто требует от жизни большего.
                </p>
              </div>
              <div className="col-span-12 grid grid-cols-12 gap-6 mt-12">
                <div className="col-span-12 md:col-span-4">
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <h3 className="font-bold text-white text-lg">Проверено в лаборатории</h3>
                    <p className="text-gray-400 mt-2 text-sm">
                      Каждая партия проходит строгий контроль качества и чистоты.
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <h3 className="font-bold text-white text-lg">Натуральные ингредиенты</h3>
                    <p className="text-gray-400 mt-2 text-sm">
                      Мы используем только силу природы, без синтетических добавок.
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <h3 className="font-bold text-white text-lg">Эффективные дозировки</h3>
                    <p className="text-gray-400 mt-2 text-sm">
                      Только рабочие дозы для реального результата.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Catalog Section */}
            <section id="catalog" className="grid grid-cols-12 gap-6 py-16 md:py-24 reveal">
              <div className="col-span-12">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white font-heading">
                  Наша линейка продуктов
                </h2>
              </div>
              <div className="col-span-12 md:col-span-3">
                <div className="glass-card rounded-2xl p-6 flex flex-col text-center items-center h-full">
                  <Image 
                    src="/assets/imgs/Yohimbin 1.png" 
                    alt="ARPOZAN Yohimbe - Natural Energy and Focus Supplement" 
                    width={160} 
                    height={160} 
                    className="h-40 w-40 object-contain mb-4"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                  <h3 className="font-bold text-xl text-white font-heading">ARPOZAN Yohimbe</h3>
                  <p className="text-gray-400 text-sm my-2 flex-grow">
                    Адреналиновый заряд для ваших самых амбициозных целей.
                  </p>
                  <p className="text-2xl font-bold text-white my-4">2990₽</p>
                  <div className="w-full mt-auto">
                    <Link
                      href="/Yohimbin"
                      className="w-full inline-block text-center bg-white/10 text-white font-bold py-2 rounded-lg hover:bg-white/20 transition-transform hover:-translate-y-1"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-3">
                <div className="glass-card rounded-2xl p-6 flex flex-col text-center items-center h-full">
                  <Image 
                    src="/assets/imgs/Maka peruvian.png" 
                    alt="ARPOZAN Maca - Natural Libido and Energy Booster" 
                    width={160} 
                    height={160} 
                    className="h-40 w-40 object-contain mb-4"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                  <h3 className="font-bold text-xl text-white font-heading">ARPOZAN Maca</h3>
                  <p className="text-gray-400 text-sm my-2 flex-grow">
                    Природный бустер либидо и сексуальной энергии.
                  </p>
                  <p className="text-2xl font-bold text-white my-4">1990₽</p>
                  <div className="w-full mt-auto">
                    <Link
                      href="/maca"
                      className="w-full inline-block text-center bg-white/10 text-white font-bold py-2 rounded-lg hover:bg-white/20 transition-transform hover:-translate-y-1"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-3">
                <div className="glass-card rounded-2xl p-6 flex flex-col text-center items-center h-full">
                  <Image 
                    src="/assets/imgs/Zink.png" 
                    alt="ARPOZAN Zinc - Essential Men's Health Supplement" 
                    width={160} 
                    height={160} 
                    className="h-40 w-40 object-contain mb-4"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                  <h3 className="font-bold text-xl text-white font-heading">ARPOZAN Zinc</h3>
                  <p className="text-gray-400 text-sm my-2 flex-grow">
                    Базовый элемент мужского здоровья и тестостерона.
                  </p>
                  <p className="text-2xl font-bold text-white my-4">1990₽</p>
                  <div className="w-full mt-auto">
                    <Link
                      href="/zinc"
                      className="w-full inline-block text-center bg-white/10 text-white font-bold py-2 rounded-lg hover:bg-white/20 transition-transform hover:-translate-y-1"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-3">
                <div className="glass-card rounded-2xl p-6 flex flex-col text-center items-center h-full">
                  <Image 
                    src="/assets/imgs/Tongkat Ali.png" 
                    alt="ARPOZAN Tongkat Ali - Natural Testosterone Booster" 
                    width={160} 
                    height={160} 
                    className="h-40 w-40 object-contain mb-4"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                  <h3 className="font-bold text-xl text-white font-heading">ARPOZAN Tongkat Ali</h3>
                  <p className="text-gray-400 text-sm my-2 flex-grow">
                    Природный стимулятор тестостерона и мышечного роста.
                  </p>
                  <p className="text-2xl font-bold text-white my-4">2990₽</p>
                  <div className="w-full mt-auto">
                    <Link
                      href="/Long-jack"
                      className="w-full inline-block text-center bg-white/10 text-white font-bold py-2 rounded-lg hover:bg-white/20 transition-transform hover:-translate-y-1"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="grid grid-cols-12 gap-x-6 py-16 md:py-24 items-center reveal">
              <div className="col-span-12 md:col-span-6">
                <Image 
                  src="/assets/imgs/Ultimate Pack.png" 
                  alt="ARPOZAN Ultimate Men's Pack - Complete Natural Health Solution" 
                  width={500} 
                  height={500} 
                  className="rounded-2xl w-full"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                />
              </div>
              <div className="col-span-12 md:col-span-6 md:pl-12 mt-8 md:mt-0">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-heading">
                  ULTIMATE MEN&apos;S PACK
                </h2>
                <p className="text-gray-400 mt-4 max-w-lg">
                  Полный набор для максимального синергетического эффекта. Поддержите гормональную систему, энергию, интимную жизнь и восстановление.
                </p>
                <div className="flex items-center justify-start space-x-4 my-6">
                  <span className="text-gray-400 text-sm">Разовая покупка</span>
                  <label className="relative inline-flex items-center cursor-pointer w-16 h-8">
                    <input
                      type="checkbox"
                      checked={isSubscription}
                      onChange={(e) => setIsSubscription(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-full h-full bg-gray-600 rounded-full peer-checked:bg-amber-500 transition-colors duration-300"></div>
                    <div className="absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform peer-checked:translate-x-8 toggle-handle"></div>
                  </label>
                  <span className="font-semibold gradient-text text-sm">Подписка (-10%)</span>
                </div>
                <div className="flex items-center justify-between bg-black/30 rounded-lg p-4">
                  <div>
                    <p className="text-gray-500 line-through text-lg">
                      {originalPrice.toLocaleString('ru-RU')} ₽
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {currentPrice.toLocaleString('ru-RU')} ₽
                    </p>
                    <p className="gradient-text font-semibold">
                      Экономия {savings.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <button
                    onClick={handleOrderClick}
                    className="glow-button text-black font-bold uppercase px-8 py-4 rounded-lg tracking-wider order-btn"
                  >
                    Заказать
                  </button>
                </div>
              </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <TestimonialsCarousel autoPlay={true} interval={6000} />

            {/* FAQ Section */}
            <section id="faq" className="py-16 md:py-24 col-span-12 reveal">
              <div className="grid grid-cols-12 gap-x-6">
                <div className="col-span-12">
                  <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white font-heading">
                    Часто задаваемые вопросы
                  </h2>
                </div>
                <div className="col-span-12 max-w-4xl mx-auto">
                  {faqs.map((faq, index) => (
                    <div key={index} className="glass-card rounded-2xl p-6 mb-4">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left flex justify-between items-center"
                      >
                        <h3 className="font-bold text-white text-lg">{faq.question}</h3>
                        <svg
                          className={`w-6 h-6 text-amber-400 transform transition-transform ${openFaqs.has(index) ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      <div className={`faq-answer pt-4 ${openFaqs.has(index) ? 'max-h-20' : 'max-h-0'} overflow-hidden transition-max-height duration-500 ease-in-out`}>
                        <p className="text-gray-400">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Order Modal */}
        {isOrderModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="glass-card rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Отличный выбор!</h3>
              <p className="text-gray-400 mb-6">Перенаправляем на страницу заказа...</p>
              <div className="w-12 h-12 mx-auto border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Lead Modal */}
        {isLeadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="glass-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative">
              <button
                onClick={() => setIsLeadModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-2xl font-bold gradient-text mb-2">Добро пожаловать!</h3>
              <p className="text-gray-300 mb-4">
                Получите <span className="text-amber-400 font-bold">скидку 10%</span> на первый заказ.
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Ваш E-mail"
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                />
                <button type="submit" className="glow-button w-full text-black font-bold py-3 rounded-lg">
                  Получить скидку
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10 py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <h3 className="text-2xl font-bold gradient-text font-heading mb-4">ARPOZAN</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Натуральные решения для вашей силы и здоровья. Присоединяйтесь к тысячам мужчин, которые уже улучшили свою жизнь.
                </p>
                <NewsletterSignup />
              </div>
              <div className="col-span-12 md:col-span-3">
                <h4 className="font-bold text-white mb-4">Продукты</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/maca" className="hover:text-gray-300 transition-colors">ARPOZAN Maca</Link></li>
                  <li><Link href="/Yohimbin" className="hover:text-gray-300 transition-colors">ARPOZAN Yohimbe</Link></li>
                  <li><Link href="/zinc" className="hover:text-gray-300 transition-colors">ARPOZAN Zinc</Link></li>
                  <li><Link href="/Long-jack" className="hover:text-gray-300 transition-colors">ARPOZAN Tongkat Ali</Link></li>
                </ul>
              </div>
              <div className="col-span-12 md:col-span-3">
                <h4 className="font-bold text-white mb-4">Поддержка</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#faq" className="hover:text-yellow-400 transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-yellow-400 transition-colors">Контакты</a></li>
                  <li><a href="#" className="hover:text-yellow-400 transition-colors">Политика конфиденциальности</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 ARPOZAN. Все права защищены.</p>
            </div>
          </div>
        </footer>
      </div>
    )}
  </Layout>
)
}