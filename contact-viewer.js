var apiKey = 'bricked'
var _contacts = {};
var _contactID = null;

console.log('loading');
$(document).on("pagebeforeshow", "#home-page", function() {
	var contactList = $('#contact-list')
	contactList.html('')
	$.get('http://contacts.tinyapollo.com/contacts?key=' + apiKey,
	function (result) {
		_contacts = {}
		console.log('there are ' + result.contacts.length + ' contacts')
		for (i in result.contacts) {
			var contact = result.contacts[i]
			_contacts[contact._id] = contact
			contactList.append('<li><a href="#details-page" ' + 
				'data-contact-id="' + 
				contact._id + '">' 
				+ contact.name + '</a></li>')
		};
		contactList.listview('refresh')
	})
})

$(document).on('click', '#contact-list a', function() {
	var link = $(this)
	_contactID = link.data('contact-id')
	console.log("contact id is: " +  _contactID)
	return true
})

$(document).on('pagebeforeshow', '#details-page', function() {
	var contact = _contacts[_contactID]
	var details = $('#details-page')
	$('contact-details').text(contact.name + 'details')
	$('contact-details').text(contact.title + 'details')
	$('contact-details').append(contact.name)
	details.append('<li>Text</li>')
	$('h2').append(contact.name)
	//$('first_name').append(contact.name);

})