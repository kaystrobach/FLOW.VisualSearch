(function( $ ) {
    var settings = [];
    var ajaxTimeout = NaN;

    /**
     * Main function
     *
     * @returns {*}
     */
    $.fn.visualsearch = function() {
        return this.each(function() {
            convertQueryJsonToHtml(this);
            initialize(this);

        });
    };

    /**
     * initialize all the stuff
     */
    function initialize(element) {
        settings.container = element;
        settings.formfield = $(element).find('.form-control');
        settings.facetarea = $(element).find('.visual-search-facets');
        settings.ajaxArea = '#search-result-area';
        settings.loadingContent = '<span class="visual-search-loading-spinner"><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">Waiting</span></div></div></span>';

        $(element).on('click', '.label .glyphicon', function() {
            $(settings.formfield).val('');
            $(this).parent().remove();
            window.setTimeout(function() {
                storeQueryInSession();
            }, 100);
        });

        // bind basic autocomplete
        $(element).find('.form-control').autocomplete(
            {
                source:[],
                minLength: 0
            }
        ).focus(function(){
            $(this).trigger('keydown');
        });

        $(settings.formfield).on(
            'keyup',
            function(event) {
                var text = $(settings.formfield).val();
                if(event.which === 13) {
                    if($(settings.formfield).autocomplete('option', 'disabled')) {
                        setValue(text, text);
                        storeQueryInSession();
                        $(this).val('');
                        event.preventDefault();
                    } else if(text == '') {
                        $(this).closest('form').submit();
                        $(this).val('');
                        event.preventDefault();
                    }
                }
                // backspace
                if ((event.which == 8) && (text == '')) {
                    addFacetAutocomplete(this);
                    $(settings.facetarea).children().last().remove();
                    $(settings.formfield).blur();
                    $(settings.formfield).focus();
                    window.setTimeout(function() {
                        storeQueryInSession();
                    }, 100)

                }
            }
        );

        $(element).find('.btn-clear').on(
            'click',
            function() {
                $(settings.facetarea).children().remove();
                $(settings.formfield).val('');
                storeQueryInSession();
                window.setTimeout(
                    function() {
                        addFacetAutocomplete($(element).find('.form-control'));
                    },
                    300
                );
            }
        );

        window.setTimeout(
            function() {
                addFacetAutocomplete($(element).find('.form-control'));
            },
            300
        );

    }

    /**
     * send the query to the server and store it
     */
    function storeQueryInSession() {
        clearTimeout(ajaxTimeout);
        if($(settings['ajaxArea']).length) {
            $(settings['ajaxArea']).html(settings['loadingContent']);
        }
        ajaxTimeout = window.setTimeout(
            function() {
                $.ajax(
                    {
                        dataType: "json",
                        url: $(settings['container']).attr('data-storeQueryAction'),
                        data: {
                            query: getTerm(settings.container)
                        },
                        complete: function(data) {
                            if($(settings['ajaxArea']).length) {
                                $(settings['ajaxArea']).load(window.location.href + ' ' + settings['ajaxArea'] + ' > *');
                            }
                            addFacetAutocomplete($(settings.formfield));
                        }
                    }
                );
            },
            50
        );
    }

    /**
     * is used on init to display the facets
     * @param element
     */
    function convertQueryJsonToHtml(element) {
        var query = $.parseJSON($(element).attr('data-query'));
        $.each(
            query,
            function(key, value) {
                $(element).find('.visual-search-facets').append(getFacet(value));
            }
        );

    }

    /**
     * render a facet
     *
     * @param value
     * @returns {string}
     */
    function getFacet(value) {
        return '<span class="label label-default"><span class="token token-facet" data-facet="' + value.facet + '">' + value.facetLabel + '</span>: <span class="token token-value" data-value="' + value.value + '">' + value.valueLabel + '</span> <span class="glyphicon glyphicon-remove"></span></span> ';
    }

    /**
     * sets the last value
     * @param value
     * @param label
     */
    function setValue(value, label) {
        $(settings.facetarea).children().last().children('[data-value]').attr('data-value', value);
        $(settings.facetarea).children().last().children('[data-value]').html(label);
        $(settings.formfield).val('');

    }

    /**
     * extracts the query from the dom
     * @param element
     * @returns {Array}
     */
    function getTerm(element) {
        var query = [];
        $.each($(element).find('.label'), function(key, value) {
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
    }

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
                            query: getTerm(settings.container)
                        },
                        success: function(data) {
                            response(data);
                        }
                    });
                },
                select: function( event, ui ) {
                    var value = {
                        facetLabel:ui.item.label,
                        facet:ui.item.value,
                        valueLabel:'',
                        value:''
                    };
                    $(settings.facetarea).append(getFacet(value));
                    $(settings.formfield).text('');
                    if(ui.item.configuration.freeInput) {
                        addValueFreeText(element);
                    } else {
                        addValueAutocomplete(element);
                    }
                    $(element).val('');
                    window.setTimeout(function() {
                        // @todo add handling for disabled autocomplete
                        //if(ui.item.configuration.freeInput) {
                        //    $(element).autofocus('disable');
                        //}
                        $(element).focus();
                    }, 50);
                    return false;
                },
                focus: function (event, ui) {
                    event.preventDefault();
                    $(this).val(ui.item.label);
                },
                close: function( event, ui ) {
                    $(element).val('');
                }
            }
        );
    }

    /**
     * gets an element and add a value to a given facet
     * @param element
     */
    function addValueAutocomplete(element) {
        if($(element).autocomplete('instance')) {
            $(element).autocomplete('enable');
        }
        $(element).attr('data-type', 'value');

        $(element).autocomplete(
            'option',
            {
                source: function(request, response) {
                    $.ajax(
                        {
                            dataType: "json",
                            url: $(settings['container']).attr('data-valueAction'),
                            data: {
                                facet: $(settings.facetarea).children().last().children('[data-facet]').attr('data-facet'),
                                term: request.term,
                                query: getTerm(settings.container)
                            },
                            success: function(data) {
                                response(data);
                            }
                        }
                    );
                },
                select: function (event, ui) {
                    setValue(ui.item.value, ui.item.label);
                    addFacetAutocomplete(element);
                    window.setTimeout(
                        function() {
                            $(element).focus();
                        },
                        50
                    );

                    storeQueryInSession();
                    return false;
                },
                close: function( event, ui ) {
                    $(element).val('');
                }
            }
        );
    }

    function addValueFreeText(element) {
        if($(element).autocomplete('instance')) {
            $(element).autocomplete('disable');
        }

        $(element).attr('data-type', 'value');
    }


}( jQuery ));

$( document ).ready(function() {
    $('.visualsearch').visualsearch();
});
