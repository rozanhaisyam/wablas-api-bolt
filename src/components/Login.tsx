import React from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { type WablasServer } from '../config/wablas';
import { wablasApi } from '../services/api';

interface LoginForm {
  apiKey: string;
  server: WablasServer;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      server: 'eu'
    }
  });
  const setToken = useAuthStore((state) => state.setToken);

  const onSubmit = (data: LoginForm) => {
    wablasApi.configure(data.server, data.apiKey);
    setToken(data.apiKey);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-green-500">
            <MessageSquare className="w-full h-full" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Wablas Dashboard
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="server" className="block text-sm font-medium text-gray-700 mb-1">
                Server Region
              </label>
              <select
                {...register('server')}
                id="server"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              >
                <option value="eu">Europe (eu.wablas.com)</option>
                <option value="deu">Europe - Alternative (deu.wablas.com)</option>
                <option value="as">Asia (as.wablas.com)</option>
                <option value="das">Asia - Alternative (das.wablas.com)</option>
                <option value="us">United States (us.wablas.com)</option>
                <option value="dus">United States - Alternative (dus.wablas.com)</option>
              </select>
            </div>
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                {...register('apiKey', { required: true })}
                id="apiKey"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your Wablas API key"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}