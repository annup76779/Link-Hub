function check(input) {
	if (input.value != document.getElementById('npass').value) {
		input.setCustomValidity('Password Must be Matching.');
	} else {
		// input is valid -- reset the error message
		input.setCustomValidity('');
	}
	function Validate() {
		var country = document.getElementById("country");
		if (country.value == "") {
			//If the "Please Select" option is selected display error.
			input.setCustomValidity('Choose your country!');
		}
		else{
			input.setCustomValidity('');
		}
	}
}


function show_pass(pass_id, btn){
	var field = $("#"+pass_id+" input");
	if ($(field).attr("type") == "password"){
		$(field).attr('type', 'text');
		$("#"+btn).attr('class','fa fa-eye');
	}
	else{
		$(field).attr('type', 'password');
		$("#"+btn).attr('class','fa fa-eye-slash');
	}
	
}


function gal(a)
 {
	 var m=document.getElementById("imgM");
	 var desc=document.getElementById("header");
	 m.src=a.src;
	 desc.innerHTML=a.title;
 }
//upload image validation starts
function preview_image(event)
{
 var reader = new FileReader();
 reader.onload = function()
 {
  var output = document.getElementById('output_image');
  output.src = reader.result;
 }
 

 var splist = ($("#attach").val()).split("\\")//this is the list of the layers of path seperated by a ","
 var filename = splist[splist.length-1];
 var extlist = filename.split(".");
 var extension = extlist[extlist.length-1]
 const ALLOWED_EXTENSION = ['jpg', 'jpeg', 'png', 'gif', 'apng', 'jfif','svg']
 var ext_allowed = false;
 for (var i = 0; i < ALLOWED_EXTENSION.length; i++) {
 	if (ALLOWED_EXTENSION[i] == extension.toLowerCase()) {
 		ext_allowed = true
 	}
 }
 if (ext_allowed){
 	reader.readAsDataURL(event.target.files[0]);
 	$("#output_image").css('display', 'block');
 	$(".attachment").prop('title',filename);
 	$("#dismiss").show();
 }
 else{

 	$("#attach").val("");
 	$.notice({
 		text:"File type not allowed!",
 		type:"error"
 	});
 }
}

function dismiss(event){
	$("#output_image").attr('src', '');
	$("#output_image").hide();
	$("#attach").val("");
	$(".attachment").prop('title',"");
	$("#dismiss").hide();
}

// image validation ends



//description box support section starts
function insertAtCaret(text) {
const textarea = document.querySelector('#desc');
try{
  textarea.focus();
  textarea.setRangeText(
    text,
    textarea.selectionStart,
    textarea.selectionEnd,
    'end'
  )
}
catch(Error){
	textarea.value+=text;
}
}
//description box support section starts


//valid user
function validUser(input, type) {
	$("#user").removeClass("input");
	if (input.length<5){
		$("#user").removeClass("valid");
		$("#user").addClass('error');
		$("#msg").html("Invalid!");
		$('#block-submit').attr('onclick', 'return false;');
	}
	else
	{
		$.ajax({
			url: '/check_user',
			type: 'POST',
			dataType: "json",
			data: JSON.stringify({"user":input}),
		})
		.done(function(data) {
			if (type == "join"){
				if (data.check) {
					$("#user").removeClass("error");
					$("#user").addClass('valid');
					$("#msg").html("");
					$('#block-submit').attr('onclick', 'return true;');
				} 
				else {
					$("#user").removeClass("valid");
					$("#user").addClass('error');
					$("#msg").html("User already registered!");
					$('#block-submit').attr('onclick', 'return false;');
				}
			}
			else{
				if (!data.check) {
					$("#user").removeClass("error");
					$("input[type=password]").removeClass("error");
					$("#user").addClass('valid');
					$("#msg").html("");
					$('#block-submit').attr('onclick', 'return true;');
				} 
				else {
					$("#user").removeClass("valid");
					$("#user").addClass('error');
					$("#msg").html("Invalid user!");
					$('#block-submit').attr('onclick', 'return false;');
				}
			}
				
		});
	}
	event.preventDefault();
}

function del(el,type) {
	var url = el+type;
	var tab = $(el).attr('tabindex');
	var id = "#"+tab;
	if (confirm("Do you want to delete?")){
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({'tab': tab}),
		})
		.done(function(data) {
			if (data.status == true){
				$(id).remove();
				$.notice({
					text:"Deleted",
					type:"success"
				});
			}
			else{
				if(data.status == false){
					$.notice({
						text:"Sorry! Try again",
						type:"error"
					});
				}
			}
		})
		.fail(function() {
			$.notice({
				text:"Sorry! Try again",
				type:"error"
			});
		});	
	}
	return false;
}