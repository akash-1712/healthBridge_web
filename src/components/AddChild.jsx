import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageLayout from './ui/PageLayout';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { buildApiUrl } from '../util/api';

export default function AddChild() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const userId = location.state?.userId || user?.id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    parent: userId,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, age, weight, height, gender } = formData;

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!age || isNaN(age) || age <= 0 || age > 18) newErrors.age = 'Please enter a valid age (1-18)';
    if (!weight || isNaN(weight) || weight <= 0) newErrors.weight = 'Please enter a valid weight';
    if (!height || isNaN(height) || height <= 0) newErrors.height = 'Please enter a valid height';
    if (!gender) newErrors.gender = 'Please select a gender';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        buildApiUrl('addChild'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
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
    <PageLayout>
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/select-child')}>
            ← Back to Select Child
          </Button>
          <div className="text-center mt-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-4">
              <span className="text-3xl">👶</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary">Add a Child</h1>
            <p className="text-text-secondary mt-2">Enter your child's information</p>
          </div>
        </div>

        {/* Form */}
        <Card variant="elevated" padding="xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Child's Name"
              type="text"
              name="name"
              placeholder="Enter child's name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
              autoComplete="name"
              leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Age (years)"
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                error={errors.age}
                required
                min="1"
                max="18"
                leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />

              <Input
                label="Weight (kg)"
                type="number"
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleInputChange}
                error={errors.weight}
                required
                step="0.1"
                min="0"
                leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Height (cm)"
                type="number"
                name="height"
                placeholder="Height"
                value={formData.height}
                onChange={handleInputChange}
                error={errors.height}
                required
                min="1"
                leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>}
              />

              <div className="flex items-end">
                <label className="block w-full text-sm font-medium text-text-secondary mb-2">
                  Gender <span className="text-danger-500">*</span>
                </label>
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Gender <span className="text-danger-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Gender">
                {[
                  { value: 'male', label: 'Boy', icon: '👦', color: 'primary' },
                  { value: 'female', label: 'Girl', icon: '👧', color: 'warning' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={formData.gender === option.value}
                    onClick={() => handleGenderChange(option.value)}
                    className={`
                      flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${formData.gender === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700 dark:border-${option.color}-400 dark:bg-${option.color}-900/30 dark:text-${option.color}-300 shadow-md`
                        : 'border-border-primary hover:border-primary-300 dark:hover:border-primary-600'
                      }
                    `}
                  >
                    <span className="text-2xl" aria-hidden="true">{option.icon}</span>
                    <span className="font-medium capitalize">{option.label}</span>
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-2 text-sm text-danger-500" role="alert">{errors.gender}</p>
              )}
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Add Child
            </Button>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
