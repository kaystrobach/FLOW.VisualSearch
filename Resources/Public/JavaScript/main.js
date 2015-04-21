(function ( $ ) {
    $.fn.advancedSearch = function(settings) {
        var defaults = {
            container: '#search-input-area'
        };
        var settings = $.extend( {}, defaults, settings );

        $(settings['container']).html('<div contenteditable="true" class="token-input"></div>');

        $(settings['container']).on('click', function() {
            $(this).children('div[contenteditable]').first().focus();
        });
        $(settings['container']).children('div[contenteditable]').on('input', function() {
            $(this).html($(this).text());
        });
        $(settings['container']).children('div[contenteditable]').on('keypress', function(event) {
            if(event.which == 13) {
                var text = $(this).text()
                $(this).text('');

                if($(this).prev().class('token-facet')) {
                    $(this).before('<div class="token token-value" data-value="">' + text + '</div>');
                } else {
                    $(this).before('<div class="token token-facet" data-facet="">' + text + '</div>');
                }

                event.preventDefault();
            }
        });
    }
})(jQuery);

$( document ).ready(function() {
    $().advancedSearch();
});