import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import StickyCTA from '../components/StickyCTA'
import PaymentIcons from '../components/PaymentIcons'
import { useCart } from '../lib/CartContext'
import { useToast } from '../lib/ToastContext'
import { animations } from '../lib/gsapUtils'
import { utils } from '../lib/lodashUtils'
import gsap from 'gsap'

export default function LongJack() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState('one-time')
  const [quantity, setQuantity] = useState(1)
  const [activeBenefit, setActiveBenefit] = useState('testosterone')
  const [activeComponent, setActiveComponent] = useState('eurypeptides')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const benefitsRef = useRef([])
  const componentsRef = useRef([])
  const { addToCart } = useCart()
  const { push } = useToast()

  const images = [
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Product.png",
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Ingredients.png",
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Effects.png",
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-benefits.png",
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Science.png",
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Testimonials.png"
  ]

  const benefits = {
    testosterone: "Повышает уровень тестостерона и мужскую силу",
    energy: "Увеличивает физическую и умственную энергию",
    stamina: "Повышает выносливость и спортивные результаты",
    recovery: "Ускоряет восстановление после тренировок"
  }

  const components = {
    eurypeptides: {
      title: "Эурипептиды",
      content: "Это уникальные биологически активные соединения, которые содержатся только в корне тонгкат али. Они стимулируют выработку тестостерона естественным путем, не вмешиваясь напрямую в гормональную систему."
    },
    glycosaponins: {
      title: "Гликосапонины",
      content: "Комплекс природных соединений, которые улучшают кровообращение и повышают уровень энергии. Они помогают организму лучше усваивать питательные вещества и поддерживают общий тонус."
    },
    alkaloids: {
      title: "Алкалоиды",
      content: "Природные вещества, которые обладают адаптогенными свойствами. Они помогают организму лучше справляться со стрессом, улучшают сон и повышают общую резистентность к негативным факторам."
    }
  }

  // Particles animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let particles = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25
      })
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(245, 166, 35, 0.2)'

      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })

      requestAnimationFrame(drawParticles)
    }

    drawParticles()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // GSAP Animations
  useEffect(() => {
    // Hero section animations
    if (titleRef.current) {
      animations.fadeIn(titleRef.current, 1, 0.3)
    }

    // Benefits tabs hover effects
    benefitsRef.current.forEach((benefit, index) => {
      if (benefit) {
        animations.hoverScale(benefit, 1.02)
      }
    })

    // Component tabs hover effects
    componentsRef.current.forEach((component, index) => {
      if (component) {
        animations.hoverScale(component, 1.02)
      }
    })

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach(el => {
      animations.scrollReveal(el)
    })

  }, [])

  // Intersection Observer for reveal animations (keeping original for compatibility)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleImageChange = (index) => {
    setCurrentImageIndex(index)
  }

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    const product = {
      id: 'long-jack',
      name: 'Тонгкат Али',
      price: selectedPlan === 'subscription' ? 2691 : 1990,
      quantity: quantity,
      plan: selectedPlan
    }

    // Use Lodash to validate and format data
    if (utils.isEmpty(product.name) || !utils.isNumber(product.price)) {
      push('Ошибка: некорректные данные товара')
      return
    }

    addToCart(product)
    push(`✅ ${product.name} добавлен в корзину!`)

    // GSAP animation for add to cart feedback
    const addToCartBtn = document.querySelector('.glow-button')
    if (addToCartBtn) {
      const tl = gsap.timeline()
      tl.to(addToCartBtn, { scale: 0.95, duration: 0.1 })
        .to(addToCartBtn, { scale: 1, duration: 0.3, ease: "back.out(1.7)" })
    }
  }

  const productData = {
    id: 'long-jack',
    name: 'Тонгкат Али',
    oneTimePrice: 1990,
    subscriptionPrice: 2691
  }

  return (
    <>
      <Head>
        <title>Тонгкат Али - ARPOZAN</title>
        <meta name="description" content="Тонгкат Али для тестостерона и мужской силы от ARPOZAN. Природный бустер тестостерона из Малайзии." />
      </Head>

      <Layout>
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

        <main>
          <div className="relative">
            <section id="product" className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[25px]">
              <div className="lg:sticky lg:top-[81px] h-[60vh] lg:h-[calc(100vh-81px)]">
                <div className="relative reveal w-full h-full p-8 lg:p-16 flex items-center justify-center">
                  <img
                    src={images[currentImageIndex]}
                    alt="Изображение продукта Тонгкат Али"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />

                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between z-10">
                    <button
                      onClick={() => handleImageChange((currentImageIndex - 1 + images.length) % images.length)}
                      className="bg-gray-900/50 hover:bg-gray-900/80 p-2 rounded-full text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleImageChange((currentImageIndex + 1) % images.length)}
                      className="bg-gray-900/50 hover:bg-gray-900/80 p-2 rounded-full text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-6 flex space-x-2 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-yellow-500' : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center py-16 px-4 sm:px-8" id="purchase-section">
                <div className="max-w-[450px] w-full">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B">
                          <path d="M12 1.25a.91.91 0 01.8.4l2.5 5.2 5.8.8c.9.1 1.3 1.2.6 1.8l-4.2 4.1.9 5.8c.1.9-.8 1.6-1.6 1.2l-5.2-2.7-5.2 2.7c-.8.4-1.7-.3-1.6-1.2l.9-5.8-4.2-4.1c-.6-.6-.2-1.7.6-1.8l5.8-.8 2.5-5.2a.91.91 0 01.8-.4z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-normal text-gray-400">978 отзывов</span>
                  </div>
                  <h1 ref={titleRef} className="text-4xl lg:text-5xl font-bold gradient-text mt-2">Тонгкат Али</h1>
                  <p className="mt-2 text-gray-400 text-lg">Природный бустер тестостерона</p>

                  <p className="mt-6 text-gray-400">Мощный корень из джунглей Малайзии, который веками использовали мужчины для поддержания мужской силы и энергии.</p>

                  <div className="mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="benefits-tabs">
                      {Object.entries(benefits).map(([key, description], index) => (
                        <button
                          key={key}
                          ref={el => benefitsRef.current[index] = el}
                          onClick={() => setActiveBenefit(key)}
                          className={`benefit-tab-btn p-3 rounded-lg text-sm font-semibold border-2 transition ${
                            activeBenefit === key
                              ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                              : 'bg-gray-800/50 text-gray-300 border-transparent hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {key === 'testosterone' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                              {key === 'energy' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                              {key === 'stamina' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                              {key === 'recovery' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                            </svg>
                            {key === 'testosterone' && 'Тестостерон'}
                            {key === 'energy' && 'Энергия'}
                            {key === 'stamina' && 'Выносливость'}
                            {key === 'recovery' && 'Восстановление'}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 text-gray-400 text-sm min-h-[64px]">
                      {benefits[activeBenefit]}
                    </div>
                  </div>

                  <form className="mt-8 space-y-6">
                    <fieldset>
                      <legend className="font-bold text-lg mb-4">Выберите ваш план</legend>

                      <div className={`p-4 glass-card rounded-lg mb-4 border ${selectedPlan === 'one-time' ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-gray-700'}`}>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="purchase_type"
                            value="one-time"
                            id="one-time"
                            checked={selectedPlan === 'one-time'}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="h-4 w-4 bg-transparent border-gray-600 text-yellow-500 focus:ring-yellow-600"
                          />
                          <label htmlFor="one-time" className="ml-4 flex-grow flex justify-between items-center cursor-pointer">
                            <div>
                              <p className="font-bold text-gray-200">Разовая покупка</p>
                              <p className="text-sm text-gray-400">60 капсул</p>
                            </div>
                            <div className="text-lg font-bold text-gray-200">1.990 ₽</div>
                          </label>
                        </div>
                      </div>

                      <div className={`glass-card rounded-lg border ${selectedPlan === 'subscription' ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-gray-700'}`}>
                        <div className="bg-yellow-500/10 px-4 py-2 text-center text-sm font-bold text-yellow-400 rounded-t-lg">
                          <p>Экономьте 10% на каждой доставке</p>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="purchase_type"
                              value="subscription"
                              id="subscribe"
                              checked={selectedPlan === 'subscription'}
                              onChange={(e) => setSelectedPlan(e.target.value)}
                              className="h-4 w-4 bg-transparent border-gray-600 text-yellow-500 focus:ring-yellow-600"
                            />
                            <label htmlFor="subscribe" className="ml-4 flex-grow flex justify-between items-center cursor-pointer">
                              <div>
                                <p className="font-bold text-gray-200">Подписка и скидка 10%</p>
                                <p className="text-sm text-gray-400">60 капсул</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-white">2.691 ₽</p>
                                <p className="text-sm line-through text-gray-500">2.990 ₽</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <div className="flex items-end gap-4">
                      <div>
                        <label htmlFor="quantity-input" className="block text-sm font-normal text-gray-400 mb-2">Количество</label>
                        <div className="relative flex items-center max-w-[8rem]">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(-1)}
                            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-l-lg p-4 h-12 focus:ring-gray-700 focus:ring-2 focus:outline-none"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <input
                            type="text"
                            id="quantity-input"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="bg-gray-900 border-t border-b border-gray-600 h-12 text-center text-gray-200 text-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full py-2"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(1)}
                            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-r-lg p-4 h-12 focus:ring-gray-700 focus:ring-2 focus:outline-none"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full glow-button font-bold px-6 rounded-lg text-lg shadow-lg h-12 flex-grow flex items-center justify-center"
                      >
                        Добавить в корзину
                      </button>
                    </div>
                  </form>

                  <div className="mt-4 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>30-дневная гарантия возврата денег</span>
                  </div>

                  <PaymentIcons />
                  <div className="mt-2 text-center text-xs text-gray-500">✍🏼 По вопросам приобретения пишите</div>
                </div>
              </div>
            </section>
          </div>

          <div className="container mx-auto px-4 lg:px-8">
            <section id="components" className="my-16 py-12 reveal">
              <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text">Ключевые компоненты силы</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Узнайте, что делает наш тонгкат али таким эффективным.</p>
                <div className="mt-12 max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
                    {Object.entries(components).map(([key, data], index) => (
                      <button
                        key={key}
                        ref={el => componentsRef.current[index] = el}
                        onClick={() => setActiveComponent(key)}
                        className={`font-bold py-3 px-6 rounded-lg text-lg flex-grow transition ${
                          activeComponent === key
                            ? 'glow-button'
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                      >
                        {key === 'eurypeptides' && 'Эурипептиды'}
                        {key === 'glycosaponins' && 'Гликосапонины'}
                        {key === 'alkaloids' && 'Алкалоиды'}
                      </button>
                    ))}
                  </div>
                  <div className="glass-card rounded-lg p-8 text-left min-h-[200px]">
                    <h3 className="text-2xl font-bold text-yellow-400">{components[activeComponent].title}</h3>
                    <p className="mt-4 text-gray-300">{components[activeComponent].content}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="my-16 py-12 reveal">
              <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text">Преимущество ARPOZAN</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Мы предлагаем не просто тонгкат али, а гарантированное качество и эффективность.</p>
                <div className="mt-12 max-w-4xl mx-auto">
                  <div className="grid grid-cols-3 gap-px bg-gray-700 rounded-lg overflow-hidden glass-card border-0">
                    <div className="bg-black/50 p-4 font-bold">Параметр</div>
                    <div className="bg-black/50 p-4 font-bold gradient-text">ARPOZAN Тонгкат</div>
                    <div className="bg-black/50 p-4 font-bold text-gray-400">Обычный Тонгкат</div>

                    <div className="p-4 text-left font-bold bg-black/30">Происхождение</div>
                    <div className="p-4 bg-black/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">Малайзия</span>
                    </div>
                    <div className="p-4 bg-black/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="ml-2">Неизвестно</span>
                    </div>

                    <div className="p-4 text-left font-bold bg-black/40">Концентрация</div>
                    <div className="p-4 bg-black/40 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">200:1</span>
                    </div>
                    <div className="p-4 bg-black/40 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="ml-2">50:1</span>
                    </div>

                    <div className="p-4 text-left font-bold bg-black/30">Контроль качества</div>
                    <div className="p-4 bg-black/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">Лабораторные тесты</span>
                    </div>
                    <div className="p-4 bg-black/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="ml-2">Отсутствует</span>
                    </div>

                    <div className="p-4 text-left font-semibold bg-black/40">Гарантия</div>
                    <div className="p-4 bg-black/40 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2">30 дней на возврат</span>
                    </div>
                    <div className="p-4 bg-black/40 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="ml-2">Нет</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-16 text-center reveal">
              <h2 className="text-3xl font-bold gradient-text">Простой путь к вашей энергии</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                <div className="flex flex-col items-center p-6 glass-card rounded-lg">
                  <span className="text-2xl font-bold text-yellow-400">1</span>
                  <h3 className="text-xl font-bold">Примите 1 капсулу</h3>
                  <p className="text-gray-400 mt-2">Утром натощак для лучшего усвоения.</p>
                </div>
                <div className="flex flex-col items-center p-6 glass-card rounded-lg">
                  <span className="text-2xl font-bold text-yellow-400">2</span>
                  <h3 className="text-xl font-bold">Поддерживайте курс</h3>
                  <p className="text-gray-400 mt-2">Регулярный прием для поддержания уровня тестостерона.</p>
                </div>
                <div className="flex flex-col items-center p-6 glass-card rounded-lg">
                  <span className="text-2xl font-bold text-yellow-400">3</span>
                  <h3 className="text-xl font-bold">Почувствуйте силу</h3>
                  <p className="text-gray-400 mt-2">Увеличение энергии и мужской силы.</p>
                </div>
              </div>
            </section>

            <section className="my-16 py-12 reveal">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="glass-card rounded-lg p-4">
                    <img src="/assets/imgs/Tongkat Ali.png" alt="Научное исследование Тонгкат Али" className="rounded-md w-full max-h-[500px] object-contain" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold gradient-text">Научный подход к вашей силе</h2>
                    <p className="mt-4 text-lg text-gray-400">Тонгкат али содержит эурипептиды — уникальные биологически активные соединения, которые стимулируют естественную выработку тестостерона.</p>
                    <p className="mt-4 text-gray-400">Клинические исследования подтверждают эффективность тонгкат али в повышении уровня тестостерона, улучшении физической формы и увеличении мышечной массы у мужчин.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="faq" className="grid grid-cols-12 gap-x-6 py-16 md:py-24">
              <div className="col-span-12 md:col-span-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-heading">Частые<br />вопросы</h2>
              </div>
              <div className="col-span-12 md:col-span-8 mt-8 md:mt-0">
                <div className="space-y-4">
                  <details className="glass-card rounded-lg p-4">
                    <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg">
                      Есть ли противопоказания?
                      <span className="text-2xl font-normal text-amber-400">+</span>
                    </summary>
                    <div className="mt-3 text-gray-400">
                      <p>Не рекомендуется принимать при индивидуальной непереносимости компонентов. Перед применением рекомендуется проконсультироваться с врачом.</p>
                    </div>
                  </details>
                  <details className="glass-card rounded-lg p-4">
                    <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg">
                      Как долго длится курс?
                      <span className="text-2xl font-normal text-amber-400">+</span>
                    </summary>
                    <div className="mt-3 text-gray-400">
                      <p>Рекомендуемый курс - 2-3 месяца. Можно принимать на постоянной основе с небольшими перерывами.</p>
                    </div>
                  </details>
                  <details className="glass-card rounded-lg p-4">
                    <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg">
                      Можно ли совмещать с другими добавками?
                      <span className="text-2xl font-normal text-amber-400">+</span>
                    </summary>
                    <div className="mt-3 text-gray-400">
                      <p>Да, тонгкат али хорошо сочетается с цинком, витамином D и другими тестостерон-бустерами. Однако, для составления индивидуальной схемы лучше проконсультироваться со специалистом.</p>
                    </div>
                  </details>
                  <details className="glass-card rounded-lg p-4">
                    <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg">
                      Когда я увижу эффект?
                      <span className="text-2xl font-normal text-amber-400">+</span>
                    </summary>
                    <div className="mt-3 text-gray-400">
                      <p>Первые результаты обычно заметны через 2-4 недели регулярного приёма. Эффект накопительный.</p>
                    </div>
                  </details>
                </div>
              </div>
            </section>
          </div>
        </main>

        <StickyCTA product={productData} />
      </Layout>
    </>
  )
}
