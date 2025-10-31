# Company Information Feature

## Overview
Fitur baru untuk input dan penyimpanan informasi perusahaan yang akan otomatis tersimpan di browser user dan auto-fill untuk invoice berikutnya.

## Features Added

### 1. Company Information Form
- **Company Name** (required)
- **Company Email** (required, with email validation)
- **Company Phone** (required)
- **Company Address** (required)
- **City** (required)
- **Company Logo URL** (optional)

### 2. Auto-Save Functionality
- Data perusahaan otomatis tersimpan di localStorage browser
- Auto-fill saat user membuka aplikasi lagi
- Real-time save saat user mengetik (debounced)
- Hanya menyimpan jika nama dan email perusahaan sudah diisi

### 3. Clear Data Feature
- Tombol "Clear Data" untuk reset informasi perusahaan
- Konfirmasi dialog sebelum menghapus data
- Menghapus data dari localStorage dan form

### 4. Logo Support
- Input URL logo perusahaan (optional)
- Logo ditampilkan di invoice preview
- Auto-resize logo (max height 64px)

## Implementation Details

### New Files Created:
1. `app/components/CompanyForm.tsx` - Form component untuk input company info
2. `app/utils/localStorage.ts` - Utility functions untuk localStorage operations

### Modified Files:
1. `app/types/invoice.ts` - Added CompanyInfo interface
2. `app/page.tsx` - Integrated company form with auto-save/load
3. `app/components/InvoicePreview.tsx` - Added logo display support

### localStorage Functions:
- `saveCompanyInfo(companyInfo)` - Save data to localStorage
- `loadCompanyInfo()` - Load data from localStorage
- `hasStoredCompanyInfo()` - Check if data exists
- `clearCompanyInfo()` - Clear data from localStorage
- `getDefaultCompanyInfo()` - Get default empty structure

## User Experience

### First Time Use:
1. User sees empty company form
2. User fills company information
3. Data automatically saved as user types
4. Blue info box explains auto-save feature

### Returning User:
1. Company form pre-filled with saved data
2. User can modify any field (auto-saves changes)
3. User can clear all data if needed
4. Logo displays in invoice if provided

### Invoice Generation:
1. Company info from form used in invoice
2. Logo included in invoice header (if provided)
3. Professional invoice layout with company branding

## Technical Benefits

- **Persistent Data**: Company info persists across browser sessions
- **Better UX**: No need to re-enter company info repeatedly  
- **Validation**: Form validation ensures required fields are filled
- **Error Handling**: Graceful handling of localStorage errors
- **Privacy**: Data stored locally in user's browser only
- **Flexibility**: Optional logo and clear data functionality

## Data Structure

```typescript
interface CompanyInfo {
  name: string;        // Required
  address: string;     // Required  
  city: string;        // Required
  phone: string;       // Required
  email: string;       // Required, validated
  logo?: string;       // Optional URL
}
```

## Usage Flow

1. **Input**: User fills company form (positioned first in layout)
2. **Auto-Save**: Data saved to localStorage on meaningful input
3. **Validation**: Form validates required fields and email format
4. **Storage**: Data persists in browser's localStorage
5. **Load**: Auto-loads on next visit
6. **Generate**: Company info included in invoice PDF

This feature significantly improves user experience by eliminating repetitive data entry while maintaining data privacy through local storage.