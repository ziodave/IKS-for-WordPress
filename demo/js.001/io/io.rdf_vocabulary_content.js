//! A content based on a RDF Vocabulary. Provides properties and an IKS Enhancement Context (from Stanbol)
var RdfVocabularyContent = Backbone.Model.extend({
    // initializes the content instance with the provided triples
    initialize: function(triples, rdf) {

        this.set({
                rdf: rdf,                   // holds the full rdf
                type: null,                 // holds the type triple
                properties: jQuery([]),          // holds the properties triples
                enhancementContext: null, // holds an IKS Enhancement Context triple (pointing to another triple)
                isEnhancement: false        // if true, it's an IKS Enhancement
            });

        this.addTriples(triples);
    },
    // parses the provided triples and build a content instance
    addTriples: function(triples) {
        for (var i = 0; i < triples.length; i++) {
            this.addTriple(triples[i]);
        }
    },
    // parses the triple and assigns its value to the content instance
    addTriple: function(triple) {
        var property = triple.property.value.toString();
        var object   = triple.object.value.toString();

        // it's a type
        if ( property === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" )
        {
            this.setType(object);
            return;
        }

        // it's a property
        if ( property.substring(0,30) === "http://rdf.data-vocabulary.org" )
        {
            // add the property
            this.addProperty(
                    jQuery.uri(triple.property.value.toString()).fragment,   // the name of the property (i.e. the fragment part of the URI, e.g. http://rdf.data-vocabulary.org#Person)
                    triple.object.value.toString()                      // the property's value
                );

            return;
        }

        // it's an IKS Enhancement Context
        if ( property === "http://fise.iks-project.eu/ontology/hasEnhancementContext" )
        {
            this.set({enhancementContext: new EnhancementContext(this.get("rdf"),triple)} );
            this.set({isEnhancement: true});
            return;
        }

        // unknown triples are discarded
    },
    // adds a property triple to the array of properties
    addProperty: function( property, value ) {
    	console.log('prop [%s]; value [%s]',property,value);
        this.get("properties").push({property: property, value: value})
    },
    // retries a property
    getProperty: function( key ) {
        this.get("properties").each(function(){
            if ( this.property === key )
                return this.value;
        });
    },
	//! returns the name of the property for the specified value
	getKeyProperty: function() {
		if ( this.get("type") === "Person" || this.get("type") === "NamedIndividual" )
			return "name";
	},
    // dumps the properties to the console.log
    dumpProperties: function() {
        this.get("properties").each(function(){
            console.log("[%s]: [%s]",this.property,this.value);
        });
    },
    setType: function( url ) {
    	var namespace = this.getNamespace(url);
    	var fragment  = this.getFragment(url);
    	console.log("namespace [%s]; fragment [%s]",namespace,fragment);
    	this.set({
    		namespace: namespace,
    		type: fragment
    	});
    },
    getNamespace: function( url ) {
    	if ( url.lastIndexOf('#') == -1 ) return ( url );

    	return ( url.substring(0, url.lastIndexOf('#')+1 ) );
    },
    getFragment: function( url ) {
    	if ( url.lastIndexOf('#') == -1 ) return ( "" );

    	return ( url.substring(url.lastIndexOf('#')+1 ) );
    }
});