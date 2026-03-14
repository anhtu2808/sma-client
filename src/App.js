import { RouterProvider } from 'react-router-dom';
import { routes } from '@/routes';
import { Toaster } from "react-hot-toast";
import { useNotificationSocket } from '@/hooks/useNotificationSocket';

function App() {
  useNotificationSocket();
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "transparent",
            boxShadow: "none"
          }
        }}
      />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;

