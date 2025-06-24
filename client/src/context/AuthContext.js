import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: {
    _id: "67ebf4ea072fb241020181f1",
    username: "I1Kazma",
    email: "I1Kazma@gmail.com",
    profilePicture: "",
    coverPicture: "",
    followers: ["67ebf576072fb241020181f3", "67ebb815ead556775c7213df"],
    isAdmin: false,
    createdAt: { $date: { $numberLong: "1743516906583" } },
    updatedAt: { $date: { $numberLong: "1750763142498" } },
    __v: { $numberInt: "0" },
    desc: "hey update",
    city: "Kaliningrad\n",
    from: "Tver",
    relationship: "2",
    followings: [
      "6858129e6ba210d7ce90bbbe",
      "67ebb0d064eefe7e8b1cf9fe",
      "6858129e6ba210d7ce90bbbe",
    ],
  },
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
