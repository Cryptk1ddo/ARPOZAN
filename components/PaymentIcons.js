export default function PaymentIcons() {
  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <div className="flex items-center space-x-2 text-gray-400 text-sm">
        <span>Принимаем к оплате:</span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
          VISA
        </div>
        <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
          MC
        </div>
        <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
          МИР
        </div>
        <div className="w-8 h-5 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">
          SBER
        </div>
      </div>
    </div>
  )
}
