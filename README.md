# get-link-fshare
Enter a fshare file code and return the download link
## run
```bash
redis-server
npm start
```
## update log
### runner 1.1.1
- add try/catch to validateLink
### runner 1.1
- fix 'visitors' in download router
- fix index.html
### runner version
### v1.5.1
- update err notification in index.html
- add limit filesize & update validateLink to get-link router
- move limiter from get-link router to download router
- handle error by try...catch & next(error)
### v1.5 
- add limit to number of visitors
- update code about redis
### v1.4.3 
- fix readme
### v1.4.2 
- add timestamp to logger and update its format
### v1.4.1 
- fix buffer error at get-link router
- updata index.html
### v1.4
- fix file corrupt after download
- set limit to file size, add message to rate limit
### v1.3
- set remember login = 1
- add limit bandwidth to download router
### v1.2
- retrieve limiter at get-link & fix shorten url
### v1.1
- fix error
### v1.1 
- move limiter to download router



