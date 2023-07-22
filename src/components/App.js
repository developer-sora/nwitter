import React, { useEffect, useState } from "react";
import AppRouters from "components/Router";
import { authService } from "myFirebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouters isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initializing"
      )}
    </>
  );
}

export default App;
