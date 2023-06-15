import { url } from "../utils";
import RestClient from "../utils/RestClient"

const getAllPlacements = () => RestClient.Get(`${url}placement`);

const Create = (formData) => RestClient.Post(`${url}placement`, formData);

const getPlacements = (id) => RestClient.Get(`${url}placement?orgId=${id}`);

const getPlacementById = (id) => RestClient.Get(`${url}placement?Id=${id}`);

const getAllCandidates = (id) => RestClient.Get(`${url}placement?placementOrg=${id}`);

const removePlacement = (id) => RestClient.Delete(`${url}placement?placementId=${id}`);

const getCandidateById = (id) => RestClient.Get(`${url}placement?candidatePlacementId=${id}`);

const addCandidates = (id, data) => RestClient.Put(`${url}placement?placementId=${id}`, data);

const updatePlacement = (id, data) => RestClient.Put(`${url}placement?placementId=${id}`, data);

const removeCandidate = (id, data) => RestClient.Put(`${url}placement?placementId=${id}`, data);

const updateCandidateStatus = (id, data) => RestClient.Put(`${url}placement?candidatePlacementId=${id}`, data);

const updateHiringStatus = (id, status, data) => RestClient.Put(`${url}placement?hiringId=${id}&status=${status}`, data);

const getPlacementsByCandidateId = (id, accessLevel) => RestClient.Get(`${url}placement?candidateId=${id}&accessLevel=${accessLevel}`);


export default { Create, getPlacements, removePlacement, getPlacementById, getAllCandidates, getAllPlacements, updatePlacement, removeCandidate, addCandidates, updateCandidateStatus, getCandidateById, updateHiringStatus, getPlacementsByCandidateId };