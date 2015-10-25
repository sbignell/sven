/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.finishSignIn = function (){

    app.views.profileView = new app.ProfileView();
    if(app.user.attributes.roles.indexOf('0,') != -1){
      app.views.adminView = new app.AdminView();
    }

    console.log('finishSignIn');
    $('.form-control').attr('disabled', false);
    $('#doSignIn').attr('disabled', false);
    $('#doSignUp').attr('disabled', false);
    $('#signinupDropdown').attr('disabled', false);
    $('.dropdown-menu').attr('disabled', false);
    $('#signStatus').css("display", "none");

    //change button to username
    var loggedInBtn = '<button id="signedinDropdown" class="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">';
    loggedInBtn += '<span class="fa fa-user"></span> ' + app.user.attributes.username + ' <span class="caret"></span></button>';
    loggedInBtn += '<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="signedinDropdown">';
    loggedInBtn += '<li><a id="bprofile" href="#">Profile</a></li>';
    if(app.user.attributes.roles.indexOf('0,') != -1){  //if they have admin role
      loggedInBtn += '<li><a id="badmin" href="#">Administer</a></li>';
    }
    loggedInBtn += '<li><a id="signout" href="http://www.sidandsven.com/logout/">Sign Out</a></li>';
    loggedInBtn += '</ul>';

    $('div.dropdown').html(loggedInBtn);
    $('.dropdown-toggle').dropdown('toggle');

    //re-render with user model
    //app.views.mycellarView.render();

    //move to cellar
    app.showView(app.views.cellarView);

  }

  app.getUrlParameter = function (sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
  }      

  app.showView = function (view){
    console.log('showView: ');
    console.dir(view.el);

    if (view != app.views.resetView) { //If user clicks away from reset page, remove url params
      if (typeof app.getUrlParameter('u') != 'undefined'){
        window.history.replaceState( {} , 'Sid is awake.', 'http://www.sidandsven.com' );
      } else if (typeof app.getUrlParameter('t') != 'undefined'){
        window.history.replaceState( {} , 'Sid is awake.', 'http://www.sidandsven.com' );
      }
    }

    if(view == app.views.cellarView && typeof app.user != 'undefined' && app.user.attributes.username != "") { //If user logged in, change cellarView
      console.log('showView: user logged in and requested cellarView');
      if(typeof app.views.mycellarView == 'undefined'){
        console.log('showView: creating mycellarView');
        app.views.mycellarView = new app.MyCellarView();
      }
      
      view = app.views.mycellarView;
    }

    if(app.views.current != undefined){
        $(app.views.current.el).hide();
    }
    app.views.current = view;
    $(app.views.current.el).show();
  };

  app.Login = Backbone.Model.extend({
    url: '/api/v1/login/',
    defaults: {
      errors: [],
      errfor: {},
      username: '',
      password: ''
    }
  });

  app.Signup = Backbone.Model.extend({
    url: '/api/v1/signup/',
    defaults: {
      errors: [],
      errfor: {},
      username: '',
      email: '',
      password: ''
    }
  });

  app.User = Backbone.Model.extend({
    url: '/api/v1/user/',
    defaults: {
      errors: [],
      errfor: {},
      id: '',
      username: '',
      email: ''
    }
  });

  app.Record = Backbone.Model.extend({
    //idAttribute: 'id',
    defaults: {
      id: undefined,
      grape: '',
      estate: '',
      name: '',
      notes: '',
      rating: '',
      createdById: '',
      createdByName: ''
    },
    url: function() {
      return '/cellar/'+ (this.isNew() ? '' : this.id +'/');
    }
  });

  app.RecordCollection = Backbone.Collection.extend({
    model: app.Record,
    url: '/cellar/'
  });


  app.HeaderView = Backbone.View.extend({
    el: '#header', 
    template: _.template(JST["assets/views/header/tmpl-header.html"]()), //We need to jade this and pass data
    events: {
      'click #gotoHome': 'processHome',
      'click #gotoAbout': 'processAbout',
      'click #gotoCellar': 'processCellar',
      'click #doSignIn': 'doSignIn',
      'click #doSignUp': 'doSignUp',
      'click #doCancelSignUp': 'doCancelSignUp',
      'click #gotoForgot': 'processForgot',
      'click #gotoReset': 'processReset',
      'click #profile': 'showProfile',
      'click #admin': 'showAdmin'
    },
    initialize: function() {
      console.log('headerView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
      return this;
    },
    processHome: function(e){
      e.preventDefault();
      console.log('view: #gotoHome clicked');

      $('#public-menu').children().removeClass('active');
      app.showView(app.views.homeView);
    },
    processAbout: function(e){
      e.preventDefault();
      console.log('view: #gotoAbout clicked');

      $('#public-menu > li.active').removeClass('active');
      app.showView(app.views.aboutView);
      $('#gotoAbout').parent().addClass('active');
    },
    processCellar: function(e){
      e.preventDefault();
      console.log('view: #gotoCellar clicked');

      $('#public-menu > li.active').removeClass('active');
      app.showView(app.views.cellarView);
      $('#gotoCellar').parent().addClass('active');
    },
    doSignIn: function(e){
      e.preventDefault();
      console.log('view: #doSignIn clicked');
      //app.showView(app.views.cellarView);

      $('#signStatus').css("display", "inline");
      $('#signAlert').html('');

      //
      $('#signinupDropdown').attr('disabled', true);
      $('.dropdown-menu').attr('disabled', true);
      $('.form-control').attr('disabled', true);
      $('#doSignIn').attr('disabled', true);
      $('#doSignUp').attr('disabled', true);


      app.login = new app.Login();

      app.login.save({
        username: $('#inputUsername').val(),
        password: $('#inputPassword').val()
      },{
        success: function(model, response) {
          if (response.success) {
            console.log('Signed In!');
            //console.dir(model);
            //console.dir(response);

            app.user.attributes.username = response.username;
            app.user.attributes.id = response.userid;
            app.user.attributes.roles = response.roles;
            app.user.attributes.firstname = response.firstname;
            app.user.attributes.lastname = response.lastname;

            app.finishSignIn();
          
          }
          else {
            model.set(response);
            var alertStr = '<div class="alert alert-danger" role="alert">' + response.errors + '</div>';
            console.log('Fail!');
            $('.form-control').attr('disabled', false);
            $('#doSignIn').attr('disabled', false);
            $('#doSignUp').attr('disabled', false);
            $('#signinupDropdown').attr('disabled', false);
            $('.dropdown-menu').attr('disabled', false);
            $('#signStatus').css("display", "none");
            $('#signAlert').html(alertStr);
          }
        }
      });


    },
    doSignUp: function(e){
      e.preventDefault();
      console.log('view: #doSignUp clicked');
      //app.showView(app.views.cellarView);

      $('#signStatus').css("display", "inline");
      $('#signAlert').html('');

      //
      $('#signinupDropdown').attr('disabled', true);
      $('.dropdown-menu').attr('disabled', true);
      $('.form-control').attr('disabled', true);
      $('#doSignIn').attr('disabled', true);

      if($('#signUpEmail').hasClass('hidden')){
        console.log('email field is hidden, unhiding');

        $('#signUpEmail').removeClass('hidden');
        $('#signUpEmail').addClass('show');
        $('#inputEmail').attr('disabled', false);
        $('#doCancelSignUp').removeClass('hidden');
        $('#doCancelSignUp').addClass('show');

      } else {
        console.log('email field was showing so sign up will proceed');
        $('#inputEmail').attr('disabled', true);
        $('#doSignUp').attr('disabled', true);
        $('#doCancelSignUp').attr('disabled', true);

        app.signup = new app.Signup();

        app.signup.save({
          username: $('#inputUsername').val(),
          password: $('#inputPassword').val(),
          email: $('#inputEmail').val()
        },{
          success: function(model, response) {
            if (response.success) {
              console.log('Signed Up!!!');

              app.user = new app.User();
              app.user.attributes.username = response.username;
              app.user.attributes.id = response.userid;
              app.user.attributes.roles = response.roles;
              app.user.attributes.firstname = response.firstname;
              app.user.attributes.lastname = response.lastname;

              app.finishSignIn();

            } else {
              model.set(response);
              var alertStr = '<div class="alert alert-danger" role="alert">' + response.errors + '</div>';
              console.log('Fail!');
              $('.form-control').attr('disabled', false);
              $('#doSignIn').attr('disabled', false);
              $('#doSignUp').attr('disabled', false);
              $('#signUpEmail').removeClass('show');
              $('#signUpEmail').addClass('hidden');
              $('#doCancelSignUp').removeClass('show');
              $('#doCancelSignUp').addClass('hidden');
              $('#signinupDropdown').attr('disabled', false);
              $('.dropdown-menu').attr('disabled', false);
              $('#signStatus').css("display", "none");
              $('#signAlert').html(alertStr);
            }
          }
        });

      }
     

    },
    doCancelSignUp: function(e){
      console.log('signup cancelled');

      $('.form-control').attr('disabled', false);
      $('#doSignIn').attr('disabled', false);
      $('#doSignUp').attr('disabled', false);
      $('#signUpEmail').removeClass('show');
      $('#signUpEmail').addClass('hidden');
      $('#doCancelSignUp').removeClass('show');
      $('#doCancelSignUp').addClass('hidden');
      $('#signinupDropdown').attr('disabled', false);
      $('.dropdown-menu').attr('disabled', false);
      $('#signStatus').css("display", "none");

      $('.dropdown-toggle').dropdown('toggle');

    },
    processForgot: function(e){
      e.preventDefault();
      console.log('view: #gotoForgot clicked');

      $('#public-menu').children().removeClass('active');
      app.showView(app.views.forgotView);
    },
    processReset: function(e){
      e.preventDefault();
      console.log('view: #gotoReset clicked');

      $('#public-menu').children().removeClass('active');
      app.showView(app.views.resetView);
    },
    showProfile: function(e){
      console.log('Loading profile page');
      app.showView(app.views.profileView);
    },
    showAdmin: function(e){
      console.log('Loading admin page');
      app.showView(app.views.adminView);
    }
  }); 

  app.HomeView = Backbone.View.extend({
    el: '#home',
    //template: _.template(JST["assets/views/home/tmpl-home.html"]()), //We need to jade this and pass data
    template: _.template(JST["assets/views/home/tmpl-home.html"]()),
    initialize: function() {
      console.log('homeView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
      return this;
    }
  });

  app.AboutView = Backbone.View.extend({
    el: '#about',
    template: _.template(JST["assets/views/about/tmpl-about.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('aboutView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
      return this;
    }
  });

  app.CellarView = Backbone.View.extend({
    el: '#cellar',
    template: _.template(JST["assets/views/cellar/tmpl-cellar.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('cellarView loaded.');
      
      this.render();
  
    },
    render: function() {

      console.log('cellarView: render');


      this.$el.html(this.template( 'hello' ));

      return this;
    }
  });

  app.MyCellarView = Backbone.View.extend({
    el: '#cellar',
    template: _.template(JST["assets/views/cellar/tmpl-cellar.html"]()), //We need to jade this and pass data
    events: {
      //'click #add-wine': 'addWine',
      'click #submit-wine': 'submitWine',
      'click #cancel-wine': 'cancelWine',
      'click .delete-wine': 'deleteWine'
    },
    initialize: function() {
      console.log('mycellarView loaded.');
      var self = this;

      this.collection = new app.RecordCollection( );
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.render);
      this.collection.fetch({
        success: function(collection, response, options){
          //console.log('collection, response, options');
          console.dir(collection);
          console.dir(response);
          //console.dir(options);
          
          self.render();
        }
      });

    },
    render: function() {

      //fetch my collection from server
      console.log('mycellarView: render');
      console.log(this.collection.length);

      //console.dir(app.user.attributes);

      this.$el.html(this.template());

      //Add + button
      $('#cellar .btn-group').append('<button id="add-wine" class="btn btn-default btn-sm" data-toggle="modal" data-target="#wine-modal"><span class="fa fa-plus"></span></button>');
      //Add the delete heading
      $('#cellar .table thead tr').prepend('<th><span class="fa fa-trash-o"></span></th>');

      //remove Sid's top 20 records
      $('#results-rows').empty();

      if(this.collection.length == 0){
        console.log('We need to add the dummy item');
        $('#results-rows').append('<tr><td>Chardonnay</td><td>Heemskerk</td><td>2012 Coal River Valley Chardonnay</td><td>Bright straw-green; French oak barrel fermented, and pure class from start to finish, with perfect balance, line and length; Tasmanian acidity provides the framework and the length of a delicious wine. Trophy Best Chardonnay Tasmanian Wine Show ’14.</td><td>9.8</td></tr>');
      }

      var welcomeText = 'Welcome, ' + app.user.attributes.username;
      var cellarBlurb1 = 'This is your wine cellar, why don\'t you start adding your favourite drops! Look, I\'ve started you off with one of my personal favourites.';
      var cellarBlurb2 = 'Excellent, I see you have great taste in wine! Keep building your cellar!';
      var cellarBlurb3 = 'This is quite the collection you have! You\'ll need to stop there or you risk overshadowing me!!';
      var panelHeading = '<img class="wines" src="media/wines.png" /> ' + app.user.attributes.username + '\'s Top 20';
      
      $('#cellar div.media-body h4.media-heading').html(welcomeText);
      if (this.collection.length == 0){
        $('#cellar div.media-body p.cellarConversation').text(cellarBlurb1);
      } else if (this.collection.length < 20){
        $('#cellar div.media-body p.cellarConversation').text(cellarBlurb2);
      } else if (this.collection.length == 20){
        $('#cellar div.media-body p.cellarConversation').text(cellarBlurb3);
      }
      $('#cellar div.panel-heading h3.panel-title').html(panelHeading);

      var frag = document.createDocumentFragment();
      this.collection.each(function(record) {
        console.log('Wine name is: ' + record.attributes.name);
        var view = new app.ResultsRowView({ model: record });
        frag.appendChild(view.render().el);
      }, this);
      $('#results-rows').append(frag);

      return this;
    },
    addWine: function(e){
      console.log('add wine');
      
      //show modal

      $('#wine-modal').modal('show');

      /* for inline row, doesnt look good
      var newWineRow = '<tr><td></td>';
      newWineRow += '<td><div class="col-md-2"><input type="text"></div></td>';
      newWineRow += '<td><div class="col-md-2"><input type="text"></div></td>';
      newWineRow += '<td><div class="col-md-2"><input type="text"></div></td>';
      newWineRow += '<td><div class="col-md-2"><input type="text"></div></td>';
      newWineRow += '<td><div class="col-md-1"><input type="text"></div></td></tr>';

      $('#results-rows').prepend(newWineRow);
      */     

      //add/cancel buttons on top of panel
      //$('#cellar div.panel-heading .btn-group').prepend('<button id="submit-wine" class="btn btn-sm btn-success"><span class="fa fa-check"></span></button><button id="cancel-wine" class="btn btn-sm btn-warning"><span class="fa fa-times"></span></button>');

    },
    submitWine: function(e){
      console.log('submit wine');
      var self = this;

      var newWine = new app.Record();

      newWine.save({
        grape: this.$el.find('.modal #wineGrape').val(),
        estate: this.$el.find('.modal #wineEstate').val(),
        name: this.$el.find('.modal #wineName').val(),
        notes: this.$el.find('.modal #wineNotes').val(),
        rating: this.$el.find('.modal #wineRating').val(),
        createdById: app.user.attributes.id,
        createdByName: app.user.attributes.username
      }, {
      success: function (model, response) {
        console.log("success");
        //console.dir(model);
        $('#wine-modal').modal('hide');
        self.collection.add(model);
      },
      error: function (model, response) {
          console.log("error");
      }
      });

    },
    cancelWine: function(e){
      console.log('cancel wine');

      $('#wine-modal').modal('hide');

    },
    deleteWine: function(e){
      console.log('delete wine');
      console.dir($(e.currentTarget).closest('tr'));
      var self = this;
      var siblings = $(e.currentTarget).closest('tr').children();

      console.log('wineName: ');
        console.dir(siblings[3]);

      //parent tr remove, fadeOut
      var removeWine = this.collection.findWhere({
        name: siblings[3].innerText
      });
      console.log('removeWine: ')
      console.dir(removeWine);

      removeWine.destroy().complete(function(){
          self.collection.fetch();
        });

      
      //this.collection.remove(removeWine);

    }
  });

  app.ForgotView = Backbone.View.extend({
    el: '#forgot',
    template: _.template(JST["assets/views/login/forgot/tmpl-forgot.html"]()), //We need to jade this and pass data
    events: {
      'click #doForgot': 'doForgot'
    },
    initialize: function() {
      console.log('forgotView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
      return this;
    },
    doForgot: function(e){
      e.preventDefault();
      console.log('view: #doForgot clicked');
      //post...
      var data = {};
      data.email = $('#forgotEmail').val();

      $.post('api/v1/login/forgot/', data, function(response, status){
        console.log('responded:');
        console.dir(response);
        var alertStr = '';

        if(response.success){
          alertStr = '<div class="alert alert-success" role="alert">Success! Check your email.</div>';
          $('#forgotErrors').html(alertStr);
        } else {
          alertStr = '<div class="alert alert-danger" role="alert">' + response.errors + '</div>';
          $('#forgotErrors').html(alertStr);
        }

      });
    }
  });

  app.ResetView = Backbone.View.extend({
    el: '#reset',
    template: _.template(JST["assets/views/login/reset/tmpl-reset.html"]()), //We need to jade this and pass data
    events: {
      'click #doReset': 'doReset'
    },
    initialize: function() {
      console.log('resetView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
      return this;
    },
    doReset: function(e){
      e.preventDefault();
      console.log('view: #doReset clicked');

      var data = {};
      data.password = $('#resetPassword').val();
      data.confirm = $('#resetConfirm').val();

      $.ajax({
          url: 'api/v1/login/reset/' + app.getUrlParameter('u') + '/' + app.getUrlParameter('t') + '/', 
          data: data,
          type: 'PUT',
          success: function(response) {
              // Do something with the result
              console.log('response:');
              console.dir(response);
              var alertStr = '';

              if(response.success){
                alertStr = '<div class="alert alert-success" role="alert">Success! Move along now. <a href="http://www.sidandsven.com">Click here</a> to go back!</div>';
                $('#resetErrors').html(alertStr);
              } else {
                alertStr = '<div class="alert alert-danger" role="alert">' + response.errors + '</div>';
                $('#resetErrors').html(alertStr);
              }
          }
      });
    }
  });

  app.ResultsRowView = Backbone.View.extend({
    tagName: 'tr',
    //template: _.template(JST["assets/views/cellar/wines/tmpl-wines.html"]()),
    events: {
      //'click .btn-details': 'viewDetails'
    },
    viewDetails: function() {
      location.href = this.model.url();
    },
    render: function() {
      console.log('ResultsRowView: render');
      console.dir(this.model.attributes);

      //this.$el.html(this.template( this.model ));
      this.$el.html(_.template(JST["assets/views/cellar/wines/tmpl-wines.html"](this.model)));
      /*this.$el.find('.timeago').each(function(index, indexValue) {
        if (indexValue.innerText) {
          var myMoment = moment(indexValue.innerText);
          indexValue.innerText = myMoment.from();
          if (indexValue.getAttribute('data-age')) {
            indexValue.innerText = indexValue.innerText.replace('ago', 'old');
          }
        }
      });*/
      return this;
    }
  });

  app.ProfileView = Backbone.View.extend({
    tagName: '#profile',
    //template: _.template(JST["assets/views/cellar/wines/tmpl-wines.html"]()),
    events: {
      //
    },
    render: function() {
      console.log('ProfileView: render');
      
      this.$el.html(_.template(JST["assets/views/profile/tmpl-profile.html"]()));
      
      return this;
    }
  });

  app.AdminView = Backbone.View.extend({
    tagName: '#admin',
    //template: _.template(JST["assets/views/cellar/wines/tmpl-wines.html"]()),
    events: {
      //
    },
    render: function() {
      console.log('AdminView: render');
      
      this.$el.html(_.template(JST["assets/views/admin/tmpl-admin.html"]()));
      
      return this;
    }
  });


  window.onload = function(){
    console.log('app loading...');
    app.firstLoad = true;
    //app.router = new app.Router();
    //Backbone.history.start();

    //check with server if predefined session exists
    app.user = new app.User();
    app.user.fetch({
        success: function(model, response, options){
          console.log('fetched user');
          console.dir(model);
          console.dir(response);
          //console.dir(options);
          
          //if exists then theyre logged in
          if((model.attributes.username != undefined) && (model.attributes.username != "")){
            app.finishSignIn();
          }
          //otherwise we're not logged in
        }
      });


    app.views = {};

    app.views.headerView = new app.HeaderView();
    app.views.homeView = new app.HomeView();
    app.views.current = app.views.homeView;
    app.views.aboutView = new app.AboutView();
    app.views.cellarView = new app.CellarView();
    //mycellarView: created upon login
    //profile: created upon login
    //admin: created upon login
    app.views.forgotView = new app.ForgotView();
    app.views.resetView = new app.ResetView();
    console.log('app loaded!');

    //if params, load up reset screen
    console.log(app.getUrlParameter('u'));
    console.log(app.getUrlParameter('t'));
    if(typeof app.getUrlParameter('u') != 'undefined' && typeof app.getUrlParameter('t') != 'undefined'){
      app.showView(app.views.resetView);
    }

  };

}());
