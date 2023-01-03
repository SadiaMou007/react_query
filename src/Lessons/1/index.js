import React from "react";
import GeneralFetch from "./GeneralFetch";
import { Random } from "./reactQueryFetch";
const Lesson1 = () => {
  const { data, isLoading, isFetching, refetch } = Random();
  return (
    <div className="app">
      <div className="app">
        <h2>General fetch</h2>
        <GeneralFetch />
      </div>
      <div className="app">
        <h2>Fetch using react query</h2>
        <button onClick={() => refetch()}>
          Click to refetch:
          {isLoading || isFetching ? "..." : data}
        </button>
      </div>
    </div>
  );
};

export default Lesson1;
