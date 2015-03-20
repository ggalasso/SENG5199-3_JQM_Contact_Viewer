var apiKey = 'bricked'
var _contacts = {};
var _contactID = null;
var _editContactId = null;

$(document).on("pagebeforeshow", "#home-page", function() {
	var contactList = $('#contact-list')
	//
	$.get('http://contacts.tinyapollo.com/contacts?key=' + apiKey,
	function (result) {
		_contacts = {}
		contactList.html("")
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
	_contactID = null
})

$(document).on('click', '#contact-list a', function() {
	var link = $(this)
	_contactID = link.data('contact-id')
	_editContactId = null
	console.log("contact id is: " +  _contactID)
	return true
})

$(document).on('pagebeforeshow', '#details-page', function() {
	if(_editContactId==null){

	 var contactD = _contacts[_contactID]	
		$('#d-name').text(contactD.name)
		$('#d-title').text(contactD.title)
		$('#d-phone').text(contactD.phone)
		$('#d-email').text(contactD.email)
		$('#d-twitterId').html(contactD.twitterId)
	}
	else{
		
		$.get( 'http://contacts.tinyapollo.com/contacts/' + _editContactId.trim() + '?key=' + apiKey, function (result) {
			for (i in result.contact) {	
				$('#d-' + i).text(result.contact[i])
			};
		})
		_contactID = _editContactId	
	}
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
							console.log('Contact Deleted: ' + _contactID)
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

$(document).on('click', '#cancel-btn', function(){
	history.back();
return true
});
	
$(document).on('pagebeforeshow', '#add-page', function() {
	//Clear out all of the fields each time the page is loaded
	if (_contactID == null)
		{
			_editContactId = null
			$('#add-contact-form h1').text('Add Contact')
			$('#name').val("");
			$('#title').val("");
			$('#email').val("");
			$('#phone').val("");
			$('#twitterId').val("");

			console.log("add clicked ")
		}
	else
		{
			_editContactId = _contactID
			$('#add-contact-form h1').text('Edit Contact');
			$.get( 'http://contacts.tinyapollo.com/contacts/' + _editContactId.trim() + '?key=' + apiKey, function (result) {
			for (i in result.contact) {	
				$('#' + i).val(result.contact[i])
			};
		})

			console.log("edit clicked " +  _contactID)
		}
});

$(document).on('submit', '#add-page', function(){
	var myName = $('#name').val().trim();
	var myTitle = $('#title').val().trim();
	var myEmail = $('#email').val().trim();
	var myPhone = $('#phone').val().trim();
	var myTwitter = $('#twitterId').val().trim();
	console.log('Contact Info:' + myName + ' ' + myTitle + myPhone)
	//http://api.jquery.com/jQuery.ajax/


	if(_editContactId==null){

		$.ajax({
			url: 'http://contacts.tinyapollo.com/contacts/?key=' + apiKey,
			method: 'POST',
			data: {
				name: myName,
				title: myTitle,
				email: myEmail,
				phone: myPhone,
				twitterId: myTwitter
			},
			//http://api.jquery.com/Ajax_Events/
		complete: function() {
		},
		success: function (result) {
		  if(result.status) {
						console.log('Result:' + result.status + ' Name:' + myName + ' Title:' + myTitle + ' Email:' + myEmail + ' Phone:' + myPhone + ' Twitter:' + myTwitter)
						$.mobile.changePage("#home-page");
		  } else {
						console.log('Add Contact Failed!')
		  }
		},
		error: function (request,error) {
		  // This callback function will trigger on unsuccessful action
				console.log('Inside Error Function!' + error + request)
			}
		});
	}
	else {

			$.ajax({
				url: 'http://contacts.tinyapollo.com/contacts/' + _contactID.trim() + '?key=' + apiKey,
				method: 'PUT',
				data: {
				name: myName,
				title: myTitle,
				email: myEmail,
				phone: myPhone,
				twitterId: myTwitter
			},
			complete: function() {
			},
			success: function (result) {
			  if(result.status=='success') {
							console.log('Edit Result:' + ' Name:' + myName + ' Title:' + myTitle + ' Email:' + myEmail + ' Phone:' + myPhone + ' Twitter:' + myTwitter)
			  } else {
							console.log('Edit Contact Failed!' + result + ' ' + result.message);
			  }
			  $.mobile.changePage("#details-page");
				contact
			},
			error: function (request,error) {
			  // This callback function will trigger on unsuccessful action
					console.log('Inside Error Function!' + error + request)
				}
			});
	}
});
