'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, useFieldArray, Control } from 'react-hook-form';
import { InvoiceFormData } from '../types/invoice';

interface ItemsFormProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
  control: Control<InvoiceFormData>;
  watchItems: any[];
}

export function ItemsForm({ register, errors, control, watchItems }: ItemsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const addItem = () => {
    append({
      name: '',
      description: '',
      quantity: 1,
      price: 0,
    });
  };

  const calculateItemTotal = (quantity: number, price: number) => {
    return (quantity || 0) * (price || 0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Invoice Items</h2>
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add Item
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No items added yet</p>
          <button
            type="button"
            onClick={addItem}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Your First Item
          </button>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field: any, index: number) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium text-gray-700">Item {index + 1}</h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 focus:outline-none"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label htmlFor={`items.${index}.name`} className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  id={`items.${index}.name`}
                  {...register(`items.${index}.name`, { required: 'Item name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter item name"
                />
                {errors.items?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.items[index]?.name?.message}</p>
                )}
              </div>

              <div>
                <label htmlFor={`items.${index}.quantity`} className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  id={`items.${index}.quantity`}
                  min="1"
                  step="1"
                  {...register(`items.${index}.quantity`, { 
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Quantity must be at least 1' },
                    valueAsNumber: true
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
                {errors.items?.[index]?.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.items[index]?.quantity?.message}</p>
                )}
              </div>

              <div>
                <label htmlFor={`items.${index}.price`} className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rp) *
                </label>
                <input
                  type="number"
                  id={`items.${index}.price`}
                  min="0"
                  step="0.01"
                  {...register(`items.${index}.price`, { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                    valueAsNumber: true
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.items?.[index]?.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.items[index]?.price?.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor={`items.${index}.description`} className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id={`items.${index}.description`}
                {...register(`items.${index}.description`)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter item description"
              />
            </div>

            {/* Show calculated total */}
            <div className="mt-3 text-right">
              <span className="text-sm text-gray-600">Total: </span>
              <span className="text-lg font-semibold text-gray-800">
                Rp {calculateItemTotal(
                  watchItems[index]?.quantity || 0, 
                  watchItems[index]?.price || 0
                ).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}