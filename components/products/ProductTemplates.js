// Product Templates Component
// Renders different product page templates based on template_type
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Heart, Plus, Minus } from 'lucide-react';
import Carousel from '../Carousel';
import StickyCTA from '../StickyCTA';
import PaymentIcons from '../PaymentIcons';
import LuxuryFAQ from '../LuxuryFAQ';
import { animations } from '../../lib/gsapUtils';
import { utils } from '../../lib/lodashUtils';
import gsap from 'gsap';

export default function ProductTemplates({ 
  product, 
  templateType = 'default',
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist,
  showToast
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('one-time');
  const [activeBenefit, setActiveBenefit] = useState('');
  const [activeComponent, setActiveComponent] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const benefitsRef = useRef([]);
  const componentsRef = useRef([]);

  const productContent = product.product_content || {};
  const benefits = productContent.benefits || {};
  const components = productContent.components || {};
  const faqData = productContent.faq_data || [];
  const heroImages = productContent.hero_images || product.images || [];

  // Initialize active states
  useEffect(() => {
    if (Object.keys(benefits).length > 0 && !activeBenefit) {
      setActiveBenefit(Object.keys(benefits)[0]);
    }
    if (Object.keys(components).length > 0 && !activeComponent) {
      setActiveComponent(Object.keys(components)[0]);
    }
  }, [benefits, components, activeBenefit, activeComponent]);

  // GSAP Animations
  useEffect(() => {
    if (titleRef.current) {
      animations.fadeIn(titleRef.current, 1, 0.3);
    }

    benefitsRef.current.forEach((benefit) => {
      if (benefit) {
        animations.hoverScale(benefit, 1.02);
      }
    });

    componentsRef.current.forEach((component) => {
      if (component) {
        animations.hoverScale(component, 1.02);
      }
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
      animations.scrollReveal(el);
    });
  }, []);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    const productData = {
      id: product.slug,
      name: product.name,
      price: selectedPlan === 'subscription' ? product.price * 0.9 : product.price, // 10% discount for subscription
      quantity,
      plan: selectedPlan,
      image: product.images?.[0]
    };

    if (utils.isEmpty(productData.name) || !utils.isNumber(productData.price)) {
      showToast('Ошибка: некорректные данные товара');
      return;
    }

    onAddToCart(productData);
    showToast(`✅ ${productData.name} добавлен в корзину!`);

    // GSAP animation
    const addToCartBtn = document.querySelector('.glow-button');
    if (addToCartBtn) {
      const tl = gsap.timeline();
      tl.to(addToCartBtn, { scale: 0.95, duration: 0.1 })
        .to(addToCartBtn, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
    }
  };

  const handleWishlistToggle = () => {
    const productData = {
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      href: `/products/${product.slug}`
    };

    if (isInWishlist(product.slug)) {
      onRemoveFromWishlist(product.slug);
      showToast('💔 Товар удален из избранного');
    } else {
      onAddToWishlist(productData);
      showToast('❤️ Товар добавлен в избранное!');
    }

    // GSAP animation
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
      const tl = gsap.timeline();
      tl.to(wishlistBtn, { scale: 0.8, duration: 0.1 })
        .to(wishlistBtn, { scale: 1.1, duration: 0.2 })
        .to(wishlistBtn, { scale: 1, duration: 0.1 });
    }
  };

  // Render based on template type
  switch (templateType) {
    case 'supplement':
      return <SupplementTemplate 
        product={product}
        productContent={productContent}
        benefits={benefits}
        components={components}
        faqData={faqData}
        heroImages={heroImages}
        currentImageIndex={currentImageIndex}
        selectedPlan={selectedPlan}
        activeBenefit={activeBenefit}
        activeComponent={activeComponent}
        quantity={quantity}
        refs={{ canvasRef, titleRef, benefitsRef, componentsRef }}
        handlers={{
          handleImageChange,
          handleAddToCart,
          handleWishlistToggle,
          setSelectedPlan,
          setActiveBenefit,
          setActiveComponent,
          setQuantity
        }}
        utils={{ isInWishlist }}
      />;
    
    case 'simple':
      return <SimpleTemplate 
        product={product}
        heroImages={heroImages}
        faqData={faqData}
        currentImageIndex={currentImageIndex}
        selectedPlan={selectedPlan}
        quantity={quantity}
        refs={{ titleRef }}
        handlers={{
          handleImageChange,
          handleAddToCart,
          handleWishlistToggle,
          setSelectedPlan,
          setQuantity
        }}
        utils={{ isInWishlist }}
      />;
    
    case 'premium':
      return <PremiumTemplate 
        product={product}
        productContent={productContent}
        benefits={benefits}
        components={components}
        faqData={faqData}
        heroImages={heroImages}
        currentImageIndex={currentImageIndex}
        selectedPlan={selectedPlan}
        activeBenefit={activeBenefit}
        activeComponent={activeComponent}
        quantity={quantity}
        refs={{ canvasRef, titleRef, benefitsRef, componentsRef }}
        handlers={{
          handleImageChange,
          handleAddToCart,
          handleWishlistToggle,
          setSelectedPlan,
          setActiveBenefit,
          setActiveComponent,
          setQuantity
        }}
        utils={{ isInWishlist }}
      />;
    
    default:
      return <DefaultTemplate 
        product={product}
        heroImages={heroImages}
        faqData={faqData}
        currentImageIndex={currentImageIndex}
        selectedPlan={selectedPlan}
        quantity={quantity}
        refs={{ titleRef }}
        handlers={{
          handleImageChange,
          handleAddToCart,
          handleWishlistToggle,
          setSelectedPlan,
          setQuantity
        }}
        utils={{ isInWishlist }}
      />;
  }
}

