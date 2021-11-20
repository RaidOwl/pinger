var ping = require('ping');
var fs = require('fs');

var baseloc = __dirname + '/logs';
var freq = 2000;
var pingThresh = 100;
var hosts = ['8.8.8.8','www.ebay.com','amazon.com'];
var mydate;
var datestr;

async function test()
{
  const checked = await checkLogs();
  const ret = await hostping(hosts); 
    if (ret[0]) {
        var msg = mydate + ' - Internet is DOWN!!!'
        console.log(msg);
        log('ERROR',datestr,msg);
        //fs.appendFileSync('log.txt',msg + '\r\n');
        //console.log('All hosts are alive');
    } else {
        //var msg = mydate + ' - Internet is fine'
        //console.log(msg);
    }
    await new Promise(resolve => setTimeout(resolve, freq));
    test();
}

function hostping(hosts) {
  let status = true;
  let time = 0;
  return new Promise(async function(resolve, reject) {
    for (const host of hosts) {
      const res = await ping.promise.probe(host);
      //var msg = `host ${host} is ${res.alive ? 'alive' : 'dead'}`;
      //console.log(msg);
      if (res.alive) { 
        status = false; 
        time = res.time;
        var msg = mydate + ' - ' + host + ': ' + time;
        //console.log(msg);
        log('DEBUG',datestr,msg);
        if(time > pingThresh) {
          console.log(msg);
          log('WARNING',datestr,msg);
        }
      }
    }
      //console.log('all host checks are done, resolving status');  
      resolve([status, time]);
  });
}
function log(type, datestr, msg) {

  var path = baseloc +  '/' + datestr + '/' + type + '.txt';
  fs.writeFile(path, msg + '\r\n', { flag: 'a' }, function (err) {
    if (err) {
      //throw err;
    }
  })  
}
function checkLogs() {
  return new Promise(async function(resolve) {
    mydate = new Date();
    datestr = formatDate(mydate);
    var dir = baseloc + '/' + datestr;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
      resolve(true);
  });
}
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}
test();
//setInterval(function() {test()}, freq);

