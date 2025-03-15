import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, QrCode, LogOut } from 'lucide-react';
import { wablasApi } from '../services/api';
import { useAuthStore } from '../store/auth';
import SendMessage from './SendMessage';
import DeviceStatus from './DeviceStatus';

export default function Dashboard() {
  const clearToken = useAuthStore((state) => state.clearToken);
  const { data: deviceInfo } = useQuery({
    queryKey: ['deviceInfo'],
    queryFn: wablasApi.getDeviceInfo,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-500" />
              <span className="ml-2 text-xl font-semibold">Wablas Dashboard</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => clearToken()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <DeviceStatus deviceInfo={deviceInfo} />
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <SendMessage />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}