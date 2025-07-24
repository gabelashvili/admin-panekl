import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useTranslation } from "react-i18next";

export default function LangDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
        <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
      
       {i18n.language === 'ka' ? t('common.lang.ka').slice(0, 2) : t('common.lang.en').slice(0, 2)}
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[200px] flex-col rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >

        <ul className="flex flex-col gap-1">
            <li>
              <DropdownItem
                onClick={() => {
                  i18n.changeLanguage('ka')
                  closeDropdown()
                }}
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                {t('common.lang.ka')}
              </DropdownItem>
            </li>
            <li>
            <DropdownItem
              onClick={() => {
                i18n.changeLanguage('en')
                closeDropdown()
              }}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              {t('common.lang.en')}
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
