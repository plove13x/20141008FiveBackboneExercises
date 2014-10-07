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

	idAttribute: '_id'
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
	},

	events: {
		'submit': 'saveBlogPost'
	},

	saveBlogPost: function(event) {
		event.preventDefault();
		var postData = {
			title: $('#title').val() || '[Untitled]',
			author: $('#author').val(),
			blogPostBody: $('#blogPostBody').val()
		};
		this.collection.create(postData);
	}
});


// ROUTERS

App.Routers.BlogPostAppRouter = Backbone.Router.extend ({
	initialize: function() {
		new App.Views.BlogPostView({
			collection: new App.Collections.BlogPosts(),
			$template: $('#blogPost')						/* Sets a variable, didn't use though... */
		});
	}
});


// SET UP ROUTER WITH HISTORY AND START AND SHIT


	$(document).ready(function() {
		var blogPostAppRouter = new App.Routers.BlogPostAppRouter();
		Backbone.history.start();
	});

})();			// JAKE DOES IT THIS WAY!








