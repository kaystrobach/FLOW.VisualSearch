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

        advancedSearchTerm: function() {
            var query = [];
            $.each($(this).children('.token'), function(key, value) {
                query.push(
                    {
                        facetLabel: $(value).children('.token-facet').text(),
                        facet: $(value).children('.token-facet').attr('data-facet'),
                        valueLabel: $(value).children('.token-value').text(),
                        value: $(value).children('.token-value').attr('data-value')
                    }
                )
            });
            return query;
        },

        advancedSearch: function (settings) {
            function addFacetAutocomplete(element) {
                if($(element).autocomplete('instance')) {
                    $(element).autocomplete('enable');
                }
                $(element).attr('data-type', 'facet');
                $(element).autocomplete(
                    'option',
                    {
                        source: function(request, response) {
                            //
                            $.ajax({
                                dataType: "json",
                                url: $(settings['container']).attr('data-facetsAction'),
                                data: {
                                    term: request.term,
                                    query: $(settings['container']).advancedSearchTerm()
                                },
                                success: function(data) {
                                    response(data);
                                }
                            });
                        }
                    }
                );
                $(element).autocomplete(
                    'option',
                    {
                        select: function( event, ui ) {
                            console.log(ui);
                            $(this).before('<div class="token token-wrapper"><span class="btn btn-link btn-xs"><span class="glyphicon glyphicon-remove"></span></span><div class="token token-facet" data-value=""></div></div>');
                            $(this).prev().find('.token-facet').text(ui.item.label);
                            $(this).prev().find('.token-facet').attr('data-facet', ui.item.value)
                            $(element).text('');
                            addValueAutocomplete(element);
                            window.setTimeout(function() {
                                // @todo add handling for disabled autocomplete
                                //if(ui.item.configuration.freeInput) {
                                //    $(element).autofocus('disable');
                                //}
                                $(element).focus();
                            }, 50);

                            return false;
                        }
                    }
                );
            }

            function addValueAutocomplete(element) {
                if($(element).autocomplete('instance')) {
                    $(element).autocomplete('enable');
                }
                $(element).attr('data-type', 'value');

                $(element).autocomplete(
                    'option',
                    {
                        source: function(request, response) {
                            var query =  $.param(
                                {
                                    facet: $(element).prev().children('.token-facet').attr('data-facet')
                                }
                            );
                            $.ajax({
                                dataType: "json",
                                url: $(settings['container']).attr('data-valueAction') + '&' + decodeURI(query),
                                data: {
                                    term: request.term,
                                    query: $(settings['container']).advancedSearchTerm()
                                },
                                success: function(data) {
                                    response(data);
                                }
                            });
                        }
                    }
                );
                $(element).autocomplete(
                    'option',
                    {
                        select: function (event, ui) {
                            $(this).prev().append('<div class="token token-value" data-value="' + ui.item.value + '">' + ui.item.label + '</div>');
                            $(element).text('');
                            addFacetAutocomplete(element);
                            window.setTimeout(function() {
                                $(element).focus();
                            }, 100);

                            storeQueryInSession();
                            return false;
                        }
                    }
                );
            }

            function storeQueryInSession() {
                $.ajax({
                    dataType: "json",
                    url: $(settings['container']).attr('data-storeQueryAction'),
                    data: {
                        query: $(settings['container']).advancedSearchTerm()
                    }
                });
            }

            function initQuery() {
                var query = $.parseJSON($(settings['container']).attr('data-query'));
                $.each(query, function(key, value) {
                    var html = '<div class="token token-wrapper"><span class="btn btn-link btn-xs"><span class="glyphicon glyphicon-remove"></span></span><div class="token token-facet" data-facet="' + value.facet + '">' + value.facetLabel + '</div><div class="token token-value" data-value="' + value.value + '">' + value.valueLabel + '</div></div>';
                    $(settings['container']).children('.token-input').before(html);
                });

            }

            var defaults = {
                container: '#search-input-area'
            };
            var settings = $.extend({}, defaults, settings);

            // create needed elements
            $(settings['container']).html('<div contenteditable="true" class="token-input"></div>');

            initQuery();

            $(settings['container']).children('div[contenteditable]').autocomplete(
                {
                    source:'',
                    minLength: 0
                }
            ).focus(function () {
                    $(this).autocomplete('search', $(this).text());
                }
            );
            addFacetAutocomplete($(settings['container']).children('div[contenteditable]'));

            // focus on click
            $(settings['container']).on('click', function () {
                addFacetAutocomplete($(settings['container']).children('div[contenteditable]'));
                $(this).children('div[contenteditable]').last().focus();
                window.setTimeout(function() {
                    storeQueryInSession();
                }, 50)
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
            $(settings['container']).children('div[contenteditable]').on('keydown', function (event) {
                var text = $(this).text();
                // enter
                if (event.which == 13) {
                    if(text == '') {
                        $(this).closest('form').submit();
                    }
                    $(this).text('');
                    event.preventDefault();
                }
                // backspace
                if ((event.which == 8) && (text == '')) {
                    addFacetAutocomplete(this);
                    $(this).prev().remove();

                }
            });

            $(settings['container']).on('click', '.token-wrapper .btn', function() {
               $(this).parent().remove();
            });
        }
    });
})(jQuery);

$( document ).ready(function() {
    $().advancedSearch();
});