/**
 * Copyright 2010, iContact (http://icontact.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function($) {
$.widget( "ui.richcombo", {
	options: {
		maxHeight: null,
		position: null,
		appendTo: null
	},
	_create: function() {
		var self = this,
			doc = (self.doc = $(this.element[ 0 ].ownerDocument)),
			richCombo = (self.richCombo = $('<ul class="richComboList"></ul>')),
			richComboButton = (self.richComboButton = $('<a class="richComboButton" href="">Default</a>')),
			richComboContainer = (self.richComboContainer = $('<div class="richComboContainer"></div>')),
			maxHeight = this.options.maxHeight,
			menuWidth,
			textWidth;

		this.selectedElement = $();
		
		this._populateOptions();

		richCombo.menu({
			selected: function(event, ui) {
				if (ui.item) {
					self.selected(event, ui);

					self._trigger('change', event, {item: ui.item});					
				}
			}
		});

		richComboButton.click(function(event) {
			if (richComboContainer.is(':visible')) {
				event.preventDefault();
				return;
			}
			doc.bind('click.richCombo', function(event) {
				var closestList = $(event.target).closest('.richComboList'),
					closestButton = $(event.target).closest('.richComboButton');
				
				// if you click outside of this richcombo, close the menu
				if ((closestList.length && closestList[0] == richCombo[0]) ||
				 	(closestButton.length && closestButton[0] == richComboButton[0])) {
					return;
				}
				
				self.close();
			});

			richComboButton.bind('click.richCombo', function(){
				self.close();
			});

			richComboContainer
				.show()
				.position($.extend({
					my: "left top",
					at: "left bottom",
					of: richComboButton,
					collision: "none"
				}, self.options.position))
				.hide()
				.slideDown('fast');
			
			event.preventDefault();
		});

		this.element.hide();		
		richCombo.appendTo(richComboContainer);
		richComboContainer.appendTo( self.options.appendTo || 'body');
		this.element.after(richComboButton);

		if (maxHeight && richCombo.height() > maxHeight) {
			var scrollInterval,
				prevScrollTop,
				scrollDownButton = $('<a class="richComboScrollDown">down</a>'),
				scrollUpButton = $('<a class="richComboScrollUp">up</a>');

			scrollDownButton
				.mouseover(function() {
					scrollInterval = setInterval(function() {
						scrollUpButton.show();
						prevScrollTop = richCombo.scrollTop();
						richCombo.scrollTop(prevScrollTop + 10);
						if (richCombo.scrollTop() == prevScrollTop) {
							scrollDownButton.hide();
							clearInterval(scrollInterval);
						}
					}, 300);
				})
				.mouseout(function() {
					clearInterval(scrollInterval);
				});

			scrollUpButton
				.mouseover(function() {
					scrollInterval = setInterval(function() {
						scrollDownButton.show();
						prevScrollTop = richCombo.scrollTop();
						richCombo.scrollTop(prevScrollTop - 10);
						if (richCombo.scrollTop() == prevScrollTop) {
							scrollUpButton.hide();
							clearInterval(scrollInterval);
						}
					}, 300);
				})
				.mouseout(function() {
					clearInterval(scrollInterval);
				})
				.hide();

			scrollDownButton.appendTo(richComboContainer);
			scrollUpButton.appendTo(richComboContainer);
			richCombo.css('overflow', 'hidden');
			richCombo.height(maxHeight);
		}

		richComboContainer.hide();
	},
	widget: function() {
		return this.richComboButton;
	},
	close: function() {
		this.richComboContainer.slideUp('fast');
		this.richComboButton.unbind('click.richCombo');
	},
	getList: function() {
		return this.richCombo;
	},
	destroy: function() {
		this.richCombo.remove();
		this.richComboButton.remove();
		this.element.show();
	},
	refresh: function() {
		this.richCombo.empty();
		this._populateOptions();
		this.richCombo.menu('refresh');
		this.richComboContainer.show();
		
		var menuWidth = this.richCombo.width("").outerWidth(),
			textWidth = this.richComboButton.outerWidth(),
			additionalWidth = (parseFloat(this.richCombo.css('paddingLeft')) || 0) + (parseFloat(this.richCombo.css('paddingRight')) || 0)
				+ (parseFloat(this.richCombo.css('borderLeftWidth')) || 0) + (parseFloat(this.richCombo.css('borderRightWidth')) || 0);
		this.richCombo.width(Math.max(menuWidth, textWidth) - additionalWidth);
		
		// If the height of the richCombo extends down below the bottom of the viewport, set a height and overflow
		if (this.richCombo.height() > ($(window).height() + 40)) {
			this.richCombo.css({overflow:"auto", height: $(window).height() - 140});
		}
		
		this.richComboContainer.hide();
	},
	selected: function(event, ui) {
		this.selectedElement.removeClass('selected');
		this.selectedElement.find(".selectedCheckbox").remove();
		
		this.selectedElement = ui.item.addClass('selected');
		this.selectedElement.append('<div class="selectedCheckbox"></div>');
		
		this.close();
		
		var val = ui.item.text();
		if (this.options.beforeChange) {
			val = this.options.beforeChange(ui.item);
			this.richComboButton.empty().append(val);
		} else {
			this.richComboButton.text(val);
		}
		
		//update the now hidden drop down
		this.element.val(this.selectedElement.data('richComboValue'));
	},

	_populateOptions: function() {
		var self = this;

		this.element.children().each(function(i, option) {
			var option = $(option),
				listItem = $('<li><a href="">' + option.text() + '</a></li>');
			
			if (self.options.beforeItemRender) {
				listItem = self.options.beforeItemRender(listItem, option);
			}
			
			listItem.data('richComboValue', option.val());
			if (option.attr('selected')) {
				self.selected(null, {item: listItem});
			}
			listItem.appendTo(self.richCombo);
		});
	}
});

})(jQuery);