// src/components/AddChild.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const env = import.meta.env.VITE_NODE_ENV;

export default function AddChild() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  // Get userId from navigation state or use current user
  const userId = location.state?.userId || user?.id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    parent: userId
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender: gender
    }));
  };

  const validateForm = () => {
    const { name, age, weight, height, gender } = formData;

    if (!name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!age || isNaN(age) || age <= 0) {
      toast.error('Please enter a valid age');
      return false;
    }
    if (!weight || isNaN(weight) || weight <= 0) {
      toast.error('Please enter a valid weight');
      return false;
    }
    if (!height || isNaN(height) || height <= 0) {
      toast.error('Please enter a valid height');
      return false;
    }
    if (!gender) {
      toast.error('Please select a gender');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${env === "dev" ? '/api' : '/backend'}/addChild`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok || data.errors) {
        toast.error('Something went wrong. Please try again.');
      } else {
        toast.success('Child has been added successfully!');
        navigate('/select-child');
      }
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    navigate('/login');
    return null;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=2000&q=80&opacity=0.1')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Form Container */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👶</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Add a Child</h1>
              <p className="text-gray-600 mt-2">Enter your child's information</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Child's Name <span className='text-red-700 '>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter child's name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Age Field */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Age (years) <span className='text-red-700 '>*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  min="1"
                  max="18"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Weight and Height Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Weight (kg) <span className='text-red-700 '>*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Weight"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Height (cm) <span className='text-red-700 '>*</span>
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Height"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-500 mb-3">
                  Gender <span className='text-red-700 '>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => handleGenderChange('male')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${formData.gender === 'male'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <span className="text-sm md:text-md capitalize">Male</span>
                    </div>
                  </div>

                  <div
                    onClick={() => handleGenderChange('female')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${formData.gender === 'female'
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <span className="text-sm md:text-md capitalize">Female</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding Child...</span>
                  </div>
                ) : (
                  'Add Child'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
