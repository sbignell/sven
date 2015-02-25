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

    if(view != app.views.resetView && (app.getUrlParameter('u') != undefined || app.getUrlParameter('t') != undefined)){
      window.load('http://www.revisit.cc/');
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

  app.Record = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      _id: undefined,
      'name.full': '',
      company: '',
      phone: '',
      zip: '',
      status: {
        id: undefined,
        name: '',
        userCreated: {}
      },
      userCreated: {}
    },
    url: function() {
      return '/admin/accounts/'+ (this.isNew() ? '' : this.id +'/');
    }
  });

  app.RecordCollection = Backbone.Collection.extend({
    model: app.Record,
    url: '/admin/accounts/',
    parse: function(results) {
      app.pagingView.model.set({
        pages: results.pages,
        items: results.items
      });
      app.filterView.model.set(results.filters);
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
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
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
                alertStr = '<div class="alert alert-success" role="alert">Success! Move along now.</div>';
                $('#resetErrors').html(alertStr);
              } else {
                alertStr = '<div class="alert alert-danger" role="alert">' + response.errors + '</div>';
                $('#resetErrors').html(alertStr);
              }
          }
      });
    }
  });

  app.ResultsView = Backbone.View.extend({
    el: '#results-table',
    //template: _.template( $('#tmpl-results-table').html() ),
    initialize: function() {
      this.collection = new app.RecordCollection( app.mainView.results.data );
      this.listenTo(this.collection, 'reset', this.render);
      this.render();
    },
    render: function() {
      this.$el.html( this.template() );

      var frag = document.createDocumentFragment();
      this.collection.each(function(record) {
        var view = new app.ResultsRowView({ model: record });
        frag.appendChild(view.render().el);
      }, this);
      $('#results-rows').append(frag);

      if (this.collection.length === 0) {
        $('#results-rows').append( $('#tmpl-results-empty-row').html() );
      }
    }
  });

  app.ResultsRowView = Backbone.View.extend({
    tagName: 'tr',
    //template: _.template( $('#tmpl-results-row').html() ),
    events: {
      'click .btn-details': 'viewDetails'
    },
    viewDetails: function() {
      location.href = this.model.url();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$el.find('.timeago').each(function(index, indexValue) {
        if (indexValue.innerText) {
          var myMoment = moment(indexValue.innerText);
          indexValue.innerText = myMoment.from();
          if (indexValue.getAttribute('data-age')) {
            indexValue.innerText = indexValue.innerText.replace('ago', 'old');
          }
        }
      });
      return this;
    }
  });

  app.FilterView = Backbone.View.extend({
    el: '#filters',
    //template: _.template( $('#tmpl-filters').html() ),
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
  });

  app.PagingView = Backbone.View.extend({
    el: '#results-paging',
    //template: _.template( $('#tmpl-results-paging').html() ),
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
  });

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
    app.views = {};

    app.views.headerView = new app.HeaderView();
    app.views.homeView = new app.HomeView();
    app.views.current = app.views.homeView;
    app.views.aboutView = new app.AboutView();
    app.views.cellarView = new app.CellarView();
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
