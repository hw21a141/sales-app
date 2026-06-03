/* ==================================
   Staff Sales v2
   Service Worker
================================== */

const CACHE_NAME =
"staff-sales-v2";

const FILES_TO_CACHE = [

    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"

];

/* ==================================
   インストール
================================== */

self.addEventListener(
"install",
event => {

    event.waitUntil(

        caches.open(
            CACHE_NAME
        )
        .then(cache => {

            return cache.addAll(
                FILES_TO_CACHE
            );

        })

    );

    self.skipWaiting();
});

/* ==================================
   有効化
================================== */

self.addEventListener(
"activate",
event => {

    event.waitUntil(

        caches.keys()
        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(
                        key !== CACHE_NAME
                    ){

                        return caches.delete(
                            key
                        );
                    }

                })

            );

        })

    );

    self.clients.claim();
});

/* ==================================
   キャッシュ優先
================================== */

self.addEventListener(
"fetch",
event => {

    event.respondWith(

        caches.match(
            event.request
        )

        .then(response => {

            if(response){
                return response;
            }

            return fetch(
                event.request
            );
        })

    );
});