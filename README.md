# React Query

## 1 Getting Started

Client data could be stored using - useState, useReducer hook or third party state management library like redux or mobx.Redux or MobX work fine, but they often introduce more problems by treating server state the same as client state and using a global store.

### Client State:

- Ephemeral - It goes away when the browser is closed.
- Synchronous - It's instantly available.
- Client owned - Stayed in the browser that creates it.

### Server State:

- Stored remotely - The client has no control over what is stored or how it is stored.
- Asynchronous - It takes a bit of time for the data to come from the server to the client(network request: send - process - response back).
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
  
## Example 
***  Lesson 1 - fetchRandomNumber.js  


```  
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
    const {data : data1
    isLoading : isData1Loading,
    isFetching : isData1Fetching,
    refetch : refetchData1
    } = useQuery (['random'], fetchNumber)
    
    return {data1, isData1Loading, isData1Fetching, refetchData1}
}  

export {useRandomNumber}

```   

# 2 Querying Data
## Query keys
- Identify query
- It's like useEffect dependency array, query will refetch if key changed.
- Query key array can contain any primitive or non-primitive data.

```
useQuery(["users", 1], fetchUser);
useQuery(["labels", labelName], fetchLabel);
useQuery(["issues", {completed: false}], fetchIssues);  
```  
- Key should follow ` Generic To Specific `  pattern  with a starting string which identify the kind of data.  

``` useQuery(["issues", owner, repo], queryFn);   
```  
This pattern will help to accidentally creating duplicate query keys.  

- When use Objects in Query Keys??  

When we are filtering by more than one thing and any parameter can refetch the query without breaking the order.  

```  
const issuesQuery = useQuery(
    [
      "issues",
      owner,
      repo,
      { 
        state: issueState, 
        assignee,
        labels: labels || undefined 
      },
    ],
    queryFn
  ); 
  ```
  
## Query Function
- Make data request
### Query function argument  
1.   Can pass any parameter to query function like arrow function.
2.   1st parameter is an object containing query keys. So we can use key values as Query Function Arguments.  

```  

async function getGithubUser({ queryKey }) {
  const [user, username] = queryKey;

  return fetch(`https://api.github.com/users/${username}`)
    .then((res) => res.json());
};

const User = ({ username }) => {
  const userQuery = useQuery(
    ["user", username],
    getGithubUser,
  );    
  
  ```  
  
### Queries with custom hook  

```  

function useGithubIssuesQuery({ owner, repo}) {
  function getIssues() {
    return fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues` : ""
      }`,
    ).then(res => res.json());
  }

  return useQuery(
    ["issues", owner, repo],
    getIssues
  );
}
```  

### Fetch single user with variable parameter
```  
import { useQuery } from "react-query";
const getUserData = (id) => {
  //get user data by assignee or created by

  const userData = useQuery(["issues", id], () =>
    fetch(`api/users/${id}`).then((res) => res.json())
  );
  return { userData };
};
export { getUserData };  

```  
```  
 const { userData: assigneeUser } = getUserData(assignee);
 const { userData: createdByUser } = getUserData(createdBy);  
```  

### PARALLEL QUERY  
- It combining the two requests into a single query. We use the ` Promise.all ` helper to load both requests in parallel in the query function, pass that to a single useQuery hook, and get results from both at the same time.  
```  
function getReposAndGists(username) {
  return Promise.all([
    fetch(`https://api.github.com/users/${username}/repos`)
      .then((res) => res.json()),
    fetch(`https://api.github.com/users/${username}/gists`)
      .then((res) => res.json())
  ]);
}

