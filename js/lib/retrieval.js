
//Modify this variable after migrating the api to heroku
var API_URL = 'https://exquisite-cadaver-loopback-cathe313.c9.io/api/';


// Data retrieval functions
function getStories(pageNum) {
    return $.getJSON(API_URL + 'Stories?filter={"order":"rating%20DESC","skip":' + pageNum * 2 + ',"limit":' + (2 + 1) + ',"where":{"incomplete":"false"}}').then(
        function(result) {
            if (result.length > 2) {  //storyNb
                var hasNextPage = true;
                result = result.slice(0, 2); //storyNb
            }
            else {
                hasNextPage = false;
            }
            
            return {
                hasNextPage: hasNextPage,
                stories: result
            };
        }
    );
}

module.exports = {
    'getStories':getStories,
    'API_URL': API_URL
};
            