# get-link-fshare
Enter a fshare file code and return the download link
## run
```bash
redis-server
npm start
```
## update log
v1.1 move limiter to download router<br>
v1.1 fix error<br>
v1.2 retrieve limiter at get-link & fix shorten url<br>
v1.3 add limit bandwidth to download router & set remember login<br>
v1.4 fix file corrupt after download, set limit to file size, add message to rate limit<br>
v1.4.1 fix buffer error at get-link router & updata index.html<br>
v1.4.2 add timestamp to logger and update its format<br>
