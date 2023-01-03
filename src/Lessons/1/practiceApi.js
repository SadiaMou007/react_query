import * as React from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * url `https://ui.dev/api/courses/react-query/status`
 */
const fetchStatus = () => {
  const api = `https://ui.dev/api/courses/react-query/status`;
  return fetch(api).then((res) => res.json());
};

function APIStatus() {
  const data = useQuery(["key"], fetchStatus);
  if (data.isLoading) return "Loading...";
  if (data.isError) return data.error.message;
  return (
    <h2>
      <pre>{JSON.stringify(data.data.status)}</pre>
    </h2>
  );
}

export default function CheckStatus() {
  return <APIStatus />;
}
