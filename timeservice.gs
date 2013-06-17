function TimeService() 
{
  
}

/* get Time and returns the current time.
*
* @return {data} the current time
*/
TimeService.prototype.getTime = function()
{
  if(CONFIG.USE_EXCEL_TIME)
  {
    var sdoc_id = CONFIG.SPREADSHEET_ID;
    var sdoc = SpreadsheetApp.openById(sdoc_id);
    sdoc_sheet = sdoc.getSheetByName("time");
    sdoc_range = sdoc_sheet.getRange("A1");
    var current_time = sdoc_range.getValue();
    return current_time;
  }
  else
    return new Date();
}

function test_getTime()
{
 var ts = new TimeService();
 Logger.log(ts.getTime());
}

/* within Next Minutes and returns bool.
*
* @return {bool} time is within tne next few Minutes
*/
TimeService.prototype.withinNextMinutes = function(minutes,routeTime)
{
  var start = this.getTime();
  var end = new Date(start.getTime() + minutes*60000);
  if(routeTime > start && routeTime < end)
    return true;
  return false;
}

TimeService.prototype.cleanDate = function(dates)
{
  var d = new Date(dates);
  var curr_hour = d.getHours();
  var curr_minute = d.getMinutes();
  var curr_time = curr_hour + ":" + curr_minute;
  return curr_time;
}


TimeService.prototype.format = function(in_date)
{
	var currentTime = new Date(in_date);
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10)
      minutes = "0" + minutes;

	var suffix = "AM";
	if (hours >= 12) 
    {
      suffix = "PM";
      hours = hours - 12;
	}
	if (hours == 0) {
      hours = 12;
	}
  return hours + ":" + minutes + " " + suffix;
}

TimeService.prototype.formatArray = function(date_array)
{
  var formattedArray = new Array();
  for ( var i= 0; i < date_array.length ; i++)
  {
    formattedArray[i] =this.format(date_array[i]);
  }
  return formattedArray;
}
  



