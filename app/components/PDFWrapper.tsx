import React from 'react';

interface PDFWrapperProps {
  children: React.ReactNode;
  id: string;
}

export function PDFWrapper({ children, id }: PDFWrapperProps) {
  return (
    <div
      id={id}
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
        padding: '32px',
        margin: '0',
        boxSizing: 'border-box',
        width: '210mm', // A4 width
        minHeight: '297mm', // A4 height
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <style>
        {`
          #${id} {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          #${id} * {
            box-sizing: border-box !important;
            font-family: Arial, sans-serif !important;
            position: static !important;
            transform: none !important;
            margin: 0 !important;
          }
          #${id} .grid {
            display: grid !important;
          }
          #${id} .flex {
            display: flex !important;
          }
          #${id} .block {
            display: block !important;
          }
          #${id} .text-gray-800 { color: #1f2937 !important; }
          #${id} .text-gray-700 { color: #374151 !important; }
          #${id} .text-gray-600 { color: #4b5563 !important; }
          #${id} .text-gray-500 { color: #6b7280 !important; }
          #${id} .bg-gray-50 { background-color: #f9fafb !important; }
          #${id} .border-gray-200 { border-color: #e5e7eb !important; }
          #${id} .border-gray-300 { border-color: #d1d5db !important; }
          #${id} .rounded-lg { border-radius: 0 !important; }
          #${id} .shadow-lg { box-shadow: none !important; }
          #${id} .max-w-4xl { max-width: none !important; }
          #${id} .mx-auto { margin-left: 0 !important; margin-right: 0 !important; }
          #${id} .ml-auto { margin-left: auto !important; }
        `}
      </style>
      {children}
    </div>
  );
}