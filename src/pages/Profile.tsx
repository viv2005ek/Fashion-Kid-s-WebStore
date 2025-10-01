/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Package, Heart, ShoppingCart, LogOut, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile as ProfileType, Address } from '../types/product';
import { Loading } from './Loading';

export const Profile: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserData();
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    try {
      setLoadingProfile(true);
      
      // Fetch profile - use array result instead of single
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id);

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      if (profileData && profileData.length > 0) {
        setProfile(profileData[0]);
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile = {
          id: user.id,
          name: '',
          age: null,
          gender: '',
          email: user.email || '',
          phone: '',
          created_at: new Date().toISOString()
        };
        setProfile(initialProfile);
      }

      // Fetch addresses
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user!.id);

      if (addressError) {
        console.error('Error fetching addresses:', addressError);
      }

      if (addressData) {
        setAddresses(addressData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleProfileUpdate = (field: string, value: string | number | null) => {
    setProfile(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const handleAddressFormChange = (field: string, value: string) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const saveProfileChanges = async () => {
    if (!user || !profile) return;

    try {
      setIsSaving(true);

      // Prepare profile data without updated_at
      const profileData = {
        id: user.id,
        name: profile.name || null,
        age: profile.age || null,
        gender: profile.gender || null,
        email: user.email,
        phone: profile.phone || null
        // removed updated_at since it doesn't exist in the table
      };

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id)
          .select();
      } else {
        // Insert new profile
        result = await supabase
          .from('profiles')
          .insert([{ ...profileData, created_at: new Date().toISOString() }])
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setSaveMessage('Profile updated successfully!');
      
      // Refresh profile data
      fetchUserData();
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // More specific error messages
      if (error.code === '23505') {
        setSaveMessage('Profile already exists. Please refresh the page.');
      } else if (error.code === '42501') {
        setSaveMessage('Permission denied. Please check your database permissions.');
      } else {
        setSaveMessage('Error updating profile. Please try again.');
      }
      
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const saveAddress = async () => {
    if (!user) return;

    // Basic validation
    if (!addressForm.address_line_1.trim() || !addressForm.city.trim() || 
        !addressForm.state.trim() || !addressForm.postal_code.trim()) {
      setSaveMessage('Please fill in all required address fields');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    try {
      setIsSaving(true);

      // Delete existing addresses (only allow one address)
      if (addresses.length > 0) {
        const { error: deleteError } = await supabase
          .from('addresses')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
      }

      // Add new address
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          address_line_1: addressForm.address_line_1,
          address_line_2: addressForm.address_line_2,
          city: addressForm.city,
          state: addressForm.state,
          postal_code: addressForm.postal_code,
          country: addressForm.country,
          is_default: true
        })
        .select();

      if (error) throw error;

      setSaveMessage('Address saved successfully!');
      setShowAddressForm(false);
      setAddressForm({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
      });
      
      // Refresh addresses
      const { data: newAddressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id);
        
      if (newAddressData) {
        setAddresses(newAddressData);
      }
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving address:', error);
      setSaveMessage(`Error saving address: ${error.message}`);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      setSaveMessage('Address deleted successfully!');
      
      // Update local state
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error deleting address:', error);
      setSaveMessage(`Error deleting address: ${error.message}`);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-300 to-purple-300 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-12 w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-400 rounded opacity-90 animate-float"></div>
          <div className="absolute top-20 right-16 w-6 h-6 bg-pink-300 rounded-full opacity-80 animate-bounce-slow"></div>
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-purple-300 rounded opacity-70 animate-float-reverse"></div>
          <div className="absolute bottom-16 left-1/4 w-6 h-2 bg-pink-400 rounded opacity-60 animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-1/3 w-4 h-4 bg-yellow-400 rounded-full opacity-80 animate-float"></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-purple-400 rounded opacity-70 animate-float"></div>
          <div className="absolute top-2/5 left-1/2 w-2 h-2 bg-pink-500 rounded-full opacity-60 animate-bounce-slow"></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-8 bg-purple-300 rounded opacity-70 animate-float-reverse"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shine"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-5xl md:text-7xl font-bold font-baloo mb-4 drop-shadow-lg"
          >
            My Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl font-poppins drop-shadow-md"
          >
            💕 Manage your dreamy account
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-cute-charcoal font-baloo">{profile?.name || user?.email}</h3>
                <p className="text-cute-charcoal opacity-70 text-sm font-poppins">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-poppins ${
                    activeTab === 'personal'
                      ? 'bg-gradient-to-r from-pink-200 to-purple-200 text-cute-charcoal font-medium'
                      : 'text-cute-charcoal hover:bg-pink-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Personal Info</span>
                </button>

                <button
                  onClick={() => handleNavigation('/wishlist')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-cute-charcoal hover:bg-pink-50 transition-all duration-300 font-poppins"
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </button>

                <button
                  onClick={() => handleNavigation('/cart')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-cute-charcoal hover:bg-pink-50 transition-all duration-300 font-poppins"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Shopping Cart</span>
                </button>

                <button
                  onClick={() => handleNavigation('/profile/orders')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-cute-charcoal hover:bg-pink-50 transition-all duration-300 font-poppins"
                >
                  <Package className="h-5 w-5" />
                  <span>Order History</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 font-poppins"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-pink-100">
              {activeTab === 'personal' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-cute-charcoal font-baloo">Personal Information</h2>
                    {saveMessage && (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm font-poppins px-4 py-2 rounded-full ${
                          saveMessage.includes('Error') 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {saveMessage}
                      </motion.span>
                    )}
                  </div>

                  {/* Personal Information Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile?.name || ''}
                        onChange={(e) => handleProfileUpdate('name', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile?.phone || ''}
                        onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                        Age
                      </label>
                      <input
                        type="number"
                        value={profile?.age || ''}
                        onChange={(e) => handleProfileUpdate('age', e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                        placeholder="Your age"
                        min="1"
                        max="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                        Gender
                      </label>
                      <select 
                        value={profile?.gender || ''}
                        onChange={(e) => handleProfileUpdate('gender', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                      >
                        <option value="">Select gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gray-50 font-poppins cursor-not-allowed"
                      />
                      <p className="text-xs text-cute-charcoal opacity-50 mt-1 font-poppins">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  {/* Addresses Section */}
                  <div className="border-t border-pink-100 pt-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-cute-charcoal font-baloo flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        My Address
                      </h3>
                      {addresses.length === 0 && !showAddressForm && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowAddressForm(true)}
                          className="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold py-2 px-4 rounded-xl font-poppins flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Address
                        </motion.button>
                      )}
                    </div>
                    
                    {showAddressForm ? (
                      <div className="bg-pink-50 rounded-2xl p-6 border-2 border-pink-200">
                        <h4 className="font-semibold text-cute-charcoal mb-4 font-poppins">Add New Address</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                              Address Line 1 *
                            </label>
                            <input
                              type="text"
                              value={addressForm.address_line_1}
                              onChange={(e) => handleAddressFormChange('address_line_1', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                              placeholder="House No., Street, Area"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                              Address Line 2
                            </label>
                            <input
                              type="text"
                              value={addressForm.address_line_2}
                              onChange={(e) => handleAddressFormChange('address_line_2', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                              placeholder="Landmark, Building Name (optional)"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                              City *
                            </label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) => handleAddressFormChange('city', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                              State *
                            </label>
                            <input
                              type="text"
                              value={addressForm.state}
                              onChange={(e) => handleAddressFormChange('state', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                              placeholder="State"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              value={addressForm.postal_code}
                              onChange={(e) => handleAddressFormChange('postal_code', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                              placeholder="PIN Code"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                              Country *
                            </label>
                            <input
                              type="text"
                              value={addressForm.country}
                              onChange={(e) => handleAddressFormChange('country', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                              placeholder="Country"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveAddress}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 px-6 rounded-xl font-poppins flex items-center gap-2 disabled:opacity-50"
                          >
                            <Save className="h-4 w-4" />
                            {isSaving ? 'Saving...' : 'Save Address'}
                          </motion.button>
                          <button
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 text-cute-charcoal opacity-70 hover:opacity-100 font-poppins"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-8 bg-pink-50 rounded-2xl border-2 border-dashed border-pink-200">
                        <MapPin className="h-12 w-12 text-pink-300 mx-auto mb-3" />
                        <p className="text-cute-charcoal opacity-70 font-poppins mb-4">No address added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="border-2 border-pink-100 rounded-2xl p-4 hover:border-pink-200 transition-all duration-300 relative">
                            <button
                              onClick={() => deleteAddress(address.id)}
                              className="absolute top-4 right-4 p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-cute-charcoal font-poppins">
                                {address.is_default && (
                                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full mr-2">
                                    Default
                                  </span>
                                )}
                                {address.address_line_1}
                              </h4>
                            </div>
                            {address.address_line_2 && (
                              <p className="text-cute-charcoal opacity-70 text-sm font-poppins mb-2">
                                {address.address_line_2}
                              </p>
                            )}
                            <p className="text-cute-charcoal opacity-70 text-sm font-poppins">
                              {address.city}, {address.state} - {address.postal_code}
                            </p>
                            <p className="text-cute-charcoal opacity-70 text-sm font-poppins">
                              {address.country}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveProfileChanges}
                    disabled={isSaving}
                    className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-5 w-5" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};