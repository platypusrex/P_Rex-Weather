(function(){
    var getWeather = function(location){
        var geoLocateUrl = 'http://www.geoplugin.net/json.gp?jsoncallback=?';
        var location;

        var locationStr = function(loc){
            var state = '';
            var city = '';

            for(var i = 0; i < loc.length; i++){
                if((i + 1) === loc.length){
                    state = loc[i] + '/';
                } else if((i + 1) === (loc.length - 1)){
                    city += loc[i];} else {
                    city += loc[i] + '_';
                }
            }
            return state + city;
        };

        var getWeatherUrl = function(location){
            if($('#f_elem_city').val() === ''){
                var weatherUrl = 'http://api.wunderground.com/api/05d4502012923d4a/geolookup/conditions/forecast/almanac/astronomy/q/'+location.latitude+','+location.longitude+'.json';
            } else {
                location = $('#f_elem_city').val().replace(',', '').split(' ');
                var weatherUrl = 'http://api.wunderground.com/api/05d4502012923d4a/geolookup/conditions/forecast/almanac/astronomy/q/'+locationStr(location)+'.json';
            }

            return weatherUrl;
        };

        var getWeatherConditions = function(res){
            return {
                weather: res.current_observation.weather,
                location: res.current_observation.display_location.full,
                lastUpdate: res.current_observation.observation_time,
                currentConditionsIcon: res.current_observation.icon_url,
                currentTempF: res.current_observation.temp_f,
                currentTempC: res.current_observation.temp_c,
                feelsLikeTempF: res.current_observation.feelslike_f,
                feelsLikeTempC: res.current_observation.feelslike_c,
                windDirection: res.current_observation.wind_dir,
                windSpeedMph: res.current_observation.wind_mph,
                windSpeedKph: res.current_observation.wind_kph,
                windString: res.current_observation.wind_string,
                humidity: res.current_observation.relative_humidity,
                pressure: res.current_observation.pressure_in,
                pressureTrend: res.current_observation.pressure_trend,
                visibilityMi: res.current_observation.visibility_mi,
                visibilityKm: res.current_observation.visibility_km,
                dewpointF: res.current_observation.dewpoint_f,
                dewpointC: res.current_observation.dewpoint_c,
                dewpointString: res.current_observation.dewpoint_string,
                precipToday: res.current_observation.precip_today_string,
                precipHour: res.current_observation.precip_1hr_string,
                uv: res.current_observation.UV
            };
        };

        var getWeatherForecast = function(forecast, forecastExt, res){
            var simpleForecastData = [];
            var extendedForecastFirst = [];
            var extendedForecastLast = [];
            for(var i = 0; i < forecast; i++){
                simpleForecastData.push(res.forecast.simpleforecast.forecastday[i].date.weekday);
                simpleForecastData.push(res.forecast.simpleforecast.forecastday[i].icon_url);
                simpleForecastData.push(res.forecast.simpleforecast.forecastday[i].conditions);
                simpleForecastData.push(res.forecast.simpleforecast.forecastday[i].avewind.dir + ' ' + res.forecast.simpleforecast.forecastday[i].avewind.mph + ' ' + 'mph');
                simpleForecastData.push(res.forecast.simpleforecast.forecastday[i].high.fahrenheit + '&deg;F' + ' / ' + res.forecast.simpleforecast.forecastday[i].low.fahrenheit + '&deg;F');
                simpleForecastData.push(res.forecast.simpleforecast.forecastday[i].avehumidity + '%');
            }

            for(var i = 0; i < forecastExt; i++){
                if(i % 2 === 0){
                    extendedForecastFirst.push([res.forecast.txt_forecast.forecastday[i].title, res.forecast.txt_forecast.forecastday[i].icon_url, res.forecast.txt_forecast.forecastday[i].icon, res.forecast.txt_forecast.forecastday[i].pop + "% chance", res.forecast.txt_forecast.forecastday[i].fcttext]);
                }else {
                    extendedForecastLast.push([res.forecast.txt_forecast.forecastday[i].title, res.forecast.txt_forecast.forecastday[i].icon_url, res.forecast.txt_forecast.forecastday[i].icon, res.forecast.txt_forecast.forecastday[i].pop + "% chance", res.forecast.txt_forecast.forecastday[i].fcttext]);
                }
            }

            return {
                simple: {
                    dataPerDay: simpleForecastData
                },
                extended: {
                    dataFirst: extendedForecastFirst,
                    dataLast: extendedForecastLast
                }
            };
        };

        var buildCurrentConditionDiv = function(weatherData){
            $('.location').html(weatherData.location + ' ' + 'Weather');
            $('.last-update').html(weatherData.lastUpdate);
            $('.current-condition-icon').attr({
                src: weatherData.currentConditionsIcon,
                title: 'Current Conditions Icon',
                alt: 'Current Conditions Icon'
            });
            $('.condition').html(weatherData.weather);
            $('.actual-temp').html(weatherData.currentTempF + '<span>&deg;F</span>');
            $('.feels-like').html('Feels Like ' + weatherData.feelsLikeTempF + '&deg;F');
            $('.wind').html(weatherData.windDirection + ' ' + weatherData.windSpeedMph + ' mph');
            $('.humidity').html(weatherData.humidity);
            $('.pressure').html(weatherData.pressure + ' in');
            $('.visibility').html(weatherData.visibilityMi + ' mi');
            $('.uv').html(weatherData.uv + ' of 10');
            $('.dewpoint').html(weatherData.dewpointString);
            $('.precip-today').html(weatherData.precipToday);
            $('.precip-hour').html(weatherData.precipHour);
        };

        var buildSimpleForecastTable = function(forecast){
            $('.table').find('tr td').each(function(i){
                if($(this).hasClass('forecast-icon')){
                    $(this).find('img').attr({
                        src: forecast.simple.dataPerDay[i],
                        title: 'Current Conditions Icon',
                        alt: 'Current Conditions Icon'
                    });
                } else {
                    $(this).find('p').html(forecast.simple.dataPerDay[i]);
                }
            });
        };

        var buildExtendedForecastDivs = function(forecast){
            $('.forecast-extended').find('.forecast-first').each(function(i){
                $(this).find('.day').html(forecast.extended.dataFirst[i][0]);
                $(this).find('.forecast-condition-icon').attr('src', forecast.extended.dataFirst[i][1]);
                $(this).find('.forecast-condition').html(forecast.extended.dataFirst[i][2]);
                $(this).find('.precip-chance').html(forecast.extended.dataFirst[i][3]);
                $(this).find('.forecast-text').html(forecast.extended.dataFirst[i][4]);
            });

            $('.forecast-extended').find('.forecast-last').each(function(i){
                $(this).find('.day').html(forecast.extended.dataLast[i][0]);
                $(this).find('.forecast-condition-icon').attr('src', forecast.extended.dataLast[i][1]);
                $(this).find('.forecast-condition').html(forecast.extended.dataLast[i][2]);
                $(this).find('.precip-chance').html(forecast.extended.dataLast[i][3]);
                $(this).find('.forecast-text').html(forecast.extended.dataLast[i][4]);
            });
        };

        var onPageLoad = function(){
            $.ajax({
                type: 'GET',
                url: geoLocateUrl,
                dataType: 'json',
                success: function(res){
                    var location = {
                        city: res.geoplugin_city,
                        state: res.geoplugin_region,
                        country: res.geoplugin_countryCode,
                        latitude: res.geoplugin_latitude,
                        longitude: res.geoplugin_longitude
                    };
                    $.ajax({type: 'GET',
                        url: getWeatherUrl(location),
                        dataType: 'json',
                        success: function(res){
                            var weatherData = getWeatherConditions(res);
                            var forecastLength = res.forecast.simpleforecast.forecastday.length;
                            var forecastLengthExt = res.forecast.txt_forecast.forecastday.length;
                            var forecast = getWeatherForecast(forecastLength, forecastLengthExt, res);
                            var flickrProjectWeatherUrl = 'https://api.flickr.com/services/rest/?&method=flickr.groups.pools.getPhotos&api_key=96c33396d0a10aeae7f023a680eacc4c&group_id=1463451@N25&tags=' + '"'+weatherData.weather+'"' + '&format=json&jsoncallback=?';
                            buildCurrentConditionDiv(weatherData);
                            buildSimpleForecastTable(forecast);
                            buildExtendedForecastDivs(forecast);

                            $.ajax({
                                type: 'GET',
                                url: flickrProjectWeatherUrl,
                                dataType: 'json',
                                success: function(res){
                                    var photosLength = res.photos.photo.length;
                                    var id = res.photos.photo[Math.floor(Math.random() * photosLength)].id;
                                    var flickrLargePhoto = 'https://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key=96c33396d0a10aeae7f023a680eacc4c&photo_id=' + id + '&format=json&jsoncallback=?';

                                    $.ajax({
                                        type: 'GET',
                                        url: flickrLargePhoto,
                                        dataType: 'json',
                                        success: function(res){
                                            $('body').css({'background': 'url('+res.sizes.size[8].source+') no-repeat fixed center center / cover'});
                                        },
                                        error: function(err){
                                            console.log(err);
                                        }
                                    });
                                },
                                error: function(err){
                                    console.log(err);
                                }
                            });
                        },
                        error: function(err){
                            console.log(err);
                            $('.weather-container').hide();
                            $('.error').show();
                            $('.alert-container').find('.lead').html('We are currently experiencing issues with the Wunderground API. We\'re working on this problem. Please try again later.')
                        }
                    })
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
        onPageLoad();
    };
    getWeather();

    $('.btn-container').find('.btn-default').click(function(){
        $(this).closest('.current-conditions').hide('puff').promise().done(function(){
            $('.current-details').show('drop', {
                direction: 'up'
            });
        });
    });

    $('.close-details').find('.fa-close').click(function(){
        $('.current-details').hide('puff').promise().done(function(){
            $('.current-conditions').show('drop', {
                direction: 'up'
            });
        });
    });

    $('.table tbody').find('tr').each(function(i){
        $(this).on('click', function(){
            $('.short-forecast').slideUp('fast').promise().done(function(){
                $($('.forecast-extended')[i]).slideDown('fast');
            });
        });
    });

    $('.forecast-extended').each(function(i){
        $(this).on('click', function(){
            $('.forecast-extended').fadeOut('fast').promise().done(function(){
                $('.short-forecast').fadeIn('fast');
            });
        });
    });

    $('.navbar-form').find('.btn').on('click', function(e){
        if($(this).parent().prev().val() === ''){
            e.preventDefault();
        } else {
            getWeather();
        }
    });

    $("#f_elem_city").autocomplete({
        source: function (request, response) {
            $.getJSON(
                "http://gd.geobytes.com/AutoCompleteCity?callback=?&template=<geobytes%20city>,%20<geobytes%20code>&q="+request.term,
                function (data) {
                    response(data);
                }
            );
        },
        minLength: 3,
        select: function (event, ui) {
            var selectedObj = ui.item;
            $("#f_elem_city").val(selectedObj.value);
            getcitydetails(selectedObj.value);
            return false;
        },
        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
    $("#f_elem_city").autocomplete("option", "delay", 100);
}());


