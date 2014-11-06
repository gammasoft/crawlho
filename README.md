crawlho
=======

Simple web crawler

#### Installation 

`npm install crawlho`

#### Usage

```javascript
var crawlho = require('crawlho');

crawlho({
    url: 'http://example.com', //mandatory
    extract: function($) { //mandatory
        var results = [];
        
        $('.someClass').each(function() {
            results.push($(this.text()));
        });
        
        //You should return the data you wanna grab in form of an array!
        return results; 
    }
}, function(err) {
    if(err) {
        throw err; //Something went wrong!
    }
});
```
