import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-1 border border-gray-200 rounded-md p-0.5 bg-gray-50">
      <button
        type="button"
        onClick={() => changeLanguage('th')}
        className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
          i18n.language === 'th'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
          i18n.language === 'en'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;