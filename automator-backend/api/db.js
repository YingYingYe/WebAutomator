var mysql = require('mysql');
const express = require('express');
const router = express.Router();

const automator = mysql.createConnection({
  host:'automator.czkquubm4bjf.us-east-2.rds.amazonaws.com',
  user:'root',
  port: '3306',
  password:'automator',
  database:'automator',
});
// const automator = mysql.createConnection({
//   host:'localhost',
//   user:'root',
//   port: '3306',
//   password:'',
//   database:'automator',
// });

// MySQL
router.get('/savelist/person/get', async (req, res, next) => {
    try {
      automator.query('SELECT * FROM savepersonlist ORDER BY id', function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});
router.get('/savelist/place/get', async (req, res, next) => {
    try {
      automator.query('SELECT * FROM saveplacelist ORDER BY id', function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});
router.get('/savelist/artefact/get', async (req, res, next) => {
    try {
      automator.query('SELECT * FROM saveartefactlist ORDER BY id', function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});

router.post('/savelist/person/save', async (req, res, next) => {
    try {
      const data = req.body;
      automator.query('INSERT INTO savepersonlist(keyword, birthplace, deathplace, birthdate, deathdate, article, pictures, saveaction, cridbid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [...data], function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});
router.post('/savelist/place/save', async (req, res, next) => {
    try {
      const data = req.body;
      automator.query('INSERT INTO saveplacelist(keyword, latitude, longitude, article, pictures, saveaction, cridbid) VALUES (?, ?, ?, ?, ?, ?, ?)', [...data], function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});
router.post('/savelist/artefact/save', async (req, res, next) => {
    try {
      const data = req.body;
      console.log("data =>", data);
      automator.query('INSERT INTO saveartefactlist(keyword, startdate, enddate, article, pictures, saveaction, cridbid) VALUES (?, ?, ?, ?, ?, ?, ?)', [...data], function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});

router.post('/savelist/person/update', async (req, res, next) => {
    try {
      const data = req.body;
      const query = 'UPDATE savepersonlist SET birthplace="' + data.birthplace + 
      '", deathplace="' + data.deathplace + 
      '", birthdate="' + data.birthdate + 
      '", deathdate="' + data.deathdate + 
      '", article="' + data.article + 
      '", pictures="' + data.pictures + 
      '" WHERE id=' + data.rowid;
      automator.query(query, function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});
router.post('/savelist/place/update', async (req, res, next) => {
    try {
      const data = req.body;
      const query = 'UPDATE saveplacelist SET latitude="' + data.latitude + 
      '", longitude="' + data.longitude + 
      '", article="' + data.article + 
      '", pictures="' + data.pictures + 
      '" WHERE id=' + data.rowid;
      automator.query(query, function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});
router.post('/savelist/artefact/update', async (req, res, next) => {
    try {
      const data = req.body;
      const query = 'UPDATE saveartefactlist SET startdate="' + data.startdate + 
      '", enddate="' + data.enddate + 
      '", article="' + data.article + 
      '", pictures="' + data.pictures + 
      '" WHERE id=' + data.rowid;
      automator.query(query, function(err, results) {
        if (err) throw err
        return res.json({
          results
        });
      });
    } catch (error) {
      next(error);        
    }
});

router.get('/savelist/person/delete/:keyword', async (req, res, next) => {
  try {
    const { keyword } = req.params;
    automator.query('DELETE FROM savepersonlist WHERE id = ' + keyword, function(err, results) {
      if (err) throw err
      return res.json({
        results
      });
    });
  } catch (error) {
      next(error);        
  }
});
router.get('/savelist/place/delete/:keyword', async (req, res, next) => {
  try {
    const { keyword } = req.params;
    automator.query('DELETE FROM saveplacelist WHERE id = ' + keyword, function(err, results) {
      if (err) throw err
      return res.json({
        results
      });
    });
  } catch (error) {
      next(error);        
  }
});
router.get('/savelist/artefact/delete/:keyword', async (req, res, next) => {
  try {
    const { keyword } = req.params;
    automator.query('DELETE FROM saveartefactlist WHERE id = ' + keyword, function(err, results) {
      if (err) throw err
      return res.json({
        results
      });
    });
  } catch (error) {
      next(error);        
  }
});

module.exports = router;