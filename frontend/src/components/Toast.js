import { createContext, useContext, useState } from "react";
import { FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? <FiCheckCircle color="#10b981" size={20} /> :
           toast.type === "error" ? <FiXCircle color="#ef4444" size={20} /> :
           <FiInfo size={20} />}
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);