import Image from 'next/image'

export default function PaymentIconsDark({ size = 'default', className = '' }) {
  const iconSize = size === 'small' 
    ? { width: 40, height: 26 } 
    : size === 'large' 
    ? { width: 60, height: 40 } 
    : { width: 50, height: 32 }
  
  const paymentMethods = [
    {
      name: 'Visa',
      src: '/assets/icons/Payment%20and%20Credit%20Card%20Icon%20Library%20(Community)/Visa.svg',
      alt: 'Visa'
    },
    {
      name: 'MasterCard',
      src: '/assets/icons/Payment%20and%20Credit%20Card%20Icon%20Library%20(Community)/MasterCard.svg',
      alt: 'MasterCard'
    },
    {
      name: 'МИР',
      src: '/assets/icons/Payment%20and%20Credit%20Card%20Icon%20Library%20(Community)/MNP.svg',
      alt: 'МИР'
    },
    {
      name: 'YandexPay',
      src: '/assets/icons/Payment%20and%20Credit%20Card%20Icon%20Library%20(Community)/YandexPay.svg',
      alt: 'Яндекс.Пэй'
    },
    {
      name: 'UnionPay',
      src: '/assets/icons/Payment%20and%20Credit%20Card%20Icon%20Library%20(Community)/UnionPay.svg',
      alt: 'UnionPay'
    }
  ]

  return (
    <div className={`flex items-center justify-center space-x-3 mt-4 ${className}`}>
      <div className="flex items-center space-x-2 text-gray-400 text-sm">
        <span>Принимаем к оплате:</span>
      </div>
      <div className="flex items-center space-x-2">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="flex items-center justify-center rounded-lg p-1 hover:scale-105 transition-all duration-200"
          >
            <div className="bg-white rounded p-0.5">
              <Image
                src={method.src}
                alt={method.alt}
                width={iconSize.width}
                height={iconSize.height}
                className="object-contain"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}