import { CompanyInfo } from '../types/invoice';

const COMPANY_INFO_KEY = 'invoice-generator-company-info';

export function saveCompanyInfo(companyInfo: CompanyInfo): void {
  try {
    localStorage.setItem(COMPANY_INFO_KEY, JSON.stringify(companyInfo));
  } catch (error) {
    console.error('Failed to save company info to localStorage:', error);
  }
}

export function loadCompanyInfo(): CompanyInfo | null {
  try {
    const stored = localStorage.getItem(COMPANY_INFO_KEY);
    if (stored) {
      return JSON.parse(stored) as CompanyInfo;
    }
  } catch (error) {
    console.error('Failed to load company info from localStorage:', error);
  }
  return null;
}

export function hasStoredCompanyInfo(): boolean {
  try {
    const stored = localStorage.getItem(COMPANY_INFO_KEY);
    return stored !== null && stored !== undefined;
  } catch (error) {
    console.error('Failed to check stored company info:', error);
    return false;
  }
}

export function clearCompanyInfo(): void {
  try {
    localStorage.removeItem(COMPANY_INFO_KEY);
  } catch (error) {
    console.error('Failed to clear company info from localStorage:', error);
  }
}

export function getDefaultCompanyInfo(): CompanyInfo {
  return {
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    logo: '',
    bankInfo: '',
  };
}