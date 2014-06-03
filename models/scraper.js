var request = require('request'),
    cheerio = require('cheerio'),
    Q = require('Q');

function findText(children, selector, $) {
    for (var i = 0; i < children.length; i++) {
          if($(selector + ' span strong').length > 0) {
              return $(selector + ' span strong').text();
          }else if(children[i].type === 'text'){
              return children[i].data;
          }
    }
}

function newsScraper(url,selector) {
    var deferred = Q.defer();
    request(url, function (error, response, html) {
               
               if (!error && response.statusCode == 200) {
                   var $ = cheerio.load(html),
                       headlines = $(selector),
                       news = [];
                       news.push(url);
                   for (var i = 0; i < 10; i++) {
                       var article = {};
                           children = headlines[i]['children']; 
                       if(headlines[i].attribs.href) {
                           article['href'] = headlines[i].attribs.href;
                       }else {
                           article['href'] = headlines[i].parent.attribs.href;
                       }
                       article['text'] = findText(headlines[i]['children'], selector, $);
                       news.push(article);
                   } 
                   if (error) deferred.reject(error)
                   else deferred.resolve(news)                   
               }
    });
    return deferred.promise;
}

var completed = Q.all([newsScraper('http://www.bbc.com/news', '#container-top-stories-with-splash a.story'), 
                       newsScraper('http://news.sky.com', '#latest_stories a h2')]);

module.exports = completed;



