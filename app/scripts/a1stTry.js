(function(){
'use strict';


window.App = {};		
App.Models = {};
App.Collections = {};
App.Views = {};
App.Routers = {};


// MODELS

App.Models.BlogPost = Backbone.Model.extend ({
	defaults: {
		title: '',
		author: '',
		blogPostBody: ''
	},
	// validate: function(attributes){
	// 	if (! attributes.title){
	// 		return 'Title is required!';
	// 	}
	// }
});


// COLLECTIONS

App.Collections.BlogPosts = Backbone.Collection.extend ({
	model: App.Models.BlogPost,
	url: 'http://tiny-pizza-server.herokuapp.com/collections/posts'
});


// VIEWS

App.Views.BlogPostView = Backbone.View.extend ({
	initialize: function (opts) {
		var options = _.defaults({}, opts, {		/* What does the {} indicate? */
      		$container: $('body')
		});
    options.$container.append(this.el);
    this.render();
	},

	tagName: 'form',
	className: 'bPostForm',
	template: _.template ( $('#blogPost').text() ),
	render: function () {
		this.$el.html(this.template());
	}
});


// ROUTERS

App.Views.BlogPostAppRouter = Backbone.Router.extend ({
	routes: {
		"submit": 'postBlogPost'
	},

	postBlogPost: function () {

		// this.$el.serializeArray();			/* Don't use on its own cuz returns data in unuseable format? */

		$.fn.serializeObject = function(){								/* How do I hook up my form data here or define the model or whatever? Is that dollar sign at front supposed to be replaced with a DOM element? */
  			return this.serializeArray().reduce(function(acum, i){
    			acum[i.name] = i.value;
    			return acum;
  				}, {});
		};

	$('.bPostForm').serializeObject();
	var blogPosts = new App.Collections.BlogPosts();
	var blogPostView = new App.Views.BlogPostView({collection: blogPosts, model: blogPost});
	blogPostView.collection.create(this.model);
		// blogPostView = new App.Views.BlogPostView();		OR		blogPostView.render();
	}
});


// SET UP ROUTER WITH HISTORY AND START AND SHIT


}());

$(document).ready(function() {
	var blogPost = new App.Models.BlogPost();

	var blogPostAppRouter = new App.Views.BlogPostAppRouter();
	Backbone.history.start();
});






