$('#initials').typeahead({}, {
  source: function(query, sync, cb){
    return $.get('/api/users/'+ query)
      .then(function(results){
        cb(results);
        if(results.length == 1 && $('#initials').val() == results[0]){
          $.get('/api/user/' + results[0])
            .then(function(user){
              Object.keys(user).forEach(function(key){
                if($('#' + key))
                  $('#' + key).val(user[key]);
              });
              setWorkshopProgress();
            });
        }
        else {
          resetWorkshopProgress();
        }
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

function resetWorkshopProgress(){
  $('.workshop').each(function(cell){
    $('input', this).val('0');
    map($('input', $(this)).val(), $(this));
  });
}
setWorkshopProgress();

$('#delete').click(function(){
  var form = $(this).parents('form');
  form.attr('action', '/?_method=DELETE');
});

$('.workshop-result').click(function(){
  var key = $(this).attr('data-key');
  $.getJSON('/api/workshops/' + key, function(result){
    var modal = $('#workshopModal'); 
    $('.modal-title', modal).html(key);
    var $keyConceptList = $('.key-concepts', modal);
    $keyConceptList.empty();
    result.keyConcepts.forEach(function(concept){
      var $listItem = $("<li />").addClass('list-group-item').html(concept);
      $keyConceptList.append($listItem);
    });
    var $workshopUrl = $('.workshop-url', modal);
    $workshopUrl.attr('href', result.url);
    $workshopUrl.html(result.url);
    modal.modal('show');
  });
});
