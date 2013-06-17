function doGet(request) 
{
    try
    {
      var busService = new BusService();
      var response = busService.getByText(request.parameter);
      
      if(response.hasError == false)
      {
        var isHTML = false;
        if(request.parameter.Format && request.parameter.Format == "HTML")
          return HtmlService.createHtmlOutput(response.text);
        else
          return ContentService.createTextOutput(response.text).setMimeType(ContentService.MimeType.TEXT);
      }
      else
      {
        return ContentService.createTextOutput("An error occured " + request.parameter.From).setMimeType(ContentService.MimeType.TEXT); 
      }
      return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);
    }
    catch(e)
    {
      return ContentService.createTextOutput("fail" + e).setMimeType(ContentService.MimeType.TEXT);
    }
}

function runAnyScriptToPreventAuthorizationError()
{
  
}
  
