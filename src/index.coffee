request = require('request')
API_VERSION = 1
BASE_URL = "https://www.cine.io/api/#{API_VERSION}/-"

# http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
serialize = (obj) ->
  str = []
  for p of obj
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])) if obj.hasOwnProperty(p)
  str.join "&"

class Projects
  constructor: (@config)->
  get: (callback)->
    params = serialize(secretKey: @config.secretKey)
    url = "#{BASE_URL}/project?#{params}"
    request.get url, (err, response)->
      return callback(err) if err
      return callback(response.body) unless response.statusCode == 200
      stream = JSON.parse(response.body)
      callback(null, stream)

class Streams
  constructor: (@config)->
  # callback(err, stream)
  create: (callback)->
    params = serialize(secretKey: @config.secretKey)
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

class CineIO
  constructor: (@config)->
    @projects = new Projects(@config)
    @streams = new Streams(@config)

exports.init = (config)->
  new CineIO(config)
