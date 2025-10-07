import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/home/home'
import ContactUs from './pages/contactUs/contactUs'
import Hotel from './pages/hotel/hotel'
import Footer from './components/footer'
import HeaderHero from './components/HeaderHero'
import Restaurant from './pages/restaurant/restaurant'
import CheckReservation from './pages/checkReservation/checkReservation'

function App() {
  return (
    <>
    <HeaderHero />
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
  <Route path="/hotel" element={<Hotel />} />
  <Route path="/restaurant" element={<Restaurant />} />
  <Route path="/contact" element={<ContactUs />} />
  <Route path="/check" element={<CheckReservation />} />
      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App
