crawlho
=======

Simple web crawler

#### Installation 

As simple as `npm install crawlho`.

#### Usage

`crawlho(options, callback);`

Example

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

Defaults for the options hash are as follows

```javascript
 var options = {
    sameDomain: true, 
	//Follow only internal links - default: true

	debug: false,
	//Prints current requested url and level depth - default: false
	
	maxlevel: 2,
	//Maximum level depth - default: 2
	
	delay: 1000,
	//Time delay between requests - default: 1000ms
	
	onResult: function(results) { 
	    //what to do whenever whenever your extract function finds something
	    //this is the default implementation (writes to stdout)
	    //results is the array sent by .extract when it has .length > 0
	    
		results.forEach(function(result) {
			process.stdout.write(result + os.EOL);
		});
	},
	
	shouldResetLevel: function(url) {
	    //optional function that resets depth level to 1
	    //it is useful when dealing with pagination so
	    //following `url?page=2` doesn't count as a new level
		return false;
	},
	
	shouldFollow: function(url) {
	    //Every url is passed to this function so you can decide
	    //wether you carwlho should follow this link or not
	    //useful to prevent crawling files (.zip, .rar, .mp3)
		return true;
	}
}
 ```
