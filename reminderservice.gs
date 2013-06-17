function ReminderService() 
{
  this.dataService = new DataService();
  this.timeService = new TimeService();
  this.messageService = new MessageService();
}
ReminderService.prototype.createReminder = function(route, stop, phone, arrival)
{
  var db = ScriptDb.getMyDb();
  
  var result = db.query({phone:phone});
  
  //delete any existing reminders with this phone number
  while (result.hasNext())
    db.remove(result.next());
  
  if(!arrival)
    var arrival = this.dataService.getBusArrival(route, stop);
  
  if(!arrival.Time || arrival.Time.length == 0)
  {
   Logger.log("no more buses for this stop. no reminder created");
   return;
  }
  
  var timenumber = createTimeNumber(arrival.Time[0]);
  
  var ob = {
    Route: arrival.Route, 
    StopNumber: arrival.StopNumber, 
    Phone: phone, 
    Time: arrival.Time[0].toString(),
    TimeNumber: timenumber,
    Stop: arrival.Stop
  };
  
  Logger.log(ob);
  
  var stored = db.save(ob);
}

function test_CreateReminder()
{
  try
  {
    var rs = new ReminderService(); 
    rs.createReminder("06","03",CONFIG.FROM_NUMBER, {Route:"06",StopNumber:"03",Stop:"Mutec drive",Time:[new Date("Thu Jun 06 2013 13:00:10 GMT-0400 (EDT)")]});
    
    Logger.log("success");
  }
  catch(e)
  {
    Logger.log(e); 
  }
}

ReminderService.prototype.notifyUsers = function()
{
  var result = this.getReminders();
  
  while(result.hasNext())
  {
    var current = result.next();
    current.Time = new Array(current.Time);
    this.sendText(current.Phone, this.messageService.busArrivalTextMessage(current));
    db.remove(current);
    Logger.log(current.Phone);
  }
}

ReminderService.prototype.getReminders = function(currenttime)
{
  if(!currenttime)
    var currenttime = this.timeService.getTime();
  
  var futuretime = addMinutes(currenttime,15);
  
  var currenttime_num = createTimeNumber(currenttime);
  var futuretime_num = createTimeNumber(futuretime);
  
  
  //where now < stoptime <= now + 15 minutes
  var db = ScriptDb.getMyDb();
  var result = db.query({TimeNumber: db.between(currenttime_num, futuretime_num)});
  return result;
}

function createTimeNumber(currenttime)
{
  return currenttime.getHours() + (currenttime.getMinutes() / 60);
}

function test_getReminders()
{
  try
  {
    var rs = new ReminderService();
    var result = rs.getReminders(new Date("Thu Jun 06 2013 12:47:10 GMT-0400 (EDT)"));
    Logger.log("success: " + result.getSize());
  }
  catch(e)
  {
    Logger.log("error: " + e); 
  }
}

ReminderService.prototype.sendText = function(to, body)
{
  var accountSid = CONFIG.TWILIO_ACCOUNT_SID;
  var authToken = CONFIG.TWILIO_AUTHTOKEN;  
  
  var options =
      {
        method: "post",
        headers: { Authorization: "Basic " + Utilities.base64Encode(accountSid + ":" + authToken) },
        payload :
        {
          From : CONFIG.FROM_NUMBER,
          To: to,
          Body: body
        }
      };
  
  var response = UrlFetchApp.fetch(CONFIG.TWILIO_URL, options); 
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function deleteAllReminders()
{
 var db = ScriptDb.getMyDb();
  var results = db.query({});
  while(results.hasNext())
  {
   var result = results.next();
   db.remove(result);
  }
}

function showAll() {
  var db = ScriptDb.getMyDb();
  var results = db.query({});

  while (results.hasNext()) {
    var result = results.next();
    Logger.log(Utilities.jsonStringify(result));
  }
}
