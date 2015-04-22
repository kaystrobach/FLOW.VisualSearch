(function ( $ ) {
    $.fn.extend({
        // A simple proxy for `selectRange` that sets the cursor position in an
        // input field.
        setCursorPosition: function(position) {
            return this.each(function() {
                return $(this).selectRange(position, position);
            });
        },

        // Cross-browser way to select text in an input field.
        selectRange: function(start, end) {
            return this.filter(':visible').each(function() {
                if (this.setSelectionRange) { // FF/Webkit
                    this.focus();
                    this.setSelectionRange(start, end);
                } else if (this.createTextRange) { // IE
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    if (end - start >= 0) range.select();
                }
            });
        },

        advancedSearch: function (settings) {
            var defaults = {
                container: '#search-input-area'
            };
            var settings = $.extend({}, defaults, settings);

            // create needed elements
            $(settings['container']).html('<div contenteditable="true" class="token-input" data-type="facet"></div>');

            // focus on click
            $(settings['container']).on('click', function () {
                $(this).children('div[contenteditable]').last().focus();
            });

            // strip tags on enter
            $(settings['container']).children('div[contenteditable]').on('input', function () {
                // fix wrong character ordering due to a chrome bug
                window.setTimeout(function() {
                    var text = $(this).text();
                    $(this).html(text);
                }, 100);

            });

            // react on input and build visual facets
            $(settings['container']).children('div[contenteditable]').on('keypress', function (event) {
                if (event.which == 13) {
                    var text = $(this).text()
                    $(this).text('');

                    if ($(this).attr('data-type') === 'facet') {
                        $(this).before('<div class="token token-wrapper"><span class="btn btn-link btn-xs"><span class="glyphicon glyphicon-remove"></span></span><div class="token token-facet" data-value="">' + text + '</div></div>');
                        $(this).attr('data-type', 'value');
                    } else {
                        $(this).prev().append('<div class="token token-value" data-facet="">' + text + '</div>');
                        $(this).attr('data-type', 'facet');
                    }

                    event.preventDefault();
                }
            });

        }
    });
})(jQuery);

$( document ).ready(function() {
    $().advancedSearch();
});