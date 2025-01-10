// Gerenciamento de atualização e cache
const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/path/to/icon.png',
  '/path/to/badge.png',
];

// Instalação do Service Worker (cache inicial)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache criado com sucesso.');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação do Service Worker (limpeza de caches antigos)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições (resposta com cache ou rede)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Função para exibir notificações recebidas via `postMessage` ou `push`
function showNotification(data) {
  const options = {
    body: data.body || 'Você recebeu uma nova mensagem.',
    icon: data.icon || '/path/to/icon.png',
    badge: data.badge || '/path/to/badge.png',
    data: data.url || '/',
  };

  self.registration.showNotification(data.title || 'Nova Notificação', options);
}

// Escuta eventos de notificações disparadas pelo frontend via postMessage
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    showNotification(event.data.payload);
  }
});

// Escuta eventos de notificações push
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  showNotification(data);
});

// Gerencia cliques em notificações
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Fecha a notificação
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus(); // Foca na aba existente, se houver
      }
      return clients.openWindow(event.notification.data); // Abre nova aba, se necessário
    })
  );
});

// Função de atualização do Service Worker
self.addEventListener('updatefound', event => {
  const installingWorker = self.registration.installing;
  installingWorker.onstatechange = () => {
    if (installingWorker.state === 'installed') {
      console.log('Novo conteúdo disponível; atualize a página para usar.');
    }
  };
});
