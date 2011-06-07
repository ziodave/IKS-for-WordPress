// Creates a new plugin class and a custom listbox
console.log( 'tinymce v'+tinymce.majorVersion+'.'+tinymce.minorVersion);

tinymce
		.create(
				'tinymce.plugins.io.SemanticLift',
				{
					init : function(ed, url) {

						// adding RDFa support to SPAN tag to avoid tinymce
						// remove our attrs
						tinyMCE.activeEditor.settings.cleanup = false;
						tinyMCE.activeEditor.settings.extended_valid_elements = 'div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick'
								+ '|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove'
								+ '|onmouseout|onmouseover|onmouseup|style|title|'
								+ '|xmlns::io0|xmlns::io1|xmlns::io2|xmlns::io3|xmlns::io4|xmlns::io5|xmlns::io6|xmlns::io7|xmlns::io8|xmlns::io9|xmlns::io10'
								+ '|itemscope|itemprop|itemtype'
								+ '|typeof|property],'
								+ 'span[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown'
								+ '|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover'
								+ '|onmouseup|style|title'
								+ '|xmlns::io0|xmlns::io1|xmlns::io2|xmlns::io3|xmlns::io4|xmlns::io5|xmlns::io6|xmlns::io7|xmlns::io8|xmlns::io9|xmlns::io10'
								+ '|itemscope|itemprop|itemtype'
								+ '|typeof|property|value]';

						// adding the button
						ed
								.addButton(
										'io_semantic_lift_button',
										{
											title : 'Semantic Lift',
											image : '../wp-content/plugins/wordlift/images/kubrick.jpg',
											// icons : false,
											onclick : function() {
												jQuery.ioio.ikswp.connector
														.lift();
											}
										});
					}
				});

// Register plugin with a short name
tinymce.PluginManager.add('semanticLift', tinymce.plugins.io.SemanticLift);