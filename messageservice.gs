function MessageService() 
{
  this.timeService = new TimeService();
}
MessageService.prototype.allStopsTextMessage = function(data)
{
  var message = "";  

  for(i=0;i<data.Time.length;i++)
  {
    message += this.timeService.format(data.Time[i]) + "\n"; 
  }
  return message;
}
MessageService.prototype.allStopsHtmlMessage = function(data)
{
  var template = HtmlService.createTemplate('<html><head><title><?= title ?></title><body style=\'font-size:250%\'><h1><?= header ?></h1><p><?= message1 ?></p><ul><? for (var i = 0; i < Time.length; i++) { ?> <li><?= Time[i] ?></li><? }?></ul></body></html>');
  template.Time = this.timeService.formatArray(data.Time);
  template.title = "When's the bus coming?";
  template.header = "When's the bus coming?";
  template.message1 = "The following are the times for " +  data.Stop + ".";
  return template.evaluate().getContent();
}

function test_allStopsHtmlMessage()
{
  var ms = new MessageService();
  var result = ms.allStopsHtmlMessage({Time:["Wed Jun 05 2013 12:00:00 GMT-0400 (EDT)","Wed Jun 05 2013 13:00:00 GMT-0400 (EDT)"], Stop:"Mutec Drive"});
  var expectation = "<html><head><title>When&#39;s the bus coming?</title><body style='font-size:250%'><h1>When&#39;s the bus coming?</h1><p>The following are the times for Mutec Drive.</p><ul> <li>12:00 PM</li> <li>1:00 PM</li></ul></body></html>";
  if(result !== expectation)
    Logger.log("error in test_allStopsHtmlMessage");
  else
    Logger.log("success in test_allStopsHtmlMessage");
}

MessageService.prototype.busArrivalTextMessage = function(data)
{
  var message = "There are no more stops at this stop.";
  if(data.Time[0] != null)
  {  
    if(data.Time.length == 1)
    {
      if(this.timeService.withinNextMinutes(15,data.Time[0]))
      {
        message = "Bus arrives soon at " + this.timeService.format(data.Time[0]) + " at " + data.Stop + ".";      
      }
      else
      {
        message = "Next bus arrives at " + this.timeService.format(data.Time[0]) + ". Text 2" + data.Route + data.StopNumber + " to get a Reminder.";
      }
    }
  }
  return message;
}
MessageService.prototype.busArrivalHtmlMessage = function(data)
{
  var textTemplate = "<html><body><p>There are no more stops at this stop.</p></body></html>";
  if(data != null)
  {
    if(data.Time.length == 1)
    {
      if(this.timeService.withinNextMinutes(15,data.Time[0]))
      {
        textTemplate = "<html><body><h1 style='font-size:800%'>Bus arrives soon at <?= Time ?> at <?= Stop ?>.</h1></body></html>";
      }
      else
      {
        textTemplate = "<html><body><h1 style='font-size:800%'>Next bus arrives at <?= Time ?>.  Text 2<?= Route ?><?= StopNumber ?> to get a Reminder.</h1></body></html>";
      }
    }
    var template = HtmlService.createTemplate(textTemplate);
    template.Time = this.timeService.format(data.Time[0]);
    template.Route = data.Route;
    template.Stop = data.Stop;
    template.StopNumber = data.StopNumber;
    return template.evaluate().getContent();
  }
  return textTemplate;
}

function test_busArrivalHtmlMessage()
{
  try
  {
    var ms = new MessageService();
    var result = ms.allStopsHtmlMessage({Route: "06", StopNumber: "03", Time:["Wed Jun 05 2013 12:00:00 GMT-0400 (EDT)"], Stop:"Mutec Drive"});
    var expectation = "<html><head><title>When&#39;s the bus coming?</title><body style='font-size:250%'><h1>When&#39;s the bus coming?</h1><p>The following are the times for Mutec Drive.</p><ul> <li>12:00 PM</li></ul></body></html>";
    if(result !== expectation)
      Logger.log("error in test_busArrivalHtmlMessage. Result = " + result);
    else
      Logger.log("success in test_busArrivalHtmlMessage");
  }
  catch(e)
  {
    Logger.log("error in test_busArrivalHtmlMessage: " + e);
  }
}









