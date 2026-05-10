import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Router from "./Router";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    sessionStorage.setItem("lastVisitedPage", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const goOfflinePage = () => {
      if (window.location.pathname !== "/offline.html") {
        window.location.href = "/offline.html";
      }
    };

    const goHomePage = () => {
      if (window.location.pathname === "/offline.html") {
        window.location.href = "/";
      }
    };

    window.addEventListener("offline", goOfflinePage);

    if (!navigator.onLine) {
      goOfflinePage();
    }

    return () => {
      window.removeEventListener("offline", goOfflinePage);
      window.removeEventListener("online", goHomePage);
    };
  }, []);

  return <Router />;
}

export default App;
