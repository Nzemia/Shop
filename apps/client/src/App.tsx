
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { HomePage } from "@/pages/home"
import { ContactPage } from "@/pages/contact"
import { AboutPage } from "@/pages/about"
import { ProductsPage } from "@/pages/products"
import { LoginPage } from "@/pages/auth/login"
import { RegisterPage } from "@/pages/auth/register"
import { ForgotPasswordPage } from "@/pages/auth/forgot-password"
import { useAuthInit } from "@/hooks/use-auth-init"
import { AccessDeniedPage } from "./pages/errors/access-denied"
import { NotFoundPage } from "./pages/errors/not-found"






function App() {
  // Initialize authentication state
  useAuthInit()

  return (
    <ThemeProvider defaultTheme="system" storageKey="jengashop-theme">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          <Route path="/contact" element={
            <Layout>
              <ContactPage />
            </Layout>
          } />
          <Route path="/about" element={
            <Layout>
              <AboutPage />
            </Layout>
          } />
          <Route path="/products" element={
            <Layout>
              <ProductsPage />
            </Layout>
          } />

          {/* Auth routes - redirect if already authenticated */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } />
          <Route path="/register" element={
            <ProtectedRoute requireAuth={false}>
              <RegisterPage />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={
            <ProtectedRoute requireAuth={false}>
              <ForgotPasswordPage />
            </ProtectedRoute>
          } />

          {/* Error pages */}
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </Router>
    </ThemeProvider>
  )
}

export default App
