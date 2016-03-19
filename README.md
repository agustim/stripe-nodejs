# Stripe with node.js
Small scripts to test stripe gateway with node.js.

## Install
```
npm Install
```

### Setup

copy config samples to config
```
cp config-samples.js config.js
```
And change you config.js you special key. (Needs account in stripe)
```
config.stripe_key = 'sk_test_youkey';
```
#### Crear base de dades de Socis
```
node sqlite.js
```
#### Crear un carrec als socis
```
node carrec_quotes.js
```

Si no tenen targeta de crèdit es fa amb la de prova, amb :
```
stripe.tokens.create({
  card: {
    "number": '4242424242424242',
    "exp_month": 12,
    "exp_year": 2017,
    "cvc": '123'
  }
}, function(err, token ) {
```
### Delete all customers
Small script to remove all customers (internal limit is 200):
```
node delete_all_customers.js
```
