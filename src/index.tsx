import React from "react";
import ReactDOM, { Container } from "react-dom/client";
import App from "./App";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";


const root = ReactDOM.createRoot(document.getElementById("root") as Container);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
