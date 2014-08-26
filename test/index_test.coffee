CineIO = require('../index')
requireFixture = (name)->
  require("./nock/"+ name)()

describe 'CineIO', ->

  it 'initializes', ->
    cine = CineIO.init {publicKey: 'my key', secretKey: 'my secret'}
    expect(cine.config).to.deep.equal {publicKey: 'my key', secretKey: 'my secret'}

  describe 'projects', ->
    beforeEach ->
      @cine = CineIO.init {masterKey: 'MY MASTER KEY'}

    describe 'index', ->

      beforeEach ->
        @stub = requireFixture('get_projects')

      it 'fetches the project', (done)->
        @cine.projects.index (err, projects)=>
          expect(projects).to.have.length(2)
          project = projects[0]
          project2 = projects[1]
          expect(project.id).to.equal("THE PROJECT ID")
          expect(project.publicKey).to.equal("THE PROJECT PUBLIC KEY")
          expect(project.secretKey).to.equal("THE PROJECT SECRET KEY")
          expect(project.name).to.equal("THE PROJECT NAME")
          expect(project.streamsCount).to.equal(10)
          expect(project2.id).to.equal("THE SECOND PROJECT ID")
          expect(project2.publicKey).to.equal("THE SECOND PROJECT PUBLIC KEY")
          expect(project2.secretKey).to.equal("THE SECOND PROJECT SECRET KEY")
          expect(project2.name).to.equal("THE SECOND PROJECT NAME")
          expect(project2.streamsCount).to.equal(10)

          expect(@stub.isDone()).to.be.true
          done(err)

  describe 'project', ->
    beforeEach ->
      @cine = CineIO.init {publicKey: 'my key', secretKey: 'MY SECRET'}

    describe 'get', ->

      beforeEach ->
        @stub = requireFixture('get_project')

      it 'fetches the project', (done)->
        @cine.project.get (err, project)=>
          expect(project.id).to.equal("THE PROJECT ID")
          expect(project.publicKey).to.equal("THE PROJECT PUBLIC KEY")
          expect(project.secretKey).to.equal("THE PROJECT SECRET KEY")
          expect(project.name).to.equal("THE PROJECT NAME")
          expect(project.plan).to.equal("THE PROJECT PLAN")
          expect(project.streamsCount).to.equal(10)

          expect(@stub.isDone()).to.be.true
          done(err)

    describe 'update', ->

      beforeEach ->
        @stub = requireFixture('update_project')

      it 'updates the project', (done)->
        @cine.project.update {name: 'new project name'}, (err, project)=>
          expect(project.id).to.equal("THE PROJECT ID")
          expect(project.publicKey).to.equal("THE PROJECT PUBLIC KEY")
          expect(project.secretKey).to.equal("THE PROJECT SECRET KEY")
          expect(project.name).to.equal("new project name")
          expect(project.plan).to.equal("THE PROJECT PLAN")
          expect(project.streamsCount).to.equal(10)

          expect(@stub.isDone()).to.be.true
          done(err)

    describe 'destroy', ->

      beforeEach ->
        @stub = requireFixture('delete_project')

      it 'destroys the project', (done)->
        @cine.project.destroy (err, project)=>
          expect(project.id).to.equal("THE PROJECT ID")
          expect(project.deletedAt).to.equal("2014-06-09T20:41:06.619Z")

          expect(@stub.isDone()).to.be.true
          done(err)


  describe 'streams', ->
    beforeEach ->
      @cine = CineIO.init {publicKey: 'my key', secretKey: 'MY SECRET'}

    describe 'index', ->
      beforeEach ->
        @stub = requireFixture('get_streams')

      it 'gets the streams', (done)->
        @cine.streams.index (err, streams)=>
          expect(streams).to.have.length(1)
          stream = streams[0]
          expect(stream.id).to.equal("the stream id")
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(@stub.isDone()).to.be.true
          done(err)

    describe 'get', ->
      beforeEach ->
        @stub = requireFixture('get_stream')

      it 'gets a stream', (done)->
        @cine.streams.get 'THE STREAM ID', (err, stream)=>
          expect(stream.id).to.equal("the stream id")
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(@stub.isDone()).to.be.true
          done(err)

    describe 'fmleProfile', ->
      beforeEach ->
        @stub = requireFixture('get_fmle_profile')

      it 'gets a fmle profile for a stream', (done)->
        @cine.streams.fmleProfile 'THE STREAM ID', (err, profile)=>
          expect(profile).to.include("THE PROFILE")

          expect(@stub.isDone()).to.be.true
          done(err)

    describe 'create', ->

      it 'creates a stream', (done)->
        stub = requireFixture('create_stream')
        @cine.streams.create (err, stream)->
          expect(stream.id).to.equal("the stream id")
          expect(stream.record).to.be.false
          expect(stream.name).to.be.undefined
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(stub.isDone()).to.be.true
          done(err)

      it 'creates a stream with a name', (done)->
        stub = requireFixture('create_stream_with_name')
        @cine.streams.create {name: 'new stream'}, (err, stream)->
          expect(stream.id).to.equal("the stream id")
          expect(stream.name).to.equal("new stream")
          expect(stream.record).to.be.false
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(stub.isDone()).to.be.true
          done(err)

      it 'creates a stream with record', (done)->
        stub = requireFixture('create_stream_with_record')
        @cine.streams.create {record: true}, (err, stream)->
          expect(stream.id).to.equal("the stream id")
          expect(stream.name).be.undefined
          expect(stream.record).to.be.true
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(stub.isDone()).to.be.true
          done(err)

    describe 'update', ->
      beforeEach ->
        @stub = requireFixture('update_stream')

      it 'updates a stream', (done)->
        @cine.streams.update 'the stream id', {name: 'new stream name'}, (err, stream)=>
          expect(stream.id).to.equal("the stream id")
          expect(stream.name).to.equal("new stream name")

          expect(@stub.isDone()).to.be.true
          done(err)

    describe 'destroy', ->
      beforeEach ->
        @stub = requireFixture('delete_stream')

      it 'destroys a stream', (done)->
        @cine.streams.destroy 'THE STREAM ID', (err, stream)=>
          expect(stream.id).to.equal("the stream id")
          expect(stream.deletedAt).to.equal('2014-06-09T20:41:06.619Z')
          expect(@stub.isDone()).to.be.true
          done(err)


  describe 'streams.recordings', ->
    beforeEach ->
      @cine = CineIO.init {publicKey: 'my key', secretKey: 'MY SECRET'}

    describe 'index', ->
      beforeEach ->
        @stub = requireFixture('get_stream_recordings')

      it 'gets the stream recordings', (done)->
        @cine.streams.recordings.index 'THE STREAM ID', (err, recordings)=>
          expect(recordings).to.have.length(2)
          recording = recordings[0]
          expect(recording.name).to.equal("the recording name")
          expect(recording.url).to.equal("the recording url")
          expect(recording.date).to.equal("2034-05-17T00:00:00.000Z")
          expect(recording.size).to.equal(12345)

          expect(@stub.isDone()).to.be.true
          done(err)

    describe 'destroy', ->
      beforeEach ->
        @stub = requireFixture('delete_stream_recording')

      it 'deletes a stream recordings', (done)->
        @cine.streams.recordings.destroy 'THE STREAM ID', 'the recording name', (err, streamRecording)=>
          expect(streamRecording.deletedAt).to.equal('2014-06-09T20:42:06.619Z')
          expect(@stub.isDone()).to.be.true
          done(err)
