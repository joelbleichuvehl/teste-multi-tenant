'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Inquilino = mongoose.model('Inquilino'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  inquilino;

/**
 * Inquilino routes tests
 */
describe('Inquilino CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new inquilino
    user.save(function () {
      inquilino = {
        title: 'Inquilino Title',
        content: 'Inquilino Content'
      };

      done();
    });
  });

  it('should be able to save an inquilino if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new inquilino
        agent.post('/api/inquilinos')
          .send(inquilino)
          .expect(200)
          .end(function (inquilinoSaveErr, inquilinoSaveRes) {
            // Handle inquilino save error
            if (inquilinoSaveErr) {
              return done(inquilinoSaveErr);
            }

            // Get a list of inquilinos
            agent.get('/api/inquilinos')
              .end(function (inquilinosGetErr, inquilinosGetRes) {
                // Handle inquilino save error
                if (inquilinosGetErr) {
                  return done(inquilinosGetErr);
                }

                // Get inquilinos list
                var inquilinos = inquilinosGetRes.body;

                // Set assertions
                (inquilinos[0].user._id).should.equal(userId);
                (inquilinos[0].title).should.match('Inquilino Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an inquilino if not logged in', function (done) {
    agent.post('/api/inquilinos')
      .send(inquilino)
      .expect(403)
      .end(function (inquilinoSaveErr, inquilinoSaveRes) {
        // Call the assertion callback
        done(inquilinoSaveErr);
      });
  });

  it('should not be able to save an inquilino if no title is provided', function (done) {
    // Invalidate title field
    inquilino.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new inquilino
        agent.post('/api/inquilinos')
          .send(inquilino)
          .expect(400)
          .end(function (inquilinoSaveErr, inquilinoSaveRes) {
            // Set message assertion
            (inquilinoSaveRes.body.message).should.match('Title cannot be blank');

            // Handle inquilino save error
            done(inquilinoSaveErr);
          });
      });
  });

  it('should be able to update an inquilino if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new inquilino
        agent.post('/api/inquilinos')
          .send(inquilino)
          .expect(200)
          .end(function (inquilinoSaveErr, inquilinoSaveRes) {
            // Handle inquilino save error
            if (inquilinoSaveErr) {
              return done(inquilinoSaveErr);
            }

            // Update inquilino title
            inquilino.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing inquilino
            agent.put('/api/inquilinos/' + inquilinoSaveRes.body._id)
              .send(inquilino)
              .expect(200)
              .end(function (inquilinoUpdateErr, inquilinoUpdateRes) {
                // Handle inquilino update error
                if (inquilinoUpdateErr) {
                  return done(inquilinoUpdateErr);
                }

                // Set assertions
                (inquilinoUpdateRes.body._id).should.equal(inquilinoSaveRes.body._id);
                (inquilinoUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of inquilinos if not signed in', function (done) {
    // Create new inquilino model instance
    var inquilinoObj = new Inquilino(inquilino);

    // Save the inquilino
    inquilinoObj.save(function () {
      // Request inquilinos
      request(app).get('/api/inquilinos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single inquilino if not signed in', function (done) {
    // Create new inquilino model instance
    var inquilinoObj = new Inquilino(inquilino);

    // Save the inquilino
    inquilinoObj.save(function () {
      request(app).get('/api/inquilinos/' + inquilinoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', inquilino.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single inquilino with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/inquilinos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Inquilino is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single inquilino which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent inquilino
    request(app).get('/api/inquilinos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No inquilino with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an inquilino if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new inquilino
        agent.post('/api/inquilinos')
          .send(inquilino)
          .expect(200)
          .end(function (inquilinoSaveErr, inquilinoSaveRes) {
            // Handle inquilino save error
            if (inquilinoSaveErr) {
              return done(inquilinoSaveErr);
            }

            // Delete an existing inquilino
            agent.delete('/api/inquilinos/' + inquilinoSaveRes.body._id)
              .send(inquilino)
              .expect(200)
              .end(function (inquilinoDeleteErr, inquilinoDeleteRes) {
                // Handle inquilino error error
                if (inquilinoDeleteErr) {
                  return done(inquilinoDeleteErr);
                }

                // Set assertions
                (inquilinoDeleteRes.body._id).should.equal(inquilinoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an inquilino if not signed in', function (done) {
    // Set inquilino user
    inquilino.user = user;

    // Create new inquilino model instance
    var inquilinoObj = new Inquilino(inquilino);

    // Save the inquilino
    inquilinoObj.save(function () {
      // Try deleting inquilino
      request(app).delete('/api/inquilinos/' + inquilinoObj._id)
        .expect(403)
        .end(function (inquilinoDeleteErr, inquilinoDeleteRes) {
          // Set message assertion
          (inquilinoDeleteRes.body.message).should.match('User is not authorized');

          // Handle inquilino error error
          done(inquilinoDeleteErr);
        });

    });
  });

  it('should be able to get a single inquilino that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new inquilino
          agent.post('/api/inquilinos')
            .send(inquilino)
            .expect(200)
            .end(function (inquilinoSaveErr, inquilinoSaveRes) {
              // Handle inquilino save error
              if (inquilinoSaveErr) {
                return done(inquilinoSaveErr);
              }

              // Set assertions on new inquilino
              (inquilinoSaveRes.body.title).should.equal(inquilino.title);
              should.exist(inquilinoSaveRes.body.user);
              should.equal(inquilinoSaveRes.body.user._id, orphanId);

              // force the inquilino to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the inquilino
                    agent.get('/api/inquilinos/' + inquilinoSaveRes.body._id)
                      .expect(200)
                      .end(function (inquilinoInfoErr, inquilinoInfoRes) {
                        // Handle inquilino error
                        if (inquilinoInfoErr) {
                          return done(inquilinoInfoErr);
                        }

                        // Set assertions
                        (inquilinoInfoRes.body._id).should.equal(inquilinoSaveRes.body._id);
                        (inquilinoInfoRes.body.title).should.equal(inquilino.title);
                        should.equal(inquilinoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single inquilino if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new inquilino model instance
    inquilino.user = user;
    var inquilinoObj = new Inquilino(inquilino);

    // Save the inquilino
    inquilinoObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new inquilino
          agent.post('/api/inquilinos')
            .send(inquilino)
            .expect(200)
            .end(function (inquilinoSaveErr, inquilinoSaveRes) {
              // Handle inquilino save error
              if (inquilinoSaveErr) {
                return done(inquilinoSaveErr);
              }

              // Get the inquilino
              agent.get('/api/inquilinos/' + inquilinoSaveRes.body._id)
                .expect(200)
                .end(function (inquilinoInfoErr, inquilinoInfoRes) {
                  // Handle inquilino error
                  if (inquilinoInfoErr) {
                    return done(inquilinoInfoErr);
                  }

                  // Set assertions
                  (inquilinoInfoRes.body._id).should.equal(inquilinoSaveRes.body._id);
                  (inquilinoInfoRes.body.title).should.equal(inquilino.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (inquilinoInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single inquilino if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new inquilino model instance
    var inquilinoObj = new Inquilino(inquilino);

    // Save the inquilino
    inquilinoObj.save(function () {
      request(app).get('/api/inquilinos/' + inquilinoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', inquilino.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single inquilino, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Inquilino
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new inquilino
          agent.post('/api/inquilinos')
            .send(inquilino)
            .expect(200)
            .end(function (inquilinoSaveErr, inquilinoSaveRes) {
              // Handle inquilino save error
              if (inquilinoSaveErr) {
                return done(inquilinoSaveErr);
              }

              // Set assertions on new inquilino
              (inquilinoSaveRes.body.title).should.equal(inquilino.title);
              should.exist(inquilinoSaveRes.body.user);
              should.equal(inquilinoSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the inquilino
                  agent.get('/api/inquilinos/' + inquilinoSaveRes.body._id)
                    .expect(200)
                    .end(function (inquilinoInfoErr, inquilinoInfoRes) {
                      // Handle inquilino error
                      if (inquilinoInfoErr) {
                        return done(inquilinoInfoErr);
                      }

                      // Set assertions
                      (inquilinoInfoRes.body._id).should.equal(inquilinoSaveRes.body._id);
                      (inquilinoInfoRes.body.title).should.equal(inquilino.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (inquilinoInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Inquilino.remove().exec(done);
    });
  });
});
