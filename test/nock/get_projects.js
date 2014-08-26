var response;

response = [{
  id: "THE PROJECT ID",
  publicKey: "THE PROJECT PUBLIC KEY",
  secretKey: "THE PROJECT SECRET KEY",
  name: "THE PROJECT NAME",
  streamsCount: 10
},
{
  id: "THE SECOND PROJECT ID",
  publicKey: "THE SECOND PROJECT PUBLIC KEY",
  secretKey: "THE SECOND PROJECT SECRET KEY",
  name: "THE SECOND PROJECT NAME",
  streamsCount: 10
}];

module.exports = function() {
  return nock('https://www.cine.io:443').get('/api/1/-/projects?masterKey=MY%20MASTER%20KEY').reply(200, JSON.stringify(response));
};
