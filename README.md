This javascript script will traverse your Netflix history and ratings from the "Movies You've Seen" page (http://movies.netflix.com/MoviesYouveSeen) and format this data as JSON.

To use the script, create a new bookmarklet in your browser with the following code:

```javascript
javascript:var d=new Date();r=d.getTime();var e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('src','https://raw.github.com/cmenscher/nflx/master/bookmarklet.js?r='+r);document.body.appendChild(e);void(0);
```

Then navigate to http://movies.netflix.com/MoviesYouveSeen and click the bookmarklet.  The script will do its thing and then write the JSON out to the window.

I'd like to make the script be a little cleaner about its output (if you view the source there's actually still some HTML in the document), and I'd also like to automatically prompt to download the JSON as a .json file.  If I get a chance I'll work on that some more.  Feel free to fix this for me, though.  :)