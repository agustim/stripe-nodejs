

var config = require('config');
var monike = require('moniker');
var stripe = require('stripe')(config.stripe_key);
var file = "test-socis.db"

var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

function createCustomer(soci_id, nom_soci, quota) {
  stripe.tokens.create({
    card: {
      "number": '4242424242424242',
      "exp_month": 12,
      "exp_year": 2017,
      "cvc": '123'
    }
  }, function(err, token ) {
    if (!err){
      var token = token.id;
      stripe.customers.create({
        description: nom_soci,
        card: token
      }, function(err, customer) {
        if (!err) {
          db.run("UPDATE Socis set stripe_customer_id='" + customer.id + "' where rowid=" + soci_id);
          getCharge(soci_id, nom_soci, quota, customer.id);
        }
      })
    } else {
      console.log ('some error in create token.')
      console.log(err);
    }
  })

}

function getCharge(soci_id, nom_soci, quota, stripe_customer_id){
  stripe.charges.create({
    amount: quota * 100,
    currency: "eur",
    customer: stripe_customer_id,
    description: "[SOCIS]:Carrec de la quota de " + quota  + "."
  })
  .then(function(charge) {
      var stmt = db.prepare("INSERT INTO Rebuts (soci_id, quota, estat, transaccio) VALUES (?, ?, ?, ?)");
      stmt.run(soci_id, quota, 'OK', JSON.stringify(charge));
      stmt.finalize();
      console.log('[OK]: Carrec fet correctement a "' + nom_soci + '" => ' + quota);
  }, function(error){
    var stmt = db.prepare("INSERT INTO Rebuts (soci_id, quota, estat, transaccio) VALUES (?, ?, ?, ?)");
    stmt.run(soci_id, quota, 'ERROR', JSON.stringify(error));
    stmt.finalize();
    console.log('[ERROR]: Fent el carrec a "' + nom_soci + '" => ' + quota + '(' + JSON.stringify(error) + ')');
  });
}

if (!exists) {
  console.log("La BDD no existeix!!");
  console.log("Valida que el fitxer '" + file + "', hi es.")
  process.exit();
}

db.each("SELECT rowid as id,* FROM Socis", function(err, row) {
  nom_soci = row.nom + " " + row.cognom
  soci_id = row.id
  quota = row.quota
  //console.log("Carrec al soci '" + nom_soci + "' => " + quota + ".")
  stripe_customer_id = row.stripe_customer_id;
  if (!stripe_customer_id) {
    createCustomer(soci_id, nom_soci,quota);
  } else {
    getCharge(soci_id, nom_soci, quota, stripe_customer_id);
  }
})
