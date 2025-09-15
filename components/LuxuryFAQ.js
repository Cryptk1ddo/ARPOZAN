import { useState } from 'react'

const LuxuryFAQ = ({ 
  faqs = [], 
  title = "Часто задаваемые вопросы", 
  variant = "default", // "default", "split", "minimal"
  theme = "dark" // "dark", "light"
}) => {
  const [openFaqs, setOpenFaqs] = useState(new Set())

  const toggleFaq = (index) => {
    const newOpenFaqs = new Set(openFaqs)
    if (newOpenFaqs.has(index)) {
      newOpenFaqs.delete(index)
    } else {
      newOpenFaqs.add(index)
    }
    setOpenFaqs(newOpenFaqs)
  }

  // Theme classes
  const themeClasses = {
    dark: {
      section: "bg-gradient-to-b from-black/20 to-transparent",
      title: "text-white",
      card: "bg-gradient-to-br from-white/5 to-white/1 backdrop-blur-md border border-white/10",
      cardHover: "hover:from-white/8 hover:to-white/2 hover:border-white/20",
      question: "text-white",
      answer: "text-gray-300",
      icon: "text-white",
      accent: "from-white/20 to-gray-300/20"
    },
    light: {
      section: "bg-gradient-to-b from-gray-50/80 to-transparent",
      title: "text-gray-900",
      card: "bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md border border-gray-200/50",
      cardHover: "hover:from-white hover:to-gray-50 hover:border-gray-300/50",
      question: "text-gray-900",
      answer: "text-gray-600",
      icon: "text-gray-900",
      accent: "from-gray-100/30 to-gray-200/30"
    }
  }

  const currentTheme = themeClasses[theme]

  if (variant === "split") {
    return (
      <section id="faq" className={`py-16 md:py-24 ${currentTheme.section}`}>
        <div className="grid grid-cols-12 gap-x-6 max-w-7xl mx-auto px-4">
          <div className="col-span-12 md:col-span-4 mb-8 md:mb-0">
            <div className="sticky top-24">
              <h2 className={`text-3xl md:text-5xl font-bold ${currentTheme.title} font-heading leading-tight`}>
                {title.split(' ').map((word, index) => (
                  <span key={index} className="block">
                    {word}
                  </span>
                ))}
              </h2>
              <div className={`w-16 h-1 bg-gradient-to-r ${currentTheme.accent} mt-6 rounded-full`}></div>
              <p className={`${currentTheme.answer} mt-4 text-sm leading-relaxed`}>
                Найдите ответы на самые популярные вопросы о наших продуктах
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`
                    ${currentTheme.card}
                    ${currentTheme.cardHover}
                    rounded-2xl overflow-hidden
                    transform transition-all duration-300 ease-out
                    ${openFaqs.has(index) ? 'scale-[1.01]' : 'hover:scale-[1.005]'}
                    shadow-lg hover:shadow-xl
                  `}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h3 className={`
                        ${currentTheme.question} font-semibold text-lg leading-tight
                        group-hover:text-gray-200 transition-colors duration-200
                      `}>
                        {faq.question}
                      </h3>
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        bg-gradient-to-br ${currentTheme.accent}
                        border border-white/10
                        transform transition-all duration-300
                        ${openFaqs.has(index) ? 'rotate-180 scale-110' : 'group-hover:scale-110'}
                      `}>
                        <svg
                          className={`w-4 h-4 ${currentTheme.icon} transition-transform duration-300`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                  <div
                    className={`
                      overflow-hidden transition-all duration-500 ease-out
                      ${openFaqs.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="px-6 pb-6">
                      <div className={`w-full h-px bg-gradient-to-r ${currentTheme.accent} mb-4 opacity-30`}></div>
                      <p className={`${currentTheme.answer} leading-relaxed text-sm`}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === "minimal") {
    return (
      <section id="faq" className={`py-12 md:py-16 ${currentTheme.section}`}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 ${currentTheme.title} font-heading`}>
            {title}
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`
                  ${currentTheme.card}
                  rounded-xl overflow-hidden
                  transform transition-all duration-200
                  hover:scale-[1.002]
                `}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex justify-between items-center group"
                >
                  <h3 className={`${currentTheme.question} font-medium text-base group-hover:text-gray-200 transition-colors`}>
                    {faq.question}
                  </h3>
                  <svg
                    className={`
                      w-5 h-5 ${currentTheme.icon} transform transition-transform duration-300
                      ${openFaqs.has(index) ? 'rotate-180' : ''}
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`
                    overflow-hidden transition-all duration-300
                    ${openFaqs.has(index) ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="px-4 pb-4">
                    <p className={`${currentTheme.answer} text-sm leading-relaxed`}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default variant - centered luxury design
  return (
    <section id="faq" className={`py-16 md:py-24 ${currentTheme.section}`}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-5xl font-bold ${currentTheme.title} font-heading mb-4`}>
            {title}
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r ${currentTheme.accent} mx-auto rounded-full`}></div>
        </div>
        
        <div className="grid gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`
                ${currentTheme.card}
                ${currentTheme.cardHover}
                rounded-2xl overflow-hidden
                transform transition-all duration-300 ease-out
                ${openFaqs.has(index) ? 'scale-[1.02] shadow-2xl' : 'shadow-lg hover:shadow-xl'}
                border-l-4 border-l-white/50
              `}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left group"
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className={`
                    ${currentTheme.question} font-semibold text-lg leading-tight
                    group-hover:text-gray-200 transition-colors duration-200
                    flex-1
                  `}>
                    {faq.question}
                  </h3>
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    bg-gradient-to-br ${currentTheme.accent}
                    border border-white/20
                    transform transition-all duration-300
                    ${openFaqs.has(index) ? 'rotate-180 scale-110' : 'group-hover:scale-110'}
                    shadow-inner
                  `}>
                    <svg
                      className={`w-5 h-5 ${currentTheme.icon} transition-transform duration-300`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
              <div
                className={`
                  overflow-hidden transition-all duration-500 ease-out
                  ${openFaqs.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="px-6 pb-6">
                  <div className={`w-full h-px bg-gradient-to-r ${currentTheme.accent} mb-4`}></div>
                  <p className={`${currentTheme.answer} leading-relaxed`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LuxuryFAQ