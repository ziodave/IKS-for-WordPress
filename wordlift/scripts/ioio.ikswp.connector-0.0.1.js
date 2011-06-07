(function($) {

	$.ioio.ikswp.connector = {};

	$.ioio.ikswp.connector.lift = function() {

		// ceate the dialog
		var dialog = $(
				'<div id="dialog"><button id="save-button" type="button">Save</button><button id="analyze" type="button">Analyze</button><div id="content"></div><div id="results"></div></div>')
				.appendTo(document.body).dialog({
					height : $(window).height() - 100,
					width : $(window).width() - 100,
					position : [ 50, 50 ],
					modal : true,
					autoOpen : false
				});

		var dialogContent = $('#dialog #content').html(
				tinyMCE.get('content').getContent({format: 'raw'}));

		dialog.dialog('open');

		$("#analyze").button().click(function() {
			// remove any existing entities
			$('#content div.entity').remove();
			$("#results").empty();
			var c = $("#dialog #content").text().replace(new RegExp("\\n", "g"), '');
			c = c.replace(new RegExp("\\t", "g"), ' ');
			$.ioio.ikswp.connector.analyze(c);
		});

		$("#save-button").button().click(function() {
			$('div.entity.ui-selected').each(function() {
				$(this).removeClass('ui-selected ui-selectee');
				dialogContent.append($(this));
			});
			tinyMCE.get('content').setContent(dialogContent.html());

			dialog.dialog('close');

			//
			dialog.empty();
		});

	}

	$.ioio.ikswp.connector.analyze = function(content) {

		var stanbol = $.ioio.ikswp.stanbol($('#results'));
		stanbol.bind('loaded', function() {
			$("#results").selectable({
				filter : '.entity'
			});
		});
		stanbol.analyze(content);
	}

})(jQuery);
