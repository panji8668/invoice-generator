'use client';

import React, { useState, useEffect } from 'react';
import { InvoiceData } from '../types/invoice';
import { PDFWrapper } from './PDFWrapper';
import { imageUrlToBase64, isValidImageUrl } from '../utils/imageUtils';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  // Convert logo URL to base64 for better PDF compatibility
  useEffect(() => {
    const loadLogo = async () => {
      if (data.companyInfo.logo && isValidImageUrl(data.companyInfo.logo)) {
        setLogoLoading(true);
        setLogoError(null);
        setUseFallback(false);
        
        try {
          const base64 = await imageUrlToBase64(data.companyInfo.logo);
          if (base64) {
            setLogoBase64(base64);
          } else {
            // If base64 conversion fails, try to use original URL as fallback
            setLogoError('CORS issue detected, using fallback display');
            setUseFallback(true);
          }
        } catch (error) {
          console.warn('Failed to load company logo:', error);
          setLogoError('Failed to load logo for PDF');
          setUseFallback(true);
        } finally {
          setLogoLoading(false);
        }
      }
    };

    loadLogo();
  }, [data.companyInfo.logo]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-100 py-8 flex justify-center">
      <PDFWrapper id="invoice-preview">
        <div style={{ 
          backgroundColor: '#ffffff', 
          color: '#000000',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          lineHeight: '1.4',
          width: '100%',
          minHeight: '100%'
        }}>
          {/* Header */}
          <div style={{ 
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h1 style={{ 
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>INVOICE</h1>
                <p style={{ 
                  color: '#4b5563',
                  margin: '0',
                  fontSize: '14px'
                }}>#{data.invoiceNumber}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {(logoBase64 || useFallback || data.companyInfo.logo) && (
                  <div style={{ marginBottom: '16px' }}>
                    {logoLoading ? (
                      <div style={{
                        height: '64px',
                        width: '64px',
                        marginLeft: 'auto',
                        backgroundColor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '10px', color: '#6b7280' }}>Loading...</span>
                      </div>
                    ) : (
                      <img 
                        src={logoBase64 || data.companyInfo.logo} 
                        alt="Company Logo" 
                        style={{ 
                          maxHeight: '64px',
                          maxWidth: '200px',
                          height: 'auto',
                          width: 'auto',
                          objectFit: 'contain',
                          display: 'block',
                          marginLeft: 'auto'
                        }}
                        crossOrigin={logoBase64 ? undefined : "anonymous"}
                        onError={(e) => {
                          console.warn('Logo display failed:', e);
                          setLogoError('Logo display failed');
                        }}
                      />
                    )}
                  </div>
                )}
                <h2 style={{ 
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>{data.companyInfo.name}</h2>
                <p style={{ 
                  fontSize: '12px',
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>{data.companyInfo.address}</p>
                <p style={{ 
                  fontSize: '12px',
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>{data.companyInfo.city}</p>
                <p style={{ 
                  fontSize: '12px',
                  color: '#4b5563',
                  margin: '0 0 4px 0'
                }}>{data.companyInfo.phone}</p>
                <p style={{ 
                  fontSize: '12px',
                  color: '#4b5563',
                  margin: '0'
                }}>{data.companyInfo.email}</p>
              </div>
            </div>
      </div>

      {/* Invoice Details */}
        {/* Invoice Details */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ 
              fontWeight: '600',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px'
            }}>TAGIHAN KEPADA:</h3>
            <p style={{ 
              fontWeight: '600',
              marginBottom: '4px',
              fontSize: '14px'
            }}>{data.customer.name}</p>
            <p style={{ 
              fontSize: '12px',
              color: '#4b5563',
              marginBottom: '4px'
            }}>{data.customer.address}</p>
            <p style={{ 
              fontSize: '12px',
              color: '#4b5563',
              marginBottom: '4px'
            }}>{data.customer.city}</p>
            <p style={{ 
              fontSize: '12px',
              color: '#4b5563',
              marginBottom: '4px'
            }}>{data.customer.phone}</p>
            <p style={{ 
              fontSize: '12px',
              color: '#4b5563',
              margin: '0'
            }}>{data.customer.email}</p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ 
                fontWeight: '600',
                fontSize: '16px',
                margin: '0'
              }}>INVOICE #{data.invoiceNumber}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ color: '#4b5563' }}>Tanggal Invoice:</span>
                <span>{data.date}</span>
              </div>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ color: '#4b5563' }}>Tanggal Jatuh Tempo:</span>
                <span>{data.dueDate}</span>
              </div>
            </div>
          </div>
        </div>      {/* Items Table */}
        {/* Items Table */}
        <div style={{ marginBottom: '20px' }}>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ 
                  border: '1px solid #d1d5db',
                  padding: '6px 12px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>Item</th>
                <th style={{ 
                  border: '1px solid #d1d5db',
                  padding: '6px 12px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>Qty</th>
                <th style={{ 
                  border: '1px solid #d1d5db',
                  padding: '6px 12px',
                  textAlign: 'right',
                  fontWeight: '600'
                }}>Harga</th>
                <th style={{ 
                  border: '1px solid #d1d5db',
                  padding: '6px 12px',
                  textAlign: 'right',
                  fontWeight: '600'
                }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ 
                    border: '1px solid #d1d5db',
                    padding: '6px 12px'
                  }}>
                    <div style={{ fontWeight: '500' }}>{item.name}</div>
                    {item.description && (
                      <div style={{ 
                        fontSize: '10px',
                        color: '#4b5563',
                        marginTop: '1px'
                      }}>{item.description}</div>
                    )}
                  </td>
                  <td style={{ 
                    border: '1px solid #d1d5db',
                    padding: '6px 12px',
                    textAlign: 'center'
                  }}>{item.quantity}</td>
                  <td style={{ 
                    border: '1px solid #d1d5db',
                    padding: '6px 12px',
                    textAlign: 'right'
                  }}>
                    Rp {item.price.toLocaleString('id-ID')}
                  </td>
                  <td style={{ 
                    border: '1px solid #d1d5db',
                    padding: '6px 12px',
                    textAlign: 'right',
                    fontWeight: '500'
                  }}>
                    Rp {item.total.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>      {/* Totals */}
        {/* Totals */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px'
        }}>
          <div style={{ width: '256px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ color: '#4b5563' }}>Subtotal:</span>
                <span>Rp {data.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ color: '#4b5563' }}>PPN ({data.taxRate}%):</span>
                <span>Rp {data.tax.toLocaleString('id-ID')}</span>
              </div>
              <hr style={{ 
                border: 'none',
                borderTop: '1px solid #d1d5db',
                margin: '4px 0'
              }} />
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '700',
                fontSize: '14px'
              }}>
                <span>Total:</span>
                <span>Rp {data.total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>      {/* Notes */}
        {/* Notes */}
        {data.notes && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ 
              fontWeight: '600',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px'
            }}>Catatan:</h3>
            <p style={{ 
              fontSize: '12px',
              color: '#4b5563',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              margin: '0'
            }}>{data.notes}</p>
          </div>
        )}

        {/* Bank Information */}
        {data.companyInfo.bankInfo && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ 
              fontWeight: '600',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px'
            }}>Informasi Rekening Pembayaran:</h3>
            <p style={{ 
              fontSize: '12px',
              color: '#4b5563',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              margin: '0'
            }}>{data.companyInfo.bankInfo}</p>
          </div>
        )}

        {/* Footer */}
          <div style={{ 
            borderTop: '1px solid #e5e7eb',
            paddingTop: '24px',
            marginTop: '32px',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: '12px',
              color: '#6b7280',
              margin: '0'
            }}>
              Thank you for your business!
            </p>
          </div>
        </div>
      </PDFWrapper>
    </div>
  );
}