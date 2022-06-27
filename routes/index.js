var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel');
var cloudinary = require('cloudinary').v2;

/* GET home page. */

router.get('/', async function (req, res, next) {

  var novedades = await novedadesModel.getNovedades();

  novedades = novedades.splice(0, 5);
  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      const cuerpo = () => {
        if(novedad.cuerpo.toString().length >= 200) {
          return novedad.cuerpo.toString().substring(0, 200) + "..."
        }
        return novedad.cuerpo;
      };
      return {
        ...novedad,
        cuerpo,
        imagen
      }
    } else {
      return {
        ...novedad,
        imagen: '/images/cancel.png'
      }
    }
  });

  res.render('index', {
    novedades
  });
});



router.post('/', async (req, res, next) => {

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var correo = req.body.correo;
  var mensaje = req.body.mensaje;

  console.log(req.body)

  var obj = {
    to: 'manu.1605.98@gmail.com',
    subject: 'Contacto desde la Web Game Zone',
    html: nombre + " " + apellido + " se contacto a traves de la casilla de consultas y quiere mas informacion a este correo: " + correo + ". <br> Ademas, hizo el siguiente comentario: " + mensaje
  }

  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  var info = await transporter.sendMail(obj);

  res.render('index', {
  message: 'Mensaje enviado correctamente',
  });
});

module.exports= router