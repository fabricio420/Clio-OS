import React from 'react';

// FIX: Combined attribute types for input, textarea, and select elements to support shared and unique props like 'rows'. Also unified the onChange event type.
type AllFormElementAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> &
                                Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> &
                                Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
                                  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
                                };

// Generic Form Input Component
export const FormInput = (props: AllFormElementAttributes & { label: string, as?: 'input' | 'textarea' | 'select', icon?: React.ReactNode }) => {
    const { label, as = 'input', icon, ...rest } = props;
    const InputComponent = as;
    
    return (
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        {icon}
                    </div>
                )}
                <InputComponent 
                    {...rest} 
                    className={`w-full bg-slate-800/50 text-white p-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none placeholder:text-slate-600 ${icon ? 'pl-10' : ''}`} 
                />
            </div>
        </div>
    );
};

export const FormCheckbox = (props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
    const { label, ...rest } = props;
    return (
        <label className="flex items-center space-x-3 text-sm font-medium text-slate-300 cursor-pointer group">
            <input type="checkbox" {...rest} className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 transition cursor-pointer" />
            <span className="group-hover:text-white transition-colors">{label}</span>
        </label>
    );
};