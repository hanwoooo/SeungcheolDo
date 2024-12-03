import React, { useEffect, useState } from "react";
import MainDrawerNavigator from "../drawer/MainDrawerNavigator";
import AuthStackNavigator from "../stack/AuthStackNavigator";
import useAuth from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/AuthContext";

function RootNavigator() {
  const { isLogin } = useAuthContext();

  return (
    <>
      {isLogin ? <MainDrawerNavigator /> : <AuthStackNavigator />}
    </>
  );
}

export default RootNavigator;
