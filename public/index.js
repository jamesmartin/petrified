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

    function initAutocomplete(id, url, field) {

        var tags = ['123', '1234', '12345'];

        $('#' + id)
	    .bind( "keydown", function( event ) {
			if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "autocomplete" ).menu.active ) {
					event.preventDefault();
			}
	     })
         .autocomplete({
			 source: function( request, response ) {
			     // $.getJSON( url, {
			     //    	term: extractLast( request.term )
			     //    }, response );
                 response( $.ui.autocomplete.filter(tags, extractLast( request.term ) ) );
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

    initAutocomplete('breed', '', 'breed');
    initAutocomplete('color', '', 'color');

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