import Head from 'next/head'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function IndexBackup(){
  return (
    <Layout>
      <Head>
        <title>ARPOZAN — Backup Home</title>
      </Head>

      <div className="animated-gradient-hero" />

      <main className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="flex text-amber-400">
                  {/* 5 stars */}
                  {Array.from({length:5}).map((_,i)=> (
                    <svg key={i} aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 1.25a.91.91 0 01.8.4l2.5 5.2 5.8.8c.9.1 1.3 1.2.6 1.8l-4.2 4.1.9 5.8c.1.9-.8 1.6-1.6 1.2l-5.2-2.7-5.2 2.7c-.8.4-1.7-.3-1.6-1.2l.9-5.8-4.2-4.1c-.6-.6-.2-1.7.6-1.8l5.8-.8 2.5-5.2a.91.91 0 01.8-.4z" /></svg>
                  ))}
                </div>
                <p className="text-sm text-gray-400">Более 10,000+ довольных клиентов</p>
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 font-heading">Твоя энергия — <span className="gradient-text">твой капитал</span></h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto md:mx-0 mb-10">Разработано экспертами-нутрициологами, чтобы предложить практическое решение и обеспечить вас всеми необходимыми питательными веществами в течение дня.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <a href="#pricing" className="glow-button w-full sm:w-auto text-black font-bold text-base uppercase px-10 py-4 rounded-lg tracking-wider">Купить ARPOZAN</a>
                <button className="w-full sm:w-auto bg-transparent border border-white/30 text-white font-bold text-base uppercase px-10 py-4 rounded-lg tracking-wider hover:bg-white/10">Подобрать продукт</button>
              </div>
            </div>

            <div className="product-image-container">
              <img src="/assets/imgs/Maka peruvian.png" alt="Product bottle" className="mx-auto h-[450px] md:h-[600px] object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>

        <section id="science" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 font-heading">Научный подход <span className="gradient-text">ARPOZAN</span></h2>
              <p className="text-gray-400 mt-4">Мы отказались от компромиссов. ARPOZAN — это чистые, мощные экстракты в дозировках, подтвержденных исследованиями, для тех, кто требует от жизни большего.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div><div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"><svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none"><path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25" stroke="currentColor" strokeWidth="1.5"/></svg></div><h3 className="text-xl font-bold text-white font-heading">Проверено в лаборатории</h3><p className="text-gray-400 mt-2">Каждая партия проходит строгий контроль качества и чистоты.</p></div>
              <div><div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"><svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75" stroke="currentColor" strokeWidth="1.5"/></svg></div><h3 className="text-xl font-bold text-white font-heading">Натуральные ингредиенты</h3><p className="text-gray-400 mt-2">Мы используем только силу природы, без синтетических добавок.</p></div>
              <div><div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"><svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none"><path d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12" stroke="currentColor" strokeWidth="1.5"/></svg></div><h3 className="text-xl font-bold text-white font-heading">Эффективные дозировки</h3><p className="text-gray-400 mt-2">Только рабочие дозы для реального результата.</p></div>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white font-heading">Наша линейка для <span className="gradient-text">максимальной производительности</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {img:'/assets/imgs/Yohimbin 1.png', title:'ARPOZAN Yohimbe', price:'2990₽'},
                {img:'/assets/imgs/Maka peruvian.png', title:'ARPOZAN Maca', price:'1990₽'},
                {img:'/assets/imgs/Zink.png', title:'ARPOZAN Zinc', price:'1990₽'},
                {img:'/assets/imgs/Tongkat Ali.png', title:'ARPOZAN Tongkat Ali', price:'2990₽'}
              ].map((p,i)=> (
                <div key={i} className="catalog-card glass-card rounded-2xl p-6 flex flex-col text-center items-center relative">
                  <img src={p.img} alt={p.title} className="h-40 w-40 object-contain mb-4" />
                  <h3 className="font-bold text-xl text-white font-heading">{p.title}</h3>
                  <p className="text-gray-400 text-sm my-2 flex-grow">{p.title}</p>
                  <p className="text-2xl font-bold text-white my-4">{p.price}</p>
                  <div className="w-full mt-auto"><Link href="#" className="details-btn w-full inline-block bg-white/10 text-white font-bold py-2 rounded-lg hover:bg-white/20">Подробнее</Link></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonial" className="py-24 bg-black">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white font-heading">Отзывы наших <span className="gradient-text">клиентов</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({length:6}).map((_,i)=> (
                <div key={i} className="glass-card rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4"><div className="flex text-amber-400">★★★★★</div></div>
                  <p className="text-gray-300 mb-4 flex-grow">Отличный продукт. Рекомендую.</p>
                  <div className="flex items-center mt-6"><img src={`https://placehold.co/40x40/333/fff?text=${i+1}`} className="rounded-full mr-3" alt="Avatar" /><div><p className="font-bold text-white">Клиент {i+1}</p><p className="text-sm text-amber-400">Роль</p></div></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-white font-heading">ULTIMATE MEN’S PACK</h2>
            <p className="text-center text-lg text-gray-400 mb-12">Полный набор для мужской силы и энергии</p>
            <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 overflow-visible">
              <div className="md:w-1/3 text-center"><img src="/assets/imgs/Ultimate Pack.png" alt="Ultimate Men's Pack" className="mx-auto h-64 object-contain" /></div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-white font-heading">Хочешь максимум эффекта?</h3>
                <p className="text-gray-400 mt-2 mb-6">Мы собрали в один комплект все самые мощные продукты. Вместе они работают синергично для поддержки гормональной системы, стабильной энергии, улучшения интимной жизни и ускоренного восстановления.</p>
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                  <span className="text-gray-400 text-sm">Разовая покупка</span>
                  <span className="font-semibold gradient-text text-sm">Подписка (-10%)</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <a href="#" className="glow-button text-black font-bold uppercase px-8 py-4 rounded-lg tracking-wider">Заказать</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
