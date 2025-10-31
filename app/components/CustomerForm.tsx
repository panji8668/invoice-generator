'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { InvoiceFormData } from '../types/invoice';

interface CustomerFormProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
}

export function CustomerForm({ register, errors }: CustomerFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customer.name" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            id="customer.name"
            {...register('customer.name', { required: 'Customer name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter customer name"
          />
          {errors.customer?.name && (
            <p className="mt-1 text-sm text-red-600">{errors.customer.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer.email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="customer.email"
            {...register('customer.email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="customer@example.com"
          />
          {errors.customer?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.customer.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer.phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="customer.phone"
            {...register('customer.phone', { required: 'Phone number is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+62 812 3456 7890"
          />
          {errors.customer?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.customer.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer.city" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            id="customer.city"
            {...register('customer.city', { required: 'City is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Jakarta"
          />
          {errors.customer?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.customer.city.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="customer.address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <textarea
            id="customer.address"
            {...register('customer.address', { required: 'Address is required' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter customer address"
          />
          {errors.customer?.address && (
            <p className="mt-1 text-sm text-red-600">{errors.customer.address.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            id="customer.postalCode"
            {...register('customer.postalCode')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="12345"
          />
        </div>
      </div>
    </div>
  );
}