import Head from 'next/head'

export default function SEO({
  title = 'ARPOZAN - Натуральные добавки для мужского здоровья',
  description = 'Природные добавки для повышения тестостерона, энергии и либидо. Мака перуанская, Йохимбин, Цинк, Тонгкат Али.',
  keywords = 'тестостерон, либидо, энергия, мака, йохимбин, цинк, тонгкат али, мужское здоровье',
  image = '/assets/imgs/Artur.jpg',
  url = 'https://arpofan.ru',
  type = 'website',
}) {
  const siteName = 'ARPOZAN'
  const twitterHandle = '@arpofan'

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ARPOZAN" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${url}${image}`} />
      <meta property="twitter:site" content={twitterHandle} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#F5A623" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ARPOZAN',
            url: url,
            logo: `${url}/assets/imgs/Artur.jpg`,
            description: description,
            sameAs: [
              'https://www.instagram.com/arpofan',
              'https://www.facebook.com/arpofan',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+7-XXX-XXX-XX-XX',
              contactType: 'customer service',
            },
          }),
        }}
      />
    </Head>
  )
}
