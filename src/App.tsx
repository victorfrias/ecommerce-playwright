import { Outlet } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { CartProvider } from './cart/CartContext'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <a className="skip-link" href="#content">
            Skip to content
          </a>
          <Header />
          <main id="content">
            <Outlet />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
