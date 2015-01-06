var response;

response = {
  id: "THE STREAM ID",
  secretKey: "THE PROJECT SECRET KEY",
  month: "2015-01-06T00:00:00.000Z",
  bandwidth: 1073741824,
  storage: 2147483648
};

module.exports = function() {
  var url = '/api/1/-/usage/stream?month=2015-01-06T00%3A00%3A00.000Z&report%5B0%5D=bandwidth&report%5B1%5D=storage&secretKey=THE%20PROJECT%20SECRET%20KEY&id=THE%20STREAM%20ID';
  return nock('https://www.cine.io:443').get(url).reply(200, JSON.stringify(response));
};
