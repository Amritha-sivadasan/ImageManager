import React, { createContext, useEffect, useState, ReactNode } from "react";

interface UserContextType {
  user: string;
  logout: () => void;
  login: () => void;
  signup:()=>void
}

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext<UserContextType>({
  user: "",
  logout: () => {},
  login: () => {},
  signup:()=>{}
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [userAuth, setUserAuth] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userAuth");
    if (storedUser) {
      setUserAuth(storedUser);
    }
  }, []);

  const logout = () => {
    setUserAuth("");
    localStorage.clear();
  };
  const signup=()=>{
    const storedUser = localStorage.getItem("userAuth");
    setUserAuth(storedUser!);
  }

  const login = () => {
    const storedUser = localStorage.getItem("userAuth");
    setUserAuth(storedUser!);
  };

  return (
    <userContext.Provider value={{ user: userAuth, logout, login,signup }}>
      {children}
    </userContext.Provider>
  );
};
