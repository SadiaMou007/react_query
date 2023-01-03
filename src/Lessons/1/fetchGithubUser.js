import { useQuery } from "@tanstack/react-query";

const fetchUser = (userName) => {
  const api = `https://api.github.com/users/${userName}`;
  return fetch(api).then((res) => {
    res.json();
  });
};
const useGithubUser = (userName) => {
  const data = useQuery([userName], () => () => fetchUser(userName));
  if (data.isLoading) console.log("loading");
  if (data.isError) console.log(data.error.message, data);
  if (data.isSuccess) console.log(data);
};
export { useGithubUser };
