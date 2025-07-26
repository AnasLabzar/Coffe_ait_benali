"use client";

import { useState, useEffect, useRef } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const SignInLayer = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const pinInputRef = useRef(null);

  useEffect(() => {
    pinInputRef.current?.focus();
  }, []);

  const handleDigitClick = (digit) => {
    if (pin.length < 4) {
      setPin(pin + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call your backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pin })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('employeeData', JSON.stringify(data.employee));
        
        setSuccess(true);
        setTimeout(() => {
          // Redirect to dashboard
          console.log("Redirecting to dashboard...");
        }, 1500);
      } else {
        setError(data.msg || 'Invalid PIN. Please try again.');
        setPin('');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='auth bg-base d-flex flex-wrap min-h-screen'>
      {/* Left side - remains unchanged */}
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/auth-img.png' alt='Cafe interior' />
        </div>
      </div>
      
      {/* Right side - PIN login form */}
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div className="text-center mb-12">
            <Link href='/' className='inline-block mb-8'>
              <img 
                src='assets/images/logo.png' 
                alt='Cafe Logo'
                className="max-w-[200px] mx-auto"
              />
            </Link>
            <h4 className='mb-4 text-2xl font-bold'>Employee Login</h4>
            <p className='text-secondary-light text-lg'>
              Enter your 4-digit PIN to access the system
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* PIN display */}
            <div className="mb-10 flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index}
                  className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-bold ${
                    pin.length > index 
                      ? 'border-primary-600 bg-primary-50 shadow-inner' 
                      : 'border-neutral-300'
                  }`}
                >
                  {pin.length > index ? '•' : ''}
                </div>
              ))}
            </div>
            
            {/* Hidden input for actual PIN capture */}
            <input
              type="password"
              ref={pinInputRef}
              className="sr-only"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPin(value);
                setError('');
              }}
              autoFocus
            />
            
            {/* PIN status */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-neutral-500">
                {pin.length}/4 digits
              </span>
              {pin.length > 0 && (
                <button 
                  type="button"
                  onClick={handleClear}
                  className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
                >
                  <Icon icon="mdi:close" className="text-base" />
                  Clear
                </button>
              )}
            </div>
            
            {/* Touch-friendly keypad */}
            <div className="virtual-keypad mb-8">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    className="keypad-btn h-20 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-2xl font-bold hover:bg-neutral-50 active:bg-primary-50 transition-colors"
                    onClick={() => handleDigitClick(digit)}
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  className="keypad-btn h-20 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-2xl hover:bg-neutral-50"
                  onClick={handleClear}
                >
                  <Icon icon="mdi:close" className="text-2xl text-neutral-500" />
                </button>
                <button
                  type="button"
                  className="keypad-btn h-20 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-2xl font-bold hover:bg-neutral-50"
                  onClick={() => handleDigitClick(0)}
                >
                  0
                </button>
                <button
                  type="button"
                  className="keypad-btn h-20 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-2xl hover:bg-neutral-50"
                  onClick={handleBackspace}
                >
                  <Icon icon="mdi:backspace" className="text-2xl text-neutral-500" />
                </button>
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || success || pin.length !== 4}
              className={`w-full py-5 rounded-xl text-lg font-bold transition-all ${
                isLoading || success 
                  ? 'bg-primary-300 cursor-not-allowed' 
                  : pin.length === 4 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg' 
                    : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Icon icon="svg-spinners:3-dots-fade" className="text-2xl" />
                  <span>Authenticating...</span>
                </div>
              ) : success ? (
                <div className="flex items-center justify-center gap-2">
                  <Icon icon="mdi:success-circle" className="text-2xl" />
                  <span>Success!</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
            
            {/* Status messages */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <Icon icon="material-symbols:error-outline" className="text-2xl" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mt-6 p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
                <Icon icon="mdi:success-circle" className="text-2xl" />
                <span className="font-medium">Login successful! Redirecting...</span>
              </div>
            )}
            
            <div className="mt-10 text-center text-sm text-neutral-600">
              <p className="mb-1">
                For security, your PIN should be kept confidential
              </p>
              <p>
                Having trouble? Contact <span className="text-primary-600 font-medium">Manager</span>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <style jsx global>{`
        .auth {
          font-family: 'Inter', sans-serif;
        }
        .keypad-btn {
          transition: transform 0.1s ease;
        }
        .keypad-btn:active {
          transform: scale(0.95);
        }
        @media (max-width: 1024px) {
          .auth-left {
            display: none;
          }
          .auth-right {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default SignInLayer;