import axios from "../axios";

const filterSpecialties = (data) => {
  return axios.post("/api/filter-specialties", data);
};

//filter en
const filterSpecialtiesEn = (data) => {
  return axios.post("/api/filter-specialtiesEn", data);
};

const udateSpecialtyData = (data) => {
  return axios.post("/api/edit-specialty", data);
};

const getDetailSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=ALL`
  );
};

const deleteSpecialty = (data) => {
  return axios.get(
    `/api/delete-specialty?id=${data.id}`
  );
};


export {
  filterSpecialties,
  udateSpecialtyData,
  getDetailSpecialtyById,
  deleteSpecialty, filterSpecialtiesEn
};
