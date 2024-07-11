import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { todoApi } from "./features/api/todoApi";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <ApiProvider api={todoApi}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
);
