'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { useCart } from '../lib/CartContext';
import { useToast } from '../lib/ToastContext';
import { validateEmail, validatePhone, validateName, validateAddress, validateCardNumber, validateExpiryDate, validateCVV } from '../lib/security';

// --- SVG Icon Components ---
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);


// --- Particle Background Component ---
const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particlesArray;
        
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight;
        };

        class Particle {
            constructor(x, y, dX, dY, size) {
                this.x = x; this.y = y; this.dX = dX; this.dY = dY; this.size = size;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(245, 166, 35, 0.1)';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.dX = -this.dX;
                if (this.y > canvas.height || this.y < 0) this.dY = -this.dY;
                this.x += this.dX;
                this.y += this.dY;
                this.draw();
            }
        }

        const initParticles = () => {
            particlesArray = [];
            let num = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < num; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * (window.innerWidth - size * 2) + size * 2;
                let y = Math.random() * (canvas.height - size * 2) + size * 2;
                let dX = (Math.random() * 0.4) - 0.2;
                let dY = (Math.random() * 0.4) - 0.2;
                particlesArray.push(new Particle(x, y, dX, dY, size));
            }
        };

        let animationFrameId;
        const animateParticles = () => {
            if(!ctx) return;
            ctx.clearRect(0, 0, window.innerWidth, canvas.height);
            particlesArray.forEach(p => p.update());
            animationFrameId = requestAnimationFrame(animateParticles);
        };
        
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        const handleResize = debounce(() => {
            setCanvasSize();
            initParticles();
        }, 150);

        setCanvasSize();
        initParticles();
        animateParticles();
        
        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas id="background-particles" ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[-2]"></canvas>;
};

const Header = () => (
     <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold gradient-text font-heading tracking-wider">ARPOZAN</Link>
             <Link href="/" className="text-sm font-bold text-gray-300 hover:text-yellow-400 transition-colors flex items-center gap-2">
                <ArrowLeftIcon />
                Вернуться в магазин
            </Link>
        </div>
    </header>
);

const ShippingForm = ({ formData, setFormData, errors, setErrors }) => {
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateField = (field, value) => {
        let error = '';
        switch (field) {
            case 'fullName':
                if (!value.trim()) error = 'Имя обязательно';
                else if (!validateName(value)) error = 'Введите корректное имя';
                break;
            case 'email':
                if (!value.trim()) error = 'Email обязателен';
                else if (!validateEmail(value)) error = 'Введите корректный email';
                break;
            case 'phone':
                if (!value.trim()) error = 'Телефон обязателен';
                else if (!validatePhone(value)) error = 'Введите корректный номер телефона';
                break;
            case 'address':
                if (!value.trim()) error = 'Адрес обязателен';
                else if (!validateAddress(value)) error = 'Введите полный адрес';
                break;
            case 'city':
                if (!value.trim()) error = 'Город обязателен';
                break;
            case 'postalCode':
                if (!value.trim()) error = 'Почтовый индекс обязателен';
                else if (!/^\d{6}$/.test(value.replace(/\s/g, ''))) error = 'Введите корректный индекс';
                break;
        }
        return error;
    };

    const handleBlur = (field) => {
        const error = validateField(field, formData[field]);
        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    return (
        <div className="glass-card p-6 lg:p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Информация о доставке</h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="sm:col-span-2">
                    <label htmlFor="full-name" className="block text-sm font-bold mb-2">Полное имя *</label>
                    <input 
                        type="text" 
                        id="full-name" 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        onBlur={() => handleBlur('fullName')}
                        className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.fullName ? 'border-red-500' : ''}`}
                        required 
                    />
                    {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-bold mb-2">Email *</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
                        required 
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-bold mb-2">Телефон *</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
                        required 
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-bold mb-2">Адрес *</label>
                    <input 
                        type="text" 
                        id="address" 
                        placeholder="ул. Ленина, д. 1, кв. 1"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        onBlur={() => handleBlur('address')}
                        className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.address ? 'border-red-500' : ''}`}
                        required 
                    />
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                    <label htmlFor="city" className="block text-sm font-bold mb-2">Город *</label>
                    <input 
                        type="text" 
                        id="city" 
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.city ? 'border-red-500' : ''}`}
                        required 
                    />
                    {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                    <label htmlFor="postal-code" className="block text-sm font-bold mb-2">Почтовый индекс *</label>
                    <input 
                        type="text" 
                        id="postal-code" 
                        placeholder="123456"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        onBlur={() => handleBlur('postalCode')}
                        className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.postalCode ? 'border-red-500' : ''}`}
                        required 
                    />
                    {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="country" className="block text-sm font-bold mb-2">Страна</label>
                    <select 
                        id="country" 
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full input-glass rounded-lg p-3 focus:outline-none"
                    >
                        <option>Россия</option>
                        <option>Беларусь</option>
                        <option>Казахстан</option>
                    </select>
                </div>
            </form>
        </div>
    );
};

