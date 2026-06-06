import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from '../../../locales';
import bookingService from '../../../services/bookingService';

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

function computeCheckinFee(totalCost, settings) {
  if (!settings) return 0;
  if (settings.type === 'percentage') {
    return Math.round(totalCost * settings.amount) / 100;
  }
  return settings.amount;
}

// ─── Inner Stripe card form ────────────────────────────────────────────────────

function StripeCardForm({ onSuccess, onError, onBack, amountLabel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent);
    } else {
      onError('Payment was not completed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {t('common.back')}
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-3 px-6 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#9962B9' }}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('payment.processing')}
            </span>
          ) : (
            `${t('payment.payNow')} ${amountLabel}`
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Main Payment component ────────────────────────────────────────────────────

const Payment = ({ onNext, onBack, bookingData, setBookingData }) => {
  const { t } = useTranslation();

  const [feeSettings, setFeeSettings] = useState({ type: 'fixed', amount: 50 });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    bookingService.getAppSettings()
      .then((data) => {
        if (data?.checkin_fee_type && data?.checkin_fee_amount) {
          setFeeSettings({
            type: data.checkin_fee_type,
            amount: parseFloat(data.checkin_fee_amount),
          });
        }
      })
      .catch(() => {
        // keep default fee settings on error
      })
      .finally(() => setLoadingSettings(false));
  }, []);

  const checkinFeeAmount = computeCheckinFee(bookingData.cost, feeSettings);

  const handlePaymentTypeSelect = async (type) => {
    if (creatingIntent || selectedType === type) return;

    // Cancel any previous intent before creating a new one (fire-and-forget — non-blocking)
    if (bookingData.paymentIntentId) {
      bookingService.cancelPaymentIntent(bookingData.paymentIntentId);
    }

    setSelectedType(type);
    setClientSecret(null);
    setPaymentError(null);
    setCreatingIntent(true);

    const euroAmount = type === 'full' ? bookingData.cost : checkinFeeAmount;
    const centsAmount = Math.round(euroAmount * 100);

    try {
      const result = await bookingService.createPaymentIntent({
        amount: centsAmount,
        currency: 'eur',
        paymentType: type,
        // Stable idempotency key: booking session + type so retries don't duplicate intents
        idempotencyKey: `${bookingData.checkInDate}-${bookingData.roomId}-${type}`,
        metadata: {
          roomType: bookingData.roomType,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          guestEmail: bookingData.email,
          guestName: `${bookingData.firstName} ${bookingData.lastName}`,
        },
      });

      setClientSecret(result.clientSecret);
      setBookingData((prev) => ({
        ...prev,
        paymentIntentId: result.paymentIntentId,
        paymentClientSecret: result.clientSecret,
        paymentType: type,
        amountCharged: euroAmount,
      }));
    } catch (err) {
      setPaymentError(err.message || 'Failed to initialize payment. Please try again.');
      setSelectedType(null);
    } finally {
      setCreatingIntent(false);
    }
  };

  const handleSuccess = (paymentIntent) => {
    setBookingData((prev) => ({ ...prev, paymentResult: paymentIntent }));
    onNext();
  };

  const handleBack = () => {
    setSelectedType(null);
    setClientSecret(null);
    setPaymentError(null);
    onBack();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const nights = bookingData.checkInDate && bookingData.checkOutDate
    ? Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const stripeAppearance = {
    theme: 'stripe',
    variables: { colorPrimary: '#9962B9' },
  };

  if (!stripePromise) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-6 text-center text-sm">
        Online payment is temporarily unavailable. Please contact us directly to complete your booking.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 title-font mb-1">
          {t('payment.title')}
        </h3>
        <p className="text-sm text-gray-500">{t('payment.subtitle')}</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{t('payment.room')}</span>
          <span className="font-medium text-gray-800">{bookingData.roomType}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t('payment.checkIn')}</span>
          <span className="font-medium text-gray-800">{formatDate(bookingData.checkInDate)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t('payment.checkOut')}</span>
          <span className="font-medium text-gray-800">{formatDate(bookingData.checkOutDate)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t('payment.nights')}</span>
          <span className="font-medium text-gray-800">{nights}</span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-gray-800">
          <span>{t('payment.totalCost')}</span>
          <span className="valley-rose-text">€{bookingData.cost}</span>
        </div>
      </div>

      {/* Payment Type Selection */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">{t('payment.choosePaymentOption')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Pay Full Amount */}
          <button
            type="button"
            onClick={() => handlePaymentTypeSelect('full')}
            disabled={creatingIntent}
            className={`relative p-4 rounded-lg border-2 text-left transition-all ${
              selectedType === 'full'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {selectedType === 'full' && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            <p className="font-semibold text-gray-800 text-sm">{t('payment.payFull')}</p>
            <p className="text-xl font-bold valley-rose-text mt-1">€{bookingData.cost}</p>
            <p className="text-xs text-gray-500 mt-1">{t('payment.payFullDesc')}</p>
          </button>

          {/* Pay Check-in Fee */}
          <button
            type="button"
            onClick={() => handlePaymentTypeSelect('checkin_fee')}
            disabled={creatingIntent}
            className={`relative p-4 rounded-lg border-2 text-left transition-all ${
              selectedType === 'checkin_fee'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {selectedType === 'checkin_fee' && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {loadingSettings ? (
              <div className="h-12 flex items-center">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="font-semibold text-gray-800 text-sm">{t('payment.payCheckinFee')}</p>
                <p className="text-xl font-bold valley-rose-text mt-1">€{checkinFeeAmount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('payment.payCheckinFeeDesc', { remaining: `€${Math.round((bookingData.cost - checkinFeeAmount) * 100) / 100}` })}
                </p>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading spinner while creating intent */}
      {creatingIntent && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-2">
          <svg className="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t('payment.preparingPayment')}
        </div>
      )}

      {/* Error message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {paymentError}
        </div>
      )}

      {/* Stripe Elements form */}
      {clientSecret && !creatingIntent && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: stripeAppearance }}
          >
            <StripeCardForm
              onSuccess={handleSuccess}
              onError={(msg) => setPaymentError(msg)}
              onBack={handleBack}
              amountLabel={`€${bookingData.amountCharged}`}
            />
          </Elements>
        </div>
      )}

      {/* Back button — only before type is selected */}
      {!clientSecret && !creatingIntent && (
        <button
          type="button"
          onClick={handleBack}
          className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          {t('common.back')}
        </button>
      )}

      {/* Secure payment notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        {t('payment.securePayment')}
      </div>
    </motion.div>
  );
};

export default Payment;
