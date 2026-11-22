import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import AuthLayout from './ui/AuthLayout';
import Input from './ui/Input';
import Button from './ui/Button';
import logoImg from '../assets/images/icon.png';
import { buildApiUrl } from '../util/api';

export default function Signup() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [serverCode, setServerCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [errors, setErrors] = useState({});
  const codeInputRef = useRef(null);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    if (step === 2 && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [step]);

  const handleChange = (e) => {
    const val = e.target.value.trim();
    setForm({ ...form, [e.target.name]: val });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!userCode.trim()) {
      setErrors({ userCode: 'Please enter the verification code' });
      return false;
    }
    if (userCode.trim() !== serverCode.trim()) {
      setErrors({ userCode: 'Invalid verification code' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep1()) return;

    setLoading(true);

    try {
      const res = await fetch(buildApiUrl('verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Verification step failed');

      const data = await res.json();
      setServerCode(String(data.udata?.[0]?.VerificationCode || data.VerificationCode || ''));
      toast.success('Verification email sent! Please check your inbox.');
      setStep(2);
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateStep2()) return;

    setLoading(true);

    try {
      const res = await fetch(buildApiUrl('signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Final signup failed');

      const resData = await res.json();

      toast.success('Signup successful! Redirecting...');
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
      setUserCode('');
      localStorage.setItem('authToken', resData.authToken);
      localStorage.setItem('streamtoken', resData.token);
      localStorage.setItem('user', JSON.stringify(resData.user));
      login(resData.user, resData.authToken, resData.token);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setUserCode('');
    setErrors({});
  };

  return (
    <AuthLayout
      title={step === 1 ? 'Create an Account' : 'Verify Your Email'}
      subtitle={step === 1 ? 'Start your HealthBridge journey' : 'Enter the code sent to your email'}
      illustration={step === 1 ? '📝' : '📧'}
      logo={logoImg}
      logoAlt="HealthBridge"
    >
      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
            autoComplete="name"
            leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
            leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="new-password"
            leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            helperText="At least 8 characters"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign Up
          </Button>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log In
            </Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <Input
            label="Verification Code"
            type="text"
            name="userCode"
            placeholder="123456"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value.trim())}
            error={errors.userCode}
            required
            autoComplete="one-time-code"
            ref={codeInputRef}
            leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          />

          <div className="flex gap-3">
            <Button variant="primary" fullWidth loading={loading} size="lg" onClick={handleVerifyCode}>
              Confirm
            </Button>
            <Button variant="outline" fullWidth size="lg" onClick={handleBack} disabled={loading}>
              Back
            </Button>
          </div>

          <p className="text-center text-sm text-text-secondary">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Resend
            </button>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
