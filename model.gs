function Response() 
{
  this.text = "";
  this.hasError = true;
  this.errorText = "";
}

function ScheduleData(route, stopNumber, stop, time) 
{
    this.Route = route;
    this.Stop = stop;
    this.Time = time;  
    this.StopNumber = stopNumber;
}

function RequestCommand() 
{
  this.name = "";
  this.route = "";
  this.stop = "";
  this.errorText = "";
  this.hasError = true;
  this.isFormatHtml = false;
}

function ErrorMessages() {}
ErrorMessages.prototype.BodyIsNotAString = "getByText: body is not a string";
ErrorMessages.prototype.BodyIncorrectLength = "getByText: length is not 4 or 5.";
ErrorMessages.prototype.InvalidCommandName = "getByText: Command invalid";

