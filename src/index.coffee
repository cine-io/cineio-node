request = require('request')
API_VERSION = 1
BASE_URL = "https://www.cine.io/api/#{API_VERSION}/-"
CURRENT_VERSION = require('./package.json').version

# http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
serialize = (obj) ->
  str = []
  for p of obj
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])) if obj.hasOwnProperty(p)
  str.join "&"

responseCallback = (callback, key)->
  return (err, response)->
    return callback(err) if err
    return callback(response.body) unless response.statusCode == 200
    jsonResponse = JSON.parse(response.body)
    jsonResponse = jsonResponse[key] if key
    callback(null, jsonResponse)

requestOptions = (url)->
  url: url
  headers:
    'User-Agent': "cineio-node version-#{CURRENT_VERSION}"

class ProjectsHandler
  constructor: (@config)->

  # callback(err, project)
  get: (callback)->
    params = serialize(secretKey: @config.secretKey)
    url = "#{BASE_URL}/project?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, project)
  update: (params, callback)->
    params.secretKey = @config.secretKey
    params = serialize(params)
    url = "#{BASE_URL}/project?#{params}"
    request.put requestOptions(url), responseCallback(callback)

  # callback(err, project)
  destroy: (callback)->
    params = serialize(secretKey: @config.secretKey)
    url = "#{BASE_URL}/project?#{params}"
    request.del requestOptions(url), responseCallback(callback)

class StreamsHandler
  constructor: (@config)->
    @recordings = new StreamRecordingsHandler(@config)

  # callback(err, stream)
  create: (params, callback)->
    if typeof params == 'function'
      callback = params
      params = {}
    params.secretKey = @config.secretKey
    params = serialize(params)
    url = "#{BASE_URL}/stream?#{params}"
    request.post requestOptions(url), responseCallback(callback)

  # callback(err, stream)
  get: (id, callback)->
    params = serialize(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, profile (String))
  fmleProfile: (id, callback)->
    params = serialize(id: id, secretKey: @config.secretKey, fmleProfile: true)
    url = "#{BASE_URL}/stream?#{params}"
    request.get requestOptions(url), responseCallback(callback, 'content')

  # callback(err, stream)
  update: (id, params, callback)->
    params.secretKey = @config.secretKey
    params.id = id
    params = serialize(params)
    url = "#{BASE_URL}/stream?#{params}"
    request.put requestOptions(url), responseCallback(callback)

  # callback(err, streams)
  index: (callback)->
    params = serialize(secretKey: @config.secretKey)
    url = "#{BASE_URL}/streams?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, stream)
  destroy: (id, callback)->
    params = serialize(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream?#{params}"
    request.del requestOptions(url), responseCallback(callback)

class StreamRecordingsHandler
  constructor: (@config)->

  # callback(err, streamRecordings)
  index: (id, callback)->
    params = serialize(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream/recordings?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, streamRecording)
  destroy: (id, recordingName, callback)->
    params = serialize(id: id, secretKey: @config.secretKey, name: recordingName)
    url = "#{BASE_URL}/stream/recording?#{params}"
    request.del requestOptions(url), responseCallback(callback)

class CineIO
  constructor: (@config)->
    @project = new ProjectsHandler(@config)
    @streams = new StreamsHandler(@config)

exports.init = (config)->
  new CineIO(config)
