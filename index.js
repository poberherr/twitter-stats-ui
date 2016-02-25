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
        columns: [],
        type : 'pie',
    }
});

const chartOwnTweets = c3.generate({
  bindto: '#chartOwnTweets',
    data: {
        columns: [],
        type: 'gauge',
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
    },
    donut: {
        title: "Words matter!"
    }
});

const chartTopReplyUsers = c3.generate({
  bindto: '#chartTopReplyUsers',
    data: {
        columns: [],
        type : 'pie',
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



fetchUrl('http://localhost:5000/statistics/rlsux').then((json) => {
  const sourceDevice = json.data.attributes.user_devices.map((device) => {
    return [device.source, device.count];
  });

  const ownTweets = json.data.attributes.perc_of_own_tweets_vs_retweeted;
  const mostUsedWords = json.data.attributes.most_words_used.map((mostWords) => {
    return [mostWords.source, mostWords.count];
  });

  const topReplyUsers = json.data.attributes.top_reply_users.map((topUsers) => {
    return [topUsers.source, topUsers.count];
  });

  const daysOfTweets = json.data.attributes.stats_per_day;


  document.getElementById('UserScreenName1').innerHTML = 'Overview for ' + json.user.data.attributes.screen_name;
  document.getElementById('UserScreenName2').innerHTML = json.user.data.attributes.screen_name;
  document.getElementById('UserName').innerHTML = json.user.data.attributes.name;
  document.getElementById('UserDescription').innerHTML = json.user.data.attributes.description;

  document.getElementById('UserTwitterId').innerHTML = 'Twitter ID: ' + json.user.data.attributes.twitter_id;
  document.getElementById('UserLocation').innerHTML = 'Location: ' + json.user.data.attributes.location;
  document.getElementById('UserTimeZone').innerHTML = 'Time Zone: ' + json.user.data.attributes.time_zone;
  document.getElementById('UserCreatedAt').innerHTML = 'Account created:<br>' + json.user.data.attributes.created_at;

  document.getElementById('UserTweetsCount').innerHTML = json.user.data.attributes.statuses_count + ' tweets';
  document.getElementById('UserTweetsAnalyzed').innerHTML = json.data.attributes.tweets_analysed + ' Tweets analysed';
  document.getElementById('UserFavoritesCount').innerHTML = json.user.data.attributes.favourites_count + ' total likes collected';
  document.getElementById('UserFollowersCount').innerHTML = json.user.data.attributes.followers_count + ' followers';

  document.getElementById('UserGotRetweetedCount').innerHTML = json.data.attributes.user_got_retweeted_count + ' retweets collected';
  document.getElementById('UserAverageOwnTweetsVsRetweetCount').innerHTML = json.data.attributes.avg_own_tweets_vs_retweeted_count + ' of your tweets get retweeted';
  document.getElementById('UserAverageStars').innerHTML = json.data.attributes.average_stars + ' avg stars per tweet';
  document.getElementById('UserAverageRetweets').innerHTML = json.data.attributes.average_retweets + ' avg retweets';

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

  chartTopReplyUsers.unload();
  chartTopReplyUsers.load({
    columns: topReplyUsers
  });

});
