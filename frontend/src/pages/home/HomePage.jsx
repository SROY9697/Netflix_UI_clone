import React from "react";
import HomeScreen from "./HomeScreen";
import AuthScreen from "./AuthScreen";
import { useAuthStore } from "../../store/authUser";

const HomePage = () => {
  const { user } = useAuthStore();
  console.log(user);

  return <div>{user ? <HomeScreen /> : <AuthScreen />}</div>;
};

export default HomePage;
