const helper = require('../helpers');
const pasienModel = require('../models/pasien');
const kartuKeluargaModel = require('../models/kartuKeluarga');

module.exports = {
  getAllPasien: async (request, response) => {
    try {
      const result = await pasienModel.getAllPasien();
      // const newResult=result.map(item=> return{
      //   nik: item.nik,
      //   no_kk: item.no_kk,
      //   nama: item.nama,
      //   ttl: item.ttl,
      //   jenis_kelamin: item.jenis_kelamin,
      //   alamat: item.alamat,
      //   rt: item.rt,
      //   rw: item.rw,
      //   kelurahan: item.kelurahan,
      //   kecamatan: item.kecamatan,
      //   no_telepon: item.no_telepon,
      //   bpjs: item.bpjs,
      //   nomor_kartu_bpjs: item.nomor_kartu_bpjs,
      //   pekerjaan: item.pekerjaan,
      //   kuota_daftar: item.kuota_daftar,
      //   url_foto_kartu_identitas: item.url_foto_kartu_identitas,
      //   pendidikan_terakhir: item.pendidikan_terakhir,
      //   status_anggota_keluarga: item.status_anggota_kel,
      //   created_at: "2023-01-05T15:09:31.000Z",
      //   "updated_at": "2023-01-07T10:24:31.000Z",
      //   "no_rm": "13313131131",
      //   "kepala_keluarga": "add"
      // })
      helper.response(response, 200, { message: 'Get All Pasien Berhasil' }, result);
    } catch (error) {
      console.log(error);
      helper.response(response, 500, { message: 'Get All Pasien Gagal' });
    }
  },
  getPasienById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await pasienModel.getPasienById(id);
      if (!result) {
        return helper.response(response, 404, { message: 'Data Pasien tidak Ditemukan' });
      }
      return helper.response(response, 200, { message: 'Get data Pasien berhasil' }, result);
    } catch (error) {
      return helper.response(response, 500, { message: 'Get data Pasien gagal' });
    }
  },
  getAllPasienByNoRM: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await pasienModel.getAllPasienByNoRM(id);

      return helper.response(response, 200, { message: 'Get data Data Pasien berdasarkan NO RM berhasil' }, result);
    } catch (error) {
      return helper.response(response, 500, { message: 'Get data Data Pasien berdasarkan NO RM gagal' });
    }
  },
  getAllPasienByNoKK: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await pasienModel.getAllPasienByNoKK(id);

      return helper.response(response, 200, { message: 'Get data Data Pasien berdasarkan NO KK berhasil' }, result);
    } catch (error) {
      return helper.response(response, 500, { message: 'Get data Data Pasien berdasarkan NO KK gagal' });
    }
  },

  postPasien: async (request, response) => {
    try {
      const setData = request.body;
      const setDataKk = {
        no_kk: setData.no_kk,
        kepala_keluarga: setData.kepala_keluarga,
      };
      const setDataPasien = {
        nik: setData.nik,
        no_kk: setData.no_kk,
        nama: setData.nama,
        ttl: setData.ttl,
        jenis_kelamin: setData.jenis_kelamin,
        alamat: setData.alamat,
        rt: setData.rt,
        rw: setData.rw,
        kelurahan: setData.kelurahan,
        kecamatan: setData.kecamatan,
        no_telepon: setData.no_telepon,
        bpjs: setData.bpjs,
        nomor_kartu_bpjs: setData.nomor_kartu_bpjs ? setData.nomor_kartu_bpjs : '',
        pekerjaan: setData.pekerjaan,
        kuota_daftar: setData.kuota_daftar,
        url_foto_kartu_identitas: setData.url_foto_kartu_identitas ? setData.url_foto_kartu_identitas : '',
        pendidikan_terakhir: setData.pendidikan_terakhir,
        status_anggota_keluarga: setData.status_anggota_keluarga,
      };

      // console.log(setData);
      // setData.kuota_daftar = 1;

      const checkNoKK = kartuKeluargaModel.getnoKKByID(setData.no_kk);
      if (!checkNoKK) {
        await kartuKeluargaModel.postKartuKeluarga(setDataKk);
      } else {
        await kartuKeluargaModel.putKartuKeluarga(
          setData.no_kk,
          { kepala_keluarga: setDataKk.kepala_keluarga },
        );
      }

      const result = await pasienModel.postPasien(setDataPasien);
      return helper.response(response, 201, { message: 'Post data Pasien berhasil' }, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: 'Post data Pasien gagal' });
    }
  },
  putPasien: async (request, response) => {
    try {
      const { id } = request.params;
      const setData = request.body;
      const setDataKk = {
        no_kk: setData.no_kk,
        kepala_keluarga: setData.kepala_keluarga,
      };
      const setDataPasien = {
        no_kk: setData.no_kk,
        nama: setData.nama,
        ttl: setData.ttl,
        jenis_kelamin: setData.jenis_kelamin,
        alamat: setData.alamat,
        rt: setData.rt,
        rw: setData.rw,
        kelurahan: setData.kelurahan,
        kecamatan: setData.kecamatan,
        no_telepon: setData.no_telepon,
        bpjs: setData.bpjs,
        nomor_kartu_bpjs: setData.nomor_kartu_bpjs ? setData.nomor_kartu_bpjs : '',
        pekerjaan: setData.pekerjaan,
        kuota_daftar: setData.kuota_daftar,
        url_foto_kartu_identitas: setData.url_foto_kartu_identitas ? setData.url_foto_kartu_identitas : '',
        pendidikan_terakhir: setData.pendidikan_terakhir,
        status_anggota_keluarga: setData.status_anggota_keluarga,
      };

      // console.log(setData);
      // setData.kuota_daftar = 1;

      const checkNoKK = kartuKeluargaModel.getnoKKByID(setData.no_kk);
      if (!checkNoKK) {
        await kartuKeluargaModel.postKartuKeluarga(setDataKk);
      } else {
        await kartuKeluargaModel.putKartuKeluarga(
          setData.no_kk,
          { kepala_keluarga: setDataKk.kepala_keluarga },
        );
      }

      const result = await pasienModel.putPasien(id, setDataPasien);
      return helper.response(response, 200, { message: 'Put data Pasien berhasil' }, result);
    } catch (error) {
      return helper.response(response, 500, { message: 'Put data Pasien gagal' });
    }
  },
  putKartuIdentitasPasien: async (request, response) => {
    try {
      const { id } = request.params;
      const setData = request.body;

      const result = await pasienModel.putPasien(id, setData);
      return helper.response(response, 200, { message: 'Put data Pasien berhasil' }, result);
    } catch (error) {
      return helper.response(response, 500, { message: 'Put data Pasien gagal' });
    }
  },
  deletePasien: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await pasienModel.deletePasien(id);
      return helper.response(response, 200, { message: 'Delete data Pasien berhasil' }, result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 500, { message: `Delete data Pasien gagal, ${error.message}` });
    }
  },
};
