import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route index element={<Home />} />
            <Route path="ui-kit" element={<UiKit />} />
        </Route>
    )
);
