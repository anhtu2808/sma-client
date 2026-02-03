import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Jobs from '@/pages/jobs';

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="ui-kit" element={<UiKit />} />
                <Route path="jobs" element={<Jobs />} />
            </Route>
        </>
    )
);
