var nflx = {
    currPage: 0,
    pageURL: document.location.href,
    movieData: [],

    go: function() {
        console.log("GO!!!!");
        var _this = this;
        _this.scrape();

        jQuery.ajax({
            type: 'GET',
            dataType: 'html',
            url: _this.pageURL,
            data: _this.currPage,
            async: false,
            success: _this.handleResponse
        });
    },  

    handleResponse: function(html) {
        var _this = this;

        $page = jQuery(html);
        if($page("#mylMsg").text().indexOf("You have not rated any movies.") < 0) {
            _this.finish();
        } else {
            _this.currPage++;
            _this.go();

        }
    },

    process: function(movies) {
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
    },

    scrape: function(str) {
        var _this = this;
        var movies;
        if(arguments.length > 0) {
            jQuery("html").html(str);
        } else {
            movies = jQuery(".agMovie");
            var $movies=jQuery(movies);
            _this.process(movies);
        }
    },

    finish: function() {
        var _this = this;
        console.log(JSON.stringify(_this.movieData));
    }
}
nflx.go();
