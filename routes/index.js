var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://heroku_30qp2xgr:vu4okpr9a9of3ev8kpudk8d5tg@ds053370.mlab.com:53370/heroku_30qp2xgr';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* LOGOUT. */
router.get('/logout', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next){
  var username = req.body.username;
  var password = req.body.pass;

  switch(true){
    case (username=="receiver") && (password=="receiver"):
      res.render('index');
      break;
    case (username=="tech-dimensi") && (password=="technician"):
      res.render('dimensi');
      break;
    case (username=="tech-mekanik") && (password=="technician"):
      res.render('mekanik');
      break;
    case (username=="tech-elektrik") && (password=="technician"):
      res.render('elektrik');
      break;
    case (username=="tech-temperatur") && (password=="technician"):
      res.render('temperatur');
      break;
  }
});

//costumer
router.get('/costumer', function(req, res, next) {
  res.render('costumer');
});

/* memunculkan no order tertinggi*/
router.get('/tinggi', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find().sort({"No_Order":-1}).limit(1);
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {tinggi: resultArray});
    });
  });
});

/* memasukan data nomet masuk ke db metmasuk */
router.post('/', function(req, res, next) {

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').insert(req.body, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });
  res.redirect('/');
});

/* memunculkan data dari database ke tabel antrian receiving*/
router.get('/antrian-rec', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find({ "Antrian": "receiving" });
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});


/* mengirim/merubah antrian receiving ke antrian lab */
router.post('/kirim', function(req, res, next) {

  var item = {
    "Antrian": req.body.antrian,
    "Tgllab": req.body.tgllab
  };
  var order = req.body.order;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').updateMany({"No_Order": order}, {$set: item},function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.render ('index', {anchor: 'antri-receiving'});
});

/* memunculkan data dari database ke tabel antrian lab*/
router.get('/antrian-lab', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find({ "Antrian": "lab" });
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items2: resultArray} );
    });
  });
});

/* memunculkan data dari database ke tabel antrian lab UNTUK DIMENSI.HBS*/
router.get('/d', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find({$and:[{ "Antrian": "lab" },{ "Jenis_Alat": "Dimensi" }]});
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('dimensi', {items2: resultArray} );
    });
  });
});

/* memunculkan data dari database ke tabel antrian lab UNTUK MEKANIK.HBS*/
router.get('/m', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find({$and:[{ "Antrian": "lab" },{ "Jenis_Alat": "Mekanik" }]});
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('mekanik', {items2: resultArray} );
    });
  });
});

/* memunculkan data dari database ke tabel antrian lab UNTUK ELEKTRIK.HBS*/
router.get('/e', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find({$and:[{ "Antrian": "lab" },{ "Jenis_Alat": "Elektrik" }]});
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('elektrik', {items2: resultArray} );
    });
  });
});

/* memunculkan data dari database ke tabel antrian lab UNTUK TEMPERATUR.HBS*/
router.get('/t', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find({$and:[{ "Antrian": "lab" },{ "Jenis_Alat": "Temperatur" }]});
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('temperatur', {items2: resultArray} );
    });
  });
});

/* mengirim/merubah antrian lab ke antrian selesai */
router.post('/selesai', function(req, res, next) {
  var item2 = {
    "Antrian": req.body.antrian,
    "Tglkal": req.body.tglkal,
    "Hasil": req.body.hasil
  };
  var nomet = req.body.nomet;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').updateOne({$and: [ { "Nomet": nomet }, { "Antrian": "lab" } ]}, {$set: item2}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.render ('index', {anchor1: 'antri-lab'});
});

/* mengirim/merubah antrian lab ke antrian selesai */
router.post('/selesaid', function(req, res, next) {
  var item2 = {
    "Antrian": req.body.antrian,
    "Tglkal": req.body.tglkal,
    "Hasil": req.body.hasil
  };
  var nomet = req.body.nomet;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').updateOne({$and: [ { "Nomet": nomet }, { "Antrian": "lab" } ]}, {$set: item2}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.render ('dimensi', {anchor1: 'antri-lab'});
});

/* mengirim/merubah antrian lab ke antrian selesai */
router.post('/selesaim', function(req, res, next) {
  var item2 = {
    "Antrian": req.body.antrian,
    "Tglkal": req.body.tglkal,
    "Hasil": req.body.hasil
  };
  var nomet = req.body.nomet;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').updateOne({$and: [ { "Nomet": nomet }, { "Antrian": "lab" } ]}, {$set: item2}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.render ('mekanik', {anchor1: 'antri-lab'});
});

/* mengirim/merubah antrian lab ke antrian selesai */
router.post('/selesaie', function(req, res, next) {
  var item2 = {
    "Antrian": req.body.antrian,
    "Tglkal": req.body.tglkal,
    "Hasil": req.body.hasil
  };
  var nomet = req.body.nomet;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').updateOne({$and: [ { "Nomet": nomet }, { "Antrian": "lab" } ]}, {$set: item2}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.render ('elektrik', {anchor1: 'antri-lab'});
});

/* mengirim/merubah antrian lab ke antrian selesai */
router.post('/selesait', function(req, res, next) {
  var item2 = {
    "Antrian": req.body.antrian,
    "Tglkal": req.body.tglkal,
    "Hasil": req.body.hasil
  };
  var nomet = req.body.nomet;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').updateOne({$and: [ { "Nomet": nomet }, { "Antrian": "lab" } ]}, {$set: item2}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.render ('temperatur', {anchor1: 'antri-lab'});
});

