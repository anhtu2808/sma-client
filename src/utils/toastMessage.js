import React from "react";
import toast from "react-hot-toast";

const TOAST_TYPES = {
  success: {
    icon: (
      <svg viewBox="0 0 20 20" fill="#22c55e" width="20" height="20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    style: {
      background: "#f0fdf4",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
  },
  error: {
    icon: (
      <svg viewBox="0 0 20 20" fill="#ef4444" width="20" height="20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
    ),
    style: {
      background: "#fef2f2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },
  },
  warning: {
    icon: "⚠️",
    style: {
      background: "#fffbeb",
      color: "#92400e",
      border: "1px solid #fde68a",
    },
  },
  info: {
    icon: "ℹ️",
    style: {
      background: "#eff6ff",
      color: "#1e40af",
      border: "1px solid #bfdbfe",
    },
  },
};

const DismissibleToast = ({ t, type, message }) => {
  const config = TOAST_TYPES[type];
  return (
    <div
      style={{
        ...config.style,
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "14px",
        fontFamily: "inherit",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "350px",
        opacity: t.visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {config.icon}
      </span>
      <span style={{ flex: 1, wordBreak: "break-word" }}>{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: "transparent",
          border: "none",
          padding: "2px 4px",
          cursor: "pointer",
          color: config.style.color,
          opacity: 0.6,
          flexShrink: 0,
          fontSize: "14px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.6)}
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
};

const createToast = (type) => (msg) =>
  toast.custom((t) => <DismissibleToast t={t} type={type} message={msg} />, {
    duration: 4000,
  });

const toastMessage = {
  success: createToast("success"),
  error: createToast("error"),
  warning: createToast("warning"),
  info: createToast("info"),
  loading: (msg) => toast.loading(msg),
};

export default toastMessage;
