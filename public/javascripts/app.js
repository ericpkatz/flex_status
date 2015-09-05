$('#initials').typeahead({}, {
  source: function(query, sync, cb){
    return $.get('/api/users/'+ query)
      .then(function(results){
        console.log(results);
        cb(results);
      });
  }
})
.on('typeahead:select', function(o, initials){
  $.get('/api/user/' + initials)
    .then(function(user){
      Object.keys(user).forEach(function(key){
        if($('#' + key))
          $('#' + key).val(user[key]);
      });
    
    });
});
