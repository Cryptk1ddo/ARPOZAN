-- Insert initial data for ARPOZAN e-commerce platform

-- ============================
-- Categories
-- ============================

INSERT INTO categories (id, name, description, slug, sort_order) VALUES
  (gen_random_uuid(), 'Мужское здоровье', 'Продукты для поддержания мужского здоровья и энергии', 'mens-health', 1),
  (gen_random_uuid(), 'Тестостерон буsters', 'Натуральные добавки для поддержки уровня тестостерона', 'testosterone-boosters', 2),
  (gen_random_uuid(), 'Комплексы', 'Готовые комплексы для достижения целей', 'complexes', 3);

-- ============================
-- Products
-- ============================

INSERT INTO products (
  id, name, description, short_description, one_time_price, subscription_price,
  image_url, gallery_images, stock_quantity, category_id, slug,
  benefits, ingredients, usage_instructions, warnings
) VALUES 
(
  'zinc',
  'Цинк пиколинат',
  'Высокобиодоступная форма цинка для поддержки тестостерона, иммунной системы и общего здоровья мужчин.',
  'Поддержка тестостерона и иммунитета',
  1990.00,
  2691.00,
  '/assets/imgs/Zink.png',
  '[
    "/assets/imgs/Zinc-product-imgs/Zinc-Product.png",
    "/assets/imgs/Zinc-product-imgs/Zinc-Ingredients.png",
    "/assets/imgs/Zinc-product-imgs/Zinc-Effects.png",
    "/assets/imgs/Zinc-product-imgs/Zinc-benefits.png"
  ]'::jsonb,
  100,
  (SELECT id FROM categories WHERE slug = 'testosterone-boosters'),
  'zinc',
  '[
    {"name": "Поддержка тестостерона", "description": "Цинк необходим для синтеза тестостерона"},
    {"name": "Укрепление иммунитета", "description": "Мощная поддержка иммунной системы"},
    {"name": "Улучшение фертильности", "description": "Важен для репродуктивного здоровья мужчин"},
    {"name": "Антиоксидантная защита", "description": "Защита клеток от окислительного стресса"}
  ]'::jsonb,
  '[
    {"name": "Цинк пиколинат", "amount": "15 мг", "description": "Высокобиодоступная форма цинка"}
  ]'::jsonb,
  'Принимать по 1 капсуле в день во время еды или как рекомендовано врачом.',
  'Не превышать рекомендуемую дозу. Хранить в недоступном для детей месте.'
),
(
  'maca',
  'Мака перуанская',
  'Натуральный адаптоген из Перу для повышения энергии, выносливости и либидо.',
  'Энергия и выносливость от природы',
  1990.00,
  2691.00,
  '/assets/imgs/Maka peruvian.png',
  '[
    "/assets/imgs/Maca-product-imgs/Maca-Product.png",
    "/assets/imgs/Maca-product-imgs/Maca-Benefits.png",
    "/assets/imgs/Maca-product-imgs/Maca-Ingredients.png"
  ]'::jsonb,
  85,
  (SELECT id FROM categories WHERE slug = 'mens-health'),
  'maca',
  '[
    {"name": "Повышение энергии", "description": "Натуральный источник энергии без стимуляторов"},
    {"name": "Улучшение либидо", "description": "Традиционно используется для поддержки сексуальной функции"},
    {"name": "Адаптогенные свойства", "description": "Помогает адаптироваться к стрессу"},
    {"name": "Поддержка выносливости", "description": "Улучшает физическую и умственную выносливость"}
  ]'::jsonb,
  '[
    {"name": "Экстракт корня Маки", "amount": "500 мг", "description": "Стандартизированный экстракт 10:1"}
  ]'::jsonb,
  'Принимать по 1-2 капсулы в день, желательно утром с едой.',
  'Не рекомендуется при проблемах с щитовидной железой. Консультация врача обязательна.'
),
(
  'long-jack',
  'Тонгкат Али',
  'Премиальный экстракт Тонгкат Али (Eurycoma longifolia) для поддержки мужской силы и энергии.',
  'Премиальная поддержка мужской силы',
  2990.00,
  3990.00,
  '/assets/imgs/Tongkat Ali.png',
  '[
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Product.png",
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Ingredients.png",
    "/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Benefits.png"
  ]'::jsonb,
  50,
  (SELECT id FROM categories WHERE slug = 'testosterone-boosters'),
  'tongkat-ali',
  '[
    {"name": "Поддержка тестостерона", "description": "Естественная поддержка уровня тестостерона"},
    {"name": "Повышение либидо", "description": "Улучшение сексуальной функции и желания"},
    {"name": "Увеличение мышечной массы", "description": "Поддержка роста и восстановления мышц"},
    {"name": "Снижение стресса", "description": "Уменьшение уровня кортизола"}
  ]'::jsonb,
  '[
    {"name": "Экстракт Тонгкат Али", "amount": "400 мг", "description": "Стандартизированный экстракт 100:1"},
    {"name": "Эврипептиды", "amount": "1%", "description": "Активные соединения для максимальной эффективности"}
  ]'::jsonb,
  'Принимать по 1 капсуле в день натощак за 30 минут до еды.',
  'Не рекомендуется лицам младше 18 лет. Проконсультируйтесь с врачом перед применением.'
),
(
  'yohimbin',
  'Йохимбин HCl',
  'Высокочистый йохимбин гидрохлорид для поддержки мужского здоровья и жиросжигания.',
  'Мощная поддержка мужского здоровья',
  1990.00,
  2691.00,
  '/assets/imgs/Yohimbin 1.png',
  '[
    "/assets/imgs/Yohimbin-product-imgs/Yohimbe-Product.png",
    "/assets/imgs/Yohimbin-product-imgs/Yohimbe-benefits.png",
    "/assets/imgs/Yohimbin-product-imgs/Yohimbe-composition.png"
  ]'::jsonb,
  75,
  (SELECT id FROM categories WHERE slug = 'mens-health'),
  'yohimbin',
  '[
    {"name": "Поддержка эректильной функции", "description": "Улучшение кровообращения в области таза"},
    {"name": "Жиросжигание", "description": "Стимулирует липолиз и метаболизм"},
    {"name": "Повышение энергии", "description": "Стимулирующий эффект без кофеина"},
    {"name": "Улучшение настроения", "description": "Поддержка нейромедиаторов"}
  ]'::jsonb,
  '[
    {"name": "Йохимбин HCl", "amount": "5 мг", "description": "Чистый йохимбин гидрохлорид фармацевтического качества"}
  ]'::jsonb,
  'Принимать по 1 капсуле натощак за 30-60 минут до тренировки или как рекомендовано специалистом.',
  'ВНИМАНИЕ: Не принимать при сердечно-сосудистых заболеваниях, высоком давлении. Только для здоровых взрослых.'
),
(
  'ultimate-pack',
  'ULTIMATE MEN''S PACK',
  'Премиальный комплекс из всех продуктов ARPOZAN для максимальной поддержки мужского здоровья.',
  'Полный комплекс для мужского здоровья',
  7990.00,
  9990.00,
  '/assets/imgs/Ultimate Pack.png',
  '[
    "/assets/imgs/Ultimate Pack.png"
  ]'::jsonb,
  25,
  (SELECT id FROM categories WHERE slug = 'complexes'),
  'ultimate-pack',
  '[
    {"name": "Полная поддержка тестостерона", "description": "Комплексное воздействие на гормональную систему"},
    {"name": "Максимальная энергия", "description": "Синергия всех компонентов для максимального эффекта"},
    {"name": "Экономия до 30%", "description": "Выгодная цена при покупке комплекта"},
    {"name": "Удобство приема", "description": "Все необходимое в одном комплекте"}
  ]'::jsonb,
  '[
    {"name": "Цинк пиколинат", "amount": "1 упаковка", "description": "Полный курс на месяц"},
    {"name": "Мака перуанская", "amount": "1 упаковка", "description": "Полный курс на месяц"},
    {"name": "Тонгкат Али", "amount": "1 упаковка", "description": "Полный курс на месяц"},
    {"name": "Йохимбин HCl", "amount": "1 упаковка", "description": "Полный курс на месяц"}
  ]'::jsonb,
  'Следуйте инструкциям по применению каждого продукта в комплекте. Рекомендуется консультация специалиста.',
  'Ознакомьтесь с противопоказаниями каждого продукта. Не рекомендуется одновременный прием всех продуктов без консультации врача.'
);

