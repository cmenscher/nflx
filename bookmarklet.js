var nflx = {
    currPage: 1,
    pageURL: document.location.href,
    movieData: [],
    test: "",

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
            jQuery("body").html(str);
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
