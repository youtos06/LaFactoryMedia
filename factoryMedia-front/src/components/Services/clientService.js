import http from '../Services/httpService';
import config from '../../config.json';

export  function allClients(){
    return http.get(config.ApiBackend + "/clients");  
}

export function getClient(_id){
    return http.get(config.ApiBackend+"/clients/"+_id)
}
export function deleteClient(_id){
    return http.delete(config.ApiBackend+"/clients/"+_id)
}