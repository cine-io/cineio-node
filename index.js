var API_VERSION, BASE_URL, CineIO, ProjectsHandler, StreamsHandler, request, serialize;

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

ProjectsHandler = (function() {
  function ProjectsHandler(config) {
    this.config = config;
  }

  ProjectsHandler.prototype.get = function(callback) {
    var params, url;
    params = serialize({
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

  return ProjectsHandler;

})();

StreamsHandler = (function() {
  function StreamsHandler(config) {
    this.config = config;
  }

  StreamsHandler.prototype.create = function(callback) {
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

  StreamsHandler.prototype.get = function(id, callback) {
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

  StreamsHandler.prototype.fmleProfile = function(id, callback) {
    var params, url;
    params = serialize({
      id: id,
      secretKey: this.config.secretKey,
      fmleProfile: true
    });
    url = "" + BASE_URL + "/stream?" + params;
    return request.get(url, function(err, response) {
      if (err) {
        return callback(err);
      }
      if (response.statusCode !== 200) {
        return callback(response.body);
      }
      response = JSON.parse(response.body);
      return callback(null, response.content);
    });
  };

  StreamsHandler.prototype.index = function(callback) {
    var params, url;
    params = serialize({
      secretKey: this.config.secretKey
    });
    url = "" + BASE_URL + "/streams?" + params;
    return request.get(url, function(err, response) {
      var streams;
      if (err) {
        return callback(err);
      }
      if (response.statusCode !== 200) {
        return callback(response.body);
      }
      streams = JSON.parse(response.body);
      return callback(null, streams);
    });
  };

  return StreamsHandler;

})();

CineIO = (function() {
  function CineIO(config) {
    this.config = config;
    this.project = new ProjectsHandler(this.config);
    this.streams = new StreamsHandler(this.config);
  }

  return CineIO;

})();

exports.init = function(config) {
  return new CineIO(config);
};
