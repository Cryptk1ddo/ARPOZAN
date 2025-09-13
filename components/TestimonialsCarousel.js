import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import gsap from 'gsap'

const testimonialData = [
  {
    id: 1,
    quote: "Энергии стало в разы больше, тренировки проходят легче, а восстановление быстрее. Это то, что я искал.",
    name: "Алексей П.",
    role: "Профессиональный спортсмен",
    age: "28 лет",
    location: "Москва",
    rating: 5,
    date: "2024-01-15",
    product: "Мака перуанская",
    verified: true
  },
  {
    id: 2,
    quote: "Работаю в IT, постоянные дедлайны. С этим комплексом голова стала яснее, и к вечеру остаются силы на семью.",
    name: "Михаил В.",
    role: "Предприниматель", 
    age: "35 лет",
    location: "Санкт-Петербург",
    rating: 5,
    date: "2024-01-12",
    product: "Йохимбин Premium",
    verified: true
  },
  {
    id: 3,
    quote: "Либидо вернулось на уровень 20-летнего. Жена довольна, я тоже. Спасибо, ребята!",
    name: "Игорь С.",
    role: "Инженер",
    age: "45 лет",
    location: "Екатеринбург",
    rating: 5,
    date: "2024-01-10",
    product: "Тонгкат Али",
    verified: true
  },
  {
    id: 4,
    quote: "Совмещаю учебу и работу. С ARPOZAN концентрация выросла, а после смены есть силы на подготовку к экзаменам.",
    name: "Дмитрий К.",
    role: "Студент",
    age: "22 года",
    location: "Новосибирск",
    rating: 5,
    date: "2024-01-08",
    product: "Цинк пиколинат",
    verified: true
  },
  {
    id: 5,
    quote: "В 52 года думал, что пик формы позади. Этот комплекс вернул бодрость и мужскую уверенность.",
    name: "Владимир Н.",
    role: "Бизнесмен",
    age: "52 года",
    location: "Казань",
    rating: 5,
    date: "2024-01-05",
    product: "Ultimate Pack",
    verified: true
  },
  {
    id: 6,
    quote: "Пропал 'туман' в голове. Как дизайнер, я снова могу часами работать над проектами, не теряя фокуса.",
    name: "Сергей Л.",
    role: "Креативный директор",
    age: "38 лет",
    location: "Ростов-на-Дону",
    rating: 5,
    date: "2024-01-03",
    product: "Мака + Йохимбин",
    verified: true
  }
]

export default function TestimonialsCarousel({ autoPlay = true, interval = 6000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [direction, setDirection] = useState(0)
  const progressRef = useRef(null)

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

    gsap.fromTo(progressRef.current, 
      { scaleX: 0 },
      { 
        scaleX: 1, 
        duration: interval / 1000,
        ease: "none",
        transformOrigin: "left center"
      }
    )
  }, [currentIndex, isPlaying, interval])

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonialData.length) % testimonialData.length)
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
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }

  const currentTestimonial = testimonialData[currentIndex]

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Luxury monochrome background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-white to-gray-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-white to-gray-200 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-bold text-white font-heading mb-4"
          >
            Что говорят наши <span className="gradient-text">клиенты</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Реальные отзывы реальных людей, которые изменили свою жизнь с ARPOZAN
          </motion.p>
        </div>

        {/* Main Testimonial Display */}
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <div className="relative h-[500px]" style={{ perspective: '1000px' }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "tween", duration: 0.4, ease: "easeInOut" },
                  opacity: { duration: 0.4, ease: "easeInOut" }
                }}
                className="absolute inset-0"
              >
                <motion.div 
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="glass-card rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between relative overflow-hidden"
                  style={{ 
                    background: 'rgba(10, 10, 10, 0.85)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(248, 248, 248, 0.08)',
                    boxShadow: `
                      0 25px 60px rgba(0, 0, 0, 0.6),
                      0 8px 32px rgba(0, 0, 0, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.08),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.03)
                    `
                  }}
                >
                  {/* Luxury gradient border at top */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  
                  {/* Quote Icon */}
                  <div className="absolute top-6 left-6 opacity-10">
                    <Quote size={80} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex items-center mb-6 star-rating">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ 
                            delay: i * 0.05,
                            duration: 0.3
                          }}
                        >
                          <Star 
                            size={24} 
                            className="text-white fill-current mr-1 star" 
                          />
                        </motion.div>
                      ))}
                      {currentTestimonial.verified && (
                        <span className="ml-3 bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                          ✓ Проверено
                        </span>
                      )}
                    </div>

                    {/* Quote */}
                    <motion.blockquote 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8 testimonial-text"
                    >
                      "{currentTestimonial.quote}"
                    </motion.blockquote>

                    {/* Customer Info */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex items-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-white/15 to-white/5 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border border-white/10">
                        <span className="text-white font-bold text-xl">
                          {currentTestimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{currentTestimonial.name}</h3>
                        <p className="text-gray-300">{currentTestimonial.role}, {currentTestimonial.age}</p>
                        <p className="text-gray-400 text-sm">{currentTestimonial.location} • {currentTestimonial.product}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Subtle floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/3 rounded-full blur-2xl"></div>
                  
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 rounded-3xl pointer-events-none"></div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons - Luxury monochrome style */}
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/8 backdrop-blur-md p-3 rounded-full transition-all duration-200 z-20 border border-white/10"
            style={{
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft size={24} className="text-white" />
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/8 backdrop-blur-md p-3 rounded-full transition-all duration-200 z-20 border border-white/10"
            style={{
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
            aria-label="Следующий отзыв"
          >
            <ChevronRight size={24} className="text-white" />
          </motion.button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center mt-12 space-y-6">
          {/* Progress Bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5" style={{
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            <div 
              ref={progressRef}
              className="h-full bg-gradient-to-r from-white to-gray-300 rounded-full transform origin-left scale-x-0"
              style={{
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
              }}
            ></div>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center space-x-4">
            {testimonialData.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 border testimonial-dot ${
                  index === currentIndex 
                    ? 'bg-white border-white/30 shadow-lg shadow-white/20' 
                    : 'bg-white/20 border-white/10 hover:bg-white/40'
                }`}
                aria-label={`Перейти к отзыву ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            onClick={togglePlayPause}
            className="flex items-center space-x-2 bg-white/8 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-200 border border-white/10"
            style={{
              boxShadow: `
                0 4px 16px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
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
      </div>
    </section>
  )
}