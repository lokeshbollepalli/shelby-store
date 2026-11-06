import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const StoreContext=createContext(null);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
export function StoreProvider({children}){const [wishlist,setWishlist]=useState(()=>read('shelby-wishlist',[]));useEffect(()=>{localStorage.setItem('shelby-wishlist',JSON.stringify(wishlist));},[wishlist]);const toggleWishlist=id=>setWishlist(items=>items.includes(id)?items.filter(x=>x!==id):[...items,id]);const value=useMemo(()=>({wishlist,toggleWishlist}),[wishlist]);return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;}
export const useStore=()=>useContext(StoreContext);
