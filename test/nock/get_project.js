var response;

response = {
  id: "THE PROJECT ID",
  publicKey: "THE PROJECT PUBLIC KEY",
  secretKey: "THE PROJECT SECRET KEY",
  name: "THE PROJECT NAME",
  plan: "THE PROJECT PLAN",
  streamsCount: 10
};

module.exports = function() {
  return nock('https://www.cine.io:443').get('/api/1/-/project?secretKey=MY%20SECRET').reply(200, JSON.stringify(response));
};
