# cine.io node pakage

[![Build Status](https://travis-ci.org/cine-io/cineio-node.svg?branch=master)](https://travis-ci.org/cine-io/cineio-node)

The [node package](https://www.npmjs.org/package/cine-io) for [cine.io](cine.io).

## Installation

```bash
npm install --save cine-io
```
## Usage

### Initialization

```javascript
CineIO = require('cine-io');
client = CineIO.init({secretKey: 'my secret'});
```

### Functions

#### Projects

To get data about your project:

```javascript
client.project.get(function(err, project){});
// project is a simple javascript object: {id: 'project id', name: 'project name', …}
```

To update your project attributes:

```javascript
// params
//  name: 'a new project name'
client.project.update(params, function(err, project){});
// project is a simple javascript object: {id: 'project id', name: 'a new project name', …}
```

To delete your project and all associated streams:

```javascript
client.project.destroy(function(err, project){});
// project is a simple javascript object that will include deletedAt: {id: 'project id', name: 'project name', deletedAt: 'ISO date' …}
```

#### Streams

To get all your streams:

```javascript
client.streams.index(function(err, streams){});
// streams is an array of javascript objects: [{id: 'stream id', play: {rtmp: 'the rtmp url', hls: 'the hls url'}, publish: {stream: 'the stream name', url: 'the publish url'}, …}, …]
```

To get a specific stream:

```javascript
client.streams.get('STREAM_ID', function(err, stream){});
// stream is a simple javascript object: {id: 'stream id', …}
```

To create a new stream:

```javascript
client.streams.create(function(err, stream){});
// stream is a simple javascript object: {id: 'stream id', …}
```

```javascript
// can optionally take params
// params:
//  name: 'an optional stream name'
client.streams.create(params, function(err, stream){});
// stream is a simple javascript object: {id: 'stream id', name: 'an optional stream name', …}
```

To update a stream:

```javascript
// params:
//  name: 'a new stream name'
client.streams.update(params, function(err, stream){});
// stream is a simple javascript object: {id: 'stream id', name: 'a new stream name', …}
```

To delete a specific new stream:

```javascript
client.streams.destroy('STREAM_ID', function(err, stream){});
// stream is a simple javascript object that will include deletedAt: {id: 'stream id', deletedAt: 'ISO Date', …}
```

To fetch the [Flash Media Live Encoder](http://www.adobe.com/products/flash-media-encoder.html) profile for a stream:

```javascript
client.streams.fmleProfile('STREAM_ID', function(err, profile){});
// profile is a string of the contents of the Flash Media Live Encoder profile.
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
