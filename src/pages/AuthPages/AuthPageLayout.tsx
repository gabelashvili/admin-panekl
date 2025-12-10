import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import useAuthedUserStore from "../../store/client/useAuthedUserStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate()
  const {user} = useAuthedUserStore()

  useEffect(() => {
    if(user) {
      navigate('/')
    }
  }, [navigate, user])

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
