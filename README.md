# get-link-fshare
Enter a fshare file code and return the download link
## run
```bash
redis-server
npm start
```
## update log
v1.1 move limiter to download router
v1.1 fix error
v1.2 retrieve limiter at get-link & fix shorten url
v1.3 add limit bandwidth to download router & set remember login
v1.4 fix file corrupt after download, set limit to file size, add message to rate limit
