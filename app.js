//let = require('http-errors');
let express = require('express');
let path = require('path');
// let cookieParser = require('cookie-parser');
let morgan = require('morgan');

let app = express();

const menu_items = [
  {
    header: 'Appetizers',
    dishes: [{
      name: 'tomato salad',
      price: '$10'
    },
    {
      name: 'mashed potatos',
      price: '$5'
    }],
  },
  {
    header: 'Soups',
    dishes: [{
      name: 'vegetable soup',
      price: '$12'
    },
    {
      name: 'tomato soup',
      price: '$15'
    }]
  },
  {
    header: 'Main',
    dishes: [{
      name: 'hamburger',
      price: '$20'
    },
    {
      name: 'chicken burger',
      price: '$16'
    },
    {
      name: 'vegetable burger',
      price: '$13'
    }]
  }
];

const orders = [];



// view engine setup
app.set('views', 'views');
app.set('view engine', 'pug');


// app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   // res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Launch School Burger Restaurant'
  });
})

app.get('/menu', (req, res) => {
  res.render('menu', {
    title: 'Launch School Burger Restaurant',
    menu_items: menu_items
  });
})

app.get('/order_food', (req, res) => {
  res.render('order_food', {
    title: 'Launch School Burger Restaurant',
  })
})

app.post('/order_food', (req, res) => {
  orders.push({
    name: req.body.firstName,
    tel: req.body.tel,
    address: req.body.address,
    order: req.body.order
  });
  res.render('order_completed', {
    name: req.body.firstName,
    order: req.body.order
  });
})

// app.get('/order_completed', (req, res) => {
//   res.render('order_completed', {
//     title: 'Launch School Burger Restaurant',
//   });
// })


app.listen(3000, () => {
  console.log('Listening to port 3000');
});

module.exports = app;
