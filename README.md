# Retention Matrix

User retention analysis for an e-commerce app.

Renders retention matrix to show how many users returned to an the app to place another order after their first order. 

### Data Set
An `Array` of user objects that contain a key `orders` that has an `Array` of all the orders placed by the user. 

```js
[
  {
    id: 1,
    name: 'User',
    /* ... */
    orders: [
      { id: 1, /* ... */ created_at: 1604188900}
      /* ...orders */
    ]
  }
  /* ...users */
]
```

Retention data will look like this for each cohort:
```js
[
  {
    from_date: 'Nov 1, 2020',
    to_date: 'Nov 7, 2020',
    from_timestamp: 1604188800,
    to_timestamp: 1604189800,
    retention: { 
      size: 20, // total size of cohort
      period_1: 18, // retention in first period
      period_2: 14, // retention in second period
      /* period_n: x */ // retention in nth period
    },
  }
  /* ...cohorts */
]
```
Retention table will look like this:

![header image](./screenshot.png)

## Building and running on localhost

First install dependencies:

```sh
npm install
```

To run in hot module reloading mode:

```sh
npm start
```

To create a production build:

```sh
npm run build-prod
```

## Running

```sh
node dist/bundle.js
```
