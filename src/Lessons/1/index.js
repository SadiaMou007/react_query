import React from "react";
import { useGithubUser } from "./fetchGithubUser";
import GeneralFetch from "./GeneralFetch";
import { Random } from "./reactQueryFetch";
import CheckStatus from "./practiceApi";
const Lesson1 = () => {
  const { data, isLoading, refetch, isFetching } = Random();
  const c = useGithubUser("SadiaMou007");

  return (
    <div className="app">
      <div className="app">
        <h2>General fetch</h2>
        <GeneralFetch />
      </div>
      <div className="app">
        <h2>Fetch using react query</h2>
        <button onClick={() => refetch()}>
          Click to refetch:{isLoading || isFetching ? "..." : data}
        </button>
      </div>
      <div className="app">
        <h2>Fetch github user data using react query</h2>
      </div>
      <div className="app">
        <h2>Practice query</h2>
        <CheckStatus />
      </div>
    </div>
  );
};

export default Lesson1;
