//! an EnhancementContext
var EnhancementContext   = Backbone.Model.extend({
    //! Creates an EnhancementContext.
    /*!
     * \param rdf is the full rdf that contains the EnhancementContext
     * \param triple is a triple referencing the EnhancementContext
     */
    initialize: function( rdf, triple ) {
        
        var urn         = triple.object;
        var enhancement = rdf.where(urn + ' ?prop ?obj');
        var startPos    = -1;
        var endPos      = -1;
        var context     = "";
        
        for (var i = 0; i < enhancement.length; i++) {
            
            var triple    = enhancement[i];
            var property  = triple.prop.toString();
            var object   = triple.obj;
            
            if (property === "<http://fise.iks-project.eu/ontology/start-position>") {
				startPos = parseInt(object.value.toString());
			}

			if (property === "<http://fise.iks-project.eu/ontology/end-position>") {
				endPos   = parseInt(object.value.toString());
			}

			if (property === "<http://fise.iks-project.eu/ontology/context>") {
				context  = object.value.toString();
			}
			
        }
        
        if (startPos>-1 && endPos>-1) {
			this.set({
					start: startPos,
					end  : endPos
				});
        }                
    }
});