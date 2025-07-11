import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* We’ll add /shop, /product/:id, /cart etc next */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
