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

        $('#' + id)
	    .bind( "keydown", function( event ) {
			if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "autocomplete" ).menu.active ) {
					event.preventDefault();
			}
	     })
         .autocomplete({
			 source: function( request, response ) {
			     $.getJSON( 'https://www.google.com/fusiontables/api/query?sql='
				             + encodeURIComponent('SELECT * FROM ' + table + ' where '+ filterName + ' like "%' + extractLast( request.term ) +'%"') + '&jsonCallback=?'
							 //+ encodeURIComponent('SELECT * FROM ' + table) + '&jsonCallback=?'
							 , {	
	
			         }, function(data) {
						     var lst = [], i;
							 for (i = 0; i < data.table.rows.length; i += 1) {
								 lst.push(data.table.rows[i][1]);
								 }
						     response(lst);
						 });
                 //response( $.ui.autocomplete.filter(tags, extractLast( request.term ) ) );
			 },
             focus: function() {return false; },
			 select: function( event, ui ) {
				 criteria[field] = split( this.value );
				 criteria[field].pop();
				 criteria[field].push( ui.item.value );
				 criteria[field].push( "" );
				 this.value = criteria[field].join( ", " );
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
            tableName = 'x';

        query += 'select ' + fieldList + ' from ' + tableName + ' where animalType = "' +  criteria.animal + '" ';

        if (criteria.name) {
            query += ' and name = "' + criteria.name + '" ';
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

    $('#search').button().click(function() {
        alert(buildQuery());
    });

});