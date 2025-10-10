import React from 'react'
import { motion } from 'framer-motion'
import HeaderHero from '../../components/HeaderHero'
import contactBanner from '../../assets/banners/contact.jpg'

const ContactUs = () => {
  const contactCards = [
    {
      id: 1,
      title: 'Visit Us',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4.5 8-10a8 8 0 10-16 0c0 5.5 8 10 8 10z" />
        </svg>
      ),
      content: (
        <div className="text-sm text-gray-300">
          <div className="font-medium">Valley Rose Hotel</div>
          <div>Erzherzog Karl Stra§e 98a,</div>
          <div>1220 Vienna, Austria</div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Call Us',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2l1 5-1 1a11 11 0 005 5l1-1 5 1v2a2 2 0 01-2 2h-1C7.611 20 4 16.389 4 11V9a2 2 0 01-1-4z" />
        </svg>
      ),
      content: (
        <div className="text-sm text-gray-300">
          <div>Phone : +43 1 204 38 88</div>
          <div>Mobile: +43 650 910 66 01</div>
          <div>Whatsapp: +43 650 910 66 01</div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Email Us',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
      content: (
        <div className="text-sm text-gray-300">valleyrose@speed.at</div>
      )
    },
    {
      id: 4,
      title: 'Opening Hours',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
        </svg>
      ),
      content: (
        <div className="text-sm text-gray-300">
          <div>Monday to Sunday</div>
          <div>11:30 h - 23:00 h</div>
        </div>
      )
    }
  ];

  return (
    <motion.div 
      className="min-h-screen content-section  text-gray-200 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderHero 
        backgroundImage={contactBanner} 
        showButtons={false}
        customTitle={
          <>
            <span className="valley-rose-text">Contact</span> <span className="text-white">Us</span>
          </>
        }
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.h1 
          className="text-3xl sm:text-4xl font-bold text-black mb-2 title-font"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact Us
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We'd Love to Hear From You
        </motion.p>
        <motion.p 
          className="text-lg text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Whether you have a question, want to book a room, plan an event, or simply learn more about what we offer, feel free to reach out. Our team is here to help and will get back to you as soon as possible.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card, index) => (
            <motion.div 
              key={card.id}
              className="bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <motion.div 
                className="text-2xl font-semibold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
              >
                {card.title}
              </motion.div>
              <motion.div 
                className="w-24 h-24 rounded-full btn-primary flex items-center justify-center mb-6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "var(--primary-hover)"
                }}
              >
                {card.icon}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
              >
                {card.content}
              </motion.div>
            </motion.div>
          ))}
        </div>

      
      </div>
    </motion.div>
  )
}

export default ContactUs
