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

	idAttribute: '_id',

	validate: function(attributes){
      if(! attributes.firstName){
        return "First name is required.";
      }
      if(! attributes.lastName){
        return "Last name is required.";
      }
      if(! attributes.address || !attributes.address.match(' ')){
        return "Address is required.";
      }
      if(! attributes.phoneNumber || !attributes.phoneNumber.match('1')){
        return "Phone number is required.";
      }
    },

    url: 'http://tiny-pizza-server.herokuapp.com/collections/people'
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
	this.listenTo(this.model, 'invalid', this.invalidUser);
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
		
		var postData = this.$el.serializeObject();
		// OR instead of entire line above:
		// var	firstName = $('#firstName').val();
		// var lastName = $('#lastName').val();
		// var address = $('#address').val();
		// var phoneNumber = $('#phoneNumber').val();

		this.collection.create(postData);
		// OR instead of postData above:
		// {firstName: firstName, lastName: lastName, address: address, phoneNumber: phoneNumber}
		
		console.log(this.model);
		this.$('input[type=text]').val('');
		
	},

	invalidUser: function(model, error){
      this.$('form').addClass('invalid');
      alert(error);
    },

});

// ROUTERS

App.Routers.BRouter = Backbone.Router.extend ({
	initialize: function() {
		new App.Views.NewPersonForm({
			model: new App.Models.Person(),
			collection: new App.Collections.People(),
		});
	},
});




// GLUE CODE

$(document).ready(function() {
		var bRouter = new App.Routers.BRouter();
		Backbone.history.start();
});


})();


$.fn.serializeObject = function(){
	return this.serializeArray().reduce(function(acum, i){
		acum[i.name] = i.value;
		return acum;
	}, {});
};