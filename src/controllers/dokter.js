const dokterModel = require('../models/dokter');
const helper = require('../helpers');
const { promiseMiddleware } = require('../middleware/promiseMidd');
const { customErrorApi } = require('../helpers/CustomError');

module.exports = {
  getAllDokter: promiseMiddleware(async (request, response, next) => {
    const result = await dokterModel.getAllDokter();
    return helper.response(response, 200, { message: 'Get All data Dokter berhasil' }, result);
  }),
  getDokterById: promiseMiddleware(async (request, response, next) => {
    const { id } = request.params;
    const result = await dokterModel.getDokterById(id);
    if (!result) {
      next(customErrorApi(404, 'Data Dokter tidak Ditemukan'));
    }
    return helper.response(response, 200, { message: 'Get data Dokter berhasil' }, result);
  }),

  postDokter: promiseMiddleware(async (request, response, next) => {
    const setData = request.body;
    const checkData = await dokterModel.getDokterById(setData.id_dokter);
    if (checkData) {
      next(customErrorApi(409, 'ID Dokter sudah digunakan'));
    }
    const result = await dokterModel.postDokter(setData);
    return helper.response(response, 201, { message: 'Post data Dokter berhasil' }, result);
  }),
  putDokter: promiseMiddleware(async (request, response, next) => {
    const setData = request.body;
    const { id } = request.params;
    const checkData = await dokterModel.getDokterById(id);
    if (!checkData) {
      next(customErrorApi(404, 'Data Dokter tidak Ditemukan'));
    }
    const result = await dokterModel.putDokter(id, setData);
    return helper.response(response, 200, { message: 'Put data Dokter berhasil' }, result);
  }),
  deleteDokter: promiseMiddleware(async (request, response, next) => {
    const { id } = request.params;
    const checkData = await dokterModel.getDokterById(id);
    if (!checkData) {
      next(customErrorApi(404, 'Data Dokter tidak Ditemukan'));
    }
    const result = await dokterModel.deleteDokter(id);
    return helper.response(response, 200, { message: 'Delete data Dokter berhasil' }, result);
  }),
};
