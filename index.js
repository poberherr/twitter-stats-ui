'use strict';

const Bluebird = require('bluebird');
const c3 = require('c3');
const fetchUrl = require('./lib/fetch-url');

// const chartTweetsByDay = c3.generate({
//   bindto: '#chartTweetsByDay',
//     data: {
//         x: 'x',
// //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
//         columns: [
//             ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
// //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
//             ['data1', 30, 200, 100, 400, 150, 250],
//             ['data2', 130, 340, 200, 500, 250, 350]
//         ]
//     },
//     zoom: {
//         enabled: true
//     },
//     axis: {
//         x: {
//             type: 'timeseries',
//             tick: {
//                 format: '%Y-%m-%d'
//             }
//         }
//     }
// });
const chartTweetsByDay = c3.generate({
  bindto: '#chartTweetsByDay',
    data: {
        x: 'x',
      //  xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
            // ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
//            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
            // ['data1', 30, 200, 100, 400, 150, 250],
            // ['data2', 130, 340, 200, 500, 250, 350]
        ]
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
        columns: [
            []
        ],
        type: 'gauge',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    gauge: {

    },
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
        columns: [
        ],
        type : 'donut',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
        title: "Words matter!"
    }
});

fetchUrl('http://localhost:5000/tweet_statistics/rlsux').then((json) => {
  console.log(json);
  const sourceDevice = json.data.attributes.user_devices.map((device) => {
    return [device.source, device.count];
  });

  const ownTweets = json.data.attributes.prec_of_own_tweets_vs_retweeted;
  const mostUsedWords = json.data.attributes.most_words_used.map((mostWords) => {
    return [mostWords.source, mostWords.count];
  })
  const daysOfTweets = json.data.attributes.stats_per_day;
  // console.log(daysOfTweets);

  chartDevices.unload();
  chartDevices.load({
    columns: sourceDevice
  });

  chartOwnTweets.unload();
  chartOwnTweets.load({
    columns: [['data', ownTweets*100]]
  });

  chartMostUsedWords.unload();
  chartMostUsedWords.load({
    columns: mostUsedWords
  });

  chartTweetsByDay.unload();
  chartTweetsByDay.load({
    columns: daysOfTweets
  })

});
