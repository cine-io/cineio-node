var response;



response = [
  {
    name: "the recording name",
    url: "the recording url",
    date: "2034-05-17T00:00:00.000Z",
    size: 12345,
  },
  {
    name: "the second recording name",
    url: "the second recording url",
    date: "2034-05-17T00:00:00.000Z",
    size: 54321,
  }
];

module.exports = function() {
  return nock('https://www.cine.io:443').get('/api/1/-/stream/recordings?id=THE%20STREAM%20ID&secretKey=MY%20SECRET').reply(200, JSON.stringify(response));
};
