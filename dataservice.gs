function DataService() 
{
  this.timeservice = new TimeService();
}
DataService.prototype.getBusArrival = function(routeNum, stopNum)
{
  
    var sdoc_id = CONFIG.SPREADSHEET_ID;
  
  var sheetmapping = new Array("Route 1","Route 2","Route 3","Route 4","Route 5", "Route 6","Route 7","Route 8");
  var routeNineMapping = new Array("Route 9 MTWTF","Route 9 SAT");
  var routes = new Array("A","B","C","D","E","F","G");
  
  
  
  var sdoc = SpreadsheetApp.openById(sdoc_id);
  var selected_route_num =  parseInt(routeNum, 10) -1;
  var selected_route_name;
  var d = new Date(this.timeservice.getTime());
  Logger.log(d);
  if (selected_route_num > 7)
    selected_route_name = routeNineMapping[ d.getDay() == 6 ? 1:0 ];
  
  else
    selected_route_name = sheetmapping[ selected_route_num];
  
  
  sdoc_sheet = sdoc.getSheetByName(selected_route_name);
  var sheet_column = routes[parseInt(stopNum) - 1] + "2";
  sdoc_range = sdoc_sheet.getRange(sheet_column);
  var stopName = sdoc_range.getValue();
   var lastrow = sdoc_sheet.getLastRow();
  sheet_column = routes[parseInt(stopNum) - 1] + "3:" +routes[parseInt(stopNum) - 1 ] +  lastrow;
 
  sdoc_range = sdoc_sheet.getRange(sheet_column);
  var result = sdoc_range.getValues();//.toTimeString();
  
  
  var curr_hour = d.getHours();
  var curr_minute = d.getMinutes();
  var curr_time = curr_hour + curr_minute/60;


  var depart_time = null;
  //Logger.log(result);
  for (var i = 0; i <result.length ; i++)
  {
    var td = new Date(result[i][0]);
    var td_hour = td.getHours();
    var td_minute = td.getMinutes();
    var td_time = td_hour + td_minute/60;
    Logger.log(result[i][0]);
    Logger.log(td_time +"   " + curr_time);
    if (td_time > curr_time)
    {
        depart_time = result[i];
      
      break;
    }
    
  }
  //Logger.log(depart_time);
  
 return new ScheduleData( routeNum,stopNum, stopName, new Array(depart_time));
}
DataService.prototype.getAllStops = function(routeNum, stopNum)
{
  
    var sdoc_id = CONFIG.SPREADSHEET_ID;
  
  var sheetmapping = new Array("Route 1","Route 2","Route 3","Route 4","Route 5", "Route 6","Route 7","Route 8");
  var routeNineMapping = new Array("Route 9 MTWTF","Route 9 SAT");
  var routes = new Array("A","B","C","D","E","F","G");
  
  
  
  var sdoc = SpreadsheetApp.openById(sdoc_id);
  var selected_route_num =  parseInt(routeNum) -1;
  var selected_route_name;
  
  if (selected_route_num > 7)
    selected_route_name = routeNineMapping[selected_route_num - 8];
  
  else
    selected_route_name = sheetmapping[selected_route_num];
  
  
  sdoc_sheet = sdoc.getSheetByName(selected_route_name);
  var sheet_column = routes[parseInt(stopNum) - 1] + "2";
  sdoc_range = sdoc_sheet.getRange(sheet_column);
  var stopName = sdoc_range.getValue();
   var lastrow = sdoc_sheet.getLastRow();
  sheet_column = routes[parseInt(stopNum) - 1] + "3:" +routes[parseInt(stopNum) - 1 ] +  lastrow;
 
  sdoc_range = sdoc_sheet.getRange(sheet_column);
  var result = new Array;
  result = sdoc_range.getValues();//.toTimeString();
  Logger.log(result);
  
 return new ScheduleData( routeNum,stopNum, stopName, result);
}


function datatest()
{
  var dt = new DataService();
  var result = dt.getBusArrival("06","03");
  Logger.log(result);
  var result = dt.getAllStops("06","03");
  Logger.log(result);
}
  

