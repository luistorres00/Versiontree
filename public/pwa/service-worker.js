const CACHE_NAME = 'wfr-app-v1'; 
const ASSETS_TO_CACHE = [
  // Páginas HTML
  '/',
  '/index.html',
  '/admin.html',
  '/cliente.html',

  // CSS (apenas os essenciais)
  '/cssS/cs.css',
  '/cssS/cssCliente.css',

  // JavaScript
  '/JSs/scriptslogin.js',
  '/JSs/script.js',

  // Imagens críticas
  '/images/login.png',
  '/images/wfrLogo.jpg',
  '/pwa/manifest.json'
];

// Fallback HTML embutido
const OFFLINE_FALLBACK = `
<!DOCTYPE html>
<html>
<head>
    <title>WFR Offline</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 2rem;
            background-color: #f5f5f5;
        }
        h1 { color: #333; }
        button { 
            padding: 10px 20px; 
            background: #0066cc; 
            color: white; 
            border: none; 
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Você está offline</h1>
    <p>A aplicação WFR requer conexão à internet.</p>
    <button onclick="window.location.reload()">Tentar novamente</button>
</body>
</html>
`;

// Instalação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Ativação
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de Fetch
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET
  if (event.request.method !== 'GET') return;

  // Páginas HTML (Network First com fallback embutido)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .catch(() => new Response(OFFLINE_FALLBACK, {
          headers: { 'Content-Type': 'text/html' }
        }))
    );
  } 
  // Demais assets (Cache First)
  else {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
)}
})