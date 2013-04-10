var nflx = {
    currPage: 1,
    pageURL: document.location.href,
    currentMovie: {},
    movieData: [],

    go: function(html) {
        console.log("SCRAPING...");
        var _this = this;
        arguments.length === 0 ? _this.scrape() : _this.scrape(html);
    },  

    scrape: function(str) {
        var _this = this;
        var movies;
        if(arguments.length > 0) {
            jQuery("body").html(str);
        }
        movies = jQuery(".agMovie");
        var $movies = jQuery(movies);
        _this.process($movies, function() {
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

    process: function(movies, callback) {
        var _this = this;
        movies.each(function(index) {
            //var data = {};
            var movie = jQuery(this).find(".mdpLink")

            var movieName = jQuery(movie).text();
            var movieURL = jQuery(movie).attr("href");

            var fullrating = jQuery(this).find(".stbrMaskFg").text();
            rating = jQuery.trim(fullrating.substr(fullrating.indexOf(": ")+1));

            _this.currentMovie.movieName = movieName;
            _this.currentMovie.url = movieURL;
            _this.currentMovie.rating = rating;

            console.log("Found \"" + _this.currentMovie.movieName + "\"...");

            jQuery.ajax({
                type: 'GET',
                dataType: 'html',
                url: _this.currentMovie.url,
                async: false,
                success: _this.getMovieData
            });

            // _this.movieData.push(data);
        });
        callback();
    },

    getMovieData: function(html) {
        console.log("Fetching data for \"" + nflx.currentMovie.movieName + "\"...");
        var $movieworkspace = jQuery("#movieworkspace");
        if($movieworkspace.length === 0) {
            jQuery("body").append("<div id='movieworkspace'></div>");
        }
        $movieworkspace.css("display: none;");
        $movieworkspace.empty();
        $movieworkspace.html(html);

        nflx.currentMovie.year = jQuery("#movieworkspace .year").text();
        console.log(nflx.currentMovie.year);

        nflx.currentMovie.duration = jQuery("#movieworkspace .duration").text();
        console.log(nflx.currentMovie.duration);

        var $dvdActors = jQuery("dd.actors");
        var $dvdDirectors = jQuery("dd.directors");

        var $streamingPage = jQuery("div#displaypage-details");
        var $dt = $streamingPage.find("dt");

        var actors = [];
        var directors = [];
        if($dvdActors.length > 0) {
            actors = $dvdActors.text().split(",");
        } else if($streamingPage.length > 0) {
            jQuery($dt).each(function() {
                if(jQuery(this).text() == "Cast") {
                    var actors = $dt.find("dd").text().split();
                    return;
                }
            });
        }
        console.log(actors);

        if($dvdDirectors.length > 0) {
            directors = $dvdDirectors.text().split(",");
        } else if($streamingPage.length > 0) {
            jQuery($dl).each(function() {
                if(jQuery(this).text() == "Director" || jQuery(this).text() == "Directors") {
                    var directors = $dl.find("dd").text().split();
                }
            });
        }
        console.log(directors);

        nflx.movieData.push(nflx.currentMovie);
        nflx.currentMovie = {}; //reset current movie
    },

    handleResponse: function(html) {
        if(html.indexOf("You have not rated any movies.") > 0) {
            console.log("DONE SCRAPING!");
            nflx.finish();
        } else {
            nflx.go(html);
        }
    },

    finish: function() {
        var _this = this;
        var jsonData = JSON.stringify(_this.movieData);
        console.log(jsonData);

        if(window.Blob && (window.createObjectURL || window.webkitURL.createObjectURL)) {
            var blob = new Blob([jsonData], {type: "application/octet-stream"}),
                saveas = document.createElement("iframe");
            saveas.style.display = "none";
            saveas.src = (window.createObjectURL||window.webkitURL.createObjectURL)(blob);
            (document.body || document.getElementsByTagName("html")[0]).appendChild(saveas);
        }
        else {
            var jsonField = document.createElement("textarea");
            jsonField.setAttribute("style", "display: block; position: absolute; top: 0px; width: 100%; height: 100%; z-index: 1000;");
            document.body.appendChild(jsonField);

            var jsonVal = document.createTextNode(jsonData);
            jsonField.appendChild(jsonVal);
            jsonField.select();
            alert("You data has been liberated! Just copy and paste into a document.");
        }
    }
}
nflx.go();
