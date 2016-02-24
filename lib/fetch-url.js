const fetchUrl = function (url) {
  return fetch(url, {
    method: 'get',
    mode: 'cors',
    redirect: 'follow',
    headers: new Headers({
  		'Content-Type': 'application/json'
  	})
  }).then((response) => {
    return response.json();
  });
};

module.exports = fetchUrl;
