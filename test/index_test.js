var
  CineIO = require('../index')
  , requireFixture = function(name){
    return require("./nock/"+ name)();
  };

describe('CineIO', function(){

  it('initializes', function(){
    cine = CineIO.init({publicKey: 'my key', secretKey: 'my secret'})
    expect(cine.config).to.deep.equal({publicKey: 'my key', secretKey: 'my secret'})
  });

  describe('project', function(){
    beforeEach(function(){
      this.cine = CineIO.init({publicKey: 'my key', secretKey: 'MY SECRET'})
    });

    describe('get', function(){

      beforeEach(function(){
        this.stub = requireFixture('get_project')
      });

      it('fetches the project', function(done){
        var self = this;
        self.cine.project.get(function(err, project){
          expect(project.id).to.equal("THE PROJECT ID")
          expect(project.publicKey).to.equal("THE PROJECT PUBLIC KEY")
          expect(project.secretKey).to.equal("THE PROJECT SECRET KEY")
          expect(project.name).to.equal("THE PROJECT NAME")
          expect(project.plan).to.equal("THE PROJECT PLAN")
          expect(project.streamsCount).to.equal(10)

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    })

    describe('update', function(){

      beforeEach(function(){
        this.stub = requireFixture('update_project')
      });

      it('updates the project', function(done){
        var self = this;
        self.cine.project.update({name: 'new project name'}, function(err, project){
          expect(project.id).to.equal("THE PROJECT ID")
          expect(project.publicKey).to.equal("THE PROJECT PUBLIC KEY")
          expect(project.secretKey).to.equal("THE PROJECT SECRET KEY")
          expect(project.name).to.equal("new project name")
          expect(project.plan).to.equal("THE PROJECT PLAN")
          expect(project.streamsCount).to.equal(10)

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    })

    describe('destroy', function(){

      beforeEach(function(){
        this.stub = requireFixture('delete_project')
      });

      it('destroys the project', function(done){
        var self = this;
        self.cine.project.destroy(function(err, project){
          expect(project.id).to.equal("THE PROJECT ID")
          expect(project.deletedAt).to.equal("2014-06-09T20:41:06.619Z")

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    })

  });

  describe('streams', function(){
    beforeEach(function(){
      this.cine = CineIO.init({publicKey: 'my key', secretKey: 'MY SECRET'})
    });

    describe('index', function(){
      beforeEach(function(){
        this.stub = requireFixture('get_streams')
      });

      it('gets the streams', function(done){
        var self = this;
        self.cine.streams.index(function(err, streams){
          expect(streams).to.have.length(1)
          var stream = streams[0]
          expect(stream.id).to.equal("the stream id")
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    });

    describe('get', function(){
      beforeEach(function(){
        this.stub = requireFixture('get_stream')
      });

      it('gets a stream', function(done){
        var self = this;
        self.cine.streams.get('THE STREAM ID', function(err, stream){
          expect(stream.id).to.equal("the stream id")
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    });

    describe('fmleProfile', function(){
      beforeEach(function(){
        this.stub = requireFixture('get_fmle_profile')
      });

      it('gets a fmle profile for a stream', function(done){
        var self = this;
        self.cine.streams.fmleProfile('THE STREAM ID', function(err, profile){
          expect(profile).to.include("THE PROFILE")

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    });

    describe('create', function(){

      it('creates a stream', function(done){
        var stub = requireFixture('create_stream')
        this.cine.streams.create(function(err, stream){
          expect(stream.id).to.equal("the stream id")
          expect(stream.record).to.be.false
          expect(stream.name).to.be.undefined
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(stub.isDone()).to.be.true;
          done(err)
        })
      })

      it('creates a stream with a name', function(done){
        var stub = requireFixture('create_stream_with_name')
        this.cine.streams.create({name: 'new stream'}, function(err, stream){
          expect(stream.id).to.equal("the stream id")
          expect(stream.name).to.equal("new stream")
          expect(stream.record).to.be.false
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(stub.isDone()).to.be.true;
          done(err)
        })
      })

      it('creates a stream with record', function(done){
        var stub = requireFixture('create_stream_with_record')
        this.cine.streams.create({record: true}, function(err, stream){
          expect(stream.id).to.equal("the stream id")
          expect(stream.name).be.undefined
          expect(stream.record).to.be.true
          expect(stream.streamName).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(stub.isDone()).to.be.true;
          done(err)
        })
      })
    })

    describe('update', function(){
      beforeEach(function(){
        this.stub = requireFixture('update_stream')
      });

      it('updates a stream', function(done){
        var self = this;
        self.cine.streams.update('the stream id', {name: 'new stream name'}, function(err, stream){
          expect(stream.id).to.equal("the stream id")
          expect(stream.name).to.equal("new stream name")

          expect(self.stub.isDone()).to.be.true;
          done(err)
        })
      })
    })

    describe('destroy', function(){
      beforeEach(function(){
        this.stub = requireFixture('delete_stream')
      });

      it('destroys a stream', function(done){
        var self = this;
        self.cine.streams.destroy('THE STREAM ID', function(err, stream){
          expect(stream.id).to.equal("the stream id")
          expect(stream.deletedAt).to.equal('2014-06-09T20:41:06.619Z')
          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    });

  })

  describe('streams.recordings', function(){
    beforeEach(function(){
      this.cine = CineIO.init({publicKey: 'my key', secretKey: 'MY SECRET'})
    });

    describe('index', function(){
      beforeEach(function(){
        this.stub = requireFixture('get_stream_recordings')
      });

      it('gets the stream recordings', function(done){
        var self = this;
        self.cine.streams.recordings.index('THE STREAM ID', function(err, recordings){
          expect(recordings).to.have.length(2)
          var recording = recordings[0]
          expect(recording.name).to.equal("the recording name")
          expect(recording.url).to.equal("the recording url")
          expect(recording.date).to.equal("2034-05-17T00:00:00.000Z")
          expect(recording.size).to.equal(12345)

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    });

    describe('destroy', function(){
      beforeEach(function(){
        this.stub = requireFixture('delete_stream_recording')
      });

      it('deletes a stream recordings', function(done){
        var self = this;
        self.cine.streams.recordings.destroy('THE STREAM ID', 'the recording name', function(err, streamRecording){
          expect(streamRecording.deletedAt).to.equal('2014-06-09T20:42:06.619Z')
          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    });

  })

})
