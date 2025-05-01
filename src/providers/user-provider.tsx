"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

interface UserContextType {
  userId: string;
  isLoaded: boolean;
}

const UserContext = createContext<UserContextType>({
  userId: "",
  isLoaded: false,
});

export const USER_ID_COOKIE = "katalon_bot_user_id";
const USER_ID_COOKIE_EXPIRY = 365; // days

export function UserProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [userId, setUserId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let existingUserId = Cookies.get(USER_ID_COOKIE);
    
    if (!existingUserId) {
      existingUserId = uuidv4();
      
      Cookies.set(USER_ID_COOKIE, existingUserId, { 
        expires: USER_ID_COOKIE_EXPIRY,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    }
    
    setUserId(existingUserId);
    setIsLoaded(true);
  }, []);

  return (
    <UserContext.Provider value={{ userId, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext); 