this["JST"] = this["JST"] || {};

this["JST"]["assets/views/about/tmpl-about.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row"><div class="col-sm-6"><div class="page-header"><h1>Best of friends</h1></div><div class="media"><a href="#" class="pull-left"><img src="data:image/png;base64,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" style="width: 64px; height: 64px;" class="media-object"/></a><div class="media-body"><h4 class="media-heading">Sid</h4><p>Sid represents the server. He serves Sven\'s front end code statically and provides an API for services, such as authentication and the wine cellar data.</p></div></div></div><div class="col-sm-6 special"><div class="media text-right"><a href="#" class="pull-right"><img src="data:image/png;base64,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" style="width: 64px; height: 64px;" class="media-object"/></a><div class="media-body"><h4 class="media-heading">Sven</h4><p>Sven is our front end. He\'s loaded via index.html and is mostly javascript, he interacts with Sid over API calls. He could potentially be packaged into a cordova (phonegap) project to become a mobile app too, aligning all your client code.</p></div></div></div></div>';

}
return __p
};

this["JST"]["assets/views/cellar/tmpl-cellar.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row"><div class="media"><div class="media-left"><img src="media/Robert3.png" class="media-object"/></div><div class="media-body"><h4 class="media-heading">Welcome, friend</h4><p>I love wine, but I\'m irritated that your wine cellar is empty! Sign up/in to start building it now. In the meantime below is a peek at some of my favourite drops! </p><p>My wine cellar is built on mysql and I interact with it via the great npm module Sequelize. I could of course use mongodb instead, however in this configuration you can gain an understanding of how to integrate mysql into your project rather than the usual choice of mongodb.</p></div><div class="clearfix"></div></div></div><div class="row"><div class="col-md-8 col-md-offset-2"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><img src="media/wines.png" class="wines"/> Sid\'s Top 20</h3></div><div class="panel-body"></div><table class="table"><thead><th>Grape</th><th>Estate</th><th>Vintage</th><th>Notes</th><th>Pairing</th><th>Rating</th></thead><tbody><tr><td>Cabernet Sauvignon</td><td>Wolf Blass</td><td>2005 Private Selection</td><td>Blackberries and teardrops</td><td>Lamb</td><td>8.5</td></tr></tbody></table><!--div.panel-footer       --></div></div></div>';

}
return __p
};

this["JST"]["assets/views/cellar/tmpl-mycellar.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row"><div class="media"><div class="media-left"><img src="media/Robert3.png" class="media-object"/></div><div class="media-body"><h4 class="media-heading">Welcome, </h4><h2></h2><p>This is your wine cellar, why don\'t you start adding your favourite drops! Look, I\'ve started you of with my personal favourite.</p><p>My wine cellar is built on mysql and I interact with it via the great npm module Sequelize. I could of course use mongodb instead, however in this configuration you can gain an understanding of how to integrate mysql into your project rather than the usual choice of mongodb.</p></div><div class="clearfix"></div></div></div><div class="row"><div class="col-md-8 col-md-offset-2"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><img src="media/wines.png" class="wines"/>\'s Top 20</h3></div><div class="panel-body"></div><table class="table"><thead><th>Grape</th><th>Estate</th><th>Vintage</th><th>Notes</th><th>Pairing</th><th>Rating</th></thead><tbody><tr><td>Cabernet Sauvignon</td><td>Wolf Blass</td><td>2005 Private Selection</td><td>Blackberries and teardrops</td><td>Lamb</td><td>8.5</td></tr></tbody></table><!--div.panel-footer       --></div></div></div>';

}
return __p
};

this["JST"]["assets/views/header/tmpl-header.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="container"><div class="navbar-header"><a id="gotoHome" href="#" class="navbar-brand"><img src="media/ss-logo-64.png" class="navbar-logo"/><span class="navbar-brand-label">  Sid &amp; Sven</span></a><button data-toggle="collapse" data-target=".my-navbar-collapse" class="navbar-toggle collapsed"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button></div><div class="navbar-collapse my-navbar-collapse collapse"><ul id="public-menu" class="nav navbar-nav"><li><a id="gotoAbout" href="#">About</a></li><li><a id="gotoCellar" href="#">Wine Cellar</a></li></ul><div class="pull-right"><div class="dropdown"><button id="signinupDropdown" type="button" data-toggle="dropdown" aria-expanded="true" class="btn btn-primary dropdown-toggle">Sign-In/Up <span class="caret"></span></button><ul role="menu" aria-labelledby="signinupDropdown" class="dropdown-menu dropdown-menu-right"><form id="signForm"><div class="form-group"><label for="inputUsername">Username</label><input id="inputUsername" type="text" placeholder="Enter username" class="form-control"/></div><div class="form-group"><label for="inputPassword">Password</label><input id="inputPassword" type="password" placeholder="Password" class="form-control"/></div><hr/><button id="doSignIn" class="btn btn-info btn-block">Sign In</button><button id="doSignUp" class="btn btn-warning btn-block">Sign Up</button><p class="small"> <a id="gotoForgot" href="#">Forgot </a>/  <a id="gotoReset" href="#">Reset</a></p><div id="signStatus"><span class="fa fa-5x fa-spinner fa-spin"></span></div><div id="signAlert">   </div></form></ul></div></div></div></div>';

}
return __p
};

