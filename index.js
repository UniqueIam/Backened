require('dotenv').config()

const express = require('express')

const app = express()

const port = 3000

const gitHubData = {
    "login": "UniqueIam",
    "id": 141363553,
    "node_id": "U_kgDOCG0JYQ",
    "avatar_url": "https://avatars.githubusercontent.com/u/141363553?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/UniqueIam",
    "html_url": "https://github.com/UniqueIam",
    "followers_url": "https://api.github.com/users/UniqueIam/followers",
    "following_url": "https://api.github.com/users/UniqueIam/following{/other_user}",
    "gists_url": "https://api.github.com/users/UniqueIam/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/UniqueIam/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/UniqueIam/subscriptions",
    "organizations_url": "https://api.github.com/users/UniqueIam/orgs",
    "repos_url": "https://api.github.com/users/UniqueIam/repos",
    "events_url": "https://api.github.com/users/UniqueIam/events{/privacy}",
    "received_events_url": "https://api.github.com/users/UniqueIam/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Abhimanyu Kumar",
    "company": null,
    "blog": "",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "public_repos": 7,
    "public_gists": 0,
    "followers": 3,
    "following": 4,
    "created_at": "2023-08-03T19:15:50Z",
    "updated_at": "2024-06-08T17:37:58Z"
    }

app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.get('/login',(req , res)=>{
    res.send('<h2>Please Login in our Page</h2>')
})
app.get('/youtube',(req,res)=>{
      res.send('<h1>Please Subscribe me on the You tube</h1>')
})
app.get('/github',(req,res)=>{
    res.json(gitHubData)
})
app.listen(process.env.port,()=>{
    console.log(`Express is running at port ${port}`);
})