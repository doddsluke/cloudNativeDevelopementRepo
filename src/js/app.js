// importing auth0
import { createAuth0Client } from '@auth0/auth0-spa-js';

//The URIs of the REST endpoint
IUPS = "https://prod-13.centralus.logic.azure.com:443/workflows/5a610bdd364d4f7994c6e96320e43e4c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MkL8gwyt55VKF8UmcPDCPv9Es0PjzcSluWWce5giFo8";
RAI = "https://prod-03.centralus.logic.azure.com:443/workflows/9ad6dae0ce544e64a098e756dd4fa75c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6t7vu9uX9IoekYIWZITB3Bk5lKogG5UkxL4vW_ZNQkk";

BLOB_ACCOUNT = "https://week9blob.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){

//Create a form data object
submitData = new FormData();
//Get form variables and append them to the form data object
submitData.append('FileName', $('#FileName').val());
submitData.append('userID', $('#userID').val());
submitData.append('userName', $('#userName').val());
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