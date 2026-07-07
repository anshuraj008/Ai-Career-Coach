import React from "react";

const MainLayout = async ({ children }) => {
  return <div className="container mx-auto mt-24 mb-20 px-4 md:px-6">{children}</div>;
};

export default MainLayout;
