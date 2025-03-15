import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QrCode, Smartphone, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { wablasApi, type DeviceInfo } from '../services/api';

interface DeviceStatusProps {
  deviceInfo?: DeviceInfo;
}

export default function DeviceStatus({ deviceInfo }: DeviceStatusProps) {
  const { data: qrCode, refetch: refetchQR, isLoading, error } = useQuery({
    queryKey: ['qrCode'],
    queryFn: wablasApi.getQRCode,
    enabled: false, // Don't auto-generate QR code on mount
    retry: 1,
    retryDelay: 1000,
  });

  const { data: qrStatus } = useQuery({
    queryKey: ['qrStatus', qrCode?.data?.token],
    queryFn: () => qrCode?.data?.token ? wablasApi.checkQRStatus(qrCode.data.token) : null,
    enabled: !!qrCode?.data?.token,
    refetchInterval: (data) => {
      if (data?.status === 'connected' || data?.status === 'error') {
        return false;
      }
      return 3000;
    },
  });

  useEffect(() => {
    if (qrStatus?.status === 'connected') {
      toast.success('WhatsApp connected successfully!');
    } else if (qrStatus?.status === 'error') {
      toast.error('Failed to connect WhatsApp');
    }
  }, [qrStatus?.status]);

  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch QR code';
      console.error('QR Code Error:', error);
      toast.error(errorMessage);
    }
  }, [error]);

  const handleGenerateQR = async () => {
    try {
      await refetchQR();
      toast.success('QR Code generated successfully');
    } catch (error) {
      console.error('Generate QR Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate QR Code';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
            <Smartphone className="h-6 w-6 mr-2 text-green-600" />
            WhatsApp Device Connection
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Status</p>
                <p className="text-sm text-gray-500">{deviceInfo?.status || 'Not connected'}</p>
              </div>
              <button
                onClick={handleGenerateQR}
                disabled={isLoading || qrStatus?.status === 'pending'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || qrStatus?.status === 'pending' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {isLoading ? 'Generating...' : 'Connecting...'}
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </>
                )}
              </button>
            </div>

            {/* Debug information */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 p-4 rounded-lg text-xs">
                <p>QR Response: {JSON.stringify(qrCode, null, 2)}</p>
                <p>Loading: {isLoading ? 'true' : 'false'}</p>
                <p>Error: {error ? JSON.stringify(error, null, 2) : 'none'}</p>
              </div>
            )}

            {qrCode?.data?.qr && (
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with WhatsApp to connect your device:
                </p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src={qrCode.data.qr}
                    alt="WhatsApp QR Code"
                    className="w-64 h-64"
                    onError={(e) => {
                      console.error('QR Image Error:', e);
                      toast.error('Failed to load QR code image');
                    }}
                  />
                </div>
                {qrStatus?.status === 'pending' && (
                  <p className="mt-4 text-sm text-amber-600 flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Waiting for WhatsApp scan...
                  </p>
                )}
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p className="font-medium">Instructions:</p>
              <ol className="mt-2 list-decimal list-inside space-y-1">
                <li>Open WhatsApp on your phone</li>
                <li>Go to Settings &gt; Linked Devices</li>
                <li>Tap on "Link a Device"</li>
                <li>Scan the QR code above</li>
              </ol>
            </div>

            {qrCode?.data?.token && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Alternative Connection Method:</p>
                <p className="text-sm text-gray-600">If scanning doesn't work, use this link on your phone:</p>
                <div className="mt-2 p-2 bg-white rounded border border-gray-200 flex items-center justify-between">
                  <code className="text-xs text-gray-600 break-all">
                    {`https://deu.wablas.com/api/device/scan?token=${qrCode.data.token}`}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://deu.wablas.com/api/device/scan?token=${qrCode.data.token}`);
                      toast.success('Link copied to clipboard');
                    }}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {qrStatus?.status === 'connected' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Device connected successfully!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}