var response;

response = {
  id: "the stream id",
  streamName: 'the stream name',
  play: {
    hls: "the hls url",
    rtmp: "the rtmp url"
  },
  publish: {
    url: "the publish url",
    stream: "the publish stream"
  },
  expiration: "2034-05-17T00:00:00.000Z",
  password: "the stream password",
  record: true
};

module.exports = function() {
  var url = '/api/1/-/stream?record=true&secretKey=MY%20SECRET'
  return nock('https://www.cine.io:443').post(url).reply(200, JSON.stringify(response));
};
