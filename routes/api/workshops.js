var router = require('express').Router();
var Workshop = require('../../models').Workshop;

router.get('/:key', function(req, res, next){
  Workshop.findOne({key: req.params.key})
    .then(function(workshop){
      res.send(workshop);
    });

});

module.exports = router;
