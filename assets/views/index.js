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
      'click #home': 'processHome',
      'click #about': 'processAbout',
      'click #contact': 'processContact',
      'click #signup': 'processSignup',
      'click #login': 'processLogin'
    },
    processHome: function(e){
      e.preventDefault();
      console.log('view: #home clicked');
      Backbone.history.navigate('home', {trigger: true});
    },
    processAbout: function(e){
      e.preventDefault();
      console.log('view: #about clicked');
      Backbone.history.navigate('about', {trigger: true});
    },
    processContact: function(e){
      e.preventDefault();
      console.log('view: #contact clicked');
      Backbone.history.navigate('contact', {trigger: true});
    },
    processSignup: function(e){
      e.preventDefault();
      console.log('view: #signup clicked');
      Backbone.history.navigate('signup', {trigger: true});
    },
    processLogin: function(e){
      e.preventDefault();
      console.log('view: login clicked');
      Backbone.history.navigate('#login', {trigger: true});
    },
  }); 

  app.ContentView = Backbone.View.extend({
    el: '#content',
    template: _.template(JST["assets/views/index/tmpl-index.html"]()), //We need to jade this and pass data
    initialize: function() {
      console.log('contentView loaded.');
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
      'home': 'home',
      'about': 'about',
      'contact': 'contact',
      'signup': 'signup',
      'login': 'login'
    },
    initialize: function() {
      app.headerView = new app.HeaderView();
      app.contentView = new app.ContentView();
    },
    default: function() {
      if (!app.firstLoad) {
        app.resultsView.collection.fetch({ reset: true });
      }

      app.firstLoad = false;
    },
    query: function(params) {
      app.resultsView.collection.fetch({ data: params, reset: true });
      app.firstLoad = false;
    },
    home: function() {
      console.log('router: home');
      app.contentView.template = _.template(JST["assets/views/index/tmpl-index.html"]());
    },
    about: function() {
      console.log('router: about');
      app.contentView.template = _.template(JST["assets/views/index/tmpl-about.html"]());
    },
    contact: function() {
      console.log('router: contact');
    },
    signup: function() {
      console.log('router: signup');
    },
    login: function() {
      console.log('router: login');
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
