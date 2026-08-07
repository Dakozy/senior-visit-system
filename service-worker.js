/*
==========================================
Senior Care Visit Management System
Service Worker
Version 1.0
==========================================
*/

const CACHE_NAME = "senior-visits-v1";

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/style.css",

    "./js/app.js",

    "./images/logo.png",

    "./images/icons/icon-72x72.png",

    "./images/icons/icon-96x96.png",

    "./images/icons/icon-128x128.png",

    "./images/icons/icon-144x144.png",

    "./images/icons/icon-152x152.png",

    "./images/icons/icon-192x192.png",

    "./images/icons/icon-512x512.png"

];

//==============================
// INSTALL
//==============================

self.addEventListener("install", event => {

    console.log("Installing Service Worker...");

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(FILES_TO_CACHE);

        })

    );

    self.skipWaiting();

});

//==============================
// ACTIVATE
//==============================

self.addEventListener("activate", event => {

    console.log("Service Worker Activated");

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

//==============================
// FETCH
//==============================

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if(response){

                return response;

            }

            return fetch(event.request);

        })

    );

});