this["JST"]["assets/views/home/tmpl-header.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="container"><div class="navbar-header"><a id="gotoHome" href="#" class="navbar-brand"><img src="media/logo-symbol-64x64.png" class="navbar-logo"/><span class="navbar-brand-label">Simon</span></a><button data-toggle="collapse" data-target=".my-navbar-collapse" class="navbar-toggle collapsed"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button></div><div class="navbar-collapse my-navbar-collapse collapse"><ul id="public-menu" class="nav navbar-nav"><li><a id="gotoAbout" href="#">About</a></li><li><a id="gotoCellar" href="#">Wine Cellar</a></li></ul><div class="dropdown pull-right"><button id="signinupDropdown" type="button" data-toggle="dropdown" aria-expanded="true" class="btn btn-primary dropdown-toggle">Sign-In/Up <span class="caret"></span></button><ul role="menu" aria-labelledby="signinupDropdown" class="dropdown-menu dropdown-menu-right"><form id="signForm"><div class="form-group"><label for="inputEmail">Email address</label><input id="inputEmail" type="email" placeholder="Enter email" class="form-control"/></div><div class="form-group"><label for="inputPassword">Password</label><input id="inputPassword" type="password" placeholder="Password" class="form-control"/></div><hr/><button id="doSignIn" class="btn btn-default">Sign In</button><button id="doSignUp" class="btn btn-default">Sign Up</button></form></ul></div></div></div>';

}
return __p
};

this["JST"]["assets/views/home/tmpl-home.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jumbotron"><h1>Success!!!<div class="chars"><div class="col-md-2 col-md-offset-3"><img src="media/Robert2.png"/><h2>Sid </h2></div><div class="col-md-2"><h2 id="and">and</h2></div><div class="col-md-2"><img src="media/Sven.png"/><h2>Sven</h2></div></div><div class="story">   <p class="lead">Sid likes wine and Sven likes design. They are your Node.js server and single-page app.      </p></div><div class="clearfix"></div></h1></div><div class="row"><div class="col-sm-4"><div class="panel panel-default"><div class="panel-body"><h3>Vision</h3><p>To provide a simple, minimal framework for creating single-page apps built with <a href="http://nodejs.org" target="_blank">node.js</a> on the server and <a href="http://backbonejs.org/" target="_blank">backbone</a> on the client.</p><!--a.btn.btn-default.btn-block(href=\'#\') Learn More--></div></div></div><div class="col-sm-4"><div class="panel panel-default"><div class="panel-body"><h3>Technology</h3><p>Sid and Sven utilise current technologies such as <a href="http://nodejs.org" target="_blank">node.js</a>, <a href="http://expressjs.com/" target="_blank">express</a>, <a href="http://passportjs.org/" target="_blank">passport</a>, <a href="http://www.mongodb.org/" target="_blank">mongodb</a>,  <a href="http://www.mysql.com/" target="_blank">mysql </a>on the back end and <a href="http://getbootstrap.com/" target="_blank">bootstrap</a>,  <a href="http://fortawesome.github.io/Font-Awesome/" target="_blank">font awesome</a>, <a href="http://backbonejs.org/" target="_blank">backbone</a>, <a href="http://jade-lang.com/" target="_blank">jade </a>and <a href="http://lesscss.org/" target="_blank">less </a>on the front end. They\'re built using <a href="http://gruntjs.com/" target="_blank">Grunt</a>.</p></div></div></div><div class="col-sm-4"><div class="panel panel-default"><div class="panel-body"><h3>Open</h3><p>Open source and available on GitHub, go ahead and fork it.</p><a href="https://github.com/sbignell/sid" class="btn btn-default btn-block">Source Code</a></div></div></div></div>';

}
return __p
};

this["JST"]["assets/views/login/forgot/tmpl-forgot.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row"><div class="col-sm-6"><div class="page-header"><h1>Forgot Your Password?</h1></div><div id="forgotForm"><form><div class="form-group"><label>Enter Your Email:</label><input id="forgotEmail" type="text" name="email" class="form-control"/></div><div class="form-group"><button id="doForgot" type="button" class="btn btn-primary btn-forgot">Send Reset </button></div><div id="forgotErrors" class="form-group">    </div></form></div></div></div>';

}
return __p
};

this["JST"]["assets/views/login/reset/tmpl-reset.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row"><div class="col-sm-6"><div class="page-header"><h1>Reset Your Password</h1></div><div id="resetForm"><form><div class="form-group"><label>New Password:</label><input id="resetPassword" type="password" name="password" class="form-control"/></div><div class="form-group"><label>Confirm Password:</label><input id="resetConfirm" type="password" name="confirm" class="form-control"/></div><div class="form-group"><button id="doReset" type="button" class="btn btn-primary btn-reset">Set Password</button></div><div id="resetErrors" class="form-group">    </div></form></div></div></div>';

}
return __p
};