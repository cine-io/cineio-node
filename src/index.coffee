crypto = require('crypto')
request = require('request')
qs = require('qs')
API_VERSION = 1
BASE_URL = "https://www.cine.io/api/#{API_VERSION}/-"
CURRENT_VERSION = require('./package.json').version

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

  # callback(err, projects)
  index: (callback)->
    params = qs.stringify(masterKey: @config.masterKey)
    url = "#{BASE_URL}/projects?#{params}"
    request.get requestOptions(url), responseCallback(callback)

class ProjectHandler
  constructor: (@config)->

  # callback(err, project)
  get: (callback)->
    params = qs.stringify(secretKey: @config.secretKey)
    url = "#{BASE_URL}/project?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, project)
  update: (params, callback)->
    params.secretKey = @config.secretKey
    params = qs.stringify(params)
    url = "#{BASE_URL}/project?#{params}"
    request.put requestOptions(url), responseCallback(callback)

  # callback(err, project)
  destroy: (callback)->
    params = qs.stringify(secretKey: @config.secretKey)
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
    params = qs.stringify(params)
    url = "#{BASE_URL}/stream?#{params}"
    request.post requestOptions(url), responseCallback(callback)

  # callback(err, stream)
  get: (id, callback)->
    params = qs.stringify(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, profile (String))
  fmleProfile: (id, callback)->
    params = qs.stringify(id: id, secretKey: @config.secretKey, fmleProfile: true)
    url = "#{BASE_URL}/stream?#{params}"
    request.get requestOptions(url), responseCallback(callback, 'content')

  # callback(err, stream)
  update: (id, params, callback)->
    params.secretKey = @config.secretKey
    params.id = id
    params = qs.stringify(params)
    url = "#{BASE_URL}/stream?#{params}"
    request.put requestOptions(url), responseCallback(callback)

  # callback(err, streams)
  index: (params, callback)->
    if typeof params == 'function'
      callback = params
      params = {}
    params.secretKey = @config.secretKey
    params = qs.stringify(params)
    url = "#{BASE_URL}/streams?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, stream)
  destroy: (id, callback)->
    params = qs.stringify(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream?#{params}"
    request.del requestOptions(url), responseCallback(callback)

class StreamRecordingsHandler
  constructor: (@config)->

  # callback(err, streamRecordings)
  index: (id, callback)->
    params = qs.stringify(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream/recordings?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, streamRecording)
  destroy: (id, recordingName, callback)->
    params = qs.stringify(id: id, secretKey: @config.secretKey, name: recordingName)
    url = "#{BASE_URL}/stream/recording?#{params}"
    request.del requestOptions(url), responseCallback(callback)

class UsageHandler
  constructor: (@config)->

  # callback(err, usageReport)
  project: (options, callback)->
    params = qs.stringify
      month: options.month.toISOString()
      report: options.report
      secretKey: @config.secretKey

    url = "#{BASE_URL}/usage/project?#{params}"
    request.get requestOptions(url), responseCallback(callback)

  # callback(err, usageReport)
  stream: (id, options, callback)->
    params = qs.stringify
      month: options.month.toISOString()
      report: options.report
      secretKey: @config.secretKey
      id: id
    url = "#{BASE_URL}/usage/stream?#{params}"
    request.get requestOptions(url), responseCallback(callback)

class Peer
  constructor: (@config)->
  generateSignature = (identity, timestamp, secretKey)->
    shasum = crypto.createHash('sha1')

    signatureToSha = "identity=#{identity}&timestamp=#{timestamp}#{secretKey}"
    shasum.update(signatureToSha)
    shasum.digest('hex')

  generateIdentitySignature: (identity)->
    timestamp = Math.floor(Date.now() / 1000)
    signature = generateSignature(identity, timestamp, @config.secretKey)
    response =
      timestamp:  timestamp
      signature: signature
      identity: identity
    return response

class CineIO
  constructor: (@config)->
    @projects = new ProjectsHandler(@config)
    @project = new ProjectHandler(@config)
    @streams = new StreamsHandler(@config)
    @usage = new UsageHandler(@config)
    @peer = new Peer(@config)

exports.init = (config)->
  new CineIO(config)
