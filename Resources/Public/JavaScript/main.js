(function ( $ ) {
    $.fn.advancedSearch = function(settings) {
        var defaults = {
            container: '#search-input-area'
        };
        var settings = $.extend( {}, defaults, settings );

        $(settings['container']).html('<div contenteditable="true" class="token-input" data-type="facet"></div>');

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

                if($(this).attr('data-type') === 'facet') {
                    $(this).before('<div class="token token-facet" data-value="">' + text + '</div>');
                    $(this).attr('data-type', 'value');
                } else {
                    $(this).before('<div class="token token-value" data-facet="">' + text + '</div>');
                    $(this).attr('data-type', 'facet');
                }

                event.preventDefault();
            }
        });
    }
})(jQuery);

$( document ).ready(function() {
    $().advancedSearch();
});