const ReposAndGists = ({ username }) => {
  const reposAndGistsQuery = useQuery(
    ["reposAndGists", username],
    () => getReposAndGists(username),
  );
  
const [repos, gists] = reposAndGistsQuery.data;

 ```  
 - useQueries : accepts an array of query options and returns an array of query results. [React query docs](https://tanstack.com/query/latest/docs/react/reference/useQueries?from=reactQueryV3&original=https%3A%2F%2Ftanstack.com%2Fquery%2Fv3%2Fdocs%2Freference%2FuseQueries)
 
 ### Dependent Query  
 - When second request will attempt to use the data from the first request, even though that data hasn't been loaded yet. We need a configuration object `enabled` to define when the second query will run.
 ```  
 useQuery(
  queryKey,
  queryFn,
  configuration
)
```  
- To avoid long time Loding in UI (for second query data), we can use `fetchStatus` .If status is loading and fetchStatus is idle, then we can know the query is disabled. 
- querying two APIs. (labels & issues). Where issues are dependent to labels Id. ( Use label Id as parameter for fetch issues)

```  

export default function App() {
  const [id, setId] = useState(null);
  const { data: labels, isLoading: isLabelLoading } = useQuery(["labels"], () =>
    fetch(`https://ui.dev/api/courses/react-query/labels`).then((res) =>
      res.json()
    )
  );

  const { data: issues, isLoading: isIssuesLoading, fetchStatus } = useQuery(
    ["issues", { id }],
    () =>
      fetch(
        `https://ui.dev/api/courses/react-query/issues?/labels[]=${id}`
      ).then((res) => res.json()),
    { enabled: !!id }
  );

  return (
    <div>
      {isLabelLoading ? (
        <p>Loading..</p>
      ) : (
        labels.map((label) => (
          <div>
            <button onClick={() => setId(label.id)}>{label.name}</button>
          </div>
        ))
      )}
      {fetchStatus === "idle" && isIssuesLoading ? null : isIssuesLoading ? (
        <p>Loading..</p>
      ) : (
        issues.map((issue) => <li>{issue.title}</li>)
      )}
    </div>
  );
}


```  

### FETCH WITH SYNAMIC URL  
```  
const issuesQuery = useQuery(["issues", { labels, status }], () => {
    const statusString = status ? `&status=${status}` : "";
    const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
    return fetch(`/api/issues?${labelsString}${statusString}`).then((res) =>
      res.json()
    );
  }); 
``` 
- Example url: `/api/issues?labels[]=bug&labels[]=enhancement&status=done` 
## 3. Resilient (saktisali :) )Queries   
### CACHE STATES   
A query only has the loading state the first time it loads and there's no data, while the fetching state is used by the query cache any time a query is refetched, including the first time.   
- Query cache states:
  `Idle/fresh`- the query doesn't need to be fetched  
  `Fetching`  
  `Paused`  
- How react query know to refetch a query?  
React Query uses another set of states: `fresh` and `stale`. React Query automatically re-fetches queries as soon as they transition from fresh to stale.    

- `Stale` vs `fresh`  
Stale : need refetch  
Fresh : no refresh needed  
- Refetch query after 1 minute:
```  
const userQuery = useQuery(
  ["user", username],
  () =>
    fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json()),
  { staleTime: 1000 * 60 }
);

