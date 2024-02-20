$(document).ready(function() {
    $(".navbar-burger").click(function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
});

$(function() {
    $('.tabs ul').on('click', 'li[data-tab]', function() {
        var el = $(this);

        $('.tabs ul li[data-tab]').removeClass('is-active');
        el.addClass('is-active');

        var tabContentID = el.attr('data-tab');
        $('[data-tab-content]').removeClass('is-active');

        $('[data-tab-content]').each(function() {
            $(this).css('display', 'none');
        });

        $('#' + tabContentID).addClass('is-active');
        $('#' + tabContentID).css('display', 'block');
    });
});

function chartCitiesFrequency(url){
    $(document).ready(function() {
        jsonData = jQuery.getJSON(url).done(function(data){
            _createCityChart(data);
        })
    });
}

function _createCityChart(content){
    const ctx = document.getElementById('chartCitiesFrequency');

    var labels = [];
    var values = [];

    for (var key in content['Frequency']) {
        country_state_city = key.split(',');
        var city = country_state_city.pop();
        var country = country_state_city.shift();
        if (country == 'Brasil') {
            country = 'BR';
        }
        if (country == 'United States') {
            country = 'US';
        }
        var city_country = city + '/' + country;

        labels.push(city_country);
        values.push(content['Frequency'][key]);
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency',
                data: values,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function tableAndChartTagsCategories(url, tableElementID, chartElementID){
    $(document).ready(function() {
        jsonData = jQuery.getJSON(url).done(function(data){
            _createTagsTable(data, tableElementID);
            _createCategoriesChart(data, chartElementID)
        })
    });
}

function toTitle(text) {
    var titledText = text.charAt(0).toUpperCase() + text.slice(1);
    var noUnderscoreText = titledText.replaceAll("_", ' ');
    return noUnderscoreText;
}

function _createTagsTable(content, elementID) {
    var htmlTable = '<table class="table is-striped is-fullwidth"><thead><tr><th>Category/Tag</th><th>Frequency</th></tr></thead><tbody>';

    for (var key in content["Frequency"]) {
        key_els = key.split(',');
        tag = toTitle(key_els.pop());
        category = toTitle(key_els.pop());

        htmlTable += '<tr>';
        htmlTable += '<td>' + tag + ' <span class="tag is-rounded is-info is-light">' + category + '</span></td>';
        htmlTable += '<td>' + content["Frequency"][key] + '</td>';
        htmlTable += '</tr>';
    }

    htmlTable += '</tr></thead><tbody>';

    for (var i = 0; i < content.length; i++) {
        htmlTable += '<tr>';
        for (var key in content[i]) {
            htmlTable += '<td>' + content[i][key] + '</td>';
        }
        htmlTable += '</tr>';
    }

    htmlTable += '</tbody></table>';

    $(elementID).html(htmlTable);
}

function _createCategoriesChart(content) {
    const ctx = document.getElementById('chartCategoriesFrequency');

    var data = {};

    for (var key in content['Frequency']) {
        category_and_tag = key.split(',');
        var cat_name = toTitle(category_and_tag.shift());
        var cat_val = content['Frequency'][key];
        var current_value = data[cat_name] | 0;
    
        data[cat_name] = current_value + cat_val;
    }

    labels = [
        'Adjacent road type',
        'Obstacles',
        'Pavement condition',
        'Sidewalk geometry',
        'Sidewalk structure',
        'Surface tpe',
    ]

    values = [
        data['Adjacent road type'],
        data['Obstacles'],
        data['Pavement condition'],
        data['Sidewalk geometry'],
        data['Sidewalk structure'],
        data['Surface type'],
    ]

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency',
                data: values,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function mapPlaces(url, elementID){
        $(document).ready(function() {
        jQuery.get(url).done(function(data){
            var iFrame = $(elementID);
            var iFrameDoc = iFrame[0].contentDocument || iFrame[0].contentWindow.document;
            iFrameDoc.write(data);
            iFrameDoc.close();
        })
    });
}