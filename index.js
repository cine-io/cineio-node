var API_VERSION, BASE_URL, CineIO, Projects, Streams, request, serialize;

request = require('request');

API_VERSION = 1;

BASE_URL = "https://www.cine.io/api/" + API_VERSION + "/-";

serialize = function(obj) {
  var p, str;
  str = [];
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }
  return str.join("&");
};

Projects = (function() {
  function Projects(config) {
    this.config = config;
  }

  Projects.prototype.get = function(id, callback) {
    var params, url;
    params = serialize({
      id: id,
      secretKey: this.config.secretKey
    });
    url = "" + BASE_URL + "/project?" + params;
    return request.get(url, function(err, response) {
      var stream;
      if (err) {
        return callback(err);
      }
      if (response.statusCode !== 200) {
        return callback(response.body);
      }
      stream = JSON.parse(response.body);
      return callback(null, stream);
    });
  };

  return Projects;

})();

Streams = (function() {
  function Streams(config) {
    this.config = config;
  }

  Streams.prototype.create = function(callback) {
    var params;
    params = serialize({
      secretKey: this.config.secretKey
    });
    return request.post("" + BASE_URL + "/stream?" + params, function(err, response) {
      var stream;
      if (err) {
        return callback(err);
      }
      if (response.statusCode !== 200) {
        return callback(response.body);
      }
      stream = JSON.parse(response.body);
      return callback(null, stream);
    });
  };

  Streams.prototype.get = function(id, callback) {
    var params, url;
    params = serialize({
      id: id,
      secretKey: this.config.secretKey
    });
    url = "" + BASE_URL + "/stream?" + params;
    return request.get(url, function(err, response) {
      var stream;
      if (err) {
        return callback(err);
      }
      if (response.statusCode !== 200) {
        return callback(response.body);
      }
      stream = JSON.parse(response.body);
      return callback(null, stream);
    });
  };

  return Streams;

})();

CineIO = (function() {
  function CineIO(config) {
    this.config = config;
    this.projects = new Projects(this.config);
    this.streams = new Streams(this.config);
  }

  return CineIO;

})();

exports.init = function(config) {
  return new CineIO(config);
};
