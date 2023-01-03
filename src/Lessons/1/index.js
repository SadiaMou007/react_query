import React from "react";
import GeneralFetch from "./GeneralFetch";
import { ReactQueryFetch } from "./reactQueryFetch";
const Lesson1 = () => {
  return (
    <>
      <div className="app">
        <GeneralFetch />
      </div>
      <div className="app">
        {" "}
        <ReactQueryFetch />
      </div>
    </>
  );
};

export default Lesson1;
