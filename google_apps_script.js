function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Setup Logs Sheet
  var logsSheet = ss.getSheetByName("Logs");
  if (!logsSheet) {
    logsSheet = ss.insertSheet("Logs");
    logsSheet.appendRow([
      "date", "eod_sammy", "eod_og", "eod_grilled", "eod_tenders", "eod_thaw", "eod_boxed",
      "del_dark", "del_tenders",
      "prep_sammy", "prep_og", "prep_grilled", "prep_tenders",
      "waste_sammy", "waste_og", "waste_grilled", "waste_tenders",
      "oil_fries", "oil_left", "oil_right"
    ]);
    logsSheet.getRange("A1:T1").setFontWeight("bold");
  }
  
  // Setup Settings Sheet
  var settingsSheet = ss.getSheetByName("Settings");
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet("Settings");
    settingsSheet.appendRow(["key", "value"]);
    settingsSheet.appendRow(["sammy", 10]);
    settingsSheet.appendRow(["og", 8]);
    settingsSheet.appendRow(["grilled", 5]);
    settingsSheet.appendRow(["tenders", 6]);
    settingsSheet.getRange("A1:B1").setFontWeight("bold");
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Read Pars
  var settingsSheet = ss.getSheetByName("Settings");
  var parsData = settingsSheet.getDataRange().getValues();
  var pars = {};
  for (var i = 1; i < parsData.length; i++) {
    pars[parsData[i][0]] = parsData[i][1];
  }
  
  // Read Logs
  var logsSheet = ss.getSheetByName("Logs");
  var logsData = logsSheet.getDataRange().getValues();
  var logs = [];
  
  for (var i = 1; i < logsData.length; i++) {
    var row = logsData[i];
    logs.push({
      date: row[0],
      eod: { sammy: row[1], og: row[2], grilled: row[3], tenders: row[4], thawingTenders: row[5], boxedTenders: row[6] },
      delivery: { dark: row[7], tenders: row[8] },
      prep: { sammy: row[9], og: row[10], grilled: row[11], tenders: row[12] },
      waste: { sammy: row[13], og: row[14], grilled: row[15], tenders: row[16] },
      oil: { fries: row[17] === true || row[17] === 'TRUE' || row[17] === 'true', leftChicken: row[18] === true || row[18] === 'TRUE' || row[18] === 'true', rightChicken: row[19] === true || row[19] === 'TRUE' || row[19] === 'true' }
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({ logs: logs, pars: pars }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var payload = JSON.parse(e.postData.contents);
  
  if (payload.action === 'UPDATE_PARS') {
    var settingsSheet = ss.getSheetByName("Settings");
    var data = settingsSheet.getDataRange().getValues();
    var keysToRow = {};
    for (var i = 1; i < data.length; i++) {
      keysToRow[data[i][0]] = i + 1;
    }
    
    var newPars = payload.pars;
    for (var key in newPars) {
      if (keysToRow[key]) {
        settingsSheet.getRange(keysToRow[key], 2).setValue(newPars[key]);
      } else {
        settingsSheet.appendRow([key, newPars[key]]);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (payload.action === 'UPDATE_LOG') {
    var logsSheet = ss.getSheetByName("Logs");
    var data = logsSheet.getDataRange().getValues();
    var dateToRow = -1;
    var logDate = payload.log.date;
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == logDate) {
        dateToRow = i + 1;
        break;
      }
    }
    
    var l = payload.log;
    var rowData = [
      l.date,
      l.eod.sammy, l.eod.og, l.eod.grilled, l.eod.tenders, l.eod.thawingTenders, l.eod.boxedTenders,
      l.delivery.dark, l.delivery.tenders,
      l.prep.sammy, l.prep.og, l.prep.grilled, l.prep.tenders,
      l.waste.sammy, l.waste.og, l.waste.grilled, l.waste.tenders,
      l.oil.fries, l.oil.leftChicken, l.oil.rightChicken
    ];
    
    if (dateToRow !== -1) {
      logsSheet.getRange(dateToRow, 1, 1, 20).setValues([rowData]);
    } else {
      logsSheet.appendRow(rowData);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
}

// Ensure CORS options request doesn't block fetch
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.JSON);
}
