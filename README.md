# React Query

## 1 Getting Started

Client data could be stored using - useState, useReducer hook or third party state management library like redux or mobx.Redux or MobX work fine, but they often introduce more problems by treating server state the same as client state and using a global store.

### Client State:

- Ephemeral - It goes away when the browser is closed.
- Synchronous - It's instantly available.
- Client owned - Stayed in the browser that creates it.

### Server State:

- Stored remotely - The client has no control over what is stored or how it is stored.
  Asynchronous
- It takes a bit of time for the data to come from the server to the client(network request: send - process - response back).
- Owned by many users - Multiple users could change the data.

### How React Query Solves Server State.

- Import the useQuery hook to make request
- Include a unique key to identify this query
- Access query.isError, query.error.message, query.isLoading, query.isFetching, and query.data to get the state of our request
- Call the refetch method on the query object to get new data

## Installation and setup

1.  Install: npm install @tanstack/react-query
2.  Import: import { useQuery } from "@tanstack/react-query"
3.  Setup index.js:

- import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
- const queryClient = new QueryClient();
- Wrap <app/> by QueryClientProvider with client={queryClient} prop

  ` <QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>`

### Terms:

- QueryClient: keeps query `cache`, Tracks `query state`.
- QueryClientProvider: Context provider that makes react query available anywhere in application.

### useQuery

- accepts 2 argument:  
  query key(array used to keep track query in the cache, if key change it will refetch)  
  query function()
