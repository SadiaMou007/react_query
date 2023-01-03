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
const Random = () => {
  const query = useQuery(["random"], fetchNumber);

  if (query.isError) return <p>{query.error.message}</p>;

  return query;
};
export { Random };
