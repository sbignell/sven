/* global app:true */

(function() {
  'use strict';

  app = app || {};

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
        window.history.replaceState( {} , 'Simon is awake.', 'http://www.revisit.cc' );
      } else if (typeof app.getUrlParameter('t') != 'undefined'){
        window.history.replaceState( {} , 'Simon is awake.', 'http://www.revisit.cc' );
      }
    }

    if(view == app.views.cellarView && typeof app.user != 'undefined') { //If user logged in, change cellarView
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
      username: '',
      email: ''
    }
  });

  app.Record = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      _id: undefined,
      grape: '',
      estate: '',
      name: '',
      notes: '',
      pairing: '',
      rating: '',
      userId: ''
    },
    url: function() {
      return '/cellar/'+ (this.isNew() ? '' : this.id +'/');
    }
  });

  app.RecordCollection = Backbone.Collection.extend({
    model: app.Record,
    url: '/cellar/',
    parse: function(results) {
      /*app.pagingView.model.set({
        pages: results.pages,
        items: results.items
      });
      app.filterView.model.set(results.filters);*/
      return results.data;
    }
  });

  app.Filter = Backbone.Model.extend({
    defaults: {
      search: '',
      status: '',
      sort: '',
      limit: ''
    }
  });

  app.Paging = Backbone.Model.extend({
    defaults: {
      pages: {},
      items: {}
    }
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
      'click #gotoForgot': 'processForgot',
      'click #gotoReset': 'processReset'
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
            console.dir(model);
            console.dir(response);
            app.user = new app.User({
              username: model.attributes.username
            });

            $('.form-control').attr('disabled', false);
            $('#doSignIn').attr('disabled', false);
            $('#doSignUp').attr('disabled', false);
            $('#signinupDropdown').attr('disabled', false);
            $('.dropdown-menu').attr('disabled', false);
            $('#signStatus').css("display", "none");

            //change button to username
            var loggedInBtn = '<button id="signedinDropdown" class="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">';
            loggedInBtn += '<span class="fa fa-user"></span> ' + model.attributes.username + ' <span class="caret"></span></button>';
            loggedInBtn += '<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="signedinDropdown">';
            loggedInBtn += '<li><a id="profile" href="#">Profile</a></li>';
            loggedInBtn += '<li><a id="signout" href="http://www.revisit.cc/logout/">Sign Out</a></li>';
            loggedInBtn += '</ul>';

            $('div.dropdown').html(loggedInBtn);
            $('.dropdown-toggle').dropdown('toggle');

            //re-render with user model
            //app.views.mycellarView.render();

            //move to cellar
            app.showView(app.views.cellarView);

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
      $('#doSignUp').attr('disabled', true);


      app.signup = new app.Signup();

      app.signup.save({
        username: $('#inputUsername').val(),
        password: $('#inputPassword').val()
      },{
        success: function(model, response) {
          if (response.success) {
            console.log('Signed Up!');
            //toggle dropdown away
            //change button to username
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
    }
  }); 

  app.HomeView = Backbone.View.extend({
    el: '#home',
    template: _.template(JST["assets/views/home/tmpl-home.html"]()), //We need to jade this and pass data
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

      this.collection = new app.RecordCollection( );
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch({
        success: function(collection, response, options){
          console.log('collection, response, options');
          console.dir(collection);
          console.dir(response);
          console.dir(options);
          this.render();
        }
      });

      
    },
    render: function() {

      console.log('cellarView: render');

      this.$el.html(this.template( 'hello' ));

      var frag = document.createDocumentFragment();
      this.collection.each(function(record) {
        console.log('Wine name is: ' + record.name);
        var view = new app.ResultsRowView({ model: record });
        frag.appendChild(view.render().el);
      }, this);
      $('#results-rows').append(frag);

      if (this.collection.length === 0) {
        //$('#results-rows').append( $('#tmpl-results-empty-row').html() );
      }

      return this;
    }
  });

  app.MyCellarView = Backbone.View.extend({
    el: '#cellar',
    template: _.template(JST["assets/views/cellar/tmpl-cellar.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('mycellarView loaded.');

      this.collection = new app.RecordCollection( );
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch(success: function(collection, response, options){
        console.log('collection, response, options');
        console.dir(collection);
        console.dir(response);
        console.dir(options);
        this.render();
      });


      
    },
    render: function() {

      //fetch my collection from server
      console.log('mycellarView: render');

      console.dir(app.user.attributes);

      this.$el.html(this.template());

      var welcomeText = 'Welcome, ' + app.user.attributes.username;
      var cellarBlurb = 'This is your wine cellar, why don\'t you start adding your favourite drops! Look, I\'ve started you off with one of my personal favourites.';
      var panelHeading = '<img class="wines" src="media/wines.png" /> ' + app.user.attributes.username + '\'s Top 20';
      $('#cellar div.media-body h4.media-heading').html(welcomeText);
      $('#cellar div.media-body p.cellarConversation').text(cellarBlurb);
      $('#cellar div.panel-heading h3.panel-title').html(panelHeading);

      var frag = document.createDocumentFragment();
      this.collection.each(function(record) {
        console.log('Wine name is: ' + record.name);
        var view = new app.ResultsRowView({ model: record });
        frag.appendChild(view.render().el);
      }, this);
      $('#results-rows').append(frag);

      if (this.collection.length === 0) {
        //$('#results-rows').append( $('#tmpl-results-empty-row').html() );
      }

      return this;
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

      $.post('api/v1/login/forgot', data, function(response, status){
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
                alertStr = '<div class="alert alert-success" role="alert">Success! Move along now. <a href="http://www.revisit.cc">Click here</a> to go back!</div>';
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
    template: _.template(JST["assets/views/cellar/wines/tmpl-wines.html"]()),
    events: {
      //'click .btn-details': 'viewDetails'
    },
    viewDetails: function() {
      location.href = this.model.url();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
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

  /*app.FilterView = Backbone.View.extend({
    el: '#filters',
    template: _.template(JST["assets/views/cellar/filter/tmpl-filter.html"]()),
    events: {
      'submit form': 'preventSubmit',
      'keypress input[type="text"]': 'filterOnEnter',
      'change select': 'filter'
    },
    initialize: function() {
      this.model = new app.Filter( app.mainView.results.filters );
      this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));

      for (var key in this.model.attributes) {
        if (this.model.attributes.hasOwnProperty(key)) {
          this.$el.find('[name="'+ key +'"]').val(this.model.attributes[key]);
        }
      }
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    filterOnEnter: function(event) {
      if (event.keyCode !== 13) { return; }
      this.filter();
    },
    filter: function() {
      var query = $('#filters form').serialize();
      Backbone.history.navigate('q/'+ query, { trigger: true });
    }
  });*/

  /*app.PagingView = Backbone.View.extend({
    el: '#results-paging',
    template: _.template(JST["assets/views/cellar/paging/tmpl-paging.html"]()),
    events: {
      'click .btn-page': 'goToPage'
    },
    initialize: function() {
      this.model = new app.Paging({ pages: app.mainView.results.pages, items: app.mainView.results.items });
      this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      if (this.model.get('pages').total > 1) {
        this.$el.html(this.template( this.model.attributes ));

        if (!this.model.get('pages').hasPrev) {
          this.$el.find('.btn-prev').attr('disabled', 'disabled');
        }

        if (!this.model.get('pages').hasNext) {
          this.$el.find('.btn-next').attr('disabled', 'disabled');
        }
      }
      else {
        this.$el.empty();
      }
    },
    goToPage: function(event) {
      var query = $('#filters form').serialize() +'&page='+ $(event.target).data('page');
      Backbone.history.navigate('q/'+ query, { trigger: true });
      $('body').scrollTop(0);
    }
  });*/

  /*app.Router = Backbone.Router.extend({
    routes: {
      '': 'default',
      'q/:params': 'query'
    },
    initialize: function() {
      console.log('router: init');
    },
    default: function() {
      //if (!app.firstLoad) {
        //app.resultsView.collection.fetch({ reset: true });
      //}

      app.firstLoad = false;
    },
    query: function(params) {
      app.resultsView.collection.fetch({ data: params, reset: true });
      app.firstLoad = false;
    }
  });*/


  window.onload = function(){
    console.log('app loading...');
    app.firstLoad = true;
    //app.router = new app.Router();
    //Backbone.history.start();

    //check with server if predefined session exists

    app.views = {};

    app.views.headerView = new app.HeaderView();
    app.views.homeView = new app.HomeView();
    app.views.current = app.views.homeView;
    app.views.aboutView = new app.AboutView();
    app.views.cellarView = new app.CellarView();
    //app.views.filterView = new app.FilterView();
    //app.views.pagingView = new app.PagingView();
    //app.views.mycellarView = new app.MyCellarView();
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
