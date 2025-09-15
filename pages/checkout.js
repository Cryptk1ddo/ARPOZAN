'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import LuxuryFAQ from '../components/LuxuryFAQ'
import { useCart } from '../lib/CartContext'
import { useToast } from '../lib/ToastContext'
import PaymentIcons from '../components/PaymentIcons'
import {
  validateEmail,
  validatePhone,
  validateName,
  validateAddress,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
} from '../lib/security'

// --- SVG Icon Components ---
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" x2="11" y1="2" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

// --- Particle Background Component ---
const ParticleCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let particlesArray

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.body.scrollHeight
    }

    class Particle {
      constructor(x, y, dX, dY, size) {
        this.x = x
        this.y = y
        this.dX = dX
        this.dY = dY
        this.size = size
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(107, 114, 128, 0.1)' // Light gray particles for monochrome design
        ctx.fill()
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.dX = -this.dX
        if (this.y > canvas.height || this.y < 0) this.dY = -this.dY
        this.x += this.dX
        this.y += this.dY
        this.draw()
      }
    }

    const initParticles = () => {
      particlesArray = []
      let num = (canvas.height * canvas.width) / 9000
      for (let i = 0; i < num; i++) {
        let size = Math.random() * 2 + 1
        let x = Math.random() * (window.innerWidth - size * 2) + size * 2
        let y = Math.random() * (canvas.height - size * 2) + size * 2
        let dX = Math.random() * 0.4 - 0.2
        let dY = Math.random() * 0.4 - 0.2
        particlesArray.push(new Particle(x, y, dX, dY, size))
      }
    }

    let animationFrameId
    const animateParticles = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, window.innerWidth, canvas.height)
      particlesArray.forEach((p) => p.update())
      animationFrameId = requestAnimationFrame(animateParticles)
    }

    const debounce = (func, wait) => {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }

    const handleResize = debounce(() => {
      setCanvasSize()
      initParticles()
    }, 150)

    setCanvasSize()
    initParticles()
    animateParticles()

    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      id="background-particles"
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-2]"
    ></canvas>
  )
}

const Header = () => (
  <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
    <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
      <Link
        href="/"
        className="text-2xl font-bold gradient-text font-heading tracking-wider"
      >
        ARPOZAN
      </Link>
      <Link
        href="/"
        className="text-sm font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-2"
      >
        <ArrowLeftIcon />
        Вернуться в магазин
      </Link>
    </div>
  </header>
)

const ShippingForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateField = (field, value) => {
    let error = ''
    switch (field) {
      case 'fullName':
        if (!value.trim()) error = 'Имя обязательно'
        else if (!validateName(value)) error = 'Введите корректное имя'
        break
      case 'email':
        if (!value.trim()) error = 'Email обязателен'
        else if (!validateEmail(value)) error = 'Введите корректный email'
        break
      case 'phone':
        if (!value.trim()) error = 'Телефон обязателен'
        else if (!validatePhone(value))
          error = 'Введите корректный номер телефона'
        break
      case 'address':
        if (!value.trim()) error = 'Адрес обязателен'
        else if (!validateAddress(value)) error = 'Введите полный адрес'
        break
      case 'city':
        if (!value.trim()) error = 'Город обязателен'
        break
      case 'postalCode':
        if (!value.trim()) error = 'Почтовый индекс обязателен'
        else if (!/^\d{6}$/.test(value.replace(/\s/g, '')))
          error = 'Введите корректный индекс'
        break
    }
    return error
  }

  const handleBlur = (field) => {
    const error = validateField(field, formData[field])
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  return (
    <div className="glass-card p-6 lg:p-8 rounded-lg border border-white/5">
      <h2 className="text-2xl font-bold mb-8 text-white">
        Информация о доставке
      </h2>
      <form className="space-y-8">
        {/* Personal Information Group */}
        <div className="space-y-3">
          <div className="sm:col-span-2">
            <label
              htmlFor="full-name"
              className="block text-sm font-semibold mb-1.5 text-gray-200"
            >
              Полное имя *
            </label>
            <div className="relative">
              <input
                type="text"
                id="full-name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`w-full bg-gray-800/60 border-2 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.fullName ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
                placeholder="Введите ваше полное имя"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.fullName}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-1.5 text-gray-200"
              >
                Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full bg-gray-800/60 border-2 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.email ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
                  placeholder="your@email.com"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold mb-1.5 text-gray-200"
              >
                Телефон *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full bg-gray-800/60 border-2 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.phone ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Details Group */}
        <div className="space-y-3">
          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-semibold mb-1.5 text-gray-200"
            >
              Адрес *
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                placeholder="ул. Ленина, д. 1, кв. 1"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                className={`w-full bg-gray-800/60 border-2 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.address ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            {errors.address && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.address}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-semibold mb-1.5 text-gray-200"
              >
                Город *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  className={`w-full bg-gray-800/60 border-2 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.city ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
                  placeholder="Москва"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              {errors.city && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.city}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="postal-code"
                className="block text-sm font-semibold mb-1.5 text-gray-200"
              >
                Почтовый индекс *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="postal-code"
                  placeholder="123456"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange('postalCode', e.target.value)
                  }
                  onBlur={() => handleBlur('postalCode')}
                  className={`w-full bg-gray-800/60 border-2 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.postalCode ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
              </div>
              {errors.postalCode && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="country"
              className="block text-sm font-semibold mb-1.5 text-gray-200"
            >
              Страна
            </label>
            <div className="relative">
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full bg-gray-800/60 border-2 border-gray-600/50 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white appearance-none cursor-pointer"
              >
                <option value="Россия" className="bg-gray-800 text-white">
                  🇷🇺 Россия
                </option>
                <option value="Беларусь" className="bg-gray-800 text-white">
                  🇧🇾 Беларусь
                </option>
                <option value="Казахстан" className="bg-gray-800 text-white">
                  🇰🇿 Казахстан
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-lg">
                  {formData.country === 'Россия' && '🇷🇺'}
                  {formData.country === 'Беларусь' && '🇧🇾'}
                  {formData.country === 'Казахстан' && '🇰🇿'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

const PaymentForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (field, value) => {
    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
    }

    // Format expiry date
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
    }

    // Limit CVV to 4 digits
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateField = (field, value) => {
    let error = ''
    switch (field) {
      case 'cardNumber':
        const cleanCardNumber = value.replace(/\s/g, '')
        if (!cleanCardNumber) error = 'Номер карты обязателен'
        else if (!validateCardNumber(cleanCardNumber))
          error = 'Введите корректный номер карты'
        break
      case 'expiryDate':
        if (!value) error = 'Срок действия обязателен'
        else {
          const [month, year] = value.split('/')
          if (!validateExpiryDate(month, year))
            error = 'Карта просрочена или дата некорректна'
        }
        break
      case 'cvv':
        if (!value) error = 'CVV обязателен'
        else if (!validateCVV(value)) error = 'CVV должен содержать 3-4 цифры'
        break
      case 'cardholderName':
        if (!value.trim()) error = 'Имя владельца обязательно'
        else if (!validateName(value)) error = 'Введите корректное имя'
        break
    }
    return error
  }

  const handleBlur = (field) => {
    const error = validateField(field, formData[field])
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  return (
    <div className="glass-card p-6 lg:p-8 rounded-lg border border-white/5">
      <h2 className="text-2xl font-bold mb-6 text-white">Оплата</h2>
      <PaymentIcons size="small" theme="light" className="mb-6" />
      <form className="space-y-6">
        <div>
          <label
            htmlFor="cardholder-name"
            className="block text-sm font-semibold mb-1.5 text-gray-200"
          >
            Имя владельца карты *
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardholder-name"
              placeholder="IVAN IVANOV"
              value={formData.cardholderName}
              onChange={(e) =>
                handleInputChange('cardholderName', e.target.value)
              }
              onBlur={() => handleBlur('cardholderName')}
              className={`w-full bg-gray-800/60 border-2 rounded-xl p-4 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 uppercase ${errors.cardholderName ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          {errors.cardholderName && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.cardholderName}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="card-number"
            className="block text-sm font-semibold mb-1.5 text-gray-200"
          >
            Номер карты *
          </label>
          <div className="relative">
            <input
              type="text"
              id="card-number"
              placeholder="•••• •••• •••• ••••"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              onBlur={() => handleBlur('cardNumber')}
              maxLength="19"
              className={`w-full bg-gray-800/60 border-2 rounded-xl p-4 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.cardNumber ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
          {errors.cardNumber && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.cardNumber}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="expiry-date"
              className="block text-sm font-semibold mb-1.5 text-gray-200"
            >
              Срок действия *
            </label>
            <div className="relative">
              <input
                type="text"
                id="expiry-date"
                placeholder="ММ / ГГ"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange('expiryDate', e.target.value)
                }
                onBlur={() => handleBlur('expiryDate')}
                maxLength="5"
                className={`w-full bg-gray-800/60 border-2 rounded-xl p-4 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.expiryDate ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            {errors.expiryDate && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.expiryDate}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="cvv"
              className="block text-sm font-semibold mb-1.5 text-gray-200"
            >
              CVV *
            </label>
            <div className="relative">
              <input
                type="text"
                id="cvv"
                placeholder="•••"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                onBlur={() => handleBlur('cvv')}
                maxLength="4"
                className={`w-full bg-gray-800/60 border-2 rounded-xl p-4 focus:outline-none focus:border-white/50 focus:bg-gray-800/80 transition-all duration-200 text-white placeholder-gray-400 ${errors.cvv ? 'border-red-500 bg-red-900/20' : 'border-gray-600/50'}`}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            {errors.cvv && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.cvv}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center mt-6 p-4 bg-gray-800/40 rounded-xl border border-gray-600/30">
          <input
            type="checkbox"
            id="save-card"
            className="mr-4 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label
            htmlFor="save-card"
            className="text-sm text-gray-300 cursor-pointer"
          >
            Сохранить карту для будущих покупок
          </label>
        </div>
      </form>
    </div>
  )
}

function OrderSummary({
  formData,
  isSubmitting,
  setIsSubmitting,
  validateAllFields,
} = {}) {
  const { cart, getTotal, setQuantity, removeFromCart, clear } = useCart()
  const toast = useToast()
  const [shipping] = useState(350)
  const [animate, setAnimate] = useState(false)
  const total = getTotal()
  const grandTotal = total + shipping

  // when grand total changes, trigger a brief animation
  useEffect(() => {
    setAnimate(true)
    const t = setTimeout(() => setAnimate(false), 600)
    return () => clearTimeout(t)
  }, [grandTotal])

  async function handlePay() {
    if (cart.length === 0) return

    // Validate all fields before submission if validation function is provided
    if (validateAllFields && !validateAllFields()) {
      toast.push('Пожалуйста, исправьте ошибки в форме')
      return
    }

    setIsSubmitting && setIsSubmitting(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear form data from localStorage on successful payment
      localStorage.removeItem('checkoutFormData')

      clear()
      toast.push('🎉 Оплата прошла успешно! Спасибо за покупку!')

      // Redirect to success page or home
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (error) {
      toast.push('❌ Ошибка оплаты. Попробуйте еще раз.')
    } finally {
      setIsSubmitting && setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8 lg:mt-0">
      <div className="glass-card rounded-lg p-6 lg:p-8 lg:sticky top-24">
        <h2 className="text-2xl font-bold mb-6">Ваш заказ</h2>
        <div className="space-y-4">
          {cart.length === 0 && (
            <div className="text-gray-400">Корзина пуста</div>
          )}
          {cart.map((item, idx) => (
            <div key={item.id || idx} className="flex items-center gap-4">
              <Image
                src={item.img || '/assets/imgs/Maka peruvian.png'}
                alt={item.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-md object-cover border border-gray-700"
              />
              <div className="flex-grow">
                <p className="font-bold">{item.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-sm text-gray-400">
                    Количество: {item.quantity}
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.price.toLocaleString('ru-RU')} ₽ / шт.
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-400 hover:text-red-300 ml-2"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <div className={`font-bold ${animate ? 'animate-pulse' : ''}`}>
                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 my-6"></div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Подытог</span>
            <span>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Доставка</span>
            <span>{shipping.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
        <div className="border-t border-gray-700 my-6"></div>
        <div className="flex justify-between items-baseline font-bold text-xl">
          <span>Итого</span>
          <span className={`gradient-text ${animate ? 'animate-pulse' : ''}`}>
            {grandTotal.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        {formData && validateAllFields && (
          <button
            onClick={handlePay}
            disabled={
              (isSubmitting !== undefined ? isSubmitting : false) ||
              cart.length === 0
            }
            className={`w-full mt-6 py-4 rounded-lg font-bold transition-all duration-300 ${
              (isSubmitting !== undefined ? isSubmitting : false)
                ? 'bg-gray-600 cursor-not-allowed'
                : 'glow-button text-black hover:scale-105'
            }`}
          >
            {(isSubmitting !== undefined ? isSubmitting : false) ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Обработка оплаты...
              </div>
            ) : (
              `Оплатить ${grandTotal.toLocaleString('ru-RU')} ₽`
            )}
          </button>
        )}

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>🔒 Безопасная оплата через защищенное соединение</p>
          <p>📦 Бесплатная доставка при заказе от 5000 ₽</p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const checkoutFaqs = [
    {
      question: 'Какие способы оплаты вы принимаете?',
      answer: 'Мы принимаем все основные банковские карты (Visa, MasterCard, МИР), а также YandexPay и UnionPay. Все платежи защищены современными системами шифрования.'
    },
    {
      question: 'Безопасна ли оплата на сайте?',
      answer: 'Да, все платежи обрабатываются через защищенные шлюзы с использованием SSL-шифрования. Данные вашей карты не сохраняются на наших серверах и передаются напрямую в банк.'
    },
    {
      question: 'Как быстро происходит доставка?',
      answer: 'Доставка по России занимает 1-3 рабочих дня после подтверждения заказа. В крупные города доставка может осуществляться на следующий день.'
    },
    {
      question: 'Можно ли изменить или отменить заказ?',
      answer: 'Заказ можно отменить или изменить в течение 1 часа после оформления. Для этого свяжитесь с нашей службой поддержки по указанным контактам.'
    },
    {
      question: 'Что делать, если товар не подошел?',
      answer: 'У нас действует 30-дневная гарантия возврата. Если товар не подошел, вы можете вернуть его в оригинальной упаковке и получить полный возврат средств.'
    }
  ]

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Россия',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('checkoutFormData')
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData))
      } catch (error) {
        console.warn('Failed to parse saved form data:', error)
      }
    }
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData))
  }, [formData])

  const validateAllFields = () => {
    const newErrors = {}

    // Shipping validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Имя обязательно'
    else if (!validateName(formData.fullName))
      newErrors.fullName = 'Введите корректное имя'

    if (!formData.email.trim()) newErrors.email = 'Email обязателен'
    else if (!validateEmail(formData.email))
      newErrors.email = 'Введите корректный email'

    if (!formData.phone.trim()) newErrors.phone = 'Телефон обязателен'
    else if (!validatePhone(formData.phone))
      newErrors.phone = 'Введите корректный номер телефона'

    if (!formData.address.trim()) newErrors.address = 'Адрес обязателен'
    else if (!validateAddress(formData.address))
      newErrors.address = 'Введите полный адрес'

    if (!formData.city.trim()) newErrors.city = 'Город обязателен'

    if (!formData.postalCode.trim())
      newErrors.postalCode = 'Почтовый индекс обязателен'
    else if (!/^\d{6}$/.test(formData.postalCode.replace(/\s/g, '')))
      newErrors.postalCode = 'Введите корректный индекс'

    // Payment validation
    if (!formData.cardholderName.trim())
      newErrors.cardholderName = 'Имя владельца обязательно'
    else if (!validateName(formData.cardholderName))
      newErrors.cardholderName = 'Введите корректное имя'

    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '')
    if (!cleanCardNumber) newErrors.cardNumber = 'Номер карты обязателен'
    else if (!validateCardNumber(cleanCardNumber))
      newErrors.cardNumber = 'Введите корректный номер карты'

    if (!formData.expiryDate) newErrors.expiryDate = 'Срок действия обязателен'
    else {
      const [month, year] = formData.expiryDate.split('/')
      if (!validateExpiryDate(month, year))
        newErrors.expiryDate = 'Карта просрочена или дата некорректна'
    }

    if (!formData.cvv) newErrors.cvv = 'CVV обязателен'
    else if (!validateCVV(formData.cvv))
      newErrors.cvv = 'CVV должен содержать 3-4 цифры'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate shipping fields
      const shippingFields = [
        'fullName',
        'email',
        'phone',
        'address',
        'city',
        'postalCode',
      ]
      const shippingErrors = {}

      shippingFields.forEach((field) => {
        let error = ''
        switch (field) {
          case 'fullName':
            if (!formData.fullName.trim()) error = 'Имя обязательно'
            else if (!validateName(formData.fullName))
              error = 'Введите корректное имя'
            break
          case 'email':
            if (!formData.email.trim()) error = 'Email обязателен'
            else if (!validateEmail(formData.email))
              error = 'Введите корректный email'
            break
          case 'phone':
            if (!formData.phone.trim()) error = 'Телефон обязателен'
            else if (!validatePhone(formData.phone))
              error = 'Введите корректный номер телефона'
            break
          case 'address':
            if (!formData.address.trim()) error = 'Адрес обязателен'
            else if (!validateAddress(formData.address))
              error = 'Введите полный адрес'
            break
          case 'city':
            if (!formData.city.trim()) error = 'Город обязателен'
            break
          case 'postalCode':
            if (!formData.postalCode.trim())
              error = 'Почтовый индекс обязателен'
            else if (!/^\d{6}$/.test(formData.postalCode.replace(/\s/g, '')))
              error = 'Введите корректный индекс'
            break
        }
        if (error) shippingErrors[field] = error
      })

      if (Object.keys(shippingErrors).length > 0) {
        setErrors(shippingErrors)
        return
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  return (
    <Layout>
      <ParticleCanvas />
      <main>
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-8 text-center">
            Оформление заказа
          </h1>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-white text-black' : 'bg-gray-600 text-gray-400'}`}
              >
                1
              </div>
              <div
                className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-white' : 'bg-gray-600'}`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-white text-black' : 'bg-gray-600 text-gray-400'}`}
              >
                2
              </div>
              <div
                className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-white' : 'bg-gray-600'}`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-white text-black' : 'bg-gray-600 text-gray-400'}`}
              >
                3
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
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
                <span>30-дневная гарантия</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Безопасная оплата</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>Быстрая доставка</span>
              </div>
            </div>
          </div>

          {/* Urgency and Social Proof */}
          <div className="flex justify-center mb-8">
            <div className="glass-card p-4 rounded-lg max-w-md">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <svg
                    className="w-5 h-5 text-red-500 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-bold text-red-400">
                    Ограниченное время!
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  🎯 5 человек уже оформили заказ за последние 10 минут
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 lg:gap-x-16 lg:gap-y-12">
            <div className="lg:col-span-6">
              <OrderSummary />
            </div>
            <div className="lg:col-span-6 space-y-8 mt-30 lg:mt-0">
              {currentStep === 1 && (
                <ShippingForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
              {currentStep === 2 && (
                <PaymentForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
              {currentStep === 3 && (
                <div className="glass-card p-6 lg:p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-6">
                    Подтверждение заказа
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-bold mb-2">Информация о доставке</h3>
                      <p className="text-sm text-gray-400">
                        {formData.fullName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formData.address}, {formData.city}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formData.postalCode}, {formData.country}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formData.email} | {formData.phone}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-bold mb-2">Способ оплаты</h3>
                      <p className="text-sm text-gray-400">
                        Карта **** **** **** {formData.cardNumber.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formData.cardholderName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Назад
                  </button>
                )}
                {currentStep < 3 && (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 glow-button text-black rounded-lg transition-all ml-auto"
                  >
                    Далее
                  </button>
                )}
                {currentStep === 3 && (
                  <OrderSummary
                    formData={formData}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    validateAllFields={validateAllFields}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Security & Trust Section */}
        <div className="mt-16 glass-card p-8 rounded-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 gradient-text">
              Ваша безопасность - наш приоритет
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">SSL Шифрование</h4>
                <p className="text-sm text-gray-400">
                  256-битное шифрование для защиты ваших данных
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
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
                </div>
                <h4 className="font-bold mb-2">Гарантия качества</h4>
                <p className="text-sm text-gray-400">
                  30 дней на возврат при любых обстоятельствах
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Быстрая доставка</h4>
                <p className="text-sm text-gray-400">
                  Доставка в течение 1-3 рабочих дней
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <LuxuryFAQ 
            faqs={checkoutFaqs}
            title="Вопросы по заказу"
            variant="minimal"
            theme="dark"
          />
        </div>
      </main>
    </Layout>
  )
}