```  
`  { staleTime: Infinity }` will keep data fresh forever.

### TRIGERING A REFETCH  
- 1st refetch: When component mount first time. If already mount -->  unmount (refetch if data in `stale` state) --> mount again.  
- 2nd refetch: When user re-focus on window. (can be disabled for individual useQuery calls by setting the refetchOnWindowFocus option to false)  
- 3rd Refetch: Network re-connect. (can be disabled setting the refetchOnReconnect config option to false)  
- 4th optional Interval: enable by using `refetchInterval` It will refetch whether the query is stale or fresh.  

### CACHE CLEARING  
- By default, when a query has been inactive for more than 5 minutes, React Query clears it out.
- or we can use `cacheTime` to handle cache clearing time.  
- Example: remove a query from the cache immediately by setting the cacheTime option to 0  
```  
const userQuery = useQuery(
  ["user", username],
  () =>
    fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json()),
  { cacheTime: 0 }
);
```  

### REACT QUERY DEVTOOLS  
- React Query Devtools visualize internal states which React Query manages for each entry in the cache. This makes it easy to see what queries have been made, which ones are stale, when queries refetch, and much more.  

- import : `import { ReactQueryDevtools } from "react-query/devtools" `  
- Wrap inside queryClientProvider ` <ReactQueryDevtools />`  
- For keep query data `fresh` set 3rd parameter of query function as  
```  
{
   staleTime: 1000 * 60 * 5,
}  
```  
### ERROR HANDLING  
- use onError callback  
```  
const Users = () => {
  const userQuery = useQuery(
    "users",
    () => fetchWithError("/users"),
    { onError: (error) => toast.error(error.message) }
  )

  // Render the loading state and data
}  
```  
- We can use `{retry:false}` parameter to stop refetch. (In case refetch gives an error but we want cache data)


## 4. The Query Client 
### Query client with default parameter (can still override them for each useQuery, if needed.) ***
```  
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 1000,
      cacheTime: 10 * 1000,
      retry: 1,
      useErrorBoundry: true,
      onError: (error => {
      }),
      refetchOnWindowFocus: false,
    },
    mutations: {}
  },
})  
```  

### Default query function ...
### Imperative Query Fetching
- Use `queryClient.fetchQuery`
- If we want to Perform a search, grab the top result, and immediately trigger a navigation to the relevant page using React Router's navigate function without displaying results.
```  
const Search() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleSearch(query) {
    try {
      const data = await queryClient.fetchQuery(
        ['search', query],
        performSearch
      );

      const topResult = data?.results[0];

      if (!topResult) throw new Error('No results found');
      
      navigate(topResult.url);
    } catch(error) {
      // handle error
    }
  }

  return (
    <form onSubmit={event => {
      event.preventDefault();
      handleSearch(event.target.query.value);
    }}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}  
```  
## 5. Keeping Data Fresh
- Manual query invalidation  
React Query will only ever refetch active queries - that is, queries that are being used by components that are currently mounted. inactive queries remain in the cache until their cacheTime expires, which is 5 minutes by default.  
### Summery  
- If refetch single query (use refetch())  

```  
import { useQuery, useQueryClient } from "react-query";
...  
<button
  onClick={() => {
   query1.refetch();
  }}
>
Refetch/Invalidate
</button>  
```  
- If refetch multiple query (use invalidateQueries/ refetchQueries). 

```  
import { useQuery, useQueryClient } from "react-query";
...  
  const queryClient = useQueryClient();  
...  


<button
  onClick={() => {
   queryClient.invalidateQueries(["random"]);
  }}
>
Refetch/Invalidate
</button>  
```  
        

### Refetching Queries  
- We can refetch a query with the `queryClient.refetchQueries` method. queryClient use `useQueryClient` hook () 
- When the user clicks this button, React Query will have every query that matches the provided query key refetch in the background.  
```  
const RefetchButton = ({org, repo}) => {
  const queryClient = useQueryClient();

  return (
    <button onClick={() =>
      queryClient.refetchQueries(['repo', org, repo])
      }>
      Refresh
    </button>
  );
};
```  
- ` queryClient.refetchQueries ` will refetch all queries  `active`, `inactive`, `fresh` or `stale`. (use when need to refetch an active queries).
-  `queryClient.invalidateQueries` will refetch inactive/stale queries only.

```  
import * as React from "react";
import { queryClient, useQuery } from "react-query";

