var config = require('config');
var stripe = require('stripe')(config.stripe_key);

stripe.customers.list(
  { limit: 600 }, function(err, customers) {
    if (!err){
      customers.data.forEach( function(customer) {
        stripe.customers.del(
            customer.id,
          function(err, confirmation) {
            if (!err){
              console.log(confirmation);
            } else {
              console.log();
            }
        });
      });
    } else {
      console.log(err);
    }
  });
