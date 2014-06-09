var response;

response = {
  id: "the stream id",
  updatedAt: "2014-06-09T20:41:06.619Z",
  deletedAt: "2014-06-09T20:41:06.619Z"
};

module.exports = function() {
  return nock('https://www.cine.io:443').delete('/api/1/-/stream?id=THE%20STREAM%20ID&secretKey=MY%20SECRET').reply(200, JSON.stringify(response));
};
