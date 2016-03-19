

String.prototype.capitalize = function() {
  return this.replace(/([\s\-_]|^)./g, function (match) {
    return match.toUpperCase();
  });
}
var Moniker = require('moniker');
var names = Moniker.generator([Moniker.noun]);
var lastnames = Moniker.generator([Moniker.adjective , Moniker.noun], { 'glue' : ' ' } );

for (x=1; x < 20; x++)
  console.log(lastnames.choose().capitalize() + ", " + names.choose().capitalize());
