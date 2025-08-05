let serverIP;
async function fetchIP() {
  try {
    const response = await fetch("/api/getIp");
    const data = await response.json();
    localStorage.setItem("currentIP", data.ip.trim());
    serverIP = data.ip.trim();
    console.log("SERVER IP:", serverIP);
    return data.ip;
  } catch (error) {
    throw new Error("There was an error fetching the IP: ", error);
  }
}
fetchIP();

// Verifica se o Service Worker é suportado e o registra
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/pwa/service-worker.js")
      .then(function (registration) {
        console.log(
          "Service-Worker registration successful with scope: ",
          registration.scope
        );
      })
      .catch(function (err) {
        console.error("Service-Worker registration failed: ", err);
      });
  });
}

// Evento para lidar com a tecla "Enter" no login
document.addEventListener("keypress", handleKeyPress);

// Evento para carregar o vídeo inicial
document.addEventListener("DOMContentLoaded", function () {
  const videoContainer = document.getElementById("videoContainer");

  if (videoContainer !== null) {
    try {
      videoContainer.style.display = "block";
      const video = document.createElement("video");
      video.src = "images/wfrtrans.mp4";
      video.autoplay = true;
      video.preload = "metadata";
      videoContainer.appendChild(video);

      setTimeout(function () {
        videoContainer.style.display = "none";
      }, 2500);
    } catch (error) {
      console.error("Erro ao tentar mostrar o contêiner do vídeo:", error);
    }
  } else {
    console.error("Elemento com ID 'videoContainer' não encontrado.");
  }
});

// Evento para logout
document.addEventListener("DOMContentLoaded", function () {
  try {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        fetch(`http://${serverIP}:16082/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              localStorage.removeItem("responseData");
              window.location.href = "index.html";
            } else {
              console.error("Failed to logout");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }
  } catch (error) {
    console.error("Botão não disponível.");
  }
});

// Variável global para instalação da PWA
let deferredPrompt;

// Evento para instalação da PWA
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPrompt();
});

// Função para mostrar prompt de instalação
function showInstallPrompt() {
  const installButton = document.getElementById("logo");
  if (installButton) {
    installButton.addEventListener("click", () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Usuário aceitou a instalação da PWA");
        } else {
          console.log("Usuário recusou a instalação da PWA");
        }
        deferredPrompt = null;
      });
    });
  }
}

// Botão flutuante para instalação manual
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement("button");
  installBtn.id = "installPWA";
  installBtn.textContent = "📲 Instalar App";
  installBtn.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999;
    padding: 10px 15px;
    background: #000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  document.body.appendChild(installBtn);

  installBtn.onclick = () => {
    e.prompt();
    e.userChoice.then(() => {
      installBtn.remove();
    });
  };
});

// Função para lidar com a tecla "Enter"
function handleKeyPress(event) {
  if (event.key === "Enter") {
    login();
  }
}

// Função de login
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = {
    username: username,
    password: password,
  };

  fetch(`http://${serverIP}:16082/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Login failed");
      }
    })
    .then((responseData) => {
      console.log("Response:", responseData);
      localStorage.setItem("responseData", JSON.stringify(responseData));
      playVideoAndRedirect(responseData);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed");
    });
}

// Função para reproduzir vídeo e redirecionar
function playVideoAndRedirect(data) {
  const videoContainer = document.getElementById("videoContainer");
  const video = document.createElement("video");
  video.src = "images/wfrpausa.mp4";
  video.autoplay = true;
  video.preload = "metadata";

  videoContainer.style.display = "block";
  videoContainer.appendChild(video);

  video.addEventListener("ended", function () {
    console.log("Vídeo terminado!");
    checkUserTypeAndRedirect();
  });

  function checkUserTypeAndRedirect() {
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    if (responseData) {
      if (
        responseData.usertype === "admin" ||
        responseData.usertype === "operator"
      ) {
        window.location.href = "/admin.html";
      } else {
        window.location.href = "/cliente.html";
      }
    }
  }

  setTimeout(checkUserTypeAndRedirect, 5000);
  video.play();
}
