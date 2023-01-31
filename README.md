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

### Parallel Query  
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

  const [id,setId]=useState(null)
  const {data:labels,isLoading:isLabelLoading}=useQuery(['labels'],()=>
    fetch(`https://ui.dev/api/courses/react-query/labels`)
    .then(res=>res.json())
  )
  
  const {data:issues,isLoading:isIssuesLoading,fetchStatus}=useQuery(['issues',{id}],()=>
    fetch(`https://ui.dev/api/courses/react-query/issues?/labels[]=${id}`)
    .then(res=>res.json()),
    {enabled: !!id}
  )

  return <div>
    {isLabelLoading? <p>Loading..</p>:labels.map(label=>  <div><button onClick={()=>setId(label.id)}>{label.name}</button></div>)}
    {fetchStatus==='idle' && isIssuesLoading?null:
    isIssuesLoading? <p>Loading..</p>:issues.map(issue=>  <li>{issue.title}</li>)}
  </div>;
}
```  


