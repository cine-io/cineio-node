var response;

response = {
  id: "THE PROJECT ID",
  apiKey: "THE PROJECT API KEY",
  apiSecret: "THE PROJECT API SECRET",
  name: "THE PROJECT NAME",
  plan: "THE PROJECT PLAN",
  streamsCount: 10
};

module.exports = function() {
  return nock('https://www.cine.io:443').get('/api/1/-/project?id=THE%20PROJECT%20ID&apiSecret=MY%20SECRET').reply(200, JSON.stringify(response));
};
