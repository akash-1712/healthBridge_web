// src/components/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Card from './ui/Card';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-[88vh] bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-6">
          <div className="text-7xl lg:text-8xl font-bold text-primary-200 dark:text-primary-900 mb-2">404</div>
          <div className="text-4xl mb-4" aria-hidden="true">🏥</div>
        </div>

        {/* Error Message */}
        <Card variant="elevated" padding="lg" className="mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3">
            Page Not Found
          </h1>
          <p className="text-base lg:text-lg text-text-secondary mb-5">
            Oops! The page you're looking for seems to have gone for a check-up.
            Let's get you back to safety.
          </p>

          <Button onClick={() => navigate(-1)} fullWidth size="lg">
            ← Go Back
          </Button>
        </Card>

        {/* Help Text */}
        <p className="text-sm text-text-muted">
          Need immediate medical assistance?
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-medium ml-1 underline"
          >
            Start consultation
          </button>
        </p>
      </div>
    </div>
  );
}
