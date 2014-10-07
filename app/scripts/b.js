(function(){
'use strict';


window.App = {};		
App.Models = {};
App.Collections = {};
App.Views = {};
App.Routers = {};


// MODELS

App.Models.Person = Backbone.Model.extend ({
	defaults: {
		firstName: ''
	},

	idAttribute: '_id'
});


// COLLECTIONS

App.Collections.People = Backbone.Collection.extend ({
	model: App.Models.Person,
	url: 'http://tiny-pizza-server.herokuapp.com/collections/people'
});


// VIEWS

App.Views.NewPersonForm = Backbone.View.extend ({
	initialize: function (opts) {
		var options = _.defaults({}, opts, {
			$container: $('body')
		});
	options.$container.append(this.el);
	this.render();
	},

	tagName: 'form',
	template: _.template ( $('#newPersonForm').text() ),
	render: function () {
		this.$el.html(this.template());
	},

	events: {
		'submit': 'makeNewPerson'
	},

	makeNewPerson: function(event) {
		event.preventDefault();
		var postData = {
			firstName: $('#firstName').val(),
			lastName: $('#lastName').val(),
			address: $('#address').val(),
			phoneNumber: $('#phoneNumber').val()
		};
		this.collection.create(postData);
	}
});

// ROUTERS

App.Routers.BRouter = Backbone.Router.extend ({
	initialize: function() {
		new App.Views.NewPersonForm({
			collection: new App.Collections.People(),
		});
	}
});




// GLUE CODE

$(document).ready(function() {
		var bRouter = new App.Routers.BRouter();
		Backbone.history.start();
});


})();