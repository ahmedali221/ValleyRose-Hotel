import React, { useState, useEffect } from 'react';
import appSettingsService from '../../services/appSettingsService';

const PaymentSettingsPage = () => {
  const [feeType, setFeeType] = useState('fixed');
  const [feeAmount, setFeeAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await appSettingsService.getSettings();
      if (data?.checkin_fee_type) setFeeType(data.checkin_fee_type);
      if (data?.checkin_fee_amount) setFeeAmount(data.checkin_fee_amount);
    } catch (err) {
      setError('Failed to load payment settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!feeAmount || isNaN(parseFloat(feeAmount)) || parseFloat(feeAmount) < 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (feeType === 'percentage' && parseFloat(feeAmount) > 100) {
      setError('Percentage cannot exceed 100.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');
      await appSettingsService.updateSetting('checkin_fee_type', feeType);
      await appSettingsService.updateSetting('checkin_fee_amount', String(feeAmount));
      setSuccessMsg('Payment settings saved successfully.');
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const previewAmount = () => {
    const amount = parseFloat(feeAmount);
    if (isNaN(amount) || amount < 0) return '—';
    if (feeType === 'percentage') {
      return `€${Math.round(500 * amount) / 100}`;
    }
    return `€${amount}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="content-section-heavy border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold valley-rose-text title-font">Payment Settings</h1>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-2xl">

        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Check-in Fee Configuration</h2>
              <p className="text-sm text-gray-500">
                This fee is shown to guests as an alternative to paying the full amount upfront. They can pay the
                check-in fee now and settle the remaining balance at check-in.
              </p>
            </div>

            {/* Fee Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fee Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feeType"
                    value="fixed"
                    checked={feeType === 'fixed'}
                    onChange={() => setFeeType('fixed')}
                    className="accent-purple-600"
                  />
                  <span className="text-sm text-gray-700">Fixed Amount (EUR)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feeType"
                    value="percentage"
                    checked={feeType === 'percentage'}
                    onChange={() => setFeeType('percentage')}
                    className="accent-purple-600"
                  />
                  <span className="text-sm text-gray-700">Percentage of Total (%)</span>
                </label>
              </div>
            </div>

            {/* Fee Amount */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {feeType === 'fixed' ? 'Amount (EUR)' : 'Percentage (0–100)'}
              </label>
              <div className="relative max-w-xs">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
                  {feeType === 'fixed' ? '€' : '%'}
                </span>
                <input
                  type="number"
                  min="0"
                  max={feeType === 'percentage' ? 100 : undefined}
                  step="0.01"
                  value={feeAmount}
                  onChange={(e) => {
                    setFeeAmount(e.target.value);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder={feeType === 'fixed' ? '50' : '20'}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">
              <span className="font-medium">Preview:</span> For a €500 booking, the check-in fee would be{' '}
              <span className="font-semibold valley-rose-text">{previewAmount()}</span>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#9962B9' }}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSettingsPage;
