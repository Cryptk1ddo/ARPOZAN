"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../lib/CartContext';

// --- SVG Icon Components ---
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>);
const MinusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" x2="19" y1="12" y2="12"/></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>);
const Trash2Icon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>);

const Spinner = ({ className = 'w-4 h-4 mr-2' }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
);


export default function CartDrawer({ open, onClose }) {
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const { cart, setQuantity, removeFromCart, clear, total } = useCart();

    const handleQuantityChange = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        const newQuantity = Math.max(0, (item.quantity || 0) + delta);
        setQuantity(id, newQuantity);
    };

    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    const cartTotal = total || cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className={`cart-backdrop absolute inset-0 bg-black/60 transition-opacity duration-300 ease-in-out ${open ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>
            
            {/* Drawer */}
            <aside className={`cart-drawer absolute right-0 top-0 h-full w-full max-w-md flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!open}>
                <div className="glass-card rounded-2xl shadow-2xl p-6 h-full flex flex-col border border-white/10 bg-black/60 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Ваша корзина</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon/></button>
                    </div>

                    <div className="flex-grow space-y-4 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-400 pt-16">Ваша корзина пуста.</p>
                    ) : (
                        cart.map(item => (
                             <div key={item.id} className="flex items-center gap-4 bg-white/2 rounded-xl p-3">
                                <img src={item.img || item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover shadow-sm" />
                                <div className="flex-grow">
                                    <p className="font-bold text-white">{item.name}</p>
                                    <p className="text-sm text-amber-400">{item.price} ₽</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleQuantityChange(item.id, -1)} className="p-1 hover:bg-white/10 rounded-full text-white"><MinusIcon/></button>
                                    <span className="text-white">{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id, 1)} className="p-1 hover:bg-white/10 rounded-full text-white"><PlusIcon/></button>
                                </div>
                                <div className="font-bold text-white">{item.price * item.quantity} ₽</div>
                                <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-400"><Trash2Icon/></button>
                            </div>
                        ))
                    )}
                </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center font-bold text-lg text-white">
                            <span>Итого:</span>
                            <span>{cartTotal} ₽</span>
                        </div>
                        <button
                            onClick={async () => {
                                if (processing || cart.length === 0) return;
                                setProcessing(true);
                                try {
                                    // navigate to next/checkout route
                                    await router.push('/checkout');
                                } finally {
                                    setProcessing(false);
                                    onClose?.();
                                }
                            }}
                            className={`flex items-center justify-center w-full font-bold py-3 px-6 rounded-lg mt-4 ${cart.length === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'glow-button'}`}
                            disabled={cart.length === 0}
                        >
                            {processing && <Spinner />}
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
