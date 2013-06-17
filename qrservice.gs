function QRService()
{
  this.dataService = new DataService();
}

QRService.prototype.createQRCode = function(route, stop)
{
  var chartsurl = CONFIG.CHARTS_URL;
  var appurl = APP_URL + "?Format=HTML&Body=" + route + stop;
  var combinedurl = chartsurl + encodeURIComponent(appurl);
  return combinedurl;
}

QRService.prototype.createQRCodeAll = function(route, stop)
{
  var chartsurl = CONFIG.CHARTS_URL;
  var appurl = APP_URL + "?Format=HTML&Body=1" + route + stop;
  var combinedurl = chartsurl + encodeURIComponent(appurl);
  return combinedurl;
}

QRService.prototype.createPrintOut = function(data)
{
  var templatetext = "<html><head><title><?= title ?></title></head><body><table width='600' cellpadding='0' cellspacing='5' border='0'><tr><td colspan='2' width='600' bgcolor='#0007CB'><img src='https://ccga1.columbusga.org/metraWebPayments.nsf/metralogo.gif'/></td></tr><tr><td colspan='2' align='center'><h1><?= header ?></h1></td></tr><tr><td align='center' style='border-right: 1px solid black'><h3><?= message1 ?></h3></td><td><h3 align='center'><?= message2 ?></h3></td></tr><tr><td><img src='<?= qrurl1 ?>' width='250' height='250' /></td><td><img src='<?= qrurl2 ?>' width='250' height='250' /></td></tr></table></body></html>";

  var template = HtmlService.createTemplate(templatetext);
  var ms =  new MessageService();
  template.title = "When's the bus coming?";
  template.header = "When's the bus coming for " + data.Stop + "?";
  template.message1 = "Text " + data.Route + data.StopNumber + " to " + CONFIG.FROM_NUMBER + " for the next bus arrival time.";
  template.message2 = "Text 1" + data.Route + data.StopNumber + " to " + CONFIG.FROM_NUMBER + " for all times on this stop.";
  template.qrurl1 = this.createQRCode(data.Route, data.StopNumber);
  template.qrurl2 = this.createQRCodeAll(data.Route, data.StopNumber);
  
  return template.evaluate().getContent();
}

QRService.prototype.createAllPrintOuts = function()
{
  var routes = [5,5,6,6,7,6,6,6,6];
  var html = "";

  for(var i = 1; i <= routes.length; i++)
    html += this.createPrintOut("" + i,"" + routes[i]);//todo
  
  return html;
}

function QRService_createQRCode_Test()
{
  var qrs = new QRService();
  var result = qrs.createQRCode("06","01");
  var testbreak = result;
}


