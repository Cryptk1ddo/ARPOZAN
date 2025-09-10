'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../lib/CartContext';
import { useToast } from '../lib/ToastContext';

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

const ShippingForm = () => (
     <div className="glass-card p-6 lg:p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Информация о доставке</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="sm:col-span-2">
                <label htmlFor="full-name" className="block text-sm font-bold mb-2">Полное имя</label>
                <input type="text" id="full-name" className="w-full input-glass rounded-lg p-3 focus:outline-none" required />
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-bold mb-2">Адрес</label>
                <input type="text" id="address" className="w-full input-glass rounded-lg p-3 focus:outline-none" required />
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-bold mb-2">Город</label>
                <input type="text" id="city" className="w-full input-glass rounded-lg p-3 focus:outline-none" required />
            </div>
             <div>
                <label htmlFor="postal-code" className="block text-sm font-bold mb-2">Почтовый индекс</label>
                <input type="text" id="postal-code" className="w-full input-glass rounded-lg p-3 focus:outline-none" required />
            </div>
             <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-bold mb-2">Страна</label>
                <select id="country" className="w-full input-glass rounded-lg p-3 focus:outline-none">
                    <option>Россия</option>
                    <option>Беларусь</option>
                    <option>Казахстан</option>
                </select>
            </div>
        </form>
    </div>
);

const PaymentForm = () => (
    <div className="glass-card p-6 lg:p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Оплата</h2>
        <form className="space-y-4">
            <div>
                <label htmlFor="card-number" className="block text-sm font-bold mb-2">Номер карты</label>
                <input type="text" id="card-number" placeholder="•••• •••• •••• ••••" className="w-full input-glass rounded-lg p-3 focus:outline-none" required />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor="expiry-date" className="block text-sm font-bold mb-2">Срок действия</label>
                    <input type="text" id="expiry-date" placeholder="ММ / ГГ" className="w-full input-glass rounded-lg p-3 focus:outline-none" required />
                </div>
                <div>
                    <label htmlFor="cvc" className="block text-sm font-bold mb-2">CVC</label>
                    <input type="text" id="cvc" placeholder="•••" className="w-full input-glass rounded-lg p-3 focus:outline-none" required />
                </div>
            </div>
        </form>
    </div>
);


function OrderSummary() {
    const { cart, total, setQuantity, removeFromCart, clear } = useCart();
    const toast = useToast()
    const [shipping] = useState(350);
    const [processing, setProcessing] = useState(false)
    const [animate, setAnimate] = useState(false)
    const grandTotal = total + shipping;

    // when grand total changes, trigger a brief animation
    useEffect(() => {
        setAnimate(true)
        const t = setTimeout(() => setAnimate(false), 600)
        return () => clearTimeout(t)
    }, [grandTotal])

    async function handlePay(){
        if (cart.length === 0) return
        setProcessing(true)
        // simulate payment
        setTimeout(() => {
            setProcessing(false)
            clear()
            toast.push('Оплата прошла успешно. Спасибо за покупку!')
        }, 900)
    }

    return (
        <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="glass-card rounded-lg p-6 lg:p-8 lg:sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Ваш заказ</h2>
                <div className="space-y-4">
                    {cart.length === 0 && <div className="text-gray-400">Корзина пуста</div>}
                    {cart.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center gap-4">
                            <img src={item.img || '/assets/imgs/Maka peruvian.png'} alt={item.name} className="w-16 h-16 rounded-md object-cover border border-gray-700" />
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
                <button
                    onClick={handlePay}
                    className={`w-full glow-button font-bold py-4 px-6 rounded-lg text-lg mt-8 ${cart.length === 0 || processing ? 'opacity-50 pointer-events-none' : ''}`}
                    disabled={cart.length === 0 || processing}
                >
                    {processing ? 'Обработка...' : 'Оплатить заказ'}
                </button>
            </div>
        </div>
    );
}

const Footer = () => (
    <footer className="bg-black bg-opacity-20 border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 lg:px-8 py-12 text-gray-400">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4">
                    <h3 className="text-xl font-bold gradient-text font-heading tracking-wider">ARPOZAN</h3>
                    <p className="mt-4 text-sm">Природные решения для вашей силы и здоровья.</p>
                </div>
                <div className="md:col-span-2 md:col-start-7">
                    <h4 className="font-bold text-white">Навигация</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-yellow-400 transition-colors">Продукт</Link></li>
                        <li><Link href="/#components" className="hover:text-yellow-400 transition-colors">Как работает</Link></li>
                        <li><Link href="/#faq" className="hover:text-yellow-400 transition-colors">FAQ</Link></li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-bold text-white">Поддержка</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">Связаться с нами</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">Политика возврата</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">Доставка</a></li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-bold text-white">Соцсети</h4>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="hover:text-yellow-400 transition-colors"><InstagramIcon /></a>
                        <a href="#" className="hover:text-yellow-400 transition-colors"><SendIcon /></a>
                        <a href="#" className="hover:text-yellow-400 transition-colors"><FacebookIcon /></a>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
                 <p>&copy; 2024 ARPOZAN. Все права защищены.</p>
            </div>
        </div>
    </footer>
);


export default function CheckoutPage() {
    return (
        <Layout>
            <ParticleCanvas />
            <main>
                <div className="container mx-auto px-4 lg:px-8 py-16">
                    <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-8 text-center">Оформление заказа</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 lg:gap-x-16">
                        <div className="lg:col-span-7 space-y-8">
                            <ShippingForm />
                            <PaymentForm />
                        </div>
                        <OrderSummary />
                    </div>
                </div>
            </main>
        </Layout>
    );
}