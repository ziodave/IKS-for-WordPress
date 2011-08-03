/**
 * IKS UI semanticEnhancer
 *
 * IKS Project
 * @author Sebastian Germsin
 *
 * Depends:
 *	jquery.ui.button.js
 *
 */

(function(jQuery, undefined) {
    jQuery.widget('ui.semanticEnhancer', {
	
    	_create: function() {
			var that = this;
			
			this.clickHandler = function(event) {
				// check if the dialog exists and is shown, if so, empty it and remove 
				// possible highlighting in the text
				if (!window.semanticDialog) {
					window.semanticDialog = jQuery('<div><div>').appendTo(document.body);
				}
				else {
					window.semanticDialog.hide().empty();
					if (window.semanticDialog.source && window.semanticDialog.source.left) {
						window.semanticDialog.source.left();
					}
				}
				window.semanticDialog.removeClass().addClass('iks-sem_enh-dia');
				window.semanticDialog.source = jQuery(this);
				window.semanticDialog.source.left = function(){
					window.semanticDialog.source.removeClass('iks-sem_enh-highlighted');
				};
								
				jQuery(this).addClass('iks-sem_enh-highlighted');
				
				var button = jQuery('<button type="button">Enhance!</button>')
				.button()
				.insertAfter( '#semantic_element' ) // .appendTo(window.semanticDialog)
				.click(function(eventHandler){
					return function(){
						var sourceTextElement = that.element;
                        
                        //remove content editable
                        sourceTextElement.removeAttr('contenteditable');
                        
                        //search for ajax loader
                        var loader = sourceTextElement.parent().parent().find('img').show();
                        
						
						//unbind event to prevent another enhancement
						sourceTextElement.unbind('click', eventHandler);
						//add loader icon
						sourceTextElement.addClass('iks-sem_enh-load');
						//to prevent removal of loading icon when clicking on the next
						// text whilst loading:
						window.semanticDialog.source.left = jQuery.noop;
						
						//hide button
						window.semanticDialog.hide();
						
						//send data to FISE
						that.getEnhancements(jQuery(that.element).html(), function(sourceTextElement){
							return function(data) {
                                loader.hide();
								//parse the FISE output and add it to newRdf triple store!
								var newRdf = jQuery.rdf().load(data, {});
								var newEntityIds = jQuery([]);
						
								//create entites in HTML and add to triples (sources) 
								var newEntitiesPos = {};
								for (subject in newRdf.databank.subjectIndex) {
									alert(subject);
									var s = subject;
									var triples = newRdf.databank.subjectIndex[subject];
									var subjTriple = undefined;
									var enhContext = jQuery([]);
									
									for (var t = 0; t < triples.length; t++) {
										var triple = triples[t];
										var prop = triple.property;
										var val = triple.object;
										
										
										if (prop.toString() === "<http://fise.iks-project.eu/ontology/hasEnhancementContext>") {
											var enhancementContextUri = val.value;
											
											var enhancementTriples = newRdf.where('<' + enhancementContextUri + '> ?prop ?obj');
											var startPos = -1;
											var endPos = -1;
											var context = "";
											
											for (var x = 0; x < enhancementTriples.size(); x++) {
												var enhTriple = enhancementTriples[x];
												var enhProp = enhTriple.prop;
												var enhVal = enhTriple.obj;
												
												if (enhProp.value.toString() === "http://fise.iks-project.eu/ontology/start-position") {
													startPos = parseInt(enhVal.value);
												}
												else 
													if (enhProp.value.toString() === "http://fise.iks-project.eu/ontology/end-position") {
														endPos = parseInt(enhVal.value);
													}
													else 
														if (enhProp.value.toString() === "http://fise.iks-project.eu/ontology/context") {
															context = enhVal.value.toString();
														}
											}
											if (startPos != -1 && endPos != -1/* && context != ""*/) {
												enhContext.push({
													'start': startPos,
													'end': endPos,
													'context': context
												});
											} 
										}
										else if (prop.toString() === "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>") {
											if (val.value.toString().substring(0, 30) === "http://rdf.data-vocabulary.org") {
												subjTriple = triple;
											}
										}
									}
											
									if (enhContext.length > 0 && subjTriple) {
										for (var e = 0; e < enhContext.length; e++) {
											//check if we already have seen an annotation for these positions
											if (!newEntitiesPos[enhContext[e].start + ',' + enhContext[e].end]) {
												newEntitiesPos[enhContext[e].start + ',' + enhContext[e].end] = jQuery([]);
											}
											newEntitiesPos[enhContext[e].start + ',' + enhContext[e].end].push({
												'triple': subjTriple,
												'context': enhContext[e].context,
												'offset': sourceTextElement.html().indexOf(enhContext[e].context.replace("\\", ""))
											});
										}
									} 
								}
								
								var sortedPos = that._getSortedKeys(newEntitiesPos);
								//register element in HTML and attach new entity selector widget
                                for (var i = 0; i < sortedPos.length; i++) {
									var posKey = sortedPos[i];
									var splitted = posKey.split(",");
									var startPos = parseInt(splitted[0]);
									var endPos = parseInt(splitted[1]);
									
									var offset = that._findApostrophsBeforeIndex(sourceTextElement.html(), startPos);
									//TODO: include the context in offset calculation
									
									var newEntityId = that.registerNewEntityInHTML(sourceTextElement, startPos, endPos, offset);
									
									newEntityIds.push({
										'id': newEntityId,
										'triples': newEntitiesPos[posKey]
									});
								}
								//remove highlighters
								sourceTextElement.removeClass('iks-sem_enh-load iks-sem_enh-highlighted iks-sem_enh-highlightable');
								
								jQuery.each (newEntityIds, function (i, e) {
									var id = e.id;
									var entArr = e.triples;
									
									var newEntity = jQuery('#' + id);
									
									if (newEntity) {
										for (var j = 0; j < entArr.length; j++) {
											var trip = entArr[j].triple;
											
											var triples = newRdf.databank.triples();
											
											for (var xx = 0; xx < triples.length; xx++) {
												var triple = triples[xx];
												if (triple === trip) {
													newRdf.databank.triples()[xx].source = newEntity;
												}
											}
										}
										newEntity.entitySelector({
											'rdf': newRdf
										});
									}
								});
							};
						}(sourceTextElement));
					};
				}(that.clickHandler));
				
				window.semanticDialog.show();
				window.semanticDialog.position({
					my: 'left bottom',
					at: 'right top',
					of: jQuery(this),
					collision: 'fit',
					offset: '5 0'
				});
				return false;
			};
			
    		this.element.bind('click', this.clickHandler);
			this.element.addClass('iks-sem_enh-highlightable');
    	},
	
		destroy: function () {
			this.element.unbind('click', this.clickHandler);
			this.element.removeClass('iks-sem_enh-highlightable');
		},
		
		_getSortedKeys: function (aInput) {
			var aTemp = jQuery([]);
			for (var sKey in aInput) {
				aTemp.push(sKey);
			}
			aTemp.sort(function () {
				var split0 = arguments[0].split(",");
				var split1 = arguments[1].split(",");
				
				return parseInt(split0[1]) < parseInt(split1[1]);
			});
			
			return aTemp;
		},
		
		registerNewEntityInHTML: function (parentElement, begin, end, offset) {
			var newEntityId = 'entity_' + this._getUUID();

			if (parentElement) {
				var parentHtml = parentElement.html();

				var head = parentHtml.substring(0, begin - offset);
				var newEntity  = jQuery('<span id="' + newEntityId + '">' + parentHtml.substring(begin - offset, end - offset) + '</span>');
				var tail = parentHtml.substring(end-offset, parentHtml.length);
				
				parentElement
				.empty()
				.append(head)
				.append(newEntity)
				.append(tail);
			
			} else {
				alert("Have not found a parent element!");
			}
			return newEntityId;
		},
		
    	getEnhancements: function(text, callback){
            jQuery.ajax({
    			async: true,
    			success: callback,
    			error: callback,
    			type: "POST",
    			url: this.options.proxy,
    			data: {
        			proxy_url: this.options.fise_url, 
        			content: text,
        			verb: "POST",
        			format: "application/rdf+json"
    			}
    		});    		
    	},
		
		_findApostrophsBeforeIndex: function (string, index) {
			var testStr = string.substring(0, index);
			
			var matches =  testStr.match(/'/g);
						
			return ((matches != null)? matches.length : 0);
		},
				
		_getSelectedText: function(){
  			var t = null;
 			if(window.getSelection){
    			t = window.getSelection();
  			} else if(document.getSelection){
    			t = document.getSelection();
  			} else if(document.selection){
    			t = document.selection.createRange().text;
  			}
  			return t;
		},
		
    	_getUUID: function () {
			if (!window.uniqueId) {
				window.uniqueId = 0;
			}
			return (window.uniqueId++);
		},
		
		options: {
			fise_url: 'http://150.146.88.63:9090/engines/',
			proxy: "../../utils/proxy/proxy.php"
		}
    });

}(jQuery));