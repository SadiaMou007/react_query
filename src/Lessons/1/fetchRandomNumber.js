import { useQuery } from "@tanstack/react-query";

const fetchNumber = () => {
    return fetch(
      "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new"
    ).then((response) => {
      if (response.status !== 200) {
        throw new Error(`Something went wrong. Try again.`);
      }
      return response.json();
    });
  };

const useRandomNumber=()=>{
    const {data:data1,isLoading:isData1Loading,isFetching:isData1Fetching,refetch:refetchData1}= useQuery(['random'],fetchNumber)
    
    return {data1,isData1Loading,isData1Fetching,refetchData1}
}
 export {useRandomNumber}