//let = require('http-errors');
const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator');
const morgan = require('morgan');
const session = require("express-session");
const store = require("connect-loki");
const flash = require("express-flash");

let app = express();
const LokiStore = store(session);


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

const createValidationChain = (name) => {
  return [
    body(name)
      .trim()
      .isLength({ min: 1 })
      .withMessage(`The ${name} field is required.`)
      .isLength({ max: 100 })
      .withMessage("The maximal number of characters is 150.")
  ];
};

// view engine setup
app.set('views', 'views');
app.set('view engine', 'pug');

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan("common"));

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
    path: "/",
    secure: false,
  },
  name: "ls-burger-restaurant-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
}));

const clone = object => {
  return JSON.parse(JSON.stringify(object));
};

app.use((req, res, next) => {
  if (!("menu_items" in req.session)) {
    req.session.menu_items = clone(menu_items);
  }

  if (!('orders' in req.session)) {
    req.session.orders = clone(orders);
  }

  next();
});

app.use(flash());

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
    menu_items: req.session.menu_items
  });
})

app.get('/order_food', (req, res) => {
  res.render('order_food', {
    title: 'Launch School Burger Restaurant',
  })
})

app.post('/order_food', createValidationChain('name'),
  createValidationChain('tel'),
  createValidationChain('address'),
  createValidationChain('order'),
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      //create an object with error messages, error as a key and message as value
      errors.array().forEach(error => req.flash("error", error.msg))

      res.render("order_food", {
        flash: req.flash(),
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        order: req.body.order
      });
    } else {
      next();
    }
  }, (req, res) => {
    req.session.orders.push({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      order: req.body.order
    });
    res.redirect('order_completed');
  });

app.get('/order_completed', (req, res) => {
  let lastOrder = req.session.orders[req.session.orders.length - 1]
  res.render('order_completed', {
    name: lastOrder.name,
    order: lastOrder.order
  })
});

app.get('/orders', (req, res) => {
  res.render('orders', { ordersEntries: req.session.orders });
})

app.listen(3000, () => {
  console.log('Listening to port 3000');
});

module.exports = app;
