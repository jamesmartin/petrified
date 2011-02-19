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

    initAutocomplete('breed', '', 'breed');
    initAutocomplete('color', '', 'color');

    $('#name').change(function(){
        criteria.name = $(this).val();
    });

    $('#search').button().click(function() {
        var query = '', i;
        query += 'select * from x where ';

        if (criteria.name) {
            query += 'name = "' + criteria.name + '"';
        }

        if (criteria.breed.length) {
        }

        alert(query);
    });
});