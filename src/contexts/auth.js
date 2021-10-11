import { useState, useEffect, createContext } from "react";
import firebase from "../services/FirebaseConnection.js";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorage() {
      const storageUser = localStorage.getItem("SistemaUser");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }

      setLoading(false);
    }

    loadStorage();
  }, []);

  async function signUp(email, password, nome) {
    setLoadingAuth(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .set({
            nome: nome,
            avatarUrl: null,
          })
          .then(() => {
            let data = {
              uid: uid,
              nome: nome,
              email: value.user.email,
              avatarUrl: null,
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem("SistemaUser", JSON.stringify(data));
  }

  return (
    //!! se "user" tiver algo dentro, retorna true
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
