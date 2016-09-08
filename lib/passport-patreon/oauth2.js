var util = require("util");
var OAuth2Strategy = require("passport-oauth2");
var InternalOAuthError = require("passport-oauth2").InternalOAuthError;
var request = require('request');

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || "https://www.patreon.com/oauth2/authorize";
  options.tokenURL = options.tokenURL || "https://api.patreon.com/oauth2/token";

  OAuth2Strategy.call(this, options, verify);
  this.name = "patreon";

  this._oauth2.setAuthMethod("OAuth");
  this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  request({
    url: "https://api.patreon.com/oauth2/api/current_user",
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  }, function (err, res, body) {
    if (err) { return done( new InternalOAuthError("failed to fecth user profile", err));}
    try {
      var json = JSON.parse(body);
      json = json.data;
      var profile = { provider: "patreon" };
      profile.id = json.id;
      profile.name = json.attributes.full_name;
      profile.avatar = json.attributes.image_url;

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};

module.exports = Strategy;
