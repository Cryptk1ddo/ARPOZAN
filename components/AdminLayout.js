import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Tag,
  FileText,
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react'
import { auth } from '../lib/supabase'

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const user = await auth.getCurrentUser()
      if (!user || !user.email.includes('admin')) {
        router.push('/admin/login')
        return
      }
      setAdmin(user)
    } catch (error) {
      console.error('Admin check error:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/admin/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'FAQs', href: '/admin/faqs', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Image src="/assets/imgs/Artur.jpg" alt="ARPOZAN" width={32} height={32} className="rounded-lg" />
              <span className="text-white font-bold">ARPOZAN Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <nav className="mt-5 px-2">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Image src="/assets/imgs/Artur.jpg" alt="ARPOZAN" width={32} height={32} className="rounded-lg" />
              <span className="text-white font-bold">ARPOZAN Admin</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = router.pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                            isActive
                              ? 'bg-gray-700 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          <item.icon size={20} />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-700 hover:text-white w-full"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <h1 className="text-white font-semibold text-lg">{title}</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button className="text-gray-400 hover:text-white">
                <Bell size={20} />
              </button>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-700" />
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{admin?.email}</p>
                    <p className="text-xs text-gray-400">Super Admin</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Shield size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout