'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { CustomerForm } from './components/CustomerForm';
import { ItemsForm } from './components/ItemsForm';
import { CompanyForm } from './components/CompanyForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceFormData, InvoiceData, InvoiceItem } from './types/invoice';
import { generatePDF, generateInvoiceNumber, calculateInvoiceTotals } from './utils/pdf';
import { saveCompanyInfo, loadCompanyInfo, getDefaultCompanyInfo, clearCompanyInfo } from './utils/localStorage';
import { preloadImage, isValidImageUrl } from './utils/imageUtils';

export default function Home() {
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [companyInfoLoaded, setCompanyInfoLoaded] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<InvoiceFormData>({
    defaultValues: {
      customer: {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
      },
      items: [
        {
          name: '',
          description: '',
          quantity: 1,
          price: 0,
        },
      ],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      taxRate: 11, // Default PPN 11%
      notes: '',
      companyInfo: getDefaultCompanyInfo(),
    },
  });

  // Load company info from localStorage on component mount
  useEffect(() => {
    const storedCompanyInfo = loadCompanyInfo();
    if (storedCompanyInfo) {
      setValue('companyInfo', storedCompanyInfo);
    }
    setCompanyInfoLoaded(true);
  }, [setValue]);

  const watchItems = useWatch({
    control,
    name: 'items',
  });

  const watchCompanyInfo = useWatch({
    control,
    name: 'companyInfo',
  });

  // Auto-save company info when it changes
  useEffect(() => {
    if (companyInfoLoaded && watchCompanyInfo) {
      // Only save if company info has meaningful data
      if (watchCompanyInfo.name && watchCompanyInfo.email) {
        saveCompanyInfo(watchCompanyInfo);
      }
    }
  }, [watchCompanyInfo, companyInfoLoaded]);

  const handleClearCompanyInfo = () => {
    if (confirm('Are you sure you want to clear all company information? This will remove the saved data from your browser.')) {
      clearCompanyInfo();
      setValue('companyInfo', getDefaultCompanyInfo());
    }
  };

  const onSubmit = (data: InvoiceFormData) => {
    setShowPreview(true);
  };

  const generateInvoiceData = (formData: InvoiceFormData): InvoiceData => {
    const items: InvoiceItem[] = formData.items.map((item, index) => ({
      id: `item-${index + 1}`,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    const { subtotal, tax, total } = calculateInvoiceTotals(items, formData.taxRate);

    return {
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      customer: formData.customer,
      items,
      subtotal,
      tax,
      taxRate: formData.taxRate,
      total,
      notes: formData.notes,
      companyInfo: formData.companyInfo,
    };
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const formData = watch();
      const invoiceData = generateInvoiceData(formData);
      const filename = `invoice-${invoiceData.invoiceNumber}.pdf`;
      
      // Enhanced logo preloading with CORS handling
      if (invoiceData.companyInfo.logo && isValidImageUrl(invoiceData.companyInfo.logo)) {
        try {
          console.log('Preloading logo with CORS handling...');
          await preloadImage(invoiceData.companyInfo.logo);
          console.log('Logo preloaded successfully');
        } catch (logoError) {
          console.warn('Logo preload failed, PDF generation will try fallback methods:', logoError);
          // Continue anyway - the PDF generation has its own fallback mechanisms
        }
      }

      // Add delay to ensure any DOM updates from logo loading are complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        console.log('Attempting primary PDF generation method...');
        await generatePDF('invoice-preview', filename);
        console.log('Primary PDF generation successful');
      } catch (primaryError) {
        console.warn('Primary PDF generation failed, trying alternative method:', primaryError);
        try {
          console.log('Attempting alternative PDF generation method...');
          const { generatePDFAlternative } = await import('./utils/pdf');
          await generatePDFAlternative('invoice-preview', filename);
          console.log('Alternative PDF generation successful');
        } catch (secondaryError) {
          console.warn('Alternative PDF generation failed, using simple method:', secondaryError);
          try {
            console.log('Attempting simple PDF generation method...');
            const { generateSimplePDF } = await import('./utils/simplePdf');
            await generateSimplePDF(invoiceData, filename);
            console.log('Simple PDF generation successful');
          } catch (tertiaryError) {
            console.error('All PDF generation methods failed:', tertiaryError);
            throw new Error('All PDF generation methods failed. Please check console for details.');
          }
        }
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error generating PDF: ${errorMessage}\n\nPlease try again. If the problem persists, check the browser console for more details.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (showPreview) {
    const formData = watch();
    const invoiceData = generateInvoiceData(formData);

    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Invoice Preview</h1>
            <div className="space-x-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Edit
              </button>
              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </div>
          </div>
          <InvoicePreview data={invoiceData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Invoice Generator</h1>
          <p className="text-gray-600">Create professional invoices and sales orders</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <CompanyForm register={register} errors={errors} onClearCompanyInfo={handleClearCompanyInfo} control={control} />
          
          <CustomerForm register={register} errors={errors} />
          
          <ItemsForm 
            register={register} 
            errors={errors} 
            control={control}
            watchItems={watchItems || []}
          />

          {/* Additional Settings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Invoice Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  id="dueDate"
                  {...register('dueDate', { required: 'Due date is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('taxRate', { 
                    min: { value: 0, message: 'Tax rate must be positive' },
                    max: { value: 100, message: 'Tax rate cannot exceed 100%' },
                    valueAsNumber: true
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="11"
                />
                {errors.taxRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxRate.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes or terms..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Preview Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
