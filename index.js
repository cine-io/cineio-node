(function() {
  var API_VERSION, BASE_URL, CURRENT_VERSION, CineIO, Peer, ProjectHandler, ProjectsHandler, StreamRecordingsHandler, StreamsHandler, UsageHandler, crypto, qs, request, requestOptions, responseCallback;

  crypto = require('crypto');

  request = require('request');

  qs = require('qs');

  API_VERSION = 1;

  BASE_URL = "https://www.cine.io/api/" + API_VERSION + "/-";

  CURRENT_VERSION = require('./package.json').version;

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

    ProjectsHandler.prototype.index = function(callback) {
      var params, url;
      params = qs.stringify({
        masterKey: this.config.masterKey
      });
      url = "" + BASE_URL + "/projects?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    return ProjectsHandler;

  })();

  ProjectHandler = (function() {
    function ProjectHandler(config) {
      this.config = config;
    }

    ProjectHandler.prototype.get = function(callback) {
      var params, url;
      params = qs.stringify({
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/project?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    ProjectHandler.prototype.update = function(params, callback) {
      var url;
      params.secretKey = this.config.secretKey;
      params = qs.stringify(params);
      url = "" + BASE_URL + "/project?" + params;
      return request.put(requestOptions(url), responseCallback(callback));
    };

    ProjectHandler.prototype.destroy = function(callback) {
      var params, url;
      params = qs.stringify({
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/project?" + params;
      return request.del(requestOptions(url), responseCallback(callback));
    };

    return ProjectHandler;

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
      params = qs.stringify(params);
      url = "" + BASE_URL + "/stream?" + params;
      return request.post(requestOptions(url), responseCallback(callback));
    };

    StreamsHandler.prototype.get = function(id, callback) {
      var params, url;
      params = qs.stringify({
        id: id,
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/stream?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    StreamsHandler.prototype.fmleProfile = function(id, callback) {
      var params, url;
      params = qs.stringify({
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
      params = qs.stringify(params);
      url = "" + BASE_URL + "/stream?" + params;
      return request.put(requestOptions(url), responseCallback(callback));
    };

    StreamsHandler.prototype.index = function(params, callback) {
      var url;
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      params.secretKey = this.config.secretKey;
      params = qs.stringify(params);
      url = "" + BASE_URL + "/streams?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    StreamsHandler.prototype.destroy = function(id, callback) {
      var params, url;
      params = qs.stringify({
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
      params = qs.stringify({
        id: id,
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/stream/recordings?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    StreamRecordingsHandler.prototype.destroy = function(id, recordingName, callback) {
      var params, url;
      params = qs.stringify({
        id: id,
        secretKey: this.config.secretKey,
        name: recordingName
      });
      url = "" + BASE_URL + "/stream/recording?" + params;
      return request.del(requestOptions(url), responseCallback(callback));
    };

    return StreamRecordingsHandler;

  })();

  UsageHandler = (function() {
    function UsageHandler(config) {
      this.config = config;
    }

    UsageHandler.prototype.project = function(options, callback) {
      var params, url;
      params = qs.stringify({
        month: options.month.toISOString(),
        report: options.report,
        secretKey: this.config.secretKey
      });
      url = "" + BASE_URL + "/usage/project?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    UsageHandler.prototype.stream = function(id, options, callback) {
      var params, url;
      params = qs.stringify({
        month: options.month.toISOString(),
        report: options.report,
        secretKey: this.config.secretKey,
        id: id
      });
      url = "" + BASE_URL + "/usage/stream?" + params;
      return request.get(requestOptions(url), responseCallback(callback));
    };

    return UsageHandler;

  })();

  Peer = (function() {
    var generateSignature;

    function Peer(config) {
      this.config = config;
    }

    generateSignature = function(identity, timestamp, secretKey) {
      var shasum, signatureToSha;
      shasum = crypto.createHash('sha1');
      signatureToSha = "identity=" + identity + "&timestamp=" + timestamp + secretKey;
      shasum.update(signatureToSha);
      return shasum.digest('hex');
    };

    Peer.prototype.generateIdentitySignature = function(identity) {
      var response, signature, timestamp;
      timestamp = Math.floor(Date.now() / 1000);
      signature = generateSignature(identity, timestamp, this.config.secretKey);
      response = {
        timestamp: timestamp,
        signature: signature,
        identity: identity
      };
      return response;
    };

    return Peer;

  })();

  CineIO = (function() {
    function CineIO(config) {
      this.config = config;
      this.projects = new ProjectsHandler(this.config);
      this.project = new ProjectHandler(this.config);
      this.streams = new StreamsHandler(this.config);
      this.usage = new UsageHandler(this.config);
      this.peer = new Peer(this.config);
    }

    return CineIO;

  })();

  exports.init = function(config) {
    return new CineIO(config);
  };

}).call(this);
