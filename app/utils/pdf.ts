import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(elementId: string, filename: string = 'invoice.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 1.5, // Reduced scale for better performance and consistency
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      foreignObjectRendering: false, // Disable for better consistency
      imageTimeout: 10000,
      removeContainer: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      ignoreElements: (element) => {
        // Ignore elements that might cause positioning issues
        const tagName = element.tagName.toLowerCase();
        const className = element.className || '';
        const htmlElement = element as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        
        return (
          tagName === 'script' || 
          tagName === 'style' ||
          className.includes('animate-') ||
          className.includes('transition-') ||
          computedStyle.position === 'fixed' ||
          computedStyle.position === 'sticky' ||
          computedStyle.transform !== 'none'
        );
      },
      onclone: (clonedDoc) => {
        // Fix any problematic CSS in the cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            box-sizing: border-box !important;
          }
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .text-gray-50 { color: #f9fafb !important; }
          .text-gray-100 { color: #f3f4f6 !important; }
          .text-gray-200 { color: #e5e7eb !important; }
          .text-gray-300 { color: #d1d5db !important; }
          .text-gray-400 { color: #9ca3af !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-900 { color: #111827 !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-gray-300 { border-color: #d1d5db !important; }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to fit in single page
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Force content to fit in single page by scaling if necessary
    if (imgHeight > pageHeight) {
      // Scale down to fit in one page
      const scaledWidth = (imgWidth * pageHeight) / imgHeight;
      const scaledHeight = pageHeight;
      const xOffset = (imgWidth - scaledWidth) / 2; // Center horizontally
      pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, scaledHeight);
    } else {
      // Content fits in one page, center it vertically
      const yOffset = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
    }

    // Save the PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

// Alternative PDF generation method with better error handling
export async function generatePDFAlternative(elementId: string, filename: string = 'invoice.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.backgroundColor = '#ffffff';
    clonedElement.style.color = '#000000';
    
    // Remove any problematic styles
    const problematicSelectors = [
      '[style*="lab("]',
      '[style*="lch("]',
      '[style*="oklab("]',
      '[style*="oklch("]'
    ];
    
    problematicSelectors.forEach(selector => {
      const elements = clonedElement.querySelectorAll(selector);
      elements.forEach(el => {
        (el as HTMLElement).style.cssText = (el as HTMLElement).style.cssText
          .replace(/lab\([^)]*\)/g, '#000000')
          .replace(/lch\([^)]*\)/g, '#000000')
          .replace(/oklab\([^)]*\)/g, '#000000')
          .replace(/oklch\([^)]*\)/g, '#000000');
      });
    });

    // Append to body temporarily
    document.body.appendChild(clonedElement);
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';

    try {
      const canvas = await html2canvas(clonedElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        foreignObjectRendering: false,
        imageTimeout: 10000,
        removeContainer: true,
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clonedElement.scrollWidth,
        windowHeight: clonedElement.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Force content to fit in single page by scaling if necessary
      if (imgHeight > pageHeight) {
        // Scale down to fit in one page
        const scaledWidth = (imgWidth * pageHeight) / imgHeight;
        const scaledHeight = pageHeight;
        const xOffset = (imgWidth - scaledWidth) / 2; // Center horizontally
        pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, scaledHeight);
      } else {
        // Content fits in one page, center it vertically
        const yOffset = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
      }

      pdf.save(filename);
      return true;
    } finally {
      // Clean up
      document.body.removeChild(clonedElement);
    }
  } catch (error) {
    console.error('Error generating PDF (alternative method):', error);
    throw error;
  }
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getTime()).slice(-4); // Last 4 digits of timestamp
  
  return `INV-${year}${month}${day}-${time}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateInvoiceTotals(items: any[], taxRate: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  
  return {
    subtotal,
    tax,
    total,
  };
}