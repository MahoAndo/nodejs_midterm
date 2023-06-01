var express = require('express');
var router = express.Router();
var mysql = require('mysql');


const mysql_setting = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node-midterm'
};


/***************
 * top page
****************/
router.get('/', function (req, res, next) {
  var data = {
    title: 'My blog Log In',
    message: ''
  };
  res.render('index', data)
});

/**********************
 * Register page (get)
***********************/
router.get('/register', (req, res, next) => {
  var data = {
    title: 'REGISTER',
    content: 'register your account'
  }
  res.render('register', data);
});

/**********************
 * Register page (post)
***********************/
router.post('/register', (req, res, next) => {
  var data = {
    'username': req.body.username,
    'password': req.body.password,
  };

  //setting database information
  var connection = mysql.createConnection(mysql_setting);
  //connect to database
  connection.connect();

  //insert to database
  connection.query('insert into user_info set ?', data, function (error, results, fields) {
    if(results != null){
      res.redirect('/main');
    }
  });
  //disconnect from database
  connection.end();
});

/**********************
 * Login page (get)
***********************/
router.get('/login', (req, res, next) => {
  var data = {
    title: 'LOGIN',
    content: 'Create Your Account'
  }
  res.render('login', data);
});

/**********************
 * Login page (post)
***********************/
router.post('/login', (req, res, next) => {
  var data = {
    'username': req.body.username,
    'password': req.body.password,
  };

   //setting database information
  var connection = mysql.createConnection(mysql_setting);
  //connect とdatabase
  connection.connect();
  var username = data.username;
  var password = data.password;
  //check data
  connection.query('SELECT * from user_info where username = ? and password = ?', [username, password], function (error, results, fields) {
    if(results[0] !== undefined){
      res.redirect('/main');
    }
    else
    {
      var data = {
        title: 'LOGIN',
        content : 'Login Failed',
      }
      res.render('login', data);
    }
  });
  //disconnect from database
  connection.end();
});


/**********************
 * Main page (get)
***********************/
router.get('/main', function (req, res, next) {

  var connection = mysql.createConnection(mysql_setting);

  //connect to database
  connection.connect();

  connection.query('SELECT * from blog ',
    function (error, results, fields) {

      if (error == null) {
        var data = {
          title: 'My blog',
          content: results,
        };
        res.render('main', data)
      }
    });
  //disconnect from database
  connection.end();
});


/**********************
 * Add page (get)
***********************/
router.get('/add', (req, res, next) => {
  var data = {
    title: 'Add',
    content: 'add new blog'
  }
  res.render('add', data);
});

router.post('/add', (req, res, next) => {
  var data = {
    'title': req.body.title,
    'text': req.body.text
  };

  var connection = mysql.createConnection(mysql_setting);
  //connect from database
  connection.connect();

  connection.query('insert into blog set ?', data, function (error, results, fields) {
    res.redirect('/main');
  });
  //disconnect from database
  connection.end();
});


/**********************
 * Edit page (get)
***********************/
router.get('/edit', (req, res, next) => {
  var no = req.query.no;
  var connection = mysql.createConnection(mysql_setting);
  connection.connect();

  connection.query('SELECT * from blog where no = ?', no, function (error, results, fields) {
    if (error == null) {
      var data = {
        title: 'Update',
        content: 'Updating...',
        blog: results[0]
      }
      res.render('edit', data);
    }
  });
  //disconnect from database
  connection.end();
});


/**********************
 * Edit page (post)
***********************/
router.post('/edit', (req, res, next) => {
  var no = req.body.no;
  var data = {
    'title': req.body.title,
    'text': req.body.text
  };

  var connection = mysql.createConnection(mysql_setting);

  connection.connect();
  connection.query('update blog set ? where no = ?', [data, no], function (error, results, fields) {
    res.redirect('/main');
  });
  //disconnect from database
  connection.end();
});


/**********************
 * Delete page (get)
***********************/
router.get('/delete', (req, res, next) => {
  var no = req.query.no;
  var connection = mysql.createConnection(mysql_setting);

  connection.connect();
  connection.query('SELECT * from blog where no = ?', no, function (error, results, fields) {
    if (error == null) {
      var data = {
        title: 'Delete',
        content: 'Deleting...',
        blog: results[0]
      }
      res.render('delete', data);
    }
  });
  //disconnect from database
  connection.end();
});



/**********************
 * Delete page (post)
***********************/
router.post('/delete', (req, res, next) => {
  var no = req.body.no;
  var connection = mysql.createConnection(mysql_setting);

  connection.connect();
  connection.query('delete from blog where no = ?', no, function (error, results, fields) {
    res.redirect('/main');
  });

  //disconnect from database
  connection.end();
});


module.exports = router;
