const express = require('express');

const Route = express.Router();

const pasienController = require('../controllers/pasien');
const { authentication, authorization } = require('../middleware/auth');

Route
  .get('/', authentication, pasienController.getAllPasien)
  .get('/:id', authentication, pasienController.getPasienById)
  .get('/rekam-medis/:id', authentication, pasienController.getAllPasienByNoRM)
  .get('/kartu-keluarga/:id', authentication, pasienController.getAllPasienByNoKK)
  .post('/', authentication, pasienController.postPasien)
  .put('/:id', authentication, pasienController.putPasien)
  .put('/kartu-identitas/:id', authentication, pasienController.putKartuIdentitasPasien)
  .delete('/:id', authentication, authorization, pasienController.deletePasien);

module.exports = Route;
