import React, { createContext, useEffect, useState, ReactNode } from "react";

interface UserContextType {
  user: string;
  logout: () => void;
  login: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext<UserContextType>({
  user: "",
  logout: () => {},
  login: () => {},
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

  const login = () => {
    const storedUser = localStorage.getItem("userAuth");
    setUserAuth(storedUser!);
  };

  return (
    <userContext.Provider value={{ user: userAuth, logout, login }}>
      {children}
    </userContext.Provider>
  );
};
