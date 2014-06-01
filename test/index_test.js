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
          expect(stream.id).to.equal("the stream id")
          expect(stream.name).to.equal("the stream name")
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
          expect(stream.name).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    });
    describe('create', function(){
      beforeEach(function(){
        this.stub = requireFixture('create_stream')
      });

      it('creates a stream', function(done){
        var self = this;
        self.cine.streams.create(function(err, stream){
          expect(stream.id).to.equal("the stream id")
          expect(stream.name).to.equal("the stream name")
          expect(stream.expiration).to.equal("2034-05-17T00:00:00.000Z")
          expect(stream.password).to.equal("the stream password")
          expect(stream.play).to.deep.equal({hls: "the hls url", rtmp: "the rtmp url"})
          expect(stream.publish).to.deep.equal({url: "the publish url", stream: "the publish stream"})

          expect(self.stub.isDone()).to.be.true;
          done(err)
        });
      });
    })
  });

});
