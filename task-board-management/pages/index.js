import { useRouter } from "next/router";
import React from "react";

const Index = () => {
  //user will be redirected to the login page after entering the website
  const router = useRouter();
  if (typeof window !== "undefined") {
    router.push("/login");
  }

  return <div></div>;
};

export default Index;
