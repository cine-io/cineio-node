var response;

response = {
  deletedAt: "2014-06-09T20:42:06.619Z"
};

module.exports = function() {
  return nock('https://www.cine.io:443').delete('/api/1/-/stream/recording?id=THE%20STREAM%20ID&secretKey=MY%20SECRET&name=the%20recording%20name').reply(200, JSON.stringify(response));
};
