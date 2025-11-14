import React from 'react';

// FIX: Combined attribute types for input, textarea, and select elements to support shared and unique props like 'rows'. Also unified the onChange event type.
type AllFormElementAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> &
                                Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> &
                                Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
                                  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
                                };

// Generic Form Input Component
export const FormInput = (props: AllFormElementAttributes & { label: string, as?: 'input' | 'textarea' | 'select' }) => {
    const { label, as = 'input', ...rest } = props;
    const InputComponent = as;
    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <InputComponent {...rest} className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
    );
};

export const FormCheckbox = (props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
    const { label, ...rest } = props;
    return (
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
            <input type="checkbox" {...rest} className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-500" />
            <span>{label}</span>
        </label>
    );
};