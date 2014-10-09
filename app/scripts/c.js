(function(){
'use strict';


window.App = {};		
App.Models = {};
App.Collections = {};
App.Views = {};
App.Routers = {};


// MODELS

App.Models.Post = Backbone.Model.extend ({
	idAttribute: '_id'
});

// COLLECTIONS

App.Collections.Posts = Backbone.Collection.extend ({
	model: App.Models.Post,
	url: 'http://tiny-pizza-server.herokuapp.com/collections/posts'
});

// VIEWS

App.Views.BPList = Backbone.View.extend ({
	
	tagName: 'ul',
	template: _.template( $('#postList').text() ),

	initialize: function(opts) {
		// var options = opts || {}								/* These two lines are Jess' alternate method */
		// this.$container = options.$container || $('body')
		var options = _.defaults({}, opts, {
			$container: $('body')
		});
		options.$container.append(this.el);
		this.render();
		this.listenTo(this.collection, 'add remove', this.renderChildren);
	},

	render: function() {
		this.$el.html(this.template());
		this.renderChildren();
	},

	renderChildren: function() {
		this.itemViews = this.itemViews || [];
		_.invoke(this.itemViews, 'remove');

		var self = this;
		this.collection.each(function(child){
			// console.log(child)		THIS IS LOGGING!
			var childView = new App.Views.BPListItemView({
				model: child,
				$container: self.$el
			});
			self.itemViews.push(childView);
		});
	}
});

App.Views.BPListItemView = Backbone.View.extend ({
	tagName: 'li',
	template: _.template( $('#listItem').text() ),

	events: {
		'click a': 'showPost'
	},

	showPost: function(event){
		console.log(this.model.toJSON());
		event.preventDefault();
		// console.log(this.model.id);			WORKING
		// /
		router.navigate('posts/' + this.model.id, {trigger: true});
	},

	initialize: function(opts){

		var options = _.defaults({}, opts, {
			$container: $('body')
		});

		options.$container.append(this.el);

		this.render();

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(){
		this.$el.html( this.template(this.model.toJSON()) );
	}
});

App.Views.CurrentlySelectedPost = Backbone.View.extend ({
	template: _.template( $('#selectedPostView').text() ),
	initialize: function(opts) {
		var options = _.defaults({}, opts, {
			$container: $('body')
		});

		options.$container.append(this.el);

		this.render();

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(){
		console.log(this.model);    /*NOT WORKING!*/
		this.$el.html(this.template(this.model));		/*toJSON?*/
	}
});

// ROUTERS

App.Routers.BRouter = Backbone.Router.extend ({
	initialize: function() {
		this.collection = new App.Collections.Posts();
		this.postsPromise = this.collection.fetch();		/* toJSON/serialize? */
		console.log(this.collection);	/* Working */
		new App.Views.BPList ({
			collection: this.collection,
			$container: $('.sidebar')
		});
	},
	
	routes: {
		'posts/:id': 'showPost'
	},

	showPost: function(id){
		var self = this;
		console.log(id);				/* WORKING */
		// console.log(this.model.get('id'));
		console.log(this.collection.get(id));		/*UNDEFINED!*/
		this.postsPromise.done(function() {

		var post = self.collection.get(id);
		console.log(post);		/* UNDEFINED! */
		// console.log(this.model);		NOT WORKING!
		new App.Views.CurrentlySelectedPost({
			model: post,
			$container: $('.mainContent')
		});
			
		})
			
	}
});


// GLUE CODE

$(document).ready(function() {
		window.router = new App.Routers.BRouter();
		Backbone.history.start();
});




})();



$.fn.serializeObject = function(){
  return this.serializeArray().reduce(function(acum, i){
    acum[i.name] = i.value;
    return acum;
  }, {});
};