-- ============================
-- FAQ Data
-- ============================

INSERT INTO faqs (question, answer, category, sort_order) VALUES
('Как долго нужно принимать продукты ARPOZAN?', 'Рекомендуемый курс составляет 1-3 месяца в зависимости от целей. Для достижения максимального эффекта рекомендуется принимать продукты регулярно в течение 8-12 недель.', 'general', 1),
('Можно ли совмещать продукты ARPOZAN?', 'Да, наши продукты разработаны с учетом возможности совместного приема. Однако рекомендуется начинать с одного продукта и постепенно добавлять другие, консультируясь со специалистом.', 'general', 2),
('Есть ли побочные эффекты?', 'Наши продукты изготовлены из натуральных компонентов и при соблюдении рекомендаций безопасны. Однако возможны индивидуальные реакции. При появлении любых неприятных симптомов прекратите прием и обратитесь к врачу.', 'general', 3),
('Какие гарантии качества?', 'Все продукты ARPOZAN производятся на сертифицированных предприятиях с соблюдением стандартов GMP. Каждая партия проходит лабораторные тесты на чистоту и активность компонентов.', 'general', 4),
('Как быстро наступает эффект?', 'Первые результаты могут быть заметны через 2-4 недели регулярного приема. Максимальный эффект обычно достигается через 6-8 недель. Индивидуальные результаты могут варьироваться.', 'general', 5);

