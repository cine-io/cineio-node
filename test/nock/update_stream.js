var response;

response = {
  "id":"the stream id",
  "name":"new stream name",
  "updatedAt":"2014-06-11T22:59:05.037Z"
}

module.exports = function() {
  var url = '/api/1/-/stream?name=new%20stream%20name&secretKey=MY%20SECRET&id=the%20stream%20id';
  return nock('https://www.cine.io:443').put(url).reply(200, JSON.stringify(response));
};
