/*
 * jQuery UI Menu (not officially released)
 * 
 * This widget isn't yet finished and the API is subject to change. We plan to finish
 * it for the next release. You're welcome to give it a try anyway and give us feedback,
 * as long as you're okay with migrating your code later on. We can help with that, too.
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Menu
 *
 * Depends:
 *	jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function($) {

$.widget("ui.menu", {
	_create: function() {
		var self = this;
		this.element
			.addClass("ui-menu ui-widget ui-widget-content ui-corner-all")
			.attr({
				role: "menu",
				"aria-activedescendant": "ui-active-menuitem"
			})
			.click(function(e) {
				// temporary
				e.preventDefault();
				self.select();
			});
		this.refresh();
	},
	
	refresh: function() {
		var self = this;

		// don't refresh list items that are already adapted
		var items = this.element.children("li:not(.ui-menu-item):has(a)")
			.addClass("ui-menu-item")
			.attr("role", "menuitem");
		
		items.children("a")
			.addClass("ui-corner-all")
			.attr("tabindex", -1)
			// mouseenter doesn't work with event delegation
			.mouseenter(function() {
				self.activate($(this).parent());
			})
			.mouseleave(function() {
				self.deactivate();
			});
	},

	activate: function(item) {
		this.deactivate();
		if (this.hasScroll()) {
			var offset = item.offset().top - this.element.offset().top,
				scroll = this.element.attr("scrollTop"),
				elementHeight = this.element.height();
			if (offset < 0) {
				this.element.attr("scrollTop", scroll + offset);
			} else if (offset > elementHeight) {
				this.element.attr("scrollTop", scroll + offset - elementHeight + item.height());
			}
		}
		this.active = item.eq(0)
			.children("a")
				.addClass("ui-state-hover")
				.attr("id", "ui-active-menuitem")
			.end();
		this._trigger("focus", null, { item: item });
	},

	deactivate: function() {
		if (!this.active) { return; }

		this.active.children("a")
			.removeClass("ui-state-hover")
			.removeAttr("id");
		this._trigger("blur");
		this.active = null;
	},

	next: function() {
		this.move("next", "li:first");
	},

	previous: function() {
		this.move("prev", "li:last");
	},

	first: function() {
		return this.active && !this.active.prev().length;
	},

	last: function() {
		return this.active && !this.active.next().length;
	},

	move: function(direction, edge) {
		if (!this.active) {
			this.activate(this.element.children(edge));
			return;
		}
		var next = this.active[direction]();
		if (next.length) {
			this.activate(next);
		} else {
			this.activate(this.element.children(edge));
		}
	},

	// TODO merge with previousPage
	nextPage: function() {
		if (this.hasScroll()) {
			// TODO merge with no-scroll-else
			if (!this.active || this.last()) {
				this.activate(this.element.children(":first"));
				return;
			}
			var base = this.active.offset().top,
				height = this.element.height(),
				result = this.element.children("li").filter(function() {
					var close = $(this).offset().top - base - height + $(this).height();
					// TODO improve approximation
					return close < 10 && close > -10;
				});

			// TODO try to catch this earlier when scrollTop indicates the last page anyway
			if (!result.length) {
				result = this.element.children(":last");
			}
			this.activate(result);
		} else {
			this.activate(this.element.children(!this.active || this.last() ? ":first" : ":last"));
		}
	},

	// TODO merge with nextPage
	previousPage: function() {
		if (this.hasScroll()) {
			// TODO merge with no-scroll-else
			if (!this.active || this.first()) {
				this.activate(this.element.children(":last"));
				return;
			}

			var base = this.active.offset().top,
				height = this.element.height();
				result = this.element.children("li").filter(function() {
					var close = $(this).offset().top - base + height - $(this).height();
					// TODO improve approximation
					return close < 10 && close > -10;
				});

			// TODO try to catch this earlier when scrollTop indicates the last page anyway
			if (!result.length) {
				result = this.element.children(":first");
			}
			this.activate(result);
		} else {
			this.activate(this.element.children(!this.active || this.first() ? ":last" : ":first"));
		}
	},

	hasScroll: function() {
		return this.element.height() < this.element.attr("scrollHeight");
	},

	select: function() {
		this._trigger("selected", null, { item: this.active });
	}
});

}(jQuery));
