'use strict';

const Bluebird = require('bluebird');
const c3 = require('c3');
const fetchUrl = require('./lib/fetch-url');

const chartTweetsByDay = c3.generate({
  bindto: '#chartTweetsByDay',
    data: {
        x: 'x',
        columns: []
    },
    zoom: {
        enabled: true
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    }
});


const chartDevices = c3.generate({
  bindto: '#chartDevices',
    data: {
        // iris data from R
        columns: [],
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    }
});

const chartOwnTweets = c3.generate({
  bindto: '#chartOwnTweets',
    data: {
        columns: [],
        type: 'gauge',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    gauge: {},
    color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
            values: [30, 60, 80, 100]
        }
    },
    size: {
        height: 180
    }
});

const chartMostUsedWords = c3.generate({
  bindto: '#chartMostUsedWords',
    data: {
        columns: [],
        type : 'donut',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
        title: "Words matter!"
    }
});


document.querySelector('#search').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      // Why u no work?
      var myURL = document.location;
      document.location = myURL + "?a=parameter";
      console.log(document.getElementById("search").value);
      return false; // doesnt prevent reloading
    }
});



fetchUrl('http://localhost:5000/statistics/nellykfm').then((json) => {
  const sourceDevice = json.data.attributes.user_devices.map((device) => {
    return [device.source, device.count];
  });

  const ownTweets = json.data.attributes.perc_of_own_tweets_vs_retweeted;
  const mostUsedWords = json.data.attributes.most_words_used.map((mostWords) => {
    return [mostWords.source, mostWords.count];
  });
  const daysOfTweets = json.data.attributes.stats_per_day;

  document.getElementById('UserScreenName1').innerHTML = 'Overview for ' + json.user.data.attributes.screen_name;
  document.getElementById('UserScreenName2').innerHTML = json.user.data.attributes.screen_name;

  chartDevices.unload();
  chartDevices.load({
    columns: sourceDevice
  });

  chartOwnTweets.unload();
  chartOwnTweets.load({
    columns: [['% of own Tweets vs retweets', ownTweets*100]]
  });

  chartMostUsedWords.unload();
  chartMostUsedWords.load({
    columns: mostUsedWords
  });

  chartTweetsByDay.unload();
  chartTweetsByDay.load({
    columns: daysOfTweets
  });

});
