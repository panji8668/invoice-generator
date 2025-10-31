import jsPDF from 'jspdf';
import { imageUrlToBase64, isValidImageUrl } from './imageUtils';

// Simple PDF generation without html2canvas to avoid color parsing issues
export async function generateSimplePDF(invoiceData: any, filename: string = 'invoice.pdf') {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = 20;

    // Helper function to add text
    const addText = (text: string, x: number, y: number, fontSize: number = 12, style: 'normal' | 'bold' = 'normal', align: 'left' | 'center' | 'right' = 'left') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', style);
      pdf.text(text, x, y, { align });
    };

    // Helper function to add line
    const addLine = (x1: number, y1: number, x2: number, y2: number) => {
      pdf.line(x1, y1, x2, y2);
    };

    // Header
    addText('INVOICE', 20, currentY, 24, 'bold');
    addText(`#${invoiceData.invoiceNumber}`, 20, currentY + 10, 12);
    
    // Company logo (if available)
    let logoHeight = 0;
    if (invoiceData.companyInfo.logo && isValidImageUrl(invoiceData.companyInfo.logo)) {
      try {
        const logoBase64 = await imageUrlToBase64(invoiceData.companyInfo.logo);
        if (logoBase64) {
          const logoWidth = 40; // Fixed width
          logoHeight = 20; // Fixed height
          pdf.addImage(logoBase64, 'PNG', pageWidth - 60, currentY, logoWidth, logoHeight);
          currentY += logoHeight + 5; // Add space after logo
        }
      } catch (error) {
        console.warn('Failed to add logo to simple PDF:', error);
      }
    }
    
    // Company info (right aligned, positioned after logo)
    const companyInfoY = Math.max(currentY, currentY + logoHeight);
    addText(invoiceData.companyInfo.name, pageWidth - 20, companyInfoY, 14, 'bold', 'right');
    addText(invoiceData.companyInfo.address, pageWidth - 20, companyInfoY + 8, 10, 'normal', 'right');
    addText(invoiceData.companyInfo.city, pageWidth - 20, companyInfoY + 16, 10, 'normal', 'right');
    addText(invoiceData.companyInfo.phone, pageWidth - 20, companyInfoY + 24, 10, 'normal', 'right');
    addText(invoiceData.companyInfo.email, pageWidth - 20, companyInfoY + 32, 10, 'normal', 'right');

    currentY = Math.max(currentY + 50, companyInfoY + 40);

    // Line separator
    addLine(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Customer info
    addText('Bill To:', 20, currentY, 12, 'bold');
    currentY += 8;
    addText(invoiceData.customer.name, 20, currentY, 11, 'bold');
    currentY += 6;
    addText(invoiceData.customer.address, 20, currentY, 10);
    currentY += 6;
    addText(`${invoiceData.customer.city} ${invoiceData.customer.postalCode}`, 20, currentY, 10);
    currentY += 6;
    addText(`Phone: ${invoiceData.customer.phone}`, 20, currentY, 10);
    currentY += 6;
    addText(`Email: ${invoiceData.customer.email}`, 20, currentY, 10);

    // Invoice details (right side)
    let detailY = currentY - 30;
    addText('Invoice Details:', pageWidth - 80, detailY, 12, 'bold');
    detailY += 8;
    addText(`Invoice Date: ${new Date(invoiceData.date).toLocaleDateString('id-ID')}`, pageWidth - 80, detailY, 10);
    detailY += 6;
    addText(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString('id-ID')}`, pageWidth - 80, detailY, 10);

    currentY += 30;

    // Items table header
    addLine(20, currentY, pageWidth - 20, currentY);
    currentY += 8;
    
    addText('Item', 20, currentY, 11, 'bold');
    addText('Qty', pageWidth - 100, currentY, 11, 'bold');
    addText('Price', pageWidth - 70, currentY, 11, 'bold');
    addText('Total', pageWidth - 40, currentY, 11, 'bold');
    
    currentY += 5;
    addLine(20, currentY, pageWidth - 20, currentY);
    currentY += 8;

    // Items
    invoiceData.items.forEach((item: any) => {
      if (currentY > pageHeight - 40) {
        pdf.addPage();
        currentY = 20;
      }

      addText(item.name, 20, currentY, 10);
      if (item.description) {
        currentY += 5;
        addText(item.description, 20, currentY, 8);
      }
      
      addText(item.quantity.toString(), pageWidth - 95, currentY, 10, 'normal', 'center');
      addText(`Rp ${item.price.toLocaleString('id-ID')}`, pageWidth - 65, currentY, 10, 'normal', 'right');
      addText(`Rp ${item.total.toLocaleString('id-ID')}`, pageWidth - 20, currentY, 10, 'normal', 'right');
      
      currentY += 12;
    });

    currentY += 5;
    addLine(20, currentY, pageWidth - 20, currentY);
    currentY += 15;

    // Totals
    const totalsX = pageWidth - 20;
    addText(`Subtotal: Rp ${invoiceData.subtotal.toLocaleString('id-ID')}`, totalsX, currentY, 10, 'normal', 'right');
    currentY += 8;
    addText(`Tax (${invoiceData.taxRate}%): Rp ${invoiceData.tax.toLocaleString('id-ID')}`, totalsX, currentY, 10, 'normal', 'right');
    currentY += 8;
    addLine(pageWidth - 80, currentY, pageWidth - 20, currentY);
    currentY += 8;
    addText(`Total: Rp ${invoiceData.total.toLocaleString('id-ID')}`, totalsX, currentY, 12, 'bold', 'right');

    // Notes
    if (invoiceData.notes) {
      currentY += 20;
      addText('Notes:', 20, currentY, 11, 'bold');
      currentY += 8;
      addText(invoiceData.notes, 20, currentY, 10);
    }

    // Footer
    currentY = pageHeight - 20;
    addText('Thank you for your business!', pageWidth / 2, currentY, 10, 'normal', 'center');

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating simple PDF:', error);
    throw error;
  }
}