import About from './components/about'
import RestaurantSection from './components/restaurant'
import HeaderHero from '../../components/HeaderHero'
import homeBanner from '../../assets/banners/home.jpg'
import { motion } from 'framer-motion'

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-x-hidden"
    >
      <HeaderHero backgroundImage={homeBanner} />
      <div className="space-y-0 overflow-x-hidden">
        <About/>
        <RestaurantSection/>
      </div>
    </motion.div>
  )
}

export default HomePage
