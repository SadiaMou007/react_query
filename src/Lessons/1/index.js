import React from "react";
import { useGithubUser } from "./fetchGithubUser";
import GeneralFetch from "./GeneralFetch";
import CheckStatus from "./practiceApi";
import { useRandomNumber } from "./fetchRandomNumber";

const Lesson1 = () => {

  const {data1,isData1Fetching,isData1Loading,refetchData1}=useRandomNumber()

  const c = useGithubUser("SadiaMou007");

  return (
    <div className="app">
      <div className="app">
        <h2>General fetch</h2>
        <GeneralFetch />
      </div>
      <div className="app">
        <h2>Fetch using react query</h2>
        <button onClick={() => refetchData1()}>
          Click to refetch:{isData1Fetching || isData1Loading ? "..." : data1}
        </button>
      </div>
      
      <div className="app">
        <h2>Practice query</h2>
        <CheckStatus />
      </div>
    </div>
  );
};

export default Lesson1;
