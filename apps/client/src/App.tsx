import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import ShopPage from "./pages/ShopPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
