# Invoice Generator

A modern, professional invoice and sales order generator built with Next.js, TypeScript, and Tailwind CSS. Create beautiful invoices with customer information, itemized products/services, automatic calculations, and PDF export functionality.

## Features

- ✨ **Modern UI** - Clean, responsive design with Tailwind CSS
- 👤 **Customer Management** - Input customer details (name, email, phone, address)
- 📝 **Dynamic Item Management** - Add/remove items with quantity, price, and descriptions
- 🧮 **Automatic Calculations** - Real-time subtotal, tax, and total calculations
- 📄 **PDF Export** - Generate professional PDF invoices
- 💰 **Tax Support** - Configurable tax rate (default PPN 11%)
- 📅 **Date Management** - Invoice date and due date handling
- 📝 **Notes Section** - Additional notes and terms
- 🎯 **TypeScript** - Full type safety and excellent developer experience

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Heroicons (SVG)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd inv-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Fill Customer Information**
   - Enter customer name, email, phone, and address
   - All fields marked with * are required

2. **Add Invoice Items**
   - Click "Add Item" to add products/services
   - Enter item name, quantity, and price
   - Optionally add descriptions
   - Remove items using the X button

3. **Configure Settings**
   - Set due date
   - Adjust tax rate (default 11%)
   - Add optional notes

4. **Preview & Export**
   - Click "Preview Invoice" to see the formatted invoice
   - Click "Download PDF" to generate and download the PDF file

## Project Structure

```
app/
├── components/          # React components
│   ├── CustomerForm.tsx # Customer information form
│   ├── ItemsForm.tsx    # Dynamic items form
│   └── InvoicePreview.tsx # Invoice preview display
├── types/
│   └── invoice.ts       # TypeScript interfaces
├── utils/
│   └── pdf.ts          # PDF generation utilities
├── globals.css         # Global styles
├── layout.tsx          # App layout
└── page.tsx            # Main page component
```

## Customization

### Company Information

Edit the `companyInfo` object in `app/page.tsx` to customize your company details:

```typescript
companyInfo: {
  name: 'Your Company Name',
  address: 'Your Company Address',
  city: 'Your City, Postal Code',
  phone: '+62 XXX XXXX XXXX',
  email: 'your-email@company.com',
}
```

### Invoice Number Format

The invoice number format can be customized in `app/utils/pdf.ts`:

```typescript
export function generateInvoiceNumber(): string {
  // Current format: INV-YYYYMMDD-XXXX
  // Customize as needed
}
```

## Build and Deploy

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and TypeScript
# invoice-generator
