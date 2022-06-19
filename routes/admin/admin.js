var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel');
var novedadesModel = require('../../models/novedadesModel');


router.get('/', function (req, res, next) {
    res.render('admin/novedades', {
        layout:'admin/layout'
    });
});


module.exports = router;