/* memunculkan data dari database ke tabel antrian selesai*/
router.get('/antrian-selesai', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find({ "Antrian": "selesai" });
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items3: resultArray});
    });
  });
});

/* mengirim/merubah antrian selesai ke antrian standby receiving */
router.post('/bawa', function(req, res, next) {
  var item3 = {
    "Antrian": req.body.antrian,
    "Tglsb": req.body.tglsb
  };
  var order = req.body.order;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').updateMany({$and: [ { "No_Order": order }, { "Antrian": "selesai" } ]}, {$set: item3}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.render ('index', {anchor2: 'antri-selesai'});
});

/* memunculkan data dari database ke tabel antrian pengambilan*/
router.get('/pengambilan', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find({ "Antrian": "receiving_sb" });
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items4: resultArray});
    });
  });
});

/* merubah antrian selesai ke antrian close (PENGAMBILAN ALAT) */
router.post('/close', function(req, res, next) {
  var item4 = {
    "Antrian": req.body.antrian,
    "Tglclose": req.body.tglclose,
    "Pengambil": req.body.pengambil,
    "NIK": req.body.nik
  };
  var nomet = req.body.nomet;
  var order = req.body.order;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk').updateMany({$and: [ {$or:[{ "Nomet": nomet },{ "No_Order": order }]}, { "Antrian": "receiving_sb" } ]}, {$set: item4}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.render ('index', {anchor3: 'pengambilan'});
});

/* MENU PENCARIAN*/

router.get('/showall', function(req, res, next) {

  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items5: resultArray});
    });
  });
});

router.get('/showalld', function(req, res, next) {

  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('dimensi', {items5: resultArray});
    });
  });
});

router.get('/showallm', function(req, res, next) {

  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('mekanik', {items5: resultArray});
    });
  });
});

router.get('/showalle', function(req, res, next) {

  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('elektrik', {items5: resultArray});
    });
  });
});

router.get('/showallt', function(req, res, next) {

  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('temperatur', {items5: resultArray});
    });
  });
});

router.get('/custom', function(req, res, next) {

  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('metmasuk').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('costumer', {items5: resultArray});
    });
  });
});

/* memunculkan data STATISTIK*/
router.get('/welcome', function(req, res, next) {
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('metmasuk', function(err, coll){
      coll.find().count(function (err, alatMasuk) {
        coll.find({"Antrian":{$ne:"close"}}).count(function (err, alatProses){
          coll.find({"Antrian":"receiving"}).count(function (err, antriRec){
            coll.find({"Antrian":"lab"}).count(function (err, antriLab){
              coll.find({"Antrian":"selesai"}).count(function (err, antriSel){
                coll.find({"Antrian":"receiving_sb"}).count(function (err, antriSB){
                  coll.find({$and:[{"Antrian":"lab"},{"Jenis_Alat":"Dimensi"}]}).count(function (err, antriDim){
                    coll.find({$and:[{"Antrian":"lab"},{"Jenis_Alat":"Mekanik"}]}).count(function (err, antriMek){
                      coll.find({$and:[{"Antrian":"lab"},{"Jenis_Alat":"Elektrik"}]}).count(function (err, antriElek){
                        coll.find({$and:[{"Antrian":"lab"},{"Jenis_Alat":"Temperatur"}]}).count(function (err, antriTemp){
                          coll.find({$and:[{"Antrian":{$ne:"receiving"}},{"Jenis_Alat":"Dimensi"}]}).count(function (err, selesaiDim){
                            coll.find({$and:[{"Antrian":{$ne:"receiving"}},{"Jenis_Alat":"Mekanik"}]}).count(function (err, selesaiMek){
                              coll.find({$and:[{"Antrian":{$ne:"receiving"}},{"Jenis_Alat":"Elektrik"}]}).count(function (err, selesaiElek){
                                coll.find({$and:[{"Antrian":{$ne:"receiving"}},{"Jenis_Alat":"Temperatur"}]}).count(function (err, selesaiTemp){
                                  var antriclose = alatMasuk-alatProses;
                                  assert.equal(null, err);
                                  db.close();
                                  res.render('index', {alatmasuk: alatMasuk,
                                                      alatproses: alatProses,
                                                      alatkeluar: antriclose,
                                                      antrirec: antriRec,
                                                      antrilab: antriLab,
                                                      antrisel: antriSel,
                                                      antridim: antriDim,
                                                      antrimek: antriMek,
                                                      antrielek: antriElek,
                                                      antritemp: antriTemp,
                                                      selesaidim: selesaiDim,
                                                      selesaimek: selesaiMek,
                                                      selesaielek: selesaiElek,
                                                      selesaitemp: selesaiTemp,
                                                      kirim: antriLab+antriclose,
                                                      kalibrasi: antriSel+antriclose,
                                                      close: antriSB+antriclose,
                                                      terkirim: (((antriLab+antriclose)/(antriRec+antriLab+antriclose))*100),
                                                      terkalibrasi: (((antriSel+antriclose)/(antriLab+antriSel+antriclose))*100),
                                                      tersedia: (((antriSB+antriclose)/(antriSel+antriSB+antriclose))*100),
                                                      antrisb: antriSB,
                                                      persendim: ((selesaiDim/(antriDim+selesaiDim))*100),
                                                      persenmek: ((selesaiMek/(antriMek+selesaiMek))*100),
                                                      persenelek: ((selesaiElek/(antriElek+selesaiElek))*100),
                                                      persentemp: ((selesaiTemp/(antriTemp+selesaiTemp))*100),
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});


module.exports = router;


