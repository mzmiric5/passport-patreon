# passport-patreon
[![Code Climate](https://codeclimate.com/github/mzmiric5/passport-patreon/badges/gpa.svg)](https://codeclimate.com/github/mzmiric5/passport-patreon)

Patreon is a trademark or registered trademark of Patreon, Inc. in the U.S. and/or other countries. "passport-patreon" is not operated by, sponsored by, or affiliated with Patreon, Inc. in any way.

[Passport](http://passportjs.org/) strategies for authenticating with [Patreon](http://www.patreon.com/)
using OAuth 2.0.

This module lets you authenticate using Patreon in your Node.js applications.
By plugging into Passport, Patreon authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install
```bash
$ npm install passport-patreon
```
## Usage of OAuth 2.0

#### Configure Strategy

The Passport OAuth 2.0 authentication strategy authenticates users using a Passport
account and OAuth 2.0 tokens. The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```javascript
var passport       = require("passport");
var patreonStrategy = require("passport-patreon").Strategy;

passport.use(new patreonStrategy({
    clientID: PATREON_CLIENT_ID,
    clientSecret: PATREON_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/patreon/callback",
    scope: "users"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ patreonId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `"patreon"` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get("/auth/patreon", passport.authenticate("patreon"));
app.get("/auth/patreon/callback", passport.authenticate("patreon", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
```

## Example

```javascript
var express        = require("express");
var bodyParser     = require("body-parser");
var cookieParser   = require("cookie-parser");
var cookieSession  = require("cookie-session");
var passport       = require("passport");
var patreonStrategy = require("passport-patreon").Strategy;

var app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({secret:"somesecrettokenhere"}));
app.use(passport.initialize());
app.use(express.static("./public"));

passport.use(new patreonStrategy({
    clientID: "098f6bcd4621d373cade4e832627b4f6",
    clientSecret: "4eb20288afaed97e82bde371260db8d8",
    callbackURL: "http://127.0.0.1:3000/auth/patreon/callback",
    scope: "users"
  },
  function(accessToken, refreshToken, profile, done) {
    // Suppose we are using mongo..
    User.findOrCreate({ patreonId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/auth/patreon", passport.authenticate("patreon"));
app.get("/auth/patreon/callback", passport.authenticate("patreon", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});

app.listen(3000);
```

## License

The MIT License (MIT)

Copyright (c) 2016 Miso Zmiric

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
