
var file = "test-socis.db"
var maxsocis = 200

var fs = require("fs");
var Moniker = require('moniker');
var names = Moniker.generator([Moniker.noun]);
var lastnames = Moniker.generator([Moniker.adjective , Moniker.noun], { 'glue' : ' ' } );
var file = "test.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);


String.prototype.capitalize = function() {
  return this.replace(/([\s\-_]|^)./g, function (match) {
    return match.toUpperCase();
  });
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE Socis (nom TEXT, cognom TEXT, stripe_customer_id TEXT, quota REAL)");
    db.run("CREATE TABLE Rebuts (soci_id NUM, quota REAL, dia TIMESTAMP DEFAULT CURRENT_TIMESTAMP, estat NUM, transaccio TEXT)");
  }

  var stmt = db.prepare("INSERT INTO Socis VALUES (?, ?, null, ?)");
  for (var i = 0; i < maxsocis; i++) {
    stmt.run(names.choose().capitalize(), lastnames.choose().capitalize(), randomInt(20,200));
  }
  stmt.finalize();

});

db.close();
