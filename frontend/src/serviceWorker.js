// src/serviceWorker.js

// Este archivo se creó con create-react-app
// https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] es la dirección IPv6 de localhost.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 son considerados localhost para IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // El URL constructor se usa para asegurar que los URLs de nuestro service worker están
      // localizados en el mismo origen que nuestra página web.
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        // Nuestro service worker no funcionará si PUBLIC_URL está en un origen diferente
        // del que nuestra página web. Esto podría ocurrir si un CDN se está usando para
        // servir assets; ver https://github.com/facebook/create-react-app/issues/2374
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // Esto corre adicionalmente chequeos en localhost. Esto aseguran que un service worker
          // aún es útil en el modo de desarrollo, y para ayudar a depurar problemas.
          checkValidServiceWorker(swUrl, config);
  
          // Añadir algunos logs adicionales al localhost, apuntando a los desarrolladores
          // a la documentación de service worker/PWA.
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'Esta aplicación está siendo servida cache-first por un service worker. ' +
                'Para más información, visita https://bit.ly/CRA-PWA'
            );
          });
        } else {
          // Solo registrar el service worker en producción
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // En este punto, el contenido previamente cacheado se ha actualizado,
                // pero el service worker anterior seguirá sirviendo el contenido viejo
                // hasta que todas las pestañas del cliente sean cerradas.
                console.log(
                  'Nuevo contenido está disponible y será usado cuando ' +
                    'todas las pestañas para esta página sean cerradas.'
                );
  
                // Ejecutar callback
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // En este punto, todo está cacheado.
                // Es el momento perfecto para mostrar
                // una notificación "Content is cached for offline use".
                console.log('Contenido está cacheado para su uso offline.');
  
                // Ejecutar callback
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Error durante el registro del service worker:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Verificar si el service worker puede ser encontrado. Si no puede recargar la página.
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' }
    })
      .then((response) => {
        // Asegurar que el service worker existe, y que realmente estamos obteniendo un archivo JS.
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // No se encontró ningún service worker. Probablemente una app diferente. Recargar la página.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Service worker encontrado. Proceder normalmente.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log(
          'No se pudo conectar a Internet. La aplicación se está ejecutando en modo offline.'
        );
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }
  