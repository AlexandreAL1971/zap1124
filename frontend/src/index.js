import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as serviceWorker from './service-worker';

import App from "./App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Certifique-se de importar o estilo do Toastify

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline>
      <App />
      <ToastContainer />
    </CssBaseline>
  </React.StrictMode>,
  document.getElementById("root")
);

// Registrar o Service Worker com notificação sobre atualizações
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    serviceWorker.register({
      onUpdate: registration => {
        // Notificar o usuário sobre a nova versão disponível
        toast.info(
          "Nova versão disponível! Clique aqui para atualizar.", 
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false,
            onClick: () => {
              if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload(); // Atualizar a página
              }
            },
          }
        );
      },
    });
  });
}
