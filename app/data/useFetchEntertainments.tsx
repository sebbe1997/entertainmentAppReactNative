import { useEffect } from "react";
import * as SQLite from 'expo-sqlite';
interface entertainmentprops
{
    id?:String
    flat?:boolean
    amount?:number
}
// do all db actionsHere
export default function useGetEntertainments({id,flat,amount}: entertainmentprops){
    const db = SQLite.openDatabaseAsync(""); // get 
    const data = {id:"1",flat:true,amount:10} as entertainmentprops
    
    return ()=> data;
}