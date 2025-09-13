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
import Image from 'next/image'  // Add import

export default function Zinc() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState('one-time')
  const [activeBenefit, setActiveBenefit] = useState('testosterone')
  const [activeComponent, setActiveComponent] = useState('bioavailability')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const benefitsRef = useRef([])
  const componentsRef = useRef([])
  const { addToCart } = useCart()
  const { push } = useToast()

  const images = [
    "/assets/imgs/Zinc-product-imgs/Zinc-Product.png",
    "/assets/imgs/Zinc-product-imgs/Zinc-Ingredients.png",
    "/assets/imgs/Zinc-product-imgs/Zinc-Effects.png",
    "/assets/imgs/Zinc-product-imgs/Zinc-benefits.png",
    "/assets/imgs/Zinc-product-imgs/Zinc-Science.png",
    "/assets/imgs/Zinc-product-imgs/Zinc-Testimonials.png"
  ]

  const benefits = {
    testosterone: "Поддержка высокого уровня тестостерона, главного мужского гормона.",
    immunity: "Крепкий иммунитет и защита организма от вирусов и бактерий.",
    recovery: "Ускоренное заживление тканей и восстановление после физических нагрузок.",
    skin: "Чистая кожа без воспалений, крепкие волосы и ногти."
  }

  const components = {
    bioavailability: {
      title: "Максимальная Биодоступность",
      content: "Пиколинат — это форма цинка, связанная с пиколиновой кислотой. Организм человека легко распознает эту кислоту, что позволяет минералу усваиваться практически полностью, в отличие от оксида или сульфата, которые часто выводятся, не принеся пользы."
    },
    safety: {
      title: "Безопасность для ЖКТ",
      content: "Благодаря своей органической форме, пиколинат цинка не вызывает раздражения желудка и побочных эффектов, которые могут возникать при приеме других, более дешевых форм минерала."
    },
    effectiveness: {
      title: "Доказанная Эффективность",
      content: "Клинические исследования подтверждают, что цинк в форме пиколината быстрее и эффективнее восполняет дефицит в организме, что напрямую сказывается на уровне тестостерона и общем самочувствии."
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

  const handleAddToCart = () => {
    const product = {
      id: 'zinc',
      name: 'Цинк пиколинат',
      price: selectedPlan === 'subscription' ? 2691 : 1990,
      quantity: 1,
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
    id: 'zinc',
    name: 'Цинк пиколинат',
    oneTimePrice: 1990,
    subscriptionPrice: 2691
  }

  return (
    <>
      <Head>
        <title>Цинк пиколинат - ARPOZAN</title>
        <meta name="description" content="Цинк пиколинат для тестостерона и иммунитета от ARPOZAN. Натуральная форма цинка для мужского здоровья." />
      </Head>

      <Layout>
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

        <main>
          <div className="relative">
            <section id="product" className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[25px]">
              <div className="lg:sticky lg:top-[81px] h-[60vh] lg:h-[calc(100vh-81px)]">
                <div className="relative reveal w-full h-full p-8 lg:p-16 flex items-center justify-center">
                  <Image
                    src={images[currentImageIndex]}
                    alt="Изображение продукта Цинк пиколинат"
                    width={500}
                    height={500}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
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
                          index === currentImageIndex ? 'bg-white' : 'bg-gray-600 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center py-16 px-4 sm:px-8" id="purchase-section">
                <div className="max-w-[450px] w-full">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex text-gray-300">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#D1D5DB">
                          <path d="M12 1.25a.91.91 0 01.8.4l2.5 5.2 5.8.8c.9.1 1.3 1.2.6 1.8l-4.2 4.1.9 5.8c.1.9-.8 1.6-1.6 1.2l-5.2-2.7-5.2 2.7c-.8.4-1.7-.3-1.6-1.2l.9-5.8-4.2-4.1c-.6-.6-.2-1.7.6-1.8l5.8-.8 2.5-5.2a.91.91 0 01.8-.4z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm font-normal text-gray-400">978 отзывов</span>
                  </div>
                  <h1 ref={titleRef} className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mt-2">Цинк пиколинат</h1>
                  <p className="mt-2 text-gray-400 text-base sm:text-lg">Для тестостерона и иммунитета</p>

                  <p className="mt-6 text-gray-400">Высокобюодоступная форма цинка, которая поддерживает мужской гормональный баланс и укрепляет защитные силы организма.</p>

                  <div className="mt-6">
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2" id="benefits-tabs">
                      {Object.entries(benefits).map(([key, description], index) => (
                        <button
                          key={key}
                          ref={el => benefitsRef.current[index] = el}
                          onClick={() => setActiveBenefit(key)}
                          className={`benefit-tab-btn p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-semibold border-2 transition min-h-[60px] sm:min-h-[auto] ${
                            activeBenefit === key
                              ? 'bg-gray-500/10 text-gray-300 border-gray-500/30'
                              : 'bg-gray-800/50 text-gray-300 border-transparent hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1 sm:gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {key === 'testosterone' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                              {key === 'immunity' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                              {key === 'recovery' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                              {key === 'skin' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />}
                            </svg>
                            <span className="text-center leading-tight">
                              {key === 'testosterone' && 'Тестостерон'}
                              {key === 'immunity' && 'Иммунитет'}
                              {key === 'recovery' && 'Восстановление'}
                              {key === 'skin' && 'Кожа и волосы'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 text-gray-400 text-sm min-h-[64px] leading-relaxed">
                      {benefits[activeBenefit]}
                    </div>
                  </div>

                  <form className="mt-8 space-y-6">
                    <fieldset>
                      <legend className="font-bold text-lg mb-4">Выберите ваш план</legend>

                      <div className={`p-4 glass-card rounded-lg mb-4 border ${selectedPlan === 'one-time' ? 'border-white/50 ring-2 ring-white/20' : 'border-gray-700'}`}>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="purchase_type"
                            value="one-time"
                            id="one-time"
                            checked={selectedPlan === 'one-time'}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="h-4 w-4 bg-transparent border-gray-600 text-white focus:ring-white"
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

                      <div className={`glass-card rounded-lg border ${selectedPlan === 'subscription' ? 'border-white/50 ring-2 ring-white/20' : 'border-gray-700'}`}>
                        <div className="bg-white/10 px-4 py-2 text-center text-sm font-bold text-white rounded-t-lg">
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
                              className="h-4 w-4 bg-transparent border-gray-600 text-white focus:ring-white"
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
                          <div className="mt-4 pl-8 border-t border-gray-700/50 pt-4">
                            <p className="text-sm font-bold text-gray-300">Как работает подписка:</p>
                            <ul className="mt-2 mb-4 space-y-2 text-sm text-gray-400">
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Самый выгодный вариант
                              </li>
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Скидка 10% на все последующие заказы
                              </li>
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Легко изменяйте или пропускайте доставку
                              </li>
                              <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Отмена в любое время
                              </li>
                            </ul>
                            <p className="text-sm font-bold text-gray-300 mb-2">Доставка каждые:</p>
                            <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm">
                              <div>
                                <input type="radio" id="freq4" name="frequency" value="4" className="hidden peer" />
                                <label htmlFor="freq4" className="block text-center py-2 px-2 sm:px-4 rounded-lg border border-gray-600 peer-checked:border-gray-300 peer-checked:bg-gray-500/10 cursor-pointer transition text-xs sm:text-sm">4 недели</label>
                              </div>
                              <div>
                                <input type="radio" id="freq6" name="frequency" value="6" className="hidden peer" defaultChecked />
                                <label htmlFor="freq6" className="block text-center py-2 px-2 sm:px-4 rounded-lg border border-gray-600 peer-checked:border-gray-300 peer-checked:bg-gray-500/10 cursor-pointer transition text-xs sm:text-sm">6 недель</label>
                              </div>
                              <div>
                                <input type="radio" id="freq8" name="frequency" value="8" className="hidden peer" />
                                <label htmlFor="freq8" className="block text-center py-2 px-2 sm:px-4 rounded-lg border border-gray-600 peer-checked:border-gray-300 peer-checked:bg-gray-500/10 cursor-pointer transition text-xs sm:text-sm">8 недель</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full glow-button font-bold px-4 sm:px-6 py-3 sm:py-0 rounded-lg text-base sm:text-lg shadow-lg h-10 sm:h-12 flex-grow flex items-center justify-center"
                      >
                        <span className="whitespace-nowrap">Добавить в корзину</span>
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
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Узнайте, что делает наш цинк пиколинат таким эффективным.</p>
                <div className="mt-12 max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
                    {Object.entries(components).map(([key, data], index) => (
                      <button
                        key={key}
                        ref={el => componentsRef.current[index] = el}
                        onClick={() => setActiveComponent(key)}
                        className={`font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg text-sm sm:text-lg flex-grow sm:flex-grow-0 transition ${
                          activeComponent === key
                            ? 'glow-button'
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                      >
                        {key === 'bioavailability' && 'Биодоступность'}
                        {key === 'safety' && 'Безопасность'}
                        {key === 'effectiveness' && 'Эффективность'}
                      </button>
                    ))}
                  </div>
                  <div className="glass-card rounded-lg p-4 sm:p-8 text-left min-h-[180px] sm:min-h-[200px]">
                    <h3 className="text-lg sm:text-2xl font-bold text-yellow-400">{components[activeComponent].title}</h3>
                    <p className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">{components[activeComponent].content}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="my-16 py-12 reveal">
              <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text">Преимущество ARPOZAN</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Мы предлагаем не просто цинк, а гарантированное качество и эффективность.</p>
                <div className="mt-12 max-w-4xl mx-auto">
                  <div className="grid grid-cols-3 gap-px bg-gray-700 rounded-lg overflow-hidden glass-card border-0">
                    <div className="bg-black/50 p-2 sm:p-4 font-bold text-xs sm:text-sm">Параметр</div>
                    <div className="bg-black/50 p-2 sm:p-4 font-bold gradient-text text-xs sm:text-sm">ARPOZAN Цинк</div>
                    <div className="bg-black/50 p-2 sm:p-4 font-bold text-gray-400 text-xs sm:text-sm">Обычный Цинк</div>

                    <div className="p-2 sm:p-4 text-left font-bold bg-black/30 text-xs sm:text-sm">Форма</div>
                    <div className="p-2 sm:p-4 bg-black/30 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Пиколинат</span>
                    </div>
                    <div className="p-2 sm:p-4 bg-black/30 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Оксид/Сульфат</span>
                    </div>

                    <div className="p-2 sm:p-4 text-left font-bold bg-black/40 text-xs sm:text-sm">Усвояемость</div>
                    <div className="p-2 sm:p-4 bg-black/40 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm">90%+</span>
                    </div>
                    <div className="p-2 sm:p-4 bg-black/40 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm">5-15%</span>
                    </div>

                    <div className="p-2 sm:p-4 text-left font-bold bg-black/30 text-xs sm:text-sm">Контроль качества</div>
                    <div className="p-2 sm:p-4 bg-black/30 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Лабораторные тесты</span>
                    </div>
                    <div className="p-2 sm:p-4 bg-black/30 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Отсутствует</span>
                    </div>

                    <div className="p-2 sm:p-4 text-left font-semibold bg-black/40 text-xs sm:text-sm">Гарантия</div>
                    <div className="p-2 sm:p-4 bg-black/40 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm">30 дней на возврат</span>
                    </div>
                    <div className="p-2 sm:p-4 bg-black/40 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Нет</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-16 text-center reveal">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Простой путь к вашей энергии</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 max-w-4xl mx-auto">
                <div className="flex flex-col items-center p-4 sm:p-6 glass-card rounded-lg">
                  <span className="text-xl sm:text-2xl font-bold text-gray-300">1</span>
                  <h3 className="text-lg sm:text-xl font-bold mt-2">Примите 1 капсулу</h3>
                  <p className="text-gray-400 mt-2 text-sm sm:text-base">Лучше всего во время еды для лучшего усвоения.</p>
                </div>
                <div className="flex flex-col items-center p-4 sm:p-6 glass-card rounded-lg">
                  <span className="text-xl sm:text-2xl font-bold text-gray-300">2</span>
                  <h3 className="text-lg sm:text-xl font-bold mt-2">Поддерживайте баланс</h3>
                  <p className="text-gray-400 mt-2 text-sm sm:text-base">Регулярный прием для поддержания уровня цинка.</p>
                </div>
                <div className="flex flex-col items-center p-4 sm:p-6 glass-card rounded-lg">
                  <span className="text-xl sm:text-2xl font-bold text-gray-300">3</span>
                  <h3 className="text-lg sm:text-xl font-bold mt-2">Почувствуйте эффект</h3>
                  <p className="text-gray-400 mt-2 text-sm sm:text-base">Улучшение иммунитета и гормонального баланса.</p>
                </div>
              </div>
            </section>

            <section className="my-16 py-12 reveal">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="glass-card rounded-lg p-4">
                    <Image
                      src="/assets/imgs/Zinc.png"
                      alt="Научное исследование Цинк пиколинат"
                      width={500}
                      height={500}
                      className="rounded-md w-full max-h-[500px] object-contain"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold gradient-text">Научный подход к вашей силе</h2>
                    <p className="mt-4 text-lg text-gray-400">Цинк пиколинат — это высокобюодоступная форма цинка, которая эффективно усваивается организмом и поддерживает нормальный уровень тестостерона.</p>
                    <p className="mt-4 text-gray-400">Клинические исследования подтверждают, что пиколинат цинка в 2-3 раза лучше усваивается по сравнению с традиционными формами, что делает его идеальным выбором для поддержания мужского здоровья.</p>
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
                      <p>Да, цинк хорошо сочетается с витамином D, магнием и другими минералами. Однако, для составления индивидуальной схемы лучше проконсультироваться со специалистом.</p>
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