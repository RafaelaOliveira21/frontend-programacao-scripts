import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import Router from "./routes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SnackbarProvider>
      <Router />
    </SnackbarProvider>
  </React.StrictMode>
);
