const express = require("express");
const path = require("path");
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const flash = require('connect-flash');
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/internPortal')
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//session middelware 
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//mount routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// it is for to get files from public folder 
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// to strt the serverr
app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`);
});