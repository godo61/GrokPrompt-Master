const CACHE_NAME = 'grokprompt-v1';

self.addEventListener('install', (event) => {
  console.log('SW: Instalado');
});

self.addEventListener('fetch', (event) => {
  // Estrategia: Ir a la red por defecto
  event.respondWith(fetch(event.request));
});