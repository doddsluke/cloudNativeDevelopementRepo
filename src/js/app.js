//The URIs of the REST endpoint
IUPS = "https://prod-13.centralus.logic.azure.com:443/workflows/5a610bdd364d4f7994c6e96320e43e4c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MkL8gwyt55VKF8UmcPDCPv9Es0PjzcSluWWce5giFo8";
RAI = "https://prod-03.centralus.logic.azure.com:443/workflows/9ad6dae0ce544e64a098e756dd4fa75c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6t7vu9uX9IoekYIWZITB3Bk5lKogG5UkxL4vW_ZNQkk";

UsersRAAURI = "https://prod-09.centralus.logic.azure.com/workflows/27fb40bd987e49a49244015863b56df1/triggers/manual/paths/invoke/rest/v1/week9users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MBJa7Km3223surAB-MidG5_ORn-yTNk2VA1JM62N0_U";
CIAURI = "https://prod-15.centralus.logic.azure.com/workflows/a6ef5f79e12d406ba3c0256b0b4658bf/triggers/manual/paths/invoke/rest/v1/week9users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=UfGmABq_wWmw6LJkulw7fJBUe_gPdJ2LO8vsBuzt2wo"

BLOB_ACCOUNT = "https://week9blob.blob.core.windows.net";

//Handlers for button clicks
creator = "False"
correctLogin = "False"
$(document).ready(function() {


  $("#loginButton").click(function(){

    //Run the get asset list function
    login()

}); 
 
  $("#retImages").click(function(){

      //Run the get asset list function
      if(correctLogin == "True") {
        getImages();
      } else {
        alert("Please log in to view videos.")
      }

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    if(creator == "True") {
      submitNewAsset();
    }
    else {
      alert("Only users who are creators can upload videos. Please log in as a creator to upload a video.")
    }
    
  }); 

  //Handler for the sign up button
  $("#signUpButton").click(function(){

    //Execute the submit new asset function
    signup();
    $.getJSON(UsersRAAURI, function( data ) {
      userIDlogin = data.length + 1
      alert("Your userID is " + userIDlogin + ". And your passowrd is " + $('#pword').val())
    });

  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){

  //Create a form data object
submitData = new FormData();
//Get form variables and append them to the form data object
submitData.append('FileName', $('#FileName').val());
submitData.append('userID', creatorUserID);
submitData.append('File', $("#UpFile")[0].files[0]);

//Post the form data to the endpoint, note the need to set the content type header
$.ajax({
  url: IUPS,
  data: submitData,
  cache: false,
  enctype: 'multipart/form-data',
  contentType: false,
  processData: false,
  type: 'POST',
  success: function(data){

}
});
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){

  //Replace the current HTML in that div with a loading message
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
  $.getJSON(RAI, function( data ) {

  //Create an array to hold all the retrieved assets
  var items = [];

  //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
  $.each( data, function( key, val ) {
    items.push( "<hr />");
    items.push("<video width='320' height='240' controls>")
    items.push("<source src='"+BLOB_ACCOUNT + val["filepath"] +"' type='video/mp4 width='400'/> <br />")
    items.push("</video> <br />")
    items.push( "File : " + val["fileName"] + "<br />");
    items.push( "Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br />");
    items.push( "<hr />");

  });

  //Clear the assetlist div
  $('#ImageList').empty();

  //Append the contents of the items array to the ImageList Div
  $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
  }).appendTo( "#ImageList" );
  });
}

function login(){

  $.getJSON(UsersRAAURI, function( data ){
  for(i = 0; i < data.length; i++) {
    if($('#userID').val() == data[i].userID && $('#loginpword').val() == data[i].pword) {
      console.log(data[i].userID + " is logged in!")
      correctLogin ="True"
      alert("You are now logged in, click the 'View Videos Button' to view videos.")
      if(data[i].creator == 1){
        console.log(data[i].userID + " is logged in!")
        creatorUserID = data[i].userID
        creator ="True"
        alert("You are a creator, you may use the upload videos feature.")
        // getting the creators user details for file uplaods 
        creatorUserID = data[i].userID
        creatorFirstName = data[i].firstName
        creatorLastName = data[i].lastName
      }
      return
    }
  } 
  alert("Incorrect username or password entered. Please try again.")
  });
}

//A function to submit a new asset to the REST endpoint 
function signup(){
  
  //Construct JSON Object for new item
  var subObj = { 
    firstName: $('#firstName').val(), 
    lastName: $('#lastName').val(), 
    pword: $('#pword').val()
  }

  //Convert to a JSON String
  subObj = JSON.stringify(subObj);

  //Post the JSON string to the endpoint, note the need to set the content type header
  $.post({ 
    url: CIAURI, 
    data: subObj, 
    contentType: 'application/json; charset=utf-8' 
  })  
}
