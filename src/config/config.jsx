import axios from "axios";

export const url = "http://localhost:8080";
export const reactUrl = "http://localhost:5173";

export const myAxios = (token, setToken) => {
   var instance = axios.create({
      baseURL : url,
      timeout:5000,
   })

   instance.interceptors.response.use(
      (response) => {
         if(response.headers.authorization) {
            setToken(response.headers.authorization)
         }
         return response;
      }
      ,
      (error) => {
         if (error.response && error.response.status) {
            switch (error.response.status) {
               case 401: 
               case 403:
                     window.location.href=`${reactUrl}/login`;  break;
               default:
               return Promise.reject(error);
            }
         }
         return Promise.reject(error);
      }
   );

   token && instance.interceptors.request.use((config)=>{
    config.headers.Authorization = token;
    return config;
   });

   return instance;
}