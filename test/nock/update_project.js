var response;

response = {
  id: "THE PROJECT ID",
  publicKey: "THE PROJECT PUBLIC KEY",
  secretKey: "THE PROJECT SECRET KEY",
  name: "new project name",
  plan: "THE PROJECT PLAN",
  streamsCount: 10
};

module.exports = function() {
  var url = '/api/1/-/project?name=new%20project%20name&secretKey=MY%20SECRET';
  return nock('https://www.cine.io:443').put(url).reply(200, JSON.stringify(response));
};
