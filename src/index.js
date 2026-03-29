import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import store, { persistor } from "./store";
import "./index.css";
import App from "./App";

config.autoAddCss = false;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="655715793583-tsavpaijv2vm9374q2g1ml43i9heugq7.apps.googleusercontent.com">
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </GoogleOAuthProvider>
  </Provider>,
);
