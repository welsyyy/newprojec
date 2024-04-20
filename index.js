/*
App
processing - options
pages
modules
components
widjets - options
asset - options
atom
*/

//Подключаем нативный модуль
const http = require('http');

//Подключаем модуль файловой системы
const fs = require('fs');
const path = require('path');
const express = require('express');
const { default: App } = require('./front/src/App');

const PORT = 8084;

//Myme Type
const mymeType = {
    '.html' : 'text/html',
    '.tmpl' : 'text/html',
    '.js' : 'text/javascript',
    '.png' : 'image/png', //jpg, jpeg
    '.jpg' : 'image/jpg', //jpeg
    '.svg' : 'image/svg+xml',
    '.woff' : 'application/font-woff', //ttf
    '.eot' : 'application/vnd.ms-fontobject'
}

const staticFile = (res, filePath, ext = '.html') => {
    let params = {};
    if(mymeType[ext].match('text/')) {
        params = {encoding: 'utf8', flag: 'r'};
    }

    fs.readFile('.' + filePath, params, (err, data) => {
        if(err) {
            console.log(err);
            res.statusCode = 404;
            res.end();
        }

        res.setHeader('Content-Type', mymeType[ext]);
        res.end(data);
    });
}

const server = http.createServer(function(req, res) { //req - request, res - response
    console.log('Server request');

    //mechanism
    const createPath = (page) => path.resolve(__dirname, 'views', `${page}.html`);

    let basePath = '';
    const url = req.url;

    switch(url) {
        case '/':
            basePath = '/index.html';
        break;

        case '/index.html':
            res.statusCode = 301; //Контролируемый редирект
            res.setHeader('Location', '/');
        break;

        case '/brands/':
            basePath = createPath('brands');
        break;

        default:
            const extname = String(path.extname(url)).toLowerCase();
            if(extname in mymeType) {
                staticFile(res, url, extname);
            }
            else {
                basePath = createPath('404');
                res.statusCode = 404;
                res.end();
            }
        break;
    }

    if(basePath != '') {
        staticFile(res, basePath);
    }

});

server.listen(PORT, "localhost", function(err) {
    (err) ? console.log(err) : console.log('Server listen');
});