export default function App() {
  const {data,isLoading,isStale}=useQuery(['user'],()=>{
  return fetch(`https://ui.dev/api/courses/react-query/users`)
  .then(res=>res.json())
  },
  {staleTime:5*1000}
  )

  return <div>{isLoading ? <p>Loading..</p>:
  data.map(user=> <p>{user.name}</p>)
  }
  {isStale && <button 
  onClick={()=>queryClient.refetchQueries(['user'])}
  >
    Refetch
  </button>}
  </div>;
}
```  
### Refetching Query with Filters  
Query can be refetch using filter by `keys`, `type`,  and `stale`
- Example Queries  
```  
const repoQuery = useQuery(['repo', org, repo]);
const repoIssuesQuery = useQuery(['repo', org, repo, 'issues']);
const openIssuesQuery = useQuery(['repo', org, repo, 'issues', {state: 'open'}]);  
```  
case 1: `queryClient.refetchQueries()` refetch all queries  
case 2: `queryClient.refetchQueries(['repo', org, repo])` refetch all queries. (keys will match from starting, This case all query has this 3 keys)  
case 3: `queryClient.refetchQueries(['repo', org, repo, "issues"])` refetch last 2 queries
case 4: `queryClient.refetchQueries(
  ['repo', org, repo, "issues"],
  {exact: true}
);` fetch the query which exactly match with this query keys. In this case refetch only 3rd query  
case 5: `queryClient.refetchQueries({stale: true, type: "inactive"})` refetch query which is stale and inactive  


##  

##  
### QUERY CANCELLATION ( *** usefull for every request (specially search) so that If a request is cancelled before it is sent, the server won't have to spend resources responding to it. )  
- By default query will cancel when - component unmount before query resolve or query key chage in mid request.  
- Cancel fetch request (pass signal parameter to fetch api and use) ***  
```  
const userQuery = useQuery(
  ["users"], 
  ({signal}) => fetch("/api/users", {signal})
    .then(res => res.json())
);  
```  
- Cancel query manually: use signal parameter in request and call `queryClient.cancelQueries` with query key  
 
```  
<button onClick={() => queryClient.cancelQueries(["users"])}>
        Cancel User Query
      </button>  
 ```  
 
### SHOW REFETCHING STATES (isFetching)  
- Configur for single query : use `isFetching`  
- Configure for all queries:  
step 1: Create queryLoader component, Which will call Loader component by checking if the query is refetching.(useIsFetching hook)  
```  
const QueryLoader = () => {
  const isFetching = useIsFetching();

  if (isFetching) {
    return (
      <div className="query-loader">
        <LoadingSpinner />
      </div>
    )
  }
  return null;
}  

```  
step 2: Place queryLoader component inside `<QueryClientProvider>`  
```  
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <QueryLoader />
  </QueryClientProvider>,
);  
```  
- Configure for specific queries using query key: `const isFetching = useIsFetching(["repo", owner, repo])`

### PREFETCHING QUERIES
- Summery: 1. placeholder data 2. Initial data 3. Preloaded data  
- PLACEHOLDER DATA: Add default value of query data which will `not store in cache`  
```  
import * as React from "react";
import { useQuery } from "react-query";

