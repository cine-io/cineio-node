process.env.NODE_ENV ||= 'test'
process.env.TZ = 'UTC'

chai = require("chai")
chai.config.includeStack = true
global.expect = chai.expect
global.sinon = require("sinon")
global.nock = require('nock')
nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')
# nock.recorder.rec()
