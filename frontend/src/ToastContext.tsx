import React, { createContext, useCallback, useContext, useState } from 'react';

export type ToastType = 'success' | 'error';

/** Error style variant derived from message content so notification matches the error. */
export type ErrorVariant = 'validation' | 'auth' | 'error';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  errorVariant?: ErrorVariant;
}

function getErrorVariant(message: string): ErrorVariant {
  const m = message.toLowerCase();
  if (
    m.includes('please ') ||
    m.includes('must ') ||
    m.includes('passwords do not match') ||
    m.includes('fill in all')
  ) {
    return 'validation';
  }
  if (
    m.includes('login failed') ||
    m.includes('invalid credentials') ||
    m.includes('sign in') ||
    m.includes('registration failed')
  ) {
    return 'auth';
  }
  return 'error';
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION_MS = 4500;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [nextId, setNextId] = useState(0);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId;
      setNextId((n) => n + 1);
      const errorVariant = type === 'error' ? getErrorVariant(message) : undefined;
      setItems((prev) => [...prev, { id, type, message, errorVariant }]);
      setTimeout(() => remove(id), TOAST_DURATION_MS);
    },
    [nextId, remove],
  );

  const success = useCallback((message: string) => toast('success', message), [toast]);
  const error = useCallback((message: string) => toast('error', message), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {items.map((item) => (
          <div
            key={item.id}
            className={`toast toast-${item.type}${item.errorVariant ? ` toast-error-${item.errorVariant}` : ''}`}
            role="status"
          >
            <span className="toast-icon" aria-hidden>
              {item.type === 'success' ? '✓' : '!'}
            </span>
            <div className="toast-content">
              {item.type === 'error' && item.errorVariant && (
                <span className="toast-label">
                  {item.errorVariant === 'validation' ? 'Check your input' : item.errorVariant === 'auth' ? 'Sign in' : 'Error'}
                </span>
              )}
              <span className="toast-message">{item.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