const  fetchUser=({queryKey})=> {
  const [user,userId]=queryKey
  console.log(userId)
  return fetch(`https://ui.dev/api/courses/react-query/users/${userId}`).then(res=>res.json())
}
export default function UserProfilePicture({ userId }) {
  const user=useQuery(['user',userId],fetchUser,{
    placeholderData:{profilePictureUrl:`https://unsplash.it/200`}
  })
console.log(user.data)
  return <div>{user.isLoading ? 'Loading..':<img src={user.data.profilePictureUrl} alt='bb'/>}</div>;
}
```  
- For dependent query need to avoid placeholder value  
```  
{
    enabled: !userQuery.isPlaceholderData 
      && userQuery.data?.login,
 }  
 ```  
 - INITIAL DATA  
 - Add default value of query data which will `store in cache`  
 - We can use hardcoded data / data from another query as initial data.  
 
 For Independent query  
 
 ```  
 const adminUsersQuery = useQuery(
  ["adminUsers"],
  fetchAdminUsers,
  {
    initialData: hardCodedAdminUsers,
  }
)  
```  
For Dependent query: use `queryClient.getQueryData` with specific query keys and use a function as 3rd parameter  

```  
const queryClient = useQueryClient();
const issueDetailQuery = useQuery(
  ["issue", repo, owner, issueNumber],
  fetchIssue,
  {
    initialData: () => {
      const issues = queryClient.getQueryData(["issues", repo, owner])
      if (!issues) return undefined;
      const issue = issues.find(issue => issue.number === issueNumber)
      return issue;
    }
  },
)  
```  
- PRELOADED DATA  
- [https://ui.dev/c/react-query/solution-preloading-data]
[https://codesandbox.io/s/3btjig?file=/App.js&utm_medium=sandpack]
## 6. Mutations    

A mutation is any function that causes a side effect - most commonly changing the state of some data outside of the function.  
- useMutation vs useQuery:   
`useQuery runs declaratively`. As soon as the component mounts, it fetches the data. `useMutation is imperative`, only firing off the request when you call the `mutation.mutate` method.  
The second difference between useMutation and useQuery in the parameters - you don't have to pass a query mutation key, just the mutation function. This implies another difference - mutation results aren't cached like query results are. If you make a mutation in one component, you won't be able to access the response data in another component without sending it some other way.  

###  Mutation Resets  
changeNameMutation.reset()

### Direct Cache Updates  
```  
const changeNameMutation = useMutation(changeName, {
  onSuccess: (data) => {
    queryClient.setQueryData(
      ["user"],
      (oldUser) => ({
        ...user,
        name: data.name
      })
    )
  }
});  
```  
### Query Invalidation
```  
const updateIssueStatusMutation = useMutation(
  updateIssueStatus, 
  {
    onSettled: (data, variables) => {
      queryClient.invalidateQueries(
        ["issues", variables.org, variables.repo]
      )
    }
  }
)  
```  
### EXAMPLE  
```  
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addIssue = useMutation(
    (issueBody) =>
      fetch(`/api/issues`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(issueBody),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["issues"], { exact: true });
        queryClient.setQueryData(["issues", data.number.toString()], data);
        navigate(`/issue/${data.number}`);
      },
    }
  );
  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (addIssue.isLoading) return;
          addIssue.mutate({
            comment: event.target.comment.value,
            title: event.target.title.value,
          });
        }}
      >
        <label htmlFor="title">Title</label>
        <input type="text" id="title" placeholder="Title" name="title" />
        <label htmlFor="comment">Title</label>
        <textarea id="comment" placeholder="Comment" name="comment" />
        <button type="submit" disabled={addIssue.isLoading}>
          {addIssue.isLoading ? "Adding Issue..." : "Add Issue"}
        </button>
      </form>
    </div>
  );
}
  
```  

### OPTIMISTIC UPDATES
## 7. Pagination  
- Keep previous page data untill get new data(avoid showing loading) : 3rd parameter: `{keepPreviousData: true}`
- `isPreviousData` will indicate we are getting same data( add this option to disable next button along with checking empty data)  
```  
const Issues = ({org, repo}) => {
  // ...
  return (
    <div>
      {/* ... */}
      <div>
        <button
          onClick={() => setPage(page => page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <p>
          Page {page} {issuesQuery.isFetching ? "..." : ""}
        </p>
        <button
          onClick={() => setPage(page => page + 1)}
          disabled={
            !issuesQuery.data || 
            issuesQuery.data.length === 0 || 
            issuesQuery.isPreviousData
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}  
```  
### Preface next page  
```  
const Issues = ({org, repo}) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const perPage = 10;
  const issuesQuery = useQuery(
    ["issues", org, repo, {page, perPage}],
    fetchIssues,
    {keepPreviousData: true}
  );

  useEffect(() => {
    queryClient.prefetchQuery(
      ["issues", org, repo, {page: page + 1, perPage}],
      fetchIssues
    );
  }, [org, repo, page, perPage, queryClient]);

  // ...
}  
```  

