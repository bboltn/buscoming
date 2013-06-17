function BusService() 
{
  this.dataService = new DataService(); 
  this.messageService = new MessageService();
  this.reminderService = new ReminderService();
  this.qrService = new QRService();
}

BusService.prototype.getByText = function(request)
{ 
  return this.processCommand(this.parseRequest(request));
  /*
  var response = new Response();
  var message = request.Body;
  var from = request.From;
  var data, route, stop, command;
  
  var isFormatHtml = false;
  if(request.Format && request.Format.toUpperCase() == "HTML")
      isFormatHtml = true;
  
  if(typeof message != "string")
  {
    response.hasError = true;
    response.errorText = "getByText: message is not a string";
    return response;
  }
  
  if(message.length < 4 || message.length > 5)
  {
    response.hasError = true;
    response.errorText = "getByText: length is not 4 or 5.";
    return response;
  }
  
  if(message.length == 4)
  {
    command = "0";//since its a 4 length message the default command is 0
    route = message.slice(0,2);
    stop = message.slice(2); 
  }
  
  if(message.length == 5)
  {
    command = message.slice(0,1);
    route = message.slice(1,3);
    stop = message.slice(3); 
  }
  
  if(isFormatHtml == true && request.Command && request.Command != null)
  {
     command = request.Command.toUpperCase();
  }
  
  switch(command)
  {
    case "0":
      data = this.dataService.getBusArrival(route, stop);
      response.hasError = false;
      if(isFormatHtml)
        response.text = this.messageService.busArrivalHtmlMessage(data);
      else
        response.text = this.messageService.busArrivalTextMessage(data);
      break;
    case "1":
      data = this.dataService.getAllStops(route,stop);
      response.hasError = false;
      if(isFormatHtml)
        response.text = this.messageService.allStopsHtmlMessage(data);
      else
        response.text = this.messageService.allStopsTextMessage(data);
      break;
    case "2":
      response.hasError = false;
      this.reminderService.createReminder(route, stop, from);
      response.text = "Reminder has been set";
      break;
    case "QRCODE":
      response.hasError = false;
      data = this.dataService.getBusArrival(route, stop);
      response.text = this.qrService.createPrintOut(data);
      break;
    case "QRCODELIST":
      response.hasError = false;
      response.text = this.qrService.createAllPrintOuts();
    default:
      response.hasError = true;
      response.errorText = "getByText: Command invalid";
  }
  
  return response;*/
}

BusService.prototype.parseRequest = function(request)
{
  var command = new RequestCommand();
  
  if(request.From)
    command.from = request.From;
  
  if(request.Format && request.Format.toUpperCase() == "HTML")
  {
      command.isFormatHtml = true;
      command.hasError = false;
      //if(request.Command && request.Command != null)
        //command.name = request.Command.toUpperCase();
      
      if(request.Body && request.Body != null)
      {
        if(request.Body.length == 4)
        {
           command.name = "0";//since its a 4 length message the default command is 0
           command.route = request.Body.slice(0,2);
           command.stop = request.Body.slice(2); 
        }
        
        if(request.Body.length == 5)
        {
           command.name = request.Body.slice(0,1);
           command.route = request.Body.slice(1,3);
           command.stop = request.Body.slice(3); 
        } 
      }
  }
  else
  {
    this.parseRequestBody(request.Body,command);
  }  
  
  return command;
}

//function test_parseRequest()
//{
//  var bs = new BusService();
//  var result = bs.parseRequest({From: CONFIG.FROM_NUMBER, Format: "HTML", Command: "1", });
  
//}

BusService.prototype.processCommand = function(command)
{
  var data = null;
  var response = new Response();
  
  if(command.hasError == true)
  {
    response.hasError = true;
    response.errorText = command.errorText;
    return response;
  }
  
  switch(command.name)
  {
    case "0":
      data = this.dataService.getBusArrival(command.route, command.stop);
      response.hasError = false;
      if(command.isFormatHtml)
        response.text = this.messageService.busArrivalHtmlMessage(data);
      else
        response.text = this.messageService.busArrivalTextMessage(data);
      break;
    case "1":
      data = this.dataService.getAllStops(command.route, command.stop);
      response.hasError = false;
      if(command.isFormatHtml)
        response.text = this.messageService.allStopsHtmlMessage(data);
      else
        response.text = this.messageService.allStopsTextMessage(data);
      break;
    case "2":
      response.hasError = false;
      this.reminderService.createReminder(command.route, command.stop, command.from);
      response.text = "Reminder set";
      break;
    case "QRCODE":
      response.hasError = false;
      data = this.dataService.getBusArrival(command.route, command.stop);
      response.text = this.qrService.createPrintOut(data);
      break;
    case "QRCODELIST":
      response.hasError = false;
      response.text = this.qrService.createAllPrintOuts();
    default:
      response.hasError = true;
      response.errorText = ErrorMessages.InvalidCommandName;
  }
  return response;
}

BusService.prototype.parseRequestBody = function(body,command)
{
  if(typeof body != "string")
  {
    command.hasError = true;
    command.errorText = ErrorMessages.BodyIsNotString;
    return;
  }
  
  if(body.length < 4 || body.length > 5)
  {
    command.hasError = true;
    command.errorText = ErrorMessages.BodyIncorrectLength;
    return;
  }
  
  if(body.length == 4)
  {
    command.name = "0";//since its a 4 length message the default command is 0
    command.route = body.slice(0,2);
    command.stop = body.slice(2); 
    command.hasError = false;
  }
  
  if(body.length == 5)
  {
    command.name = body.slice(0,1);
    command.route = body.slice(1,3);
    command.stop = body.slice(3); 
    command.hasError = false;
  }
}
