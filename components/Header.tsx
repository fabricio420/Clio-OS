import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, action }) => {
  return (
    <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6 px-4 md:px-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <p className="text-slate-400 mt-1">{subtitle}</p>
      </div>
      {action && (
        <div className="flex-shrink-0 self-start sm:self-center">
          {action}
        </div>
      )}
    </header>
  );
};

export default Header;