// Supplement Template (like Zinc page)
function SupplementTemplate({ 
  product, 
  productContent, 
  benefits, 
  components, 
  faqData, 
  heroImages,
  currentImageIndex,
  selectedPlan,
  activeBenefit,
  activeComponent,
  quantity,
  refs,
  handlers,
  utils
}) {
  const { canvasRef, titleRef, benefitsRef, componentsRef } = refs;
  const {
    handleImageChange,
    handleAddToCart,
    handleWishlistToggle,
    setSelectedPlan,
    setActiveBenefit,
    setActiveComponent,
    setQuantity
  } = handlers;

  // Particles animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(245, 166, 35, 0.2)';

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      requestAnimationFrame(drawParticles);
    }

    drawParticles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const productData = {
    id: product.slug,
    name: product.name,
    oneTimePrice: product.price,
    subscriptionPrice: Math.round(product.price * 1.35), // 35% markup for subscription
  };

  return (
    <main>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      <div className="relative">
        <section className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[25px]">
          {/* Product Images */}
          <div className="lg:sticky lg:top-[81px] h-[60vh] lg:h-[calc(100vh-81px)]">
            <div className="relative reveal w-full h-full p-8 lg:p-16 flex items-center justify-center">
              {heroImages[currentImageIndex] && (
                <Image
                  src={heroImages[currentImageIndex]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                />
              )}

              {/* Navigation arrows */}
              {heroImages.length > 1 && (
                <>
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between z-10">
                    <button
                      onClick={() =>
                        handleImageChange(
                          (currentImageIndex - 1 + heroImages.length) % heroImages.length
                        )
                      }
                      className="bg-gray-900/50 hover:bg-gray-900/80 p-2 rounded-full text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        handleImageChange((currentImageIndex + 1) % heroImages.length)
                      }
                      className="bg-gray-900/50 hover:bg-gray-900/80 p-2 rounded-full text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Image indicators */}
                  <div className="absolute bottom-6 left-6 flex space-x-2 z-10">
                    {heroImages.map((_, index) => (
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
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center py-16 px-4 sm:px-8">
            <div className="max-w-[450px] w-full">
              <h1 ref={titleRef} className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mt-2">
                {product.name}
              </h1>
              <p className="mt-2 text-gray-400 text-base sm:text-lg">
                {product.category}
              </p>
              <p className="mt-6 text-gray-400">
                {product.description}
              </p>

              {/* Benefits Section */}
              {Object.keys(benefits).length > 0 && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(benefits).map(([key, description], index) => (
                      <button
                        key={key}
                        ref={(el) => (benefitsRef.current[index] = el)}
                        onClick={() => setActiveBenefit(key)}
                        className={`benefit-tab-btn p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-semibold border-2 transition min-h-[60px] ${
                          activeBenefit === key
                            ? 'bg-gray-500/10 text-gray-300 border-gray-500/30'
                            : 'bg-gray-800/50 text-gray-300 border-transparent hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-center leading-tight capitalize">
                          {key.replace('_', ' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                  {activeBenefit && (
                    <div className="mt-4 text-gray-400 text-sm min-h-[64px] leading-relaxed">
                      {benefits[activeBenefit]}
                    </div>
                  )}
                </div>
              )}

              {/* Purchase Options */}
              <form className="mt-8 space-y-6">
                <fieldset>
                  <legend className="font-bold text-lg mb-4">Выберите ваш план</legend>

                  {/* One-time purchase */}
                  <div className={`p-4 glass-card rounded-lg mb-4 border ${
                    selectedPlan === 'one-time' ? 'border-white/50 ring-2 ring-white/20' : 'border-gray-700'
                  }`}>
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
                        <div className="text-lg font-bold text-gray-200">
                          {product.price?.toLocaleString()} ₽
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Subscription */}
                  <div className={`glass-card rounded-lg border ${
                    selectedPlan === 'subscription' ? 'border-white/50 ring-2 ring-white/20' : 'border-gray-700'
                  }`}>
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
                            <p className="text-lg font-bold text-white">
                              {Math.round(product.price * 0.9)?.toLocaleString()} ₽
                            </p>
                            <p className="text-sm line-through text-gray-500">
                              {product.price?.toLocaleString()} ₽
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <label className="text-gray-300 font-medium">Количество:</label>
                  <div className="flex items-center border border-gray-600 rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-white font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 glow-button font-bold px-4 sm:px-6 py-3 rounded-lg text-base sm:text-lg shadow-lg h-12 flex items-center justify-center"
                  >
                    <span className="whitespace-nowrap">Добавить в корзину</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    className={`wishlist-btn w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
                      utils.isInWishlist(product.slug)
                        ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30'
                        : 'bg-white/10 border-white/30 text-gray-400 hover:border-white/50 hover:text-white'
                    }`}
                    title={utils.isInWishlist(product.slug) ? 'Удалить из избранного' : 'Добавить в избранное'}
                  >
                    <Heart 
                      size={20} 
                      className={`transition-all duration-300 ${
                        utils.isInWishlist(product.slug) ? 'fill-current' : ''
                      }`}
                    />
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
            </div>
          </div>
        </section>
      </div>

      {/* Additional Content Sections */}
      <div className="container mx-auto px-4 lg:px-8">
        {/* Components Section */}
        {Object.keys(components).length > 0 && (
          <section id="components" className="my-16 py-12 reveal">
            <div className="text-center">
              <h2 className="text-3xl font-bold gradient-text">Ключевые компоненты</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Узнайте, что делает наш продукт таким эффективным.
              </p>
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
                  {Object.entries(components).map(([key, data], index) => (
                    <button
                      key={key}
                      ref={(el) => (componentsRef.current[index] = el)}
                      onClick={() => setActiveComponent(key)}
                      className={`font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg text-sm sm:text-lg flex-grow sm:flex-grow-0 transition ${
                        activeComponent === key
                          ? 'glow-button'
                          : 'bg-gray-800 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {data.title || key.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                {activeComponent && components[activeComponent] && (
                  <div className="glass-card rounded-lg p-4 sm:p-8 text-left min-h-[180px] sm:min-h-[200px]">
                    <h3 className="text-lg sm:text-2xl font-bold text-yellow-400">
                      {components[activeComponent].title}
                    </h3>
                    <p className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                      {components[activeComponent].content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqData.length > 0 && (
          <LuxuryFAQ 
            faqs={faqData}
            title="Частые вопросы"
            variant="split"
            theme="dark"
          />
        )}
      </div>

      <StickyCTA product={productData} />
    </main>
  );
}

// Default Template - Simple product layout
function DefaultTemplate({ 
  product, 
  heroImages, 
  faqData,
  currentImageIndex,
  selectedPlan,
  quantity,
  refs,
  handlers,
  utils
}) {
  const { titleRef } = refs;
  const { handleImageChange, handleAddToCart, handleWishlistToggle, setSelectedPlan, setQuantity } = handlers;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {heroImages[currentImageIndex] && (
            <div className="aspect-square relative">
              <Image
                src={heroImages[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          
          {heroImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {heroImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`flex-shrink-0 w-20 h-20 relative rounded border-2 transition-colors ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 ref={titleRef} className="text-3xl font-bold text-white mb-2">
              {product.name}
            </h1>
            <p className="text-gray-400">{product.category}</p>
          </div>

          <div className="text-2xl font-bold text-white">
            {product.original_price && (
              <span className="text-lg line-through text-gray-500 mr-2">
                ₽{product.original_price.toLocaleString()}
              </span>
            )}
            ₽{product.price.toLocaleString()}
          </div>

          <p className="text-gray-300">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <label className="text-gray-300 font-medium">Количество:</label>
            <div className="flex items-center border border-gray-600 rounded-md">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 text-white font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Добавить в корзину
            </button>
            
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-lg border-2 transition-colors ${
                utils.isInWishlist(product.slug)
                  ? 'bg-red-500/20 border-red-500 text-red-500'
                  : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
              }`}
            >
              <Heart size={20} className={utils.isInWishlist(product.slug) ? 'fill-current' : ''} />
            </button>
          </div>

          <PaymentIcons />
        </div>
      </div>

      {/* FAQ Section */}
      {faqData.length > 0 && (
        <div className="mt-16">
          <LuxuryFAQ 
            faqs={faqData}
            title="Частые вопросы"
            variant="split"
            theme="dark"
          />
        </div>
      )}
    </main>
  );
}

// Simple Template - Minimal layout
function SimpleTemplate(props) {
  // Reuse DefaultTemplate for now, but with minimal styling
  return <DefaultTemplate {...props} />;
}

// Premium Template - Enhanced layout with more features
function PremiumTemplate(props) {
  // Reuse SupplementTemplate for now, but could be enhanced further
  return <SupplementTemplate {...props} />;
}