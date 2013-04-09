var nflx = {
    currPage: 1,
    pageURL: document.location.href,
    movieData: [],

    go: function(html) {
        console.log("SCRAPING...");
        var _this = this;
        arguments.length === 0 ? _this.scrape() : _this.scrape(html);
    },  

    handleResponse: function(html) {
        if(html.indexOf("You have not rated any movies.") > 0) {
            console.log("DONE SCRAPING!");
            nflx.finish();
        } else {
            nflx.go(html);
        }
    },

    process: function(movies, callback) {
        var _this = this;
        movies.each(function(index) {
            var data = {};
            var movie = jQuery(this).find(".mdpLink")

            var movieName = jQuery(movie).text();
            var movieURL = jQuery(movie).attr("href");

            var fullrating = jQuery(this).find(".stbrMaskFg").text();
            rating = jQuery.trim(fullrating.substr(fullrating.indexOf(": ")+1));

            data.movieName = movieName;
            data.url = movieURL;
            data.rating = rating;
            _this.movieData.push(data);
        });
        callback();
    },

    scrape: function(str) {
        var _this = this;
        var movies;
        if(arguments.length > 0) {
            jQuery("html").html(str);
        }
        movies = jQuery(".agMovie");
        var $movies=jQuery(movies);
        _this.process(movies, function() {
            _this.currPage++;
            jQuery.ajax({
                type: 'GET',
                dataType: 'html',
                url: _this.pageURL+"?pn="+_this.currPage,
                async: false,
                success: _this.handleResponse
            });            
        });
    },

    finish: function() {
        var _this = this;
        var jsonData = JSON.stringify(_this.movieData);
        console.log(jsonData);
        jQuery("html").html(jsonData);
    }
}
nflx.go();
