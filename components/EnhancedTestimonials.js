import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react'
import { animations } from '../lib/gsapUtils'
import gsap from 'gsap'

const testimonialData = [
  {
    id: 1,
    quote:
      'Энергии стало в разы больше, тренировки проходят легче, а восстановление быстрее. Это то, что я искал.',
    name: 'Алексей П.',
    role: 'Профессиональный спортсмен',
    age: '28 лет',
    location: 'Москва',
    rating: 5,
    date: '2024-01-15',
    product: 'Мака перуанская',
    verified: true,
    image: '/assets/imgs/testimonials/alex.jpg',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 2,
    quote:
      'Работаю в IT, постоянные дедлайны. С этим комплексом голова стала яснее, и к вечеру остаются силы на семью.',
    name: 'Михаил В.',
    role: 'Предприниматель',
    age: '35 лет',
    location: 'Санкт-Петербург',
    rating: 5,
    date: '2024-01-12',
    product: 'Йохимбин Premium',
    verified: true,
    image: '/assets/imgs/testimonials/mikhail.jpg',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 3,
    quote:
      'Либидо вернулось на уровень 20-летнего. Жена довольна, я тоже. Спасибо, ребята!',
    name: 'Игорь С.',
    role: 'Инженер',
    age: '45 лет',
    location: 'Екатеринбург',
    rating: 5,
    date: '2024-01-10',
    product: 'Тонгкат Али',
    verified: true,
    image: '/assets/imgs/testimonials/igor.jpg',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 4,
    quote:
      'Совмещаю учебу и работу. С ARPOZAN концентрация выросла, а после смены есть силы на подготовку к экзаменам.',
    name: 'Дмитрий К.',
    role: 'Студент',
    age: '22 года',
    location: 'Новосибирск',
    rating: 5,
    date: '2024-01-08',
    product: 'Цинк пиколинат',
    verified: true,
    image: '/assets/imgs/testimonials/dmitry.jpg',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    id: 5,
    quote:
      'В 52 года думал, что пик формы позади. Этот комплекс вернул бодрость и мужскую уверенность.',
    name: 'Владимир Н.',
    role: 'Бизнесмен',
    age: '52 года',
    location: 'Казань',
    rating: 5,
    date: '2024-01-05',
    product: 'Ultimate Pack',
    verified: true,
    image: '/assets/imgs/testimonials/vladimir.jpg',
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 6,
    quote:
      "Пропал 'туман' в голове. Как дизайнер, я снова могу часами работать над проектами, не теряя фокуса.",
    name: 'Сергей Л.',
    role: 'Креативный директор',
    age: '38 лет',
    location: 'Ростов-на-Дону',
    rating: 5,
    date: '2024-01-03',
    product: 'Мака + Йохимбин',
    verified: true,
    image: '/assets/imgs/testimonials/sergey.jpg',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
]

export default function EnhancedTestimonials({
  autoPlay = true,
  interval = 5000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const cardRefs = useRef([])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      handleNext()
    }, interval)

    return () => clearInterval(timer)
  }, [currentIndex, isPlaying, interval])

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || !progressRef.current) return

    gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: interval / 1000,
        ease: 'none',
        transformOrigin: 'left center',
      }
    )
  }, [currentIndex, isPlaying, interval])

  // Initialize animations on mount
  useEffect(() => {
    if (containerRef.current) {
      animations.scrollReveal(containerRef.current)
    }
  }, [])

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex(
      (prev) => (prev - 1 + testimonialData.length) % testimonialData.length
    )
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonialData.length)
  }

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 20 : -20,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 20 : -20,
    }),
  }

  const cardVariants = {
    hover: {
      scale: 1.02,
      y: -10,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  }

  const currentTestimonial = testimonialData[currentIndex]

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 relative overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-3xl md:text-5xl font-bold text-white font-heading mb-4"
          >
            Что говорят наши <span className="gradient-text">клиенты</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Реальные отзывы реальных людей, которые изменили свою жизнь с
            ARPOZAN
          </motion.p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative h-[500px] perspective-1000">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4, ease: 'easeOut' },
                  rotateY: { duration: 0.6, ease: 'easeOut' },
                }}
                className="absolute inset-0"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="glass-card rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between relative overflow-hidden"
                  style={{
                    background: currentTestimonial.background,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 left-6 opacity-20">
                    <Quote size={80} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: i * 0.1,
                            type: 'spring',
                            stiffness: 500,
                            damping: 15,
                          }}
                        >
                          <Star
                            size={24}
                            className="text-amber-400 fill-current mr-1"
                          />
                        </motion.div>
                      ))}
                      {currentTestimonial.verified && (
                        <span className="ml-3 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Проверено
                        </span>
                      )}
                    </div>

                    {/* Quote */}
                    <motion.blockquote
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8"
                    >
                      &ldquo;{currentTestimonial.quote}&rdquo;
                    </motion.blockquote>

                    {/* Customer Info */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="flex items-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
                        <span className="text-white font-bold text-xl">
                          {currentTestimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {currentTestimonial.name}
                        </h3>
                        <p className="text-white/80">
                          {currentTestimonial.role}, {currentTestimonial.age}
                        </p>
                        <p className="text-white/60 text-sm">
                          {currentTestimonial.location} •{' '}
                          {currentTestimonial.product}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full transition-all duration-300 z-20"
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft size={24} className="text-white" />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full transition-all duration-300 z-20"
            aria-label="Следующий отзыв"
          >
            <ChevronRight size={24} className="text-white" />
          </motion.button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center mt-12 space-y-6">
          {/* Progress Bar */}
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transform origin-left scale-x-0"
            ></div>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center space-x-4">
            {testimonialData.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-amber-400 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Перейти к отзыву ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause size={16} className="text-white" />
            ) : (
              <Play size={16} className="text-white" />
            )}
            <span className="text-white text-sm">
              {isPlaying ? 'Пауза' : 'Играть'}
            </span>
          </motion.button>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          <div className="text-center glass-card rounded-2xl p-6">
            <div className="text-3xl font-bold text-amber-400 mb-2">98%</div>
            <div className="text-gray-300 text-sm">Довольных клиентов</div>
          </div>
          <div className="text-center glass-card rounded-2xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">15K+</div>
            <div className="text-gray-300 text-sm">Отзывов</div>
          </div>
          <div className="text-center glass-card rounded-2xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">4.9</div>
            <div className="text-gray-300 text-sm">Средняя оценка</div>
          </div>
          <div className="text-center glass-card rounded-2xl p-6">
            <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
            <div className="text-gray-300 text-sm">Года на рынке</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
