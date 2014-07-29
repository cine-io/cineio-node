request = require('request')
API_VERSION = 1
BASE_URL = "https://www.cine.io/api/#{API_VERSION}/-"

# http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
serialize = (obj) ->
  str = []
  for p of obj
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])) if obj.hasOwnProperty(p)
  str.join "&"

class ProjectsHandler
  constructor: (@config)->

  get: (callback)->
    params = serialize(secretKey: @config.secretKey)
    url = "#{BASE_URL}/project?#{params}"
    request.get url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      project = JSON.parse(response.body)
      callback(null, project)

  update: (params, callback)->
    params.secretKey = @config.secretKey
    params = serialize(params)
    url = "#{BASE_URL}/project?#{params}"
    request.put url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      project = JSON.parse(response.body)
      callback(null, project)

  destroy: (callback)->
    params = serialize(secretKey: @config.secretKey)
    url = "#{BASE_URL}/project?#{params}"
    request.del url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      project = JSON.parse(response.body)
      callback(null, project)

class StreamsHandler
  constructor: (@config)->

  # callback(err, stream)
  create: (params, callback)->
    if typeof params == 'function'
      callback = params
      params = {}
    params.secretKey = @config.secretKey
    params = serialize(params)
    request.post "#{BASE_URL}/stream?#{params}", (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      stream = JSON.parse(response.body)
      callback(null, stream)

  # callback(err, stream)
  get: (id, callback)->
    params = serialize(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream?#{params}"
    request.get url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      stream = JSON.parse(response.body)
      callback(null, stream)

  # callback(err, streamRecordings)
  recordings: (id, callback)->
    params = serialize(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream/recordings?#{params}"
    request.get url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      streamRecordings = JSON.parse(response.body)
      callback(null, streamRecordings)

  # callback(err, profile)
  fmleProfile: (id, callback)->
    params = serialize(id: id, secretKey: @config.secretKey, fmleProfile: true)
    url = "#{BASE_URL}/stream?#{params}"
    request.get url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      response = JSON.parse(response.body)
      callback(null, response.content)

  update: (id, params, callback)->
    params.secretKey = @config.secretKey
    params.id = id
    params = serialize(params)
    url = "#{BASE_URL}/stream?#{params}"
    request.put url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      project = JSON.parse(response.body)
      callback(null, project)

  # callback(err, streams)
  index: (callback)->
    params = serialize(secretKey: @config.secretKey)
    url = "#{BASE_URL}/streams?#{params}"
    request.get url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      streams = JSON.parse(response.body)
      callback(null, streams)

  # callback(err, stream)
  destroy: (id, callback)->
    params = serialize(id: id, secretKey: @config.secretKey)
    url = "#{BASE_URL}/stream?#{params}"
    request.del url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      stream = JSON.parse(response.body)
      callback(null, stream)

class CineIO
  constructor: (@config)->
    @project = new ProjectsHandler(@config)
    @streams = new StreamsHandler(@config)

exports.init = (config)->
  new CineIO(config)
