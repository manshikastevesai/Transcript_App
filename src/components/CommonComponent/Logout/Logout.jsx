import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import Loading from "../Loading/Loading";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoading } = useAppContext();

  useEffect(() => {
    const handleLogout = () => {
      setIsLoading(true);
      localStorage.removeItem("credentials");
      setUser(null);
      //   setTimeout(() => {
      //     setIsLoading(false);
      //     navigate("/", { replace: true });
      //   }, 500);
    };

    handleLogout();
  }, [navigate, setUser, setIsLoading]);

  return <Loading />;
};

export default Logout;
