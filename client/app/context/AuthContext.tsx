"use client";

import { createContext, useContext, useReducer } from "react";

type AuthState = {
  _id: string;
  f_name: string;
  l_name: string | null;
  username: string;
  email: string;
};

type AuthAction = {
  type: string;
  payload: AuthState;
};

type AuthContextType = {
  state: { user: AuthState | null };
  dispatch: React.Dispatch<AuthAction>;
};

export const AuthContext = createContext<AuthContextType>({
  state: { user: null },
  dispatch: () => {},
});

const reducer = (state: {user: AuthState | null}, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, { user: null });

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }

  return context;
}
