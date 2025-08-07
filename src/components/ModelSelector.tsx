import React from 'react';
import { AIProvider, AI_PROVIDERS } from '@/config/constants';

interface ModelSelectorProps {
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  disabled?: boolean;
}

export default function ModelSelector({ 
  selectedProvider, 
  onProviderChange, 
  disabled = false 
}: ModelSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        AIモデルを選択
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AI_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className={`
              relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200
              ${selectedProvider === provider.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !disabled && onProviderChange(provider.id)}
          >
            <div className="flex items-center">
              <input
                id={provider.id}
                name="ai-provider"
                type="radio"
                checked={selectedProvider === provider.id}
                onChange={() => !disabled && onProviderChange(provider.id)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={provider.id}
                className={`ml-3 block text-sm font-medium text-black cursor-pointer ${
                  disabled ? 'cursor-not-allowed' : ''
                }`}
              >
                {provider.name}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}