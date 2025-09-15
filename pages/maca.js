import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import StickyCTA from '../components/StickyCTA'
import PaymentIcons from '../components/PaymentIcons'
import LuxuryFAQ from '../components/LuxuryFAQ'
import { useCart } from '../lib/CartContext'
import { useWishlist } from '../lib/WishlistContext'
import { useToast } from '../lib/ToastContext'
import { animations } from '../lib/gsapUtils'
import { utils } from '../lib/lodashUtils'
import { Heart } from 'lucide-react'
import gsap from 'gsap'

export default function Maca() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState('one-time')
  const [activeBenefit, setActiveBenefit] = useState('libido')
  const [activeComponent, setActiveComponent] = useState('maca')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const benefitsRef = useRef([])
  const componentsRef = useRef([])
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { push } = useToast()

  const images = [
    '/assets/imgs/Maca-product-imgs/Maca-Product.png',
    '/assets/imgs/Maca-product-imgs/Maca-Ingredients.png',
    '/assets/imgs/Maca-product-imgs/Maca-Effects.png',
    '/assets/imgs/Maca-product-imgs/Maca-benefits.png',
    '/assets/imgs/Maca-product-imgs/Maca-Science.png',
    '/assets/imgs/Maca-product-imgs/Maca-Testimonials.png',
  ]

  const benefits = {
    libido: 'Повышает сексуальное влечение и улучшает качество интимной жизни',
    energy: 'Увеличивает физическую и умственную энергию',
    stamina: 'Повышает выносливость и спортивные результаты',
    focus: 'Улучшает концентрацию и когнитивные функции',
  }

  const components = {
    maca: {
      title: 'Макамиды и Макаены',
      content:
        'Это уникальные жирные кислоты, которые содержатся только в маке. Они действуют как природные регуляторы, стимулируя эндокринную систему и повышая выработку гормонов, ответственных за либидо и энергию, не вмешиваясь напрямую в гормональный фон.',
    },
    amino: {
      title: 'Аминокислоты',
      content:
        'Мака богата аргинином — аминокислотой, которая улучшает кровообращение за счет расширения сосудов. Это напрямую влияет на качество эрекции и повышает физическую выносливость во время интимной близости.',
    },
    vitamins: {
      title: 'Витамины и Минералы',
      content:
        'Высокое содержание витаминов группы B, витамина C, а также цинка и йода, поддерживает общий тонус организма, снижает утомляемость и укрепляет нервную систему, что крайне важно для здоровой сексуальной функции.',
    },
  }

  const faqData = [
    {
      question: 'Безопасна ли мака для ежедневного приема?',
      answer: 'Да, мака перуанская является натуральным продуктом питания, который безопасен для ежедневного приема. Рекомендуется проконсультироваться с врачом при наличии хронических заболеваний.'
    },
    {
      question: 'Через сколько времени заметен эффект от маки?',
      answer: 'Первые изменения в уровне энергии могут быть заметны уже через 1-2 недели. Полный эффект на либидо и выносливость проявляется через 4-6 недель регулярного приема.'
    },
    {
      question: 'Можно ли принимать маку женщинам?',
      answer: 'Абсолютно! Мака традиционно использовалась как мужчинами, так и женщинами. Она помогает балансировать гормональный фон, повышает либидо и энергию у представителей обоих полов.'
    },
    {
      question: 'Влияет ли мака на гормональный фон?',
      answer: 'Мака не содержит гормоны, но действует как адаптоген, помогая организму естественным образом балансировать гормональную систему и повышать выработку собственных гормонов.'
    },
    {
      question: 'Есть ли противопоказания у маки перуанской?',
      answer: 'Мака противопоказана при индивидуальной непереносимости. С осторожностью следует принимать при заболеваниях щитовидной железы и во время беременности и кормления грудью.'
    },
    {
      question: 'Как правильно принимать маку для максимального эффекта?',
      answer: 'Рекомендуется принимать маку утром натощак или за 30 минут до еды. Можно смешивать с соком, йогуртом или добавлять в смузи. Начинайте с небольших доз и постепенно увеличивайте.'
    }
  ]

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
        vy: Math.random() * 0.5 - 0.25,
      })
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(245, 166, 35, 0.2)'

      particles.forEach((p) => {
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
    revealElements.forEach((el) => {
      animations.scrollReveal(el)
    })
  }, [])

  // Intersection Observer for reveal animations (keeping original for compatibility)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleImageChange = (index) => {
    setCurrentImageIndex(index)
  }

  const handleAddToCart = () => {
    const product = {
      id: 'maca',
      name: 'Мака перуанская',
      price: selectedPlan === 'subscription' ? 2691 : 1990,
      quantity: 1,
      plan: selectedPlan,
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
      tl.to(addToCartBtn, { scale: 0.95, duration: 0.1 }).to(addToCartBtn, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
      })
    }
  }

  const handleWishlistToggle = () => {
    const product = {
      id: 'maca',
      name: 'Мака перуанская',
      price: 1990,
      image: '/assets/imgs/Maka peruvian.png',
      href: '/maca'
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      push('💔 Товар удален из избранного')
    } else {
      addToWishlist(product)
      push('❤️ Товар добавлен в избранное!')
    }

    // GSAP animation for wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn')
    if (wishlistBtn) {
      const tl = gsap.timeline()
      tl.to(wishlistBtn, { scale: 0.8, duration: 0.1 })
        .to(wishlistBtn, { scale: 1.1, duration: 0.2 })
        .to(wishlistBtn, { scale: 1, duration: 0.1 })
    }
  }

  const productData = {
    id: 'maca',
    name: 'Мака перуанская',
    oneTimePrice: 1990,
    subscriptionPrice: 2691,
  }

  return (
    <>
      <Head>
        <title>Мака перуанская - ARPOZAN</title>
        <meta
          name="description"
          content="Природный бустер либидо от ARPOZAN. Мака перуанская для повышения энергии и сексуальной активности."
        />
      </Head>

      <Layout>
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        />

        <main>
          <div className="relative">
            <section
              id="product"
              className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[25px]"
            >
              <div className="lg:sticky lg:top-[81px] h-[60vh] lg:h-[calc(100vh-81px)]">
                <div className="relative reveal w-full h-full p-8 lg:p-16 flex items-center justify-center">
                  <Image
                    src={images[currentImageIndex]}
                    alt="Изображение продукта Мака перуанская"
                    fill
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />

                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between z-10">
                    <button
                      onClick={() =>
                        handleImageChange(
                          (currentImageIndex - 1 + images.length) %
                            images.length
                        )
                      }
                      className="bg-gray-900/50 hover:bg-gray-900/80 p-2 rounded-full text-white transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        handleImageChange(
                          (currentImageIndex + 1) % images.length
                        )
                      }
                      className="bg-gray-900/50 hover:bg-gray-900/80 p-2 rounded-full text-white transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-6 flex space-x-2 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? 'bg-white'
                            : 'bg-gray-600 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="flex flex-col justify-center py-16 px-4 sm:px-8"
                id="purchase-section"
              >
                <div className="max-w-[450px] w-full">
                  <div className="flex items-center gap-2">
                    <div className="flex text-gray-300">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="#D1D5DB"
                        >
                          <path d="M12 1.25a.91.91 0 01.8.4l2.5 5.2 5.8.8c.9.1 1.3 1.2.6 1.8l-4.2 4.1.9 5.8c.1.9-.8 1.6-1.6 1.2l-5.2-2.7-5.2 2.7c-.8.4-1.7-.3-1.6-1.2l.9-5.8-4.2-4.1c-.6-.6-.2-1.7.6-1.8l5.8-.8 2.5-5.2a.91.91 0 01.8-.4z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-normal text-gray-400">
                      978 отзывов
                    </span>
                  </div>
                  <h1
                    ref={titleRef}
                    className="text-4xl lg:text-5xl font-bold gradient-text mt-2"
                  >
                    Мака перуанская
                  </h1>
                  <p className="mt-2 text-gray-400 text-lg">
                    Природный бустер либидо
                  </p>

                  <p className="mt-6 text-gray-400">
                    Растение из высокогорных районов Перу, которое веками
                    использовали мужчины для поддержания силы и сексуальной
                    энергии.
                  </p>

                  <div className="mt-6">
                    <div
                      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2"
                      id="benefits-tabs"
                    >
                      {Object.entries(benefits).map(
                        ([key, description], index) => (
                          <button
                            key={key}
                            ref={(el) => (benefitsRef.current[index] = el)}
                            onClick={() => setActiveBenefit(key)}
                            className={`benefit-tab-btn p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-semibold border-2 transition min-h-[60px] sm:min-h-[auto] ${
                              activeBenefit === key
                                ? 'bg-gray-500/10 text-gray-300 border-gray-500/30'
                                : 'bg-gray-800/50 text-gray-300 border-transparent hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1 sm:gap-2">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {key === 'libido' && (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                )}
                                {key === 'energy' && (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                )}
                                {key === 'stamina' && (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                )}
                                {key === 'focus' && (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                  />
                                )}
                              </svg>
                              <span className="text-center leading-tight">
                                {key === 'libido' && 'Либидо'}
                                {key === 'energy' && 'Энергия'}
                                {key === 'stamina' && 'Выносливость'}
                                {key === 'focus' && 'Фокус'}
                              </span>
                            </div>
                          </button>
                        )
                      )}
                    </div>
                    <div className="mt-4 text-gray-400 text-sm min-h-[64px] leading-relaxed">
                      {benefits[activeBenefit]}
                    </div>
                  </div>

                  <form className="mt-8 space-y-6">
                    <fieldset>
                      <legend className="font-bold text-lg mb-4">
                        Выберите ваш план
                      </legend>

                      <div
                        className={`p-4 glass-card rounded-lg mb-4 border ${selectedPlan === 'one-time' ? 'border-white/50 ring-2 ring-white/20' : 'border-gray-700'}`}
                      >
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
                          <label
                            htmlFor="one-time"
                            className="ml-4 flex-grow flex justify-between items-center cursor-pointer"
                          >
                            <div>
                              <p className="font-bold text-gray-200">
                                Разовая покупка
                              </p>
                              <p className="text-sm text-gray-400">60 капсул</p>
                            </div>
                            <div className="text-lg font-bold text-gray-200">
                              1.990 ₽
                            </div>
                          </label>
                        </div>
                      </div>

                      <div
                        className={`glass-card rounded-lg border ${selectedPlan === 'subscription' ? 'border-white/50 ring-2 ring-white/20' : 'border-gray-700'}`}
                      >
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
                            <label
                              htmlFor="subscribe"
                              className="ml-4 flex-grow flex justify-between items-center cursor-pointer"
                            >
                              <div>
                                <p className="font-bold text-gray-200">
                                  Подписка и скидка 10%
                                </p>
                                <p className="text-sm text-gray-400">
                                  60 капсул
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-white">
                                  2.691 ₽
                                </p>
                                <p className="text-sm line-through text-gray-500">
                                  2.990 ₽
                                </p>
                              </div>
                            </label>
                          </div>
                          <div className="mt-4 pl-8 border-t border-gray-700/50 pt-4">
                            <p className="text-sm font-bold text-gray-300">
                              Как работает подписка:
                            </p>
                            <ul className="mt-2 mb-4 space-y-2 text-sm text-gray-400">
                              <li className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-gray-300 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Самый выгодный вариант
                              </li>
                              <li className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-gray-300 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Скидка 10% на все последующие заказы
                              </li>
                              <li className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-gray-300 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Легко изменяйте или пропускайте доставку
                              </li>
                              <li className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-gray-300 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Отмена в любое время
                              </li>
                            </ul>
                            <p className="text-sm font-bold text-gray-300 mb-2">
                              Доставка каждые:
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <input
                                  type="radio"
                                  id="freq4"
                                  name="frequency"
                                  value="4"
                                  className="hidden peer"
                                />
                                <label
                                  htmlFor="freq4"
                                  className="block text-center py-2 px-4 rounded-lg border border-gray-600 peer-checked:border-gray-300 peer-checked:bg-gray-500/10 cursor-pointer transition"
                                >
                                  4 недели
                                </label>
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  id="freq6"
                                  name="frequency"
                                  value="6"
                                  className="hidden peer"
                                  defaultChecked
                                />
                                <label
                                  htmlFor="freq6"
                                  className="block text-center py-2 px-4 rounded-lg border border-gray-600 peer-checked:border-gray-300 peer-checked:bg-gray-500/10 cursor-pointer transition"
                                >
                                  6 недель
                                </label>
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  id="freq8"
                                  name="frequency"
                                  value="8"
                                  className="hidden peer"
                                />
                                <label
                                  htmlFor="freq8"
                                  className="block text-center py-2 px-4 rounded-lg border border-gray-600 peer-checked:border-gray-300 peer-checked:bg-gray-500/10 cursor-pointer transition"
                                >
                                  8 недель
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="flex-1 glow-button font-bold px-4 sm:px-6 py-3 sm:py-0 rounded-lg text-base sm:text-lg shadow-lg h-10 sm:h-12 flex items-center justify-center"
                      >
                        <span className="whitespace-nowrap">
                          Добавить в корзину
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handleWishlistToggle}
                        className={`wishlist-btn w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
                          isInWishlist('maca')
                            ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30'
                            : 'bg-white/10 border-white/30 text-gray-400 hover:border-white/50 hover:text-white'
                        }`}
                        title={isInWishlist('maca') ? 'Удалить из избранного' : 'Добавить в избранное'}
                      >
                        <Heart 
                          size={20} 
                          className={`transition-all duration-300 ${
                            isInWishlist('maca') ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </form>

                  <div className="mt-4 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>30-дневная гарантия возврата денег</span>
                  </div>

                  <PaymentIcons />
                  <div className="mt-2 text-center text-xs text-gray-500">
                    ✍🏼 По вопросам приобретения пишите
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="container mx-auto px-4 lg:px-8">
            <section id="components" className="my-16 py-12 reveal">
              <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text">
                  Ключевые компоненты силы
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                  Узнайте, что делает нашу маку такой эффективной.
                </p>
                <div className="mt-12 max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
                    {Object.entries(components).map(([key, data], index) => (
                      <button
                        key={key}
                        ref={(el) => (componentsRef.current[index] = el)}
                        onClick={() => setActiveComponent(key)}
                        className={`font-bold py-3 px-6 rounded-lg text-lg flex-grow transition ${
                          activeComponent === key
                            ? 'glow-button'
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                      >
                        {key === 'maca' && 'Макамиды'}
                        {key === 'amino' && 'Аминокислоты'}
                        {key === 'vitamins' && 'Витамины и Минералы'}
                      </button>
                    ))}
                  </div>
                  <div className="glass-card rounded-lg p-8 text-left min-h-[200px]">
                    <h3 className="text-2xl font-bold text-yellow-400">
                      {components[activeComponent].title}
                    </h3>
                    <p className="mt-4 text-gray-300">
                      {components[activeComponent].content}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="my-16 py-12 reveal">
              <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text">
                  Преимущество ARPOZAN
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                  Мы предлагаем не просто маку, а гарантированное качество и
                  эффективность.
                </p>
                <div className="mt-12 max-w-4xl mx-auto">
                  <div className="grid grid-cols-3 gap-px bg-gray-700 rounded-lg overflow-hidden glass-card border-0">
                    <div className="bg-black/50 p-4 font-bold">Параметр</div>
                    <div className="bg-black/50 p-4 font-bold gradient-text">
                      ARPOZAN Мака
                    </div>
                    <div className="bg-black/50 p-4 font-bold text-gray-400">
                      Обычная Мака
                    </div>

                    <div className="p-4 text-left font-bold bg-black/30">
                      Происхождение
                    </div>
                    <div className="p-4 bg-black/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-2">Высокогорье Перу</span>
                    </div>
                    <div className="p-4 bg-black/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="ml-2">Неизвестно</span>
                    </div>

                    <div className="p-4 text-left font-bold bg-black/40">
                      Чистота
                    </div>
                    <div className="p-4 bg-black/40 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-2">100% без примесей</span>
                    </div>
                    <div className="p-4 bg-black/40 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="ml-2">Возможны добавки</span>
                    </div>

                    <div className="p-4 text-left font-bold bg-black/30">
                      Контроль качества
                    </div>
                    <div className="p-4 bg-black/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-2">Лабораторные тесты</span>
                    </div>
                    <div className="p-4 bg-black/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="ml-2">Отсутствует</span>
                    </div>

                    <div className="p-4 text-left font-semibold bg-black/40">
                      Гарантия
                    </div>
                    <div className="p-4 bg-black/40 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-2">30 дней на возврат</span>
                    </div>
                    <div className="p-4 bg-black/40 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="ml-2">Нет</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-16 text-center reveal">
              <h2 className="text-3xl font-bold gradient-text">
                Простой путь к вашей энергии
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                <div className="flex flex-col items-center p-6 glass-card rounded-lg">
                  <span className="text-2xl font-bold text-yellow-400">1</span>
                  <h3 className="text-xl font-bold">Примите 1-2 капсулы</h3>
                  <p className="text-gray-400 mt-2">
                    Лучше всего утром во время еды.
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 glass-card rounded-lg">
                  <span className="text-2xl font-bold text-gray-300">2</span>
                  <h3 className="text-xl font-bold">Запейте водой</h3>
                  <p className="text-gray-400 mt-2">
                    Один стакан воды для лучшего усвоения.
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 glass-card rounded-lg">
                  <span className="text-2xl font-bold text-gray-300">3</span>
                  <h3 className="text-xl font-bold">Почувствуйте эффект</h3>
                  <p className="text-gray-400 mt-2">
                    Наслаждайтесь приливом сил и энергии.
                  </p>
                </div>
              </div>
            </section>

            <section className="my-16 py-12 reveal">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="glass-card rounded-lg p-4">
                    <Image
                      src="/assets/imgs/Maka peruvian.png"
                      alt="Научное исследование Мака перуанская"
                      width={800}
                      height={500}
                      className="rounded-md w-full max-h-[500px] object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold gradient-text">
                      Научный подход к вашей силе
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                      Перуанская мака содержит уникальные биологически активные
                      вещества — макамиды и макаены. Научные исследования
                      показывают, что именно эти соединения отвечают за
                      повышение либидо и улучшение сексуальной функции.
                    </p>
                    <p className="mt-4 text-gray-400">
                      Они действуют на эндокринную систему, помогая организму
                      естественным образом регулировать гормональный баланс, что
                      приводит к увеличению энергии, выносливости и полового
                      влечения без использования синтетических стимуляторов.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <LuxuryFAQ 
              faqs={faqData}
              title="Частые вопросы"
              variant="split"
              theme="dark"
            />
          </div>
        </main>

        <StickyCTA product={productData} />
      </Layout>
    </>
  )
}
