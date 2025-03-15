import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { wablasApi, type SendMessagePayload } from '../services/api';
import { formatPhoneNumber } from '../lib/utils';

export default function SendMessage() {
  const { register, handleSubmit, reset } = useForm<SendMessagePayload>();

  const sendMessage = useMutation({
    mutationFn: wablasApi.sendMessage,
    onSuccess: () => {
      toast.success('Message sent successfully');
      reset();
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  const onSubmit = (data: SendMessagePayload) => {
    sendMessage.mutate({
      ...data,
      phone: formatPhoneNumber(data.phone),
    });
  };

  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
        <Send className="h-5 w-5 mr-2" />
        Send Message
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            {...register('phone', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            {...register('message', { required: true })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            placeholder="Enter your message"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('isGroup')}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isGroup"
            className="ml-2 block text-sm text-gray-900"
          >
            Send to Group
          </label>
        </div>
        <div>
          <button
            type="submit"
            disabled={sendMessage.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {sendMessage.isPending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}