
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Layout } from "@/components/layout"
import { HomePage } from "@/pages/home"
import { ContactPage } from "@/pages/contact"
import { AccessDeniedPage } from "./pages/errors/access-denied"
import { NotFoundPage } from "./pages/errors/not-found"


function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="jengashop-theme">
      <Router>
        <Routes>
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
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </Layout>
          } />
          <Route path="/products" element={
            <Layout>
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Products</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </Layout>
          } />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
