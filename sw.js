/*
=====================================
スタッフ売上管理 PWA
Service Worker
=====================================
*/

const CACHE_NAME =
"sales-app-v1";

const urlsToCache = [

    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"

];

/*
=====================================
インストール
=====================================
*/

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(cache => {

                return cache.addAll(
                    urlsToCache
                );

            })
        );
    }
);

/*
=====================================
有効化
=====================================
*/

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if(
                            key !==
                            CACHE_NAME
                        ){

                            return caches.delete(
                                key
                            );
                        }

                    })
                );
            })
        );
    }
);

/*
=====================================
キャッシュ優先
=====================================
*/

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
    }
);