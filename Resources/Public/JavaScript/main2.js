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
        settings.container = this;

        $(element).on('click', '.label .glyphicon', function() {
            $(this).parent().remove();
            window.setTimeout(function() {
                storeQueryInSession();
            }, 100);
        });

        $(element).find('.form-control').autocomplete(
            {
                source:'',
                minLength: 0
            }
        ).focus(function () {
                $(element).autocomplete('search', $(element).text());
            }
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
                        }
                    }
                );
            },
            50
        );
        console.log('send ' + getTerm(settings.container));
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

    function getTerm(element) {
        var query = [];
        $.each($(this).children('.label'), function(key, value) {
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


}( jQuery ));

$( document ).ready(function() {
    $('.visualsearch').visualsearch();
});