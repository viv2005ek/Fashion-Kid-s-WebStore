import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Profile } from '../types/product';
import { X, Search, User, Mail,Star ,Phone, Calendar, Cake, Filter } from 'lucide-react';

interface AdminUsersProps {
  users: Profile[];
  isFetchingData: boolean;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, isFetchingData }) => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (selectedUser) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [selectedUser]);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedUser) {
        setSelectedUser(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (selectedUser && target.classList.contains('modal-overlay')) {
        setSelectedUser(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedUser]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = user.name?.toLowerCase().includes(searchLower);
      const emailMatch = user.email.toLowerCase().includes(searchLower);
   const phoneMatch = user.phone?.toString().includes(searchTerm);       
      return nameMatch || emailMatch || phoneMatch;
    });
  }, [users, searchTerm]);

  const getUserInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const getRandomGradient = (id: string) => {
    const gradients = [
      'from-pink-400 to-rose-400',
      'from-purple-400 to-indigo-400',
      'from-blue-400 to-cyan-400',
      'from-green-400 to-emerald-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400',
    ];
    const index = id.charCodeAt(0) % gradients.length;
    return gradients[index];
  };
if (isFetchingData) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl"
        >
          <motion.span
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-2xl text-white"
          >
            ✨
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-600 font-poppins mb-4 text-lg"
        >
          Onboarding Users...
        </motion.p>

        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: index * 0.2 
              }}
              className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cute-charcoal font-baloo">
          Users ({filteredUsers.length})
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-4 py-2 rounded-xl transition-all duration-200 font-poppins"
        >
          <Filter className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Search Section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent font-poppins"
            />
          </div>
        </motion.div>
      )}

      {/* Users List with Fixed Height and Scroll */}
      <div 
        className="space-y-4 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 250px)' }}
      >
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-pink-200">
              <User className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <p className="text-cute-charcoal opacity-70 font-poppins">
                {users.length === 0 ? 'No users found' : 'No users match your search'}
              </p>
            </div>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.98 }}
              className="border border-pink-100 rounded-2xl p-4 hover:shadow-md transition cursor-pointer bg-white group"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className={`bg-gradient-to-r ${getRandomGradient(user.id)} w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {getUserInitials(user.name)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-cute-charcoal font-poppins truncate">
                      {user.name || 'Anonymous User'}
                    </p>
                    {user.gender && (
                      <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-medium">
                        {user.gender}
                      </span>
                    )}
                  </div>
                  <p className="text-cute-charcoal opacity-70 text-sm font-poppins truncate">
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-cute-charcoal opacity-70 text-sm font-poppins">
                      📱 {user.phone}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-cute-charcoal opacity-70 text-sm font-poppins">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-cute-charcoal/50 font-poppins mt-1">
                    Joined
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Enhanced User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border-2 border-pink-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`bg-gradient-to-r from-white/20 to-white/10 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/20`}>
                    {getUserInitials(selectedUser.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-baloo">
                      {selectedUser.name || 'Anonymous User'}
                    </h3>
                    <p className="text-pink-100 text-sm font-poppins">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedUser(null)}
                  className="text-white hover:text-pink-200 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
            </div>

            {/* Content with Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
                  <h4 className="text-lg font-semibold text-cute-charcoal mb-4 font-baloo flex items-center">
                    <User className="h-5 w-5 mr-2 text-pink-500" />
                    Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-pink-400" />
                        <span className="text-sm font-medium text-cute-charcoal/60">Name</span>
                      </div>
                      <span className="font-medium text-cute-charcoal">{selectedUser.name || 'Not provided'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-pink-400" />
                        <span className="text-sm font-medium text-cute-charcoal/60">Email</span>
                      </div>
                      <span className="font-medium text-cute-charcoal">{selectedUser.email}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-pink-400" />
                        <span className="text-sm font-medium text-cute-charcoal/60">Phone</span>
                      </div>
                      <span className="font-medium text-cute-charcoal">{selectedUser.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white rounded-2xl p-6 border-2 border-pink-200">
                  <h4 className="text-lg font-semibold text-cute-charcoal mb-4 font-baloo flex items-center">
                    <Star className="h-5 w-5 mr-2 text-purple-500" />
                    Additional Details
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Star className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-cute-charcoal/60">Gender</span>
                      </div>
                      <span className="font-medium text-cute-charcoal capitalize">{selectedUser.gender || 'Not specified'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Cake className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-cute-charcoal/60">Age</span>
                      </div>
                      <span className="font-medium text-cute-charcoal">{selectedUser.age || 'Not specified'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-cute-charcoal/60">Joined Date</span>
                      </div>
                      <span className="font-medium text-cute-charcoal">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                  <h4 className="text-lg font-semibold mb-4 font-baloo flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Member Since
                  </h4>
                  <div className="text-center">
                    <p className="text-2xl font-bold font-baloo">
                      {new Date(selectedUser.created_at).getFullYear()}
                    </p>
                    <p className="text-pink-100 text-sm font-poppins">
                      {Math.floor((new Date().getTime() - new Date(selectedUser.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Custom Scrollbar Styles */}
          <style >{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #fdf2f8;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #ec4899, #8b5cf6);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #db2777, #7c3aed);
            }
          `}</style>
        </div>
      )}
    </div>
  );
};