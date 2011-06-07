// performs the semantic lifting
function lift()
{
	copyBody(); // copies the raw body in the semantic element
	registerSemanticEnhancer('#semantic_element');
}

// the body for the post is in the TinyMCE editor. we need to take it to a div in order
// to perform the semantic lifting
function copyBody()
{
	jQuery(function($)
	{	
		// the id of the element that will hold the text to lift
		var semanticElementId = 'semantic_element';
		// the id after which to insert the semantic element
		var insertAfterId     = '#postdivrich';
		// the id of the TinyMCE editor holding the raw text
		var tinyMCEId         = 'content';
		
		var tinyMCEContent    = tinyMCE.get('content').getContent({format : 'raw'});
		
		// check whether an element holding the text has already been created
		if ( $( '#'+semanticElementId ).length == 0 )
		{
			$( '<div id="'+semanticElementId+'">'+tinyMCEContent+'</div>' ).insertAfter( insertAfterId );
		}
		else
		{
			// update the content of the semantic element
			$( '#'+semanticElementId ).html( tinyMCEContent );
		}
	});
};

//register the semantic enhancer for the appropriate elements
function registerSemanticEnhancer(selector) {
	jQuery(selector).semanticEnhancer({
		fise_url : 'http://localhost:8080/engines/' // 'http://wit.istc.cnr.it:9090/engines/'
													// //
													// 'http://150.146.88.63:9090/engines/'
		,
		proxy    : '../wp-content/plugins/wordlift/utils/proxy/proxy.php'
	});
};

// register the 'Save As' button
function registerSaveButton(selector) {
	jQuery('<div></div>').saveHtml({
		label : "Validate annotation..."
	}).appendTo(jQuery('#page')).position({
		my : "left top",
		at : "left top",
		of : jQuery(selector),
		offset : "0 5"
	});
}
