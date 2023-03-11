/* eslint-disable max-len */
const { nanoid } = require('nanoid');
const antrianModel = require('../models/antrian');
const praktekModel = require('../models/praktek');
const pasienModel = require('../models/pasien');
const helper = require('../helpers');

module.exports = {
  getAllAntrian: async (request, response) => {
    try {
      const result = await antrianModel.getAllAntrian();
      return helper.response(response, 200, { message: 'Get All data Antrian berhasil' }, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: 'Get All data Antrian gagal' });
    }
  },
  getAllAntrianByFilter: async (request, response) => {
    try {
      let sqlQuery = '';
      let count = 0;
      if (request.query.id_praktek || request.query.tanggal_periksa) {
        sqlQuery += 'WHERE ';
        if (request.query.id_praktek) {
          sqlQuery += count > 0 ? `AND id_praktek=${request.query.id_praktek}` : `id_praktek=${request.query.id_praktek} `;

          count += 1;
        }
        if (request.query.tanggal_periksa) {
          sqlQuery += count > 0 ? `AND tanggal_periksa='${request.query.tanggal_periksa}' ` : `tanggal_periksa='${request.query.tanggal_periksa}' `;
          count += 1;
        }
      }
      console.log(sqlQuery);
      const result = await antrianModel.getAntrianAvailableByFilter(sqlQuery);
      return helper.response(response, 200, { message: 'Get All data Antrian berhasil' }, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: 'Get All data Antrian gagal' });
    }
  },
  getAntrianByUserId: async (request, response) => {
    try {
      const result = await antrianModel.getAllAntrian();
      return helper.response(response, 200, { message: 'Get All data Antrian berhasil' }, result);
    } catch (error) {
      return helper.response(response, 500, { message: 'Get All data Antrian gagal' });
    }
  },
  getAntrianByNik: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await antrianModel.getAntrianByNik(id);
      return helper.response(response, 200, { message: 'Get All data Antrian berhasil' }, result);
    } catch (error) {
      return helper.response(response, 500, { message: 'Get All data Antrian gagal' });
    }
  },
  getAntrianById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await antrianModel.getAntrianById(id);
      if (!result) {
        return helper.response(response, 404, { message: 'Data Antrian tidak Ditemukan' });
      }
      return helper.response(response, 200, { message: 'Get data Antrian berhasil' }, result);
    } catch (error) {
      return helper.response(response, 500, { message: 'Get data Antrian gagal' });
    }
  },

  postAntrian: async (request, response) => {
    try {
      const setData = request.body;
      const { io, token } = request;

      // cek kuota daftar pada pasien pendaftar
      const checkPasien = await pasienModel.getPasienById(setData.nik);
      if (checkPasien.kuota_daftar < 1) {
        return helper.response(response, 403, { message: 'Pasien telah terdaftar pada antrian ' }, {});
      }

      const formattedDate = setData.tanggal_periksa.split('/').reverse().join('-');
      const lastData = await antrianModel.getAntrianSequentialByDate(formattedDate);
      setData.urutan = lastData.last_number + 1 || 1;

      const getPraktek = await praktekModel.getPraktekById(setData.id_praktek);
      const checkAntrian = await antrianModel.getAntrianAvailableByDate(setData.tanggal_periksa.split('/').reverse().join('-'), setData.id_praktek);

      // cek kuota antrian di poli tertentu dari praktek
      if (checkAntrian.length >= getPraktek.kuota_booking) {
        return helper.response(response, 403, { message: 'Kuota Pendaftaran pada tanggal yang dipilih habis ' }, {});
      }
      setData.nomor_antrian = `${getPraktek.kode_poli}-${setData.urutan}`;

      setData.status_hadir = 0;
      setData.status_antrian = 1;
      setData.request_tukar = 1;

      if (setData.tanggal_periksa === new Date().toLocaleDateString('ID')) setData.booking = 1;
      else setData.booking = 0;
      // setData.tgl_periksa = setData.tgl_periksa.split('/').reverse().join('-');
      let roleSumber;
      if (request.token.result.role === 1) {
        roleSumber = 'Admin';
      } else if (request.token.result.role === 2) {
        roleSumber = 'Petugas';
      } else {
        roleSumber = 'Pasien';
      }

      const setDataAntrian = {
        id_antrian: new Date().getTime() + Math.floor(Math.random() * 100),
        user_id: setData.user_id,
        id_praktek: setData.id_praktek,
        nik: setData.nik,
        nomor_antrian: setData.nomor_antrian,
        tanggal_periksa: setData.tanggal_periksa.split('/').reverse().join('-'),
        prioritas: setData.prioritas,
        urutan: setData.urutan,
        keluhan: setData.keluhan,
        bpjs: setData.bpjs,
        estimasi_waktu_pelayanan: 0,
        status_hadir: setData.status_hadir,
        status_antrian: setData.status_antrian,
        booking: setData.booking,
        sumber: `${setData.sumber}-${roleSumber}`,
        waktu_kehadiran: null,
        request_tukar: setData.request_tukar,
      };

      const result = await antrianModel.postAntrian(setDataAntrian);
      await pasienModel.putPasien(setData.nik, { kuota_daftar: 0 });
      if (result) {
        io.emit('server-addAntrian', { result });
      }
      return helper.response(response, 201, { message: 'Post data Antrian berhasil' }, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: 'Post data Antrian gagal' });
    }
  },
  putAntrian: async (request, response) => {
    try {
      const setData = request.body;
      const { id } = request.params;
      const checkData = await antrianModel.getAntrianById(id);
      if (!checkData) {
        return helper.response(response, 404, { message: 'Data Antrian tidak Ditemukan' });
      }
      const result = await antrianModel.putAntrian(id, setData);
      return helper.response(response, 200, { message: 'Put data Antrian berhasil' }, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: 'Put data Antrian gagal' });
    }
  },
  deleteAntrian: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await antrianModel.deleteAntrian(id);
      return helper.response(response, 200, { message: 'Delete data  Antrian berhasil' }, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: 'Delete data Antrian gagal' });
    }
  },
};
