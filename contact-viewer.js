var apiKey = 'bricked'
var _contacts = {};
var _contactID = null;

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
	
	$('#first_name').text(contact.name)
	$('#d-title').text(contact.title)
	$('#d-phone').text(contact.phone)
	$('#d-email').text(contact.email)
	$('#d-twitterId').text(contact.twitterId)

});

$(document).on('pageshow', '#home-page', function(){
	console.log("Its home page")
	_contactID = null
	return true
});

$(document).on('click', '#delete-me', function(){
	console.log("Delete clicked")
	
	$.ajax({
				url: 'http://contacts.tinyapollo.com/contacts/' + _contactID.trim() + '?key=' + apiKey,
				method: 'DELETE',

			complete: function() {
			},
			success: function (result) {
			  if(result.status) {
							console.log('Contact Deleted' + _contactID)
							$.mobile.changePage("#home-page");
			  } else {
							console.log('Delete Contact Failed!' + result);
							$.mobile.changePage("#home-page");
							
			  }
			},
			error: function (request,error) {
			  // This callback function will trigger on unsuccessful action
					console.log('Inside Error Function!' + error + request)
				}
			});
	return true
});

$(document).on('pagebeforeshow', '#add-page', function() {
	//Clear out all of the fields each time the page is loaded
	$('#name').val("");
	$('#title').val("");
	$('#email').val("");
	$('#phone').val("");
	$('#twitter').val("");
});

$(document).on('submit', '#add-page', function(){
	var myName = $('#name').val();
	var myTitle = $('#title').val();
	var myEmail = $('#email').val();
	var myPhone = $('#phone').val();
	var myTwitter = $('#twitter').val();
	console.log('Contact Info:' + myName + ' ' + myTitle + myPhone)
	//http://api.jquery.com/jQuery.ajax/
	$.ajax({
		url: 'http://contacts.tinyapollo.com/contacts/?key=' + apiKey,
		method: 'POST',
		data: {
			name: myName,
			title: myTitle,
			email: myEmail,
			phone: myPhone,
			twitterID: myTwitter
		},
		//http://api.jquery.com/Ajax_Events/
    complete: function() {
    },
    success: function (result) {
      if(result.status) {
					console.log('Result:' + result.status + ' Name:' + myName + ' Title:' + myTitle + ' Email:' + myEmail + ' Phone:' + myPhone + ' Twitter:' + myTwitter)
					$.mobile.changePage("#home-page");
      } else {
					console.log('Contact Failed!')
      }
    },
    error: function (request,error) {
      // This callback function will trigger on unsuccessful action
			console.log('Inside Error Function!' + error + request)
		}
	});
});