const PaymentForm = ({ formData, setFormData, errors, setErrors }) => {
    const handleInputChange = (field, value) => {
        // Format card number with spaces
        if (field === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        }
        
        // Format expiry date
        if (field === 'expiryDate') {
            value = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
        }
        
        // Limit CVV to 4 digits
        if (field === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 4);
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateField = (field, value) => {
        let error = '';
        switch (field) {
            case 'cardNumber':
                const cleanCardNumber = value.replace(/\s/g, '');
                if (!cleanCardNumber) error = 'Номер карты обязателен';
                else if (!validateCardNumber(cleanCardNumber)) error = 'Введите корректный номер карты';
                break;
            case 'expiryDate':
                if (!value) error = 'Срок действия обязателен';
                else {
                    const [month, year] = value.split('/');
                    if (!validateExpiryDate(month, year)) error = 'Карта просрочена или дата некорректна';
                }
                break;
            case 'cvv':
                if (!value) error = 'CVV обязателен';
                else if (!validateCVV(value)) error = 'CVV должен содержать 3-4 цифры';
                break;
            case 'cardholderName':
                if (!value.trim()) error = 'Имя владельца обязательно';
                else if (!validateName(value)) error = 'Введите корректное имя';
                break;
        }
        return error;
    };

    const handleBlur = (field) => {
        const error = validateField(field, formData[field]);
        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    return (
        <div className="glass-card p-6 lg:p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Оплата</h2>
            <form className="space-y-4">
                <div>
                    <label htmlFor="cardholder-name" className="block text-sm font-bold mb-2">Имя владельца карты *</label>
                    <input 
                        type="text" 
                        id="cardholder-name"
                        placeholder="IVAN IVANOV"
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        onBlur={() => handleBlur('cardholderName')}
                        className={`w-full input-glass rounded-lg p-3 focus:outline-none uppercase ${errors.cardholderName ? 'border-red-500' : ''}`}
                        required 
                    />
                    {errors.cardholderName && <p className="text-red-400 text-sm mt-1">{errors.cardholderName}</p>}
                </div>
                <div>
                    <label htmlFor="card-number" className="block text-sm font-bold mb-2">Номер карты *</label>
                    <input 
                        type="text" 
                        id="card-number" 
                        placeholder="•••• •••• •••• ••••" 
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        onBlur={() => handleBlur('cardNumber')}
                        maxLength="19"
                        className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.cardNumber ? 'border-red-500' : ''}`}
                        required 
                    />
                    {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="expiry-date" className="block text-sm font-bold mb-2">Срок действия *</label>
                        <input 
                            type="text" 
                            id="expiry-date" 
                            placeholder="ММ / ГГ" 
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            onBlur={() => handleBlur('expiryDate')}
                            maxLength="5"
                            className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.expiryDate ? 'border-red-500' : ''}`}
                            required 
                        />
                        {errors.expiryDate && <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                        <label htmlFor="cvv" className="block text-sm font-bold mb-2">CVV *</label>
                        <input 
                            type="text" 
                            id="cvv" 
                            placeholder="•••" 
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            onBlur={() => handleBlur('cvv')}
                            maxLength="4"
                            className={`w-full input-glass rounded-lg p-3 focus:outline-none ${errors.cvv ? 'border-red-500' : ''}`}
                            required 
                        />
                        {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    <input type="checkbox" id="save-card" className="mr-3" />
                    <label htmlFor="save-card" className="text-sm text-gray-400">Сохранить карту для будущих покупок</label>
                </div>
            </form>
        </div>
    );
};


function OrderSummary({ formData, isSubmitting, setIsSubmitting, validateAllFields } = {}) {
    const { cart, getTotal, setQuantity, removeFromCart, clear } = useCart();
    const toast = useToast()
    const [shipping] = useState(350);
    const [animate, setAnimate] = useState(false)
    const total = getTotal();
    const grandTotal = total + shipping;

    // when grand total changes, trigger a brief animation
    useEffect(() => {
        setAnimate(true)
        const t = setTimeout(() => setAnimate(false), 600)
        return () => clearTimeout(t)
    }, [grandTotal])

    async function handlePay(){
        if (cart.length === 0) return
        
        // Validate all fields before submission if validation function is provided
        if (validateAllFields && !validateAllFields()) {
            toast.push('Пожалуйста, исправьте ошибки в форме')
            return
        }

        setIsSubmitting && setIsSubmitting(true)
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))
            
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
        <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="glass-card rounded-lg p-6 lg:p-8 lg:sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Ваш заказ</h2>
                <div className="space-y-4">
                    {cart.length === 0 && <div className="text-gray-400">Корзина пуста</div>}
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
                                    <div className="inline-flex items-center border border-gray-700 rounded-md overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(item.id, (item.quantity || 1) - 1)}
                                            className="px-3 py-1 bg-transparent hover:bg-white/5"
                                            aria-label={`Уменьшить количество ${item.name}`}
                                        >
                                            -
                                        </button>
                                        <div className="px-3 py-1 min-w-[48px] text-center">{item.quantity}</div>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(item.id, (item.quantity || 1) + 1)}
                                            className="px-3 py-1 bg-transparent hover:bg-white/5"
                                            aria-label={`Увеличить количество ${item.name}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-400">{item.price.toLocaleString('ru-RU')} ₽ / шт.</div>
                                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-sm text-red-400 hover:text-red-300 ml-2">Удалить</button>
                                </div>
                            </div>
                            <div className={`font-bold ${animate ? 'animate-pulse' : ''}`}>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</div>
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
                    <span className={`gradient-text ${animate ? 'animate-pulse' : ''}`}>{grandTotal.toLocaleString('ru-RU')} ₽</span>
                </div>
                
                {formData && validateAllFields && (
                    <button
                        onClick={handlePay}
                        disabled={(isSubmitting !== undefined ? isSubmitting : false) || cart.length === 0}
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
    );
}

export default function CheckoutPage() {
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
        cvv: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

    // Load form data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('checkoutFormData');
        if (savedData) {
            try {
                setFormData(JSON.parse(savedData));
            } catch (error) {
                console.warn('Failed to parse saved form data:', error);
            }
        }
    }, []);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }, [formData]);

    const validateAllFields = () => {
        const newErrors = {};
        
        // Shipping validation
        if (!formData.fullName.trim()) newErrors.fullName = 'Имя обязательно';
        else if (!validateName(formData.fullName)) newErrors.fullName = 'Введите корректное имя';
        
        if (!formData.email.trim()) newErrors.email = 'Email обязателен';
        else if (!validateEmail(formData.email)) newErrors.email = 'Введите корректный email';
        
        if (!formData.phone.trim()) newErrors.phone = 'Телефон обязателен';
        else if (!validatePhone(formData.phone)) newErrors.phone = 'Введите корректный номер телефона';
        
        if (!formData.address.trim()) newErrors.address = 'Адрес обязателен';
        else if (!validateAddress(formData.address)) newErrors.address = 'Введите полный адрес';
        
        if (!formData.city.trim()) newErrors.city = 'Город обязателен';
        
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Почтовый индекс обязателен';
        else if (!/^\d{6}$/.test(formData.postalCode.replace(/\s/g, ''))) newErrors.postalCode = 'Введите корректный индекс';

        // Payment validation
        if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Имя владельца обязательно';
        else if (!validateName(formData.cardholderName)) newErrors.cardholderName = 'Введите корректное имя';
        
        const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
        if (!cleanCardNumber) newErrors.cardNumber = 'Номер карты обязателен';
        else if (!validateCardNumber(cleanCardNumber)) newErrors.cardNumber = 'Введите корректный номер карты';
        
        if (!formData.expiryDate) newErrors.expiryDate = 'Срок действия обязателен';
        else {
            const [month, year] = formData.expiryDate.split('/');
            if (!validateExpiryDate(month, year)) newErrors.expiryDate = 'Карта просрочена или дата некорректна';
        }
        
        if (!formData.cvv) newErrors.cvv = 'CVV обязателен';
        else if (!validateCVV(formData.cvv)) newErrors.cvv = 'CVV должен содержать 3-4 цифры';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            // Validate shipping fields
            const shippingFields = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
            const shippingErrors = {};
            
            shippingFields.forEach(field => {
                let error = '';
                switch (field) {
                    case 'fullName':
                        if (!formData.fullName.trim()) error = 'Имя обязательно';
                        else if (!validateName(formData.fullName)) error = 'Введите корректное имя';
                        break;
                    case 'email':
                        if (!formData.email.trim()) error = 'Email обязателен';
                        else if (!validateEmail(formData.email)) error = 'Введите корректный email';
                        break;
                    case 'phone':
                        if (!formData.phone.trim()) error = 'Телефон обязателен';
                        else if (!validatePhone(formData.phone)) error = 'Введите корректный номер телефона';
                        break;
                    case 'address':
                        if (!formData.address.trim()) error = 'Адрес обязателен';
                        else if (!validateAddress(formData.address)) error = 'Введите полный адрес';
                        break;
                    case 'city':
                        if (!formData.city.trim()) error = 'Город обязателен';
                        break;
                    case 'postalCode':
                        if (!formData.postalCode.trim()) error = 'Почтовый индекс обязателен';
                        else if (!/^\d{6}$/.test(formData.postalCode.replace(/\s/g, ''))) error = 'Введите корректный индекс';
                        break;
                }
                if (error) shippingErrors[field] = error;
            });
            
            if (Object.keys(shippingErrors).length > 0) {
                setErrors(shippingErrors);
                return;
            }
        }
        
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <Layout>
            <ParticleCanvas />
            <main>
                <div className="container mx-auto px-4 lg:px-8 py-16">
                    <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-8 text-center">Оформление заказа</h1>
                    
                    {/* Progress Indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-amber-500 text-black' : 'bg-gray-600 text-gray-400'}`}>
                                1
                            </div>
                            <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-amber-500' : 'bg-gray-600'}`}></div>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-amber-500 text-black' : 'bg-gray-600 text-gray-400'}`}>
                                2
                            </div>
                            <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-amber-500' : 'bg-gray-600'}`}></div>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-amber-500 text-black' : 'bg-gray-600 text-gray-400'}`}>
                                3
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 lg:gap-x-16">
                        <div className="lg:col-span-7 space-y-8">
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
                                    <h2 className="text-2xl font-bold mb-6">Подтверждение заказа</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/5 rounded-lg">
                                            <h3 className="font-bold mb-2">Информация о доставке</h3>
                                            <p className="text-sm text-gray-400">{formData.fullName}</p>
                                            <p className="text-sm text-gray-400">{formData.address}, {formData.city}</p>
                                            <p className="text-sm text-gray-400">{formData.postalCode}, {formData.country}</p>
                                            <p className="text-sm text-gray-400">{formData.email} | {formData.phone}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-lg">
                                            <h3 className="font-bold mb-2">Способ оплаты</h3>
                                            <p className="text-sm text-gray-400">Карта **** **** **** {formData.cardNumber.slice(-4)}</p>
                                            <p className="text-sm text-gray-400">{formData.cardholderName}</p>
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
                                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-lg transition-colors ml-auto"
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
                        <div className="lg:col-span-5">
                            <OrderSummary />
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}