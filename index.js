(function() {
  var API_VERSION, BASE_URL, CURRENT_VERSION, CineIO, ProjectsHandler, StreamRecordingsHandler, StreamsHandler, request, requestOptions, responseCallback, serialize;

  request = require('request');

  API_VERSION = 1;

  BASE_URL = "https://www.cine.io/api/" + API_VERSION + "/-";

  CURRENT_VERSION = require('./package.json').version;

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

  responseCallback = function(callback, key) {
    return function(err, response) {
      var jsonResponse;
      if (err) {
        return callback(err);
      }
      if (response.statusCode !== 200) {
        return callback(response.body);
      }
      jsonResponse = JSON.parse(response.body);
      if (key) {
        jsonResponse = jsonResponse[key];
      }
      return callback(null, jsonResponse);
    };
  };

  requestOptions = function(url) {
    return {
      url: url,
      headers: {
        'User-Agent': "cineio-node version-" + CURRENT_VERSION
      }
    };
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
      return request.get(requestOptions(url), responseCallback(callback));
    };

    ProjectsHandler.prototype.update = function(params, callback) {
      var url;
      params.secretKey = this.config.secretKey;
      params = serialize(params);
      url = "" + BASE_URL + "/project?" + params;
      return request.put(requestOptions(url), responseCallback(callback));
    };

    ProjectsHandler.prototype.destroy = function(callback) {
      var params, url;
      params = serialize({
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/project?" + params;
      return request.del(requestOptions(url), responseCallback(callback));
    };

    return ProjectsHandler;

  })();

  StreamsHandler = (function() {
    function StreamsHandler(config) {
      this.config = config;
      this.recordings = new StreamRecordingsHandler(this.config);
    }

    StreamsHandler.prototype.create = function(params, callback) {
      var url;
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      params.secretKey = this.config.secretKey;
      params = serialize(params);
      url = "" + BASE_URL + "/stream?" + params;
      return request.post(requestOptions(url), responseCallback(callback));
    };

    StreamsHandler.prototype.get = function(id, callback) {
      var params, url;
      params = serialize({
        id: id,
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/stream?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    StreamsHandler.prototype.fmleProfile = function(id, callback) {
      var params, url;
      params = serialize({
        id: id,
        secretKey: this.config.secretKey,
        fmleProfile: true
      });
      url = "" + BASE_URL + "/stream?" + params;
      return request.get(requestOptions(url), responseCallback(callback, 'content'));
    };

    StreamsHandler.prototype.update = function(id, params, callback) {
      var url;
      params.secretKey = this.config.secretKey;
      params.id = id;
      params = serialize(params);
      url = "" + BASE_URL + "/stream?" + params;
      return request.put(requestOptions(url), responseCallback(callback));
    };

    StreamsHandler.prototype.index = function(callback) {
      var params, url;
      params = serialize({
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/streams?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    StreamsHandler.prototype.destroy = function(id, callback) {
      var params, url;
      params = serialize({
        id: id,
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/stream?" + params;
      return request.del(requestOptions(url), responseCallback(callback));
    };

    return StreamsHandler;

  })();

  StreamRecordingsHandler = (function() {
    function StreamRecordingsHandler(config) {
      this.config = config;
    }

    StreamRecordingsHandler.prototype.index = function(id, callback) {
      var params, url;
      params = serialize({
        id: id,
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/stream/recordings?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    StreamRecordingsHandler.prototype.destroy = function(id, recordingName, callback) {
      var params, url;
      params = serialize({
        id: id,
        secretKey: this.config.secretKey,
        name: recordingName
      });
      url = "" + BASE_URL + "/stream/recording?" + params;
      return request.del(requestOptions(url), responseCallback(callback));
    };

    return StreamRecordingsHandler;

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

}).call(this);
