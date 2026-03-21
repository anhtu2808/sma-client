import { RouterProvider } from 'react-router-dom';
import { routes } from '@/routes';
import { Toaster } from "react-hot-toast";
import { useNotificationSocket } from '@/hooks/useNotificationSocket';

function App() {
  useNotificationSocket();
  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          style: {
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
            fontFamily: "inherit",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#f0fdf4",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fef2f2",
            },
          },
        }}
      />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;

