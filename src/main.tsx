/* eslint-disable @typescript-eslint/naming-convention */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";

import "./i18n";

import "./styles/reset.css";
import "./styles/index.css";
import "./styles/button.css";

import App from "./App";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
