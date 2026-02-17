import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import store from "./redux/store.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{
            zIndex: 100000,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#256B22",
              color: "#fff",
              fontFamily: "Poppins",
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
