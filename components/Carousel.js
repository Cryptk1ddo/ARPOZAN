import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Carousel({ images = [], currentIndex, onPrev, onNext, onJump }){
  const [loadedImages, setLoadedImages] = useState(new Set())

  useEffect(() => {
    // Preload images
    images.forEach((src, idx) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, idx]))
      }
    })
  }, [images])

  return (
    <div className="relative w-full h-full">
      {/* main image: load eagerly for visible slide, others lazy-load via offscreen preloads */}
      <img
        src={images[currentIndex]}
        alt={`product-${currentIndex}`}
        loading="eager"
        className="w-full h-full object-contain rounded-lg"
      />

      {/* preload other images so transitions are smooth */}
      <div style={{display: 'none'}} aria-hidden>
        {images.map((src, idx) => idx !== currentIndex && (
          <img key={idx} src={src} alt={`preload-${idx}`} loading="lazy" />
        ))}
      </div>

      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between z-10">
        <button
          onClick={onPrev}
          className="bg-gray-900/50 hover:bg-gray-900/70 p-2 rounded-full text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={onNext}
          className="bg-gray-900/50 hover:bg-gray-900/70 p-2 rounded-full text-white transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-6 left-6 flex space-x-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onJump(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-yellow-500' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
