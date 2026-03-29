import { RouterProvider } from 'react-router-dom';
import { routes } from '@/routes';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';

function App() {
  useNotificationSocket();
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        theme="light"
        transition={Bounce}
        newestOnTop
        draggable
        pauseOnHover
        closeOnClick
      />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
