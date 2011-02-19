$(function() {

    var criteria = {
        animal: 1,
        name: '',
        breed: [],
        color: []
    };

	function split( val ) {
        return val.split( /,\s*/ );
	}

	function extractLast( term ) {
        return split( term ).pop();
	}
	


    function initAutocomplete(id, table, filterName, field) {

        var tags = ['123', '1234', '12345'];
        var ids = {}; 

        $('#' + id)
	    .bind( "keydown", function( event ) {
			if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "autocomplete" ).menu.active ) {
					event.preventDefault();
			}
	     })
         .autocomplete({
			 source: function( request, response ) {
			     $.getJSON( 'https://www.google.com/fusiontables/api/query?sql='
				       //      + encodeURIComponent('SELECT * FROM ' + table + ' where '+ filterName + ' like "%' + extractLast( request.term ) +'%"') + '&jsonCallback=?'
							 + encodeURIComponent('SELECT * FROM ' + table) + '&jsonCallback=?'
							 , {	
	
			         }, function(data) {
						     var lst = [], i;
							 for (i = 0; i < data.table.rows.length; i += 1) {
                 ids[data.table.rows[i][1]] = data.table.rows[i][0];
								 lst.push(data.table.rows[i][1]);
								 }
						     response(lst);
						 });
                 //response( $.ui.autocomplete.filter(tags, extractLast( request.term ) ) );
			 },
             focus: function() {return false; },
			 select: function( event, ui ) {
				 var tags = split( this.value );
				 tags.pop();
				 tags.push( ui.item.value );
				 tags.push( "" );
				 this.value = tags.join( ", " );
         criteria[field] = [];
         for (var i = 0; i < tags.length; i += 1) {
          if (ids[tags[i]]) {
            criteria[field].push(ids[tags[i]]);
          }
         }
				 return false;
			 }
         });
    }

    $('#animal-cat, #animal-dog').change(function() {
         criteria.animal = this.id === 'animal-cat' ? 1 : 2;
    });

    initAutocomplete('breed', '478879', 'breedName', 'breed');
    initAutocomplete('color', '478783', 'colorName', 'color');

    $('#name').change(function(){
        criteria.name = $(this).val();
    });

    function buildQuery() {

        
        var query = '', i,
            fieldList = '*',
            tableName = '480010';

        query += 'select ' + fieldList + ' from ' + tableName + ' where SpeciesID = ' +  criteria.animal + ' ';

        if (criteria.name) {
            query += ' and AnimalName = "' + criteria.name + '" ';
        }

        function addList(name) {
            var lst = [];

            if (criteria[name].length) {
                query += ' and (';
                for (i = 0; i < criteria[name].length; i += 1) {
                    if (criteria[name][i]) {
                        lst.push(name + ' = "' + criteria[name][i] + '" ');
                    }
                }
                query += lst.join(' or ') + ') ';
            }
        }

        addList('breed');
        addList('color');
        
        return query;
    }

		var geocoder;
		var layer;
		var map;
			
    geocoder = new google.maps.Geocoder();

    var myLatlng = new google.maps.LatLng(-33,149);
    var myOptions = {
      zoom: 4,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), myOptions);


    layer = new google.maps.FusionTablesLayer(480010, {

    });

    layer.setMap(map);
			
			
		
    $('#search').button().click(function() {

      geocoder.geocode( { 'address': $("#postcode").val() + ', Australia'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);

        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }})

        alert(buildQuery());
        layer.setQuery(buildQuery());
    });

});
