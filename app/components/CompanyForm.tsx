'use client';

import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, useWatch, Control } from 'react-hook-form';
import { InvoiceFormData } from '../types/invoice';
import { testImageCORS, isValidImageUrl, analyzeCorsError } from '../utils/imageUtils';

interface CompanyFormProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
  onClearCompanyInfo?: () => void;
  control?: Control<InvoiceFormData>;
}

export function CompanyForm({ register, errors, onClearCompanyInfo, control }: CompanyFormProps) {
  const [logoStatus, setLogoStatus] = useState<'testing' | 'success' | 'cors-error' | 'invalid' | null>(null);
  const [corsAnalysis, setCorsAnalysis] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const logoUrl = useWatch({
    control,
    name: 'companyInfo.logo',
    defaultValue: ''
  });

  useEffect(() => {
    const testLogo = async () => {
      if (!logoUrl || !logoUrl.trim()) {
        setLogoStatus(null);
        return;
      }

      if (!isValidImageUrl(logoUrl)) {
        setLogoStatus('invalid');
        return;
      }

      setLogoStatus('testing');
      
      try {
        const canLoadWithCORS = await testImageCORS(logoUrl);
        if (canLoadWithCORS) {
          setLogoStatus('success');
          setCorsAnalysis(null);
        } else {
          setLogoStatus('cors-error');
          setCorsAnalysis(analyzeCorsError(logoUrl));
        }
      } catch (error) {
        setLogoStatus('cors-error');
        setCorsAnalysis(analyzeCorsError(logoUrl));
      }
    };

    const timeoutId = setTimeout(testLogo, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [logoUrl]);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Company Information</h2>
        {onClearCompanyInfo && (
          <button
            type="button"
            onClick={onClearCompanyInfo}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            title="Clear saved company information"
          >
            Clear Data
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-4">
        This information will be saved in your browser and auto-filled for future invoices.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="companyInfo.name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            id="companyInfo.name"
            {...register('companyInfo.name', { required: 'Company name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your Company Name"
          />
          {errors.companyInfo?.name && (
            <p className="mt-1 text-sm text-red-600">{errors.companyInfo.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="companyInfo.email" className="block text-sm font-medium text-gray-700 mb-1">
            Company Email *
          </label>
          <input
            type="email"
            id="companyInfo.email"
            {...register('companyInfo.email', { 
              required: 'Company email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="company@example.com"
          />
          {errors.companyInfo?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.companyInfo.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="companyInfo.phone" className="block text-sm font-medium text-gray-700 mb-1">
            Company Phone *
          </label>
          <input
            type="tel"
            id="companyInfo.phone"
            {...register('companyInfo.phone', { required: 'Company phone is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+62 21 1234 5678"
          />
          {errors.companyInfo?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.companyInfo.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="companyInfo.city" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            id="companyInfo.city"
            {...register('companyInfo.city', { required: 'City is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Jakarta"
          />
          {errors.companyInfo?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.companyInfo.city.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="companyInfo.address" className="block text-sm font-medium text-gray-700 mb-1">
            Company Address *
          </label>
          <textarea
            id="companyInfo.address"
            {...register('companyInfo.address', { required: 'Company address is required' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your company address"
          />
          {errors.companyInfo?.address && (
            <p className="mt-1 text-sm text-red-600">{errors.companyInfo.address.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="companyInfo.logo" className="block text-sm font-medium text-gray-700 mb-1">
            Company Logo URL (Optional)
          </label>
          <input
            type="url"
            id="companyInfo.logo"
            {...register('companyInfo.logo', {
              validate: (value) => {
                if (!value) return true; // Optional field
                try {
                  new URL(value);
                  return true;
                } catch {
                  return 'Please enter a valid URL';
                }
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/logo.png"
          />
          {errors.companyInfo?.logo && (
            <p className="mt-1 text-sm text-red-600">{errors.companyInfo.logo.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Optional: Add a URL to your company logo. Supported formats: JPG, PNG, GIF, WebP, SVG
          </p>
          
          {/* Logo Status Indicator */}
          {logoUrl && (
            <div className="mt-2">
              {logoStatus === 'testing' && (
                <div className="flex items-center text-xs text-blue-600">
                  <div className="animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Testing logo accessibility...
                </div>
              )}
              {logoStatus === 'success' && (
                <div className="flex items-center text-xs text-green-600">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Logo accessible - will appear in PDF
                </div>
              )}
              {logoStatus === 'cors-error' && (
                <div className="text-xs">
                  <div className="flex items-center text-amber-600 mb-2">
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    CORS restricted by {corsAnalysis?.domain} - trying fallback methods
                    <button
                      type="button"
                      onClick={() => setShowDetails(!showDetails)}
                      className="ml-2 text-blue-600 hover:text-blue-700 underline"
                    >
                      {showDetails ? 'Hide' : 'Show'} Solutions
                    </button>
                  </div>
                  
                  {showDetails && corsAnalysis && (
                    <div className="bg-amber-50 p-3 rounded border border-amber-200 mt-2">
                      <p className="font-medium text-amber-800 mb-2">💡 Solutions to fix CORS:</p>
                      <ul className="list-disc list-inside text-amber-700 space-y-1 mb-3">
                        {corsAnalysis.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                      
                      {corsAnalysis.alternativeUrls.length > 0 && (
                        <div>
                          <p className="font-medium text-amber-800 mb-1">🔄 Alternative URLs (auto-tried):</p>
                          <div className="text-xs text-amber-600 space-y-1">
                            {corsAnalysis.alternativeUrls.slice(0, 2).map((url: string, index: number) => (
                              <div key={index} className="font-mono bg-amber-100 p-1 rounded truncate">
                                {url.length > 60 ? url.substring(0, 60) + '...' : url}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {logoStatus === 'invalid' && (
                <div className="flex items-center text-xs text-red-600">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                  Invalid image URL or format
                </div>
              )}
            </div>
          )}
          
          <p className="mt-1 text-xs text-gray-500">
            💡 For best results: Use HTTPS URLs, enable CORS on your server, or host logo on same domain.
          </p>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="companyInfo.bankInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Account Information (Optional)
          </label>
          <textarea
            id="companyInfo.bankInfo"
            {...register('companyInfo.bankInfo')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Example:&#10;BCA 0404664545&#10;MANDIRI 1450018060307&#10;PT Aviana Teknologi Nusantara"
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional: Add your bank account details for payment. Each line will be displayed separately.
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="flex items-center">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Auto-Save:</strong> Your company information will be automatically saved in your browser for future use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}