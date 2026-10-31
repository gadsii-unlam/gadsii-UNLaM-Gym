/**
 * UNLaM-Gym: receptor de eventos del MVP (TP5).
 *
 * Recibe POST con un JSON en el body y agrega una fila por evento a la
 * hoja "eventos" de la Google Sheet a la que está vinculado el script.
 * Columnas: userId, type, ts, localDate, screen, data.
 *
 * Acepta tres formas de body:
 *   { "events": [evento, ...] }   (lo que manda la app, por lotes)
 *   [evento, ...]
 *   evento
 */

var SHEET_NAME = "eventos";
var HEADERS = ["userId", "type", "ts", "localDate", "screen", "data"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var body = JSON.parse(e.postData.contents);
    var events = Array.isArray(body) ? body : (Array.isArray(body.events) ? body.events : [body]);

    var rows = events.map(function (ev) {
      return [
        String(ev.userId || ""),
        String(ev.type || ""),
        String(ev.ts || ""),
        String(ev.localDate || ""),
        String(ev.screen || ""),
        JSON.stringify(ev.data || {})
      ];
    });

    if (rows.length > 0) {
      var sheet = getSheet_();
      var range = sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length);
      // Texto plano: evita que Sheets convierta ts y localDate en fechas.
      range.setNumberFormat("@");
      range.setValues(rows);
    }
    return json_({ ok: true, received: rows.length });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Para comprobar desde el navegador que la Web App está publicada.
function doGet() {
  return json_({ ok: true, service: "unlam-gym-events" });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
