var response;

response = {
  id: "THE PROJECT ID",
  deletedAt: "2014-06-09T20:41:06.619Z"
};

module.exports = function() {
  return nock('https://www.cine.io:443').delete('/api/1/-/project?secretKey=MY%20SECRET').reply(200, JSON.stringify(response));
};
