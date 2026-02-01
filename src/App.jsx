import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AppointmentModal from './components/AppointmentModal'

import './pages/Pages.css'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import Prices from './pages/Prices'
import Reviews from './pages/Reviews'
import ContactPage from './pages/ContactPage'
import AdminPanel from './pages/AdminPanel'
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setContent(data);
        }
      })
      .catch(console.error);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  console.log(content);

  return (
    <Router>
      <div className="App">
        <Header onOpenModal={openModal} content={content?.header} />

        <Routes>
          <Route path="/" element={<Home onOpenModal={openModal} content={content} />} />
          <Route path="/portfolio" element={<Portfolio portfolio={content?.portfolio} />} />
          <Route path="/about" element={<AboutPage content={content} />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/prices" element={<Prices price={content?.price} />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contacts" element={<ContactPage content={content} />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>

        <Footer content={content?.contact} />
        <AppointmentModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </Router>
  )
}

export default App
