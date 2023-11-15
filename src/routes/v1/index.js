const express = require('express');

const docsRoute = require('./docs.route');
const paymentSplitterRoute = require('./paymentSplitter.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/docs',
        route: docsRoute,
    },
    {
        path: '/split-payments',
        route: paymentSplitterRoute ,
    },
];

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRoute,
    },
    {
        path: '/split-payments',
        route: paymentSplitterRoute ,
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

if (process.env.NODE_ENV === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

module.exports = router;