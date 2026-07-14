'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
    }
  };

  const getToastColor = (type: ToastType) => {
    switch (type) {
      case 'success': return 'rgba(46, 213, 115, 0.15)';
      case 'error': return 'rgba(255, 71, 87, 0.15)';
      case 'warning': return 'rgba(255, 165, 2, 0.15)';
      case 'info': return 'rgba(30, 144, 255, 0.15)';
    }
  };

  const getToastBorder = (type: ToastType) => {
    switch (type) {
      case 'success': return '1px solid #2ed573';
      case 'error': return '1px solid #ff4757';
      case 'warning': return '1px solid #ffa502';
      case 'info': return '1px solid #1e90ff';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '350px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'rgba(20, 20, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              border: getToastBorder(toast.type),
              color: 'white',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              pointerEvents: 'auto',
              fontSize: '0.9rem',
              fontWeight: 500,
              minWidth: '220px'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{getToastIcon(toast.type)}</span>
            <div style={{ flex: 1 }}>{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