-- Insert product-specific FAQs
INSERT INTO faqs (question, answer, category, product_id, sort_order) VALUES
('В какое время лучше принимать цинк?', 'Цинк лучше принимать во время еды или сразу после, чтобы избежать раздражения желудка. Оптимальное время - утром или в первой половине дня.', 'products', 'zinc', 1),
('Можно ли принимать маку с кофе?', 'Да, мака хорошо сочетается с кофе и может даже усилить его бодрящий эффект. Однако не рекомендуется превышать общее количество стимулирующих веществ.', 'products', 'maca', 1),
('Нужны ли перерывы в приеме Тонгкат Али?', 'Рекомендуется делать перерыв 1-2 недели после каждых 8-12 недель приема для поддержания эффективности и предотвращения адаптации организма.', 'products', 'long-jack', 1),
('Безопасен ли йохимбин для ежедневного приема?', 'Йохимбин следует принимать курсами с перерывами. Не рекомендуется непрерывный прием более 8 недель. Обязательно соблюдайте дозировку и противопоказания.', 'products', 'yohimbin', 1);

-- ============================
-- Achievements
-- ============================

INSERT INTO achievements (name, description, icon, criteria, points_reward) VALUES
('Первый заказ', 'Совершен первый заказ в ARPOZAN', '🎯', '{"orders_count": 1}', 100),
('Постоянный клиент', 'Совершено 5 или более заказов', '⭐', '{"orders_count": 5}', 500),
('Здоровый выбор', 'Заказан Ultimate Men''s Pack', '💪', '{"ultimate_pack_ordered": true}', 300),
('Ранняя пташка', '30 дней подряд с продуктами ARPOZAN', '🌅', '{"consecutive_days": 30}', 1000),
('Эксперт здоровья', 'Попробованы все продукты линейки', '🧬', '{"all_products_tried": true}', 2000),
('Амбассадор бренда', 'Совершено 10+ заказов на сумму 50,000₽+', '👑', '{"orders_count": 10, "total_spent": 50000}', 5000);

-- ============================
-- Quiz Questions
-- ============================

INSERT INTO quiz_questions (question_text, question_type, options, sort_order) VALUES
('Какова ваша основная цель?', 'single_choice', '[
  {"value": "testosterone", "label": "Повысить уровень тестостерона", "score": 3},
  {"value": "energy", "label": "Увеличить энергию и выносливость", "score": 2},
  {"value": "muscle", "label": "Набрать мышечную массу", "score": 3},
  {"value": "health", "label": "Улучшить общее самочувствие", "score": 1}
]', 1),

('Ваш возраст?', 'single_choice', '[
  {"value": "18-25", "label": "18-25 лет", "score": 1},
  {"value": "26-35", "label": "26-35 лет", "score": 2},
  {"value": "36-45", "label": "36-45 лет", "score": 3},
  {"value": "46+", "label": "46+ лет", "score": 4}
]', 2),

('Как часто вы занимаетесь спортом?', 'single_choice', '[
  {"value": "daily", "label": "Каждый день", "score": 4},
  {"value": "regular", "label": "3-4 раза в неделю", "score": 3},
  {"value": "sometimes", "label": "1-2 раза в неделю", "score": 2},
  {"value": "rarely", "label": "Редко или никогда", "score": 1}
]', 3),

('Ваш уровень стресса?', 'single_choice', '[
  {"value": "low", "label": "Низкий", "score": 1},
  {"value": "medium", "label": "Средний", "score": 2},
  {"value": "high", "label": "Высокий", "score": 3},
  {"value": "extreme", "label": "Очень высокий", "score": 4}
]', 4),

('Принимали ли вы ранее добавки для мужского здоровья?', 'single_choice', '[
  {"value": "never", "label": "Никогда", "score": 1},
  {"value": "rarely", "label": "Изредка", "score": 2},
  {"value": "regularly", "label": "Регулярно", "score": 3},
  {"value": "expert", "label": "Я эксперт в этой области", "score": 4}
]', 5);

-- ============================
-- Site Settings
-- ============================

INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'ARPOZAN', 'string', 'Название сайта'),
('site_description', 'Премиальные продукты для мужского здоровья', 'string', 'Описание сайта'),
('contact_email', 'support@arpozan.com', 'string', 'Email для связи'),
('contact_phone', '+7 (800) 123-45-67', 'string', 'Телефон для связи'),
('shipping_cost', '0', 'number', 'Стоимость доставки (0 = бесплатно)'),
('min_order_free_shipping', '2000', 'number', 'Минимальная сумма заказа для бесплатной доставки'),
('loyalty_points_rate', '0.01', 'number', 'Курс начисления баллов (1% от суммы покупки)'),
('quiz_recommendations_count', '3', 'number', 'Количество рекомендаций в квизе'),
('enable_reviews', 'true', 'boolean', 'Включить систему отзывов'),
('enable_wishlist', 'true', 'boolean', 'Включить список желаний');

-- ============================
-- Sample Admin User
-- ============================

INSERT INTO admins (email, password_hash, name, role, permissions) VALUES
('admin@arpozan.com', '$2b$10$hash_here', 'ARPOZAN Admin', 'super_admin', '[
  "users.read", "users.write", "users.delete",
  "products.read", "products.write", "products.delete",
  "orders.read", "orders.write", "orders.delete",
  "analytics.read", "settings.write"
]');

-- ============================
-- Triggers for auto-updating timestamps
-- ============================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();