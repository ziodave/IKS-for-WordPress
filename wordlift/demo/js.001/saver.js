/**
 * IKS UI savePageButton
 *
 * IKS Project
 * @author Sebastian Germsin
 *
 * Depends:
 *	jquery.ui.button.js
 *
 */


(function(jQuery, undefined) {
    jQuery.widget('ui.saveHtml', {
		
    	_create: function () {
    		var button = jQuery('<button></button>')
			.button(this.options)
			.click(this.clickHandler(this))
			.appendTo(this.element);
    	},
		
		destroy: function () {
			// default destroy
			jQuery.Widget.prototype.destroy.apply(this, arguments);
        	// now do other stuff particular to this widget
		},
    	
		clickHandler: function(inst){
			return function(event){
				inst.saveHtml(inst.options.defaultFilename());
			};
		},
		
		saveHtml: function (filename) {
			var that = this;
			var content = document.documentElement.outerHTML;
			
			if (content) {
				//create HTTP-POST call to PHP script for saving file!
				jQuery.post(this.options.writerScript, {
					filename: filename,
					content: content
					},
					that.successHandler(that));
			} else {
				alert("No content found!");
			}
		},

		successHandler: function(inst){
			return function(data){
				var googleRichSnippetsURL = "http://www.google.com/webmasters/tools/richsnippets?url={url}";
				googleRichSnippetsURL = googleRichSnippetsURL.replace("{url}", data);
				var ans = confirm("File has been successfully stored on server!\n" +
				"(" + data + ")\n" + 
				"Do you want to take a look at the\nGoogle Rich Snippets testing tool!");
				if (ans) {
					window.open(googleRichSnippetsURL);
				}
				//inst.disableButton();
			}
		},
		
		disableButton: function () {
			jQuery(this.element).find('button').button("disable");
		},
		
		enableButton: function () {
			jQuery(this.element).find('button').button("enable");
		},
		
		options: {
			label: "Save",
			defaultFilename: function () {return "../seo_output_" +  new Date().getTime() + ".html"},
			writerScript: "./js/writer.php"
		},
		
	});

}(jQuery));