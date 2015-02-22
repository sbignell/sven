/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.Project = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      _id: undefined,
      name: '',
      slogan: '',
      company: '',
      companySlogan: '',
      copyrightYear: '',
    },
    url: function() {
      return '/admin/accounts/'+ (this.isNew() ? '' : this.id +'/');
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
    el: '.navbar', 
    events: {
      'click #gotoHome': 'processHome',
      'click #gotoAbout': 'processAbout',
      'click #gotoContact': 'processContact',
      'click #gotoSignup': 'processSignup',
      'click #gotoLogin': 'processLogin'
    },
    processHome: function(e){
      e.preventDefault();
      console.log('view: #gotoHome clicked');
      //Backbone.history.navigate('home', {trigger: true});
      app.router.navigate('home', {trigger: true});
    },
    processAbout: function(e){
      e.preventDefault();
      console.log('view: #gotoAbout clicked');
      //Backbone.history.navigate('about', {trigger: true});
      app.router.navigate('about', {trigger: true});
    },
    processContact: function(e){
      e.preventDefault();
      console.log('view: #gotoContact clicked');
      Backbone.history.navigate('contact', {trigger: true});
    },
    processSignup: function(e){
      e.preventDefault();
      console.log('view: #gotoSignup clicked');
      Backbone.history.navigate('signup', {trigger: true});
    },
    processLogin: function(e){
      e.preventDefault();
      console.log('view: gotoLogin clicked');
      Backbone.history.navigate('#login', {trigger: true});
    },
  }); 

  app.HomeView = Backbone.View.extend({
    el: '#home',
    template: _.template(JST["assets/views/home/tmpl-home.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('homeView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      //this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
    }//,
    //template: _.template( $('#tmpl-header').html() ),
    /*events: {
      'submit form': 'preventSubmit',
      'keypress input[type="text"]': 'addNewOnEnter',
      'click .btn-add': 'addNew'
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    addNewOnEnter: function(event) {
      if (event.keyCode !== 13) { return; }
      event.preventDefault();
      this.addNew();
    },
    addNew: function() {
      if (this.$el.find('[name="name"]').val() === '') {
        alert('Please enter a name.');
      }
      else {
        this.model.save({
          'name.full': this.$el.find('[name="name"]').val()
        },{
          success: function(model, response) {
            if (response.success) {
              model.id = response.record._id;
              location.href = model.url();
            }
            else {
              alert(response.errors.join('\n'));
            }
          }
        });
      }
    }*/
  });

app.AboutView = Backbone.View.extend({
    el: '#about',
    template: _.template(JST["assets/views/about/tmpl-about.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('aboutView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      //this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
    }
  });

app.ContactView = Backbone.View.extend({
    el: '#contact',
    template: _.template(JST["assets/views/contact/tmpl-contact.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('contactView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      //this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
    }
  });

app.LoginView = Backbone.View.extend({
    el: '#login',
    template: _.template(JST["assets/views/login/tmpl-login.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('loginView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      //this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
    }
  });

app.SignupView = Backbone.View.extend({
    el: '#signup',
    template: _.template(JST["assets/views/signup/tmpl-signup.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('signupView loaded.');
      //this.model = new app.Record();
      //this.listenTo(this.model, 'change', this.render);
      //this.render();
    },
    render: function() {
      this.$el.html(this.template( 'hello' ));
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

  app.Router = Backbone.Router.extend({
    routes: {
      '': 'default',
      'q/:params': 'query',
      'home': 'showView(app.views.homeView)',
      'about': 'showView(app.views.aboutView)',
      'contact': 'showView(app.views.contactView)',
      'signup': 'showView(app.views.signupView)',
      'login': 'showView(app.views.loginView)'
    },
    initialize: function() {
      console.log('router: init');
      app.views = {};

      app.views.headerView = new app.HeaderView();
      app.views.homeView = new app.HomeView();
      app.views.aboutView = new app.AboutView();
      app.views.contactView = new app.ContactView();
      app.views.signupView = new app.SignupView();
      app.views.loginView = new app.LoginView();

      //this.showView(app.views.homeView);

    },
    default: function() {
      //if (!app.firstLoad) {
        //app.resultsView.collection.fetch({ reset: true });
      //}

      //this.home(); turn this on when we remove index.html


      this.showView(app.views.homeView);

      app.firstLoad = false;
    },
    query: function(params) {
      app.resultsView.collection.fetch({ data: params, reset: true });
      app.firstLoad = false;
    },
    showView: function(view){
      console.log('showView: ');
      console.dir(view.el);
      if(app.views.current != undefined){
          $(app.views.current.el).hide();
      }
      app.views.current = view;
      $(app.views.current.el).show();
    }
  });

  $(document).ready(function() {
    console.log('app loading...');
    app.firstLoad = true;
    app.router = new app.Router();
    Backbone.history.start();
    console.log('app loaded!');
  });
}());
