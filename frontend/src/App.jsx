import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './pages/home/home'
import ContactUs from './pages/contactUs/contactUs'
import Hotel from './pages/hotel/hotel'
import Footer from './components/footer'
import Restaurant from './pages/restaurant/restaurant'
import CheckReservation from './pages/checkReservation/checkReservation'
import BookingPage from './pages/booking/BookingPage'
import RoomDetailsPage from './pages/room/RoomDetailsPage'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  // Add background image after 1 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('loaded')
    }, 1000)

    return () => clearTimeout(timer)
  }, [])
  return (
    <LanguageProvider>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/check" element={<CheckReservation />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/room/:id" element={<RoomDetailsPage />} />
        </Routes>
      </div>
      <Footer/>
    </LanguageProvider>
  )
}

export default App
