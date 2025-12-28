import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { UserTypes } from "../../interface/interfaces";

interface PendindRequest {
    resolve:(response:any)=>void;
    reject:(error:unknown)=>void;
}

export default function useAuthFetch(path:UserTypes){

    let isRefreshing= false;
    let refreshPromise:Promise<number>|null=null;
    
    const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const authFetch = async (url:string, options?:RequestInit):Promise<Response> =>{
        let response = await fetch(url, {...options, credentials: "include"});

        if(response.status == 403){
            if(!isRefreshing){
                isRefreshing = true;
                refreshPromise = refresh()
            }

            const refreshStatus = await refreshPromise;

            isRefreshing=false;
            refreshPromise=null;

            if(refreshStatus==200){
                response = await fetch(url, {...options, credentials: "include"});
            }
        }
        return response;
    }

    const API = ()=>{
        let isRefreshing = false
        let requestQueue:PendindRequest[] = []

        const instance = axios.create({
            baseURL: `${ApiBaseUrl}/${path}`,
            timeout: 2500,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })


        const processQueue = (error:unknown)=>{
            requestQueue.forEach((p)=>{
                if(error)
                    p.reject(error)
                else
                    p.resolve(error)
            })
            requestQueue = []
        }


        instance.interceptors.response.use((response)=>response, async (error:AxiosError)=>{

            const originalRequest = error.config as AxiosRequestConfig & {_retry?:boolean}

            if(error.response?.status !==403){
                return Promise.reject(error)
            }

            if(error.config?.url?.includes("/auth/refresh")){
                return Promise.reject(error)
            }

            if(originalRequest._retry)
                return Promise.reject(error)

            if(isRefreshing){
                return new Promise<AxiosResponse>((resolve, reject)=>{
                    requestQueue.push({resolve, reject})
                })
                .then(()=>instance(originalRequest))
                .catch((err)=>Promise.reject(err))
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try{
                await instance.get("/auth/refresh", {
                    baseURL: ApiBaseUrl,
                    withCredentials:true
                })

                processQueue(null)
                
                return instance(originalRequest)
            }catch(refreshErr){
                processQueue(refreshErr)
                return Promise.reject(refreshErr)
            }finally{
                isRefreshing = false;
            }
        })

        return instance
    }

    const refresh = async ():Promise<number>=>{
        return 10;
    }
    return {authFetch, API};
}