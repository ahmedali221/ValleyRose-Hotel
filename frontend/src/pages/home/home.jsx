import About from './components/about'
import RestaurantSection from './components/restaurant'
import Testimonials from './components/testimonials'
import HeaderHero from '../../components/HeaderHero'
import homeBanner from '../../assets/banners/home.jpg'
import { motion } from 'framer-motion'

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderHero backgroundImage={homeBanner} />
      <About/>
      <RestaurantSection/>
      <Testimonials/>
    </motion.div>
  )
}

export default HomePage
