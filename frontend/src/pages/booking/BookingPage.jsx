import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import RoomDetails from './components/RoomDetails';
import PersonalInfo from './components/PersonalInfo';
import Confirmation from './components/Confirmation';
import Payment from './components/Payment';
import FinalReview from './components/FinalReview';
import HeaderHero from '../../components/HeaderHero';
import bookingBanner from '../../assets/banners/booking.jpg';
import { useTranslation } from '../../locales';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRoomTypePreSelected, setIsRoomTypePreSelected] = useState(false);
  const [bookingData, setBookingData] = useState({
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    numberOfGuests: '',
    cost: 0,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    paymentResult: null,
    reservationId: null,
    reservationNumber: ''
  });
  const { t } = useTranslation();

  useEffect(() => {
    // Check if room type is pre-selected from URL
    const roomTypeFromUrl = searchParams.get('roomType');
    if (roomTypeFromUrl) {
      setBookingData(prev => ({ ...prev, roomType: roomTypeFromUrl }));
      setIsRoomTypePreSelected(true);
    }
  }, [searchParams]);

  const steps = [
    { id: 1, name: t('booking.steps.roomDetails'), component: RoomDetails },
    { id: 2, name: t('booking.steps.personalInfo'), component: PersonalInfo },
    { id: 3, name: t('booking.steps.confirmation'), component: Confirmation },
    { id: 4, name: t('booking.steps.payment'), component: Payment },
    { id: 5, name: t('booking.steps.finalReview'), component: FinalReview }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderHero 
        backgroundImage={bookingBanner} 
        showButtons={false}
        customTitle={
          <>
            <span className="text-white">{t('hero.bookYourStay')}</span>
          </>
        }
        customSubtitle={t('hero.atValleyRose')}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-15">
            
            {/* Left Column - Information */}
            <div className="lg:col-span-1 space-y-8">
              {/* Online Room Reservations */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl sm:text-3xl title-font text-gray-800 mb-4">
                  {t('booking.onlineReservations')}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t('booking.onlineDescription')}
                </p>
              </motion.div>

              {/* Special Reservations */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl title-font text-gray-800 mb-4">
                  {t('booking.specialReservations')}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t('booking.specialDescription')}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 valley-rose-text" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-gray-700">+43 1 20 43 969</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 valley-rose-text" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-700">support.valley@gmail.com</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-gray-100 rounded-lg p-8"
              >
                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                              currentStep > step.id
                                ? 'bg-green-500 text-white'
                                : currentStep === step.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                            style={{
                              backgroundColor: currentStep > step.id 
                                ? '#2ABF00' 
                                : currentStep === step.id 
                                ? '#9962B9' 
                                : '#E5E7EB'
                            }}
                          >
                            {currentStep > step.id ? (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="text-lg font-semibold">{step.id}</span>
                            )}
                          </div>
                          <span className="text-sm mt-3 text-gray-700 font-medium">{step.name}</span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-6 transition-colors duration-300 ${
                              currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                            style={{
                              backgroundColor: currentStep > step.id ? '#10B981' : '#D1D5DB'
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <CurrentComponent
                    key={currentStep}
                    onNext={nextStep}
                    onBack={prevStep}
                    bookingData={bookingData}
                    setBookingData={setBookingData}
                    isRoomTypePreSelected={isRoomTypePreSelected}
                  />
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
