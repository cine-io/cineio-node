var response;

response = {
  content: '<?xml version="1.0" encoding="UTF-8"?>\n<flashmedialiveencoder_profile>THE PROFILE</flashmedialiveencoder_profile>'
};

module.exports = function() {
  return nock('https://www.cine.io:443').get('/api/1/-/stream?id=THE%20STREAM%20ID&secretKey=MY%20SECRET&fmleProfile=true').reply(200, JSON.stringify(response));
};
