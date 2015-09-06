$('#initials').typeahead({}, {
  source: function(query, sync, cb){
    return $.get('/api/users/'+ query)
      .then(function(results){
        cb(results);
        if(results.length == 1)
          $('#initials').trigger('selected', results[0]);
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
      setWorkshopProgress();
    });
});

//loop over inputs with class .workshop
//set background color based on backgroun
//
function map(index, col){
  ['danger', 'warning', 'info', 'success'].forEach(function(className){
    col.removeClass(className);
  });
  var _class = 'success';
  if(index <= 0)
    _class = 'danger';
  if(index == 1)
    _class = 'warning';
  if(index == 2)
    _class = 'info';
  col.addClass(_class);
}

$('.workshop').on('input', function(cell){
  setWorkshopProgress();
});

function setWorkshopProgress(){
  $('.workshop').each(function(cell){
    map($('input', $(this)).val(), $(this));
  });
}
setWorkshopProgress();
