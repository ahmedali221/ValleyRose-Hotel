import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('admins');
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    isMainAdmin: false
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    repeatPassword: ''
  });


  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load admins on component mount
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await settingsService.getAdmins();
      
      if (Array.isArray(result)) {
        // Direct array response from successful API call
        setAdmins(result);
      } else if (result.success === false) {
        // Error response from service
        setError(result.error);
        setAdmins([]);
      } else {
        // Unexpected response format
        setError('Unexpected response format');
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      setError('Failed to load admins. Please try again.');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdminForm({
      ...adminForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };


  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!adminForm.name.trim() || !adminForm.email.trim() || !adminForm.password.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await settingsService.createAdmin({
        name: adminForm.name.trim(),
        email: adminForm.email.trim(),
        password: adminForm.password,
        isMainAdmin: adminForm.isMainAdmin
      });

      if (result.success) {
        // Reload admins list
        await loadAdmins();
        
        // Clear form
        setAdminForm({ name: '', email: '', password: '', isMainAdmin: false });
        
        // Show success message (you could use a toast notification here)
        console.log('✅ Admin created successfully:', result.admin.name);
      } else {
        setError(result.error || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('Failed to create admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await settingsService.deleteAdmin(adminId);
      
      if (result.success) {
        // Reload admins list
        await loadAdmins();
        console.log('✅ Admin deleted successfully');
      } else {
        setError(result.error || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      setError('Failed to delete admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.repeatPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await settingsService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (result.success) {
        setPasswordForm({ currentPassword: '', newPassword: '', repeatPassword: '' });
        console.log('✅ Password changed successfully');
        // You could show a success message here
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const clearForm = () => {
    setError(''); // Clear any errors
    
    if (activeTab === 'admins') {
      setAdminForm({ name: '', email: '', password: '', isMainAdmin: false });
    } else if (activeTab === 'password') {
      setPasswordForm({ currentPassword: '', newPassword: '', repeatPassword: '' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('admins')}
              className={`font-medium ${activeTab === 'admins' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Admins
            </button>
            <button 
              onClick={() => setActiveTab('password')}
              className={`font-medium ${activeTab === 'password' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <>
            {/* Admins Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-purple-600 mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-900">Admins</h2>
              </div>
              
              {/* Admin List */}
              <div className="space-y-4 mb-8">
                {loading && admins.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : admins.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No admins found. Add the first admin below.
                  </div>
                ) : (
                  admins.map((admin) => (
                  <div key={admin.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">{admin.name}</h3>
                      <div className="flex items-center text-purple-600">
                        <span className="mr-2">📧</span>
                        <span>{admin.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {admin.isMainAdmin ? (
                        <span className="text-2xl">👑</span>
                      ) : (
                        <button 
                          onClick={() => handleDeleteAdmin(admin.id)}
                          disabled={loading}
                          className={`text-xl ${loading ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  ))
                )}
              </div>

              {/* Add Admin Form */}
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={adminForm.name}
                    onChange={handleAdminFormChange}
                    placeholder="Admin Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={adminForm.email}
                    onChange={handleAdminFormChange}
                    placeholder="Admin Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={adminForm.password}
                    onChange={handleAdminFormChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isMainAdmin"
                    name="isMainAdmin"
                    checked={adminForm.isMainAdmin}
                    onChange={handleAdminFormChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isMainAdmin" className="ml-2 block text-sm text-gray-700">
                    Set as Main Admin (cannot be deleted)
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={clearForm}
                    disabled={loading}
                    className={`px-8 py-3 font-medium rounded-lg ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 font-medium rounded-lg text-white ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      'Add Admin'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {activeTab === 'password' && (
          <>
            {/* Change Password Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-purple-600 mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
              </div>
              
              {/* Password Change Form */}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFormChange}
                    placeholder="Current password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                    placeholder="New Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat New Password
                  </label>
                  <input
                    type="password"
                    name="repeatPassword"
                    value={passwordForm.repeatPassword}
                    onChange={handlePasswordFormChange}
                    placeholder="Repeat New Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 font-medium rounded-lg text-white ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <p className="text-center text-sm text-gray-500">
          © 2022-2025 by ValleyRose.com, Inc.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
