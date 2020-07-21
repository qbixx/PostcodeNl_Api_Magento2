define([
    'Magento_Ui/js/form/components/group',
    'jquery',
    'Flekto_Postcode/js/postcode_autofill_client',
    'uiRegistry',
    'domReady!'
], function (Abstract, $, postcodenl, registry) {
    'use strict';

    return Abstract.extend({

        streetFieldSelector: "[name='street[0]']",
        countryFieldSelector: "[name='country_id']",
        autocomplete: null,
        currentStreetElement: null,
        currentCountryElement: null,
        fieldsScope: null,
        internationalAutocompleteActive: false,
        lookupTimeout: 0,
        enableDisableFieldsNl: ['[name^="street["][name$="]"]', "[name='city']", "[name='postcode']", "[name='region']"],
        enableDisableFieldsInt: ['[name^="street["][name$="]"]:not([name="street[0]"])', "[name='city']", "[name='postcode']", "[name='region']"],


        initialize: function () {

            this._super();
            var that = this;

            if (that.getSettings().enabled == 1) {

                registry.async(this.provider)(function () {
                    that.initModules();
                    that.initWatcher();
                });
            }

            return this;
        },


        initWatcher: function () {

            var that = this;

            $(document).ready(function(e){

                $(document).on('change', '[name="country_id"]', function() {

                    var dropdownEl = this;

                    // make sure field is set.
                    setTimeout(function() {

                        that.logDebug(dropdownEl);
                        that.logDebug('country changed');
                        that.logDebug("nl_input_behavior: ", that.getSettings().nl_input_behavior);
                        that.logDebug("selected country: ", $("[name='country_id']:visible :selected ").text());
                        that.logDebug($(dropdownEl).val());

                        that.updateFocusForm(dropdownEl);

                        var countriesArr = JSON.parse(that.getSettings().supported_countries);
                        that.internationalAutocompleteActive = false;
                        that.disableInternationalAutocomplete();
                        that.disableNlPostcodeWatcher();

                        document.addEventListener('autocomplete-xhrerror', function (e) {
                            that.logDebug('XHR Error!', e);
                            that.enableDisableFields('show');
                        });

                        if (that.getSettings().nl_input_behavior == 'zip_house' && $(dropdownEl).val() == 'NL') {

                            that.logDebug('zip_house init');
                            that.initNlPostcodeWatcher();
                            that.enableDisableFields('hide');

                        } else {

                            if (jQuery.inArray($(dropdownEl).val(), countriesArr) !== -1) {

                                that.logDebug('free input init');

                                that.enableInternationalAutocomplete();
                                that.initFreeInputWatcher();
                                that.enableDisableFields('hide');

                            }
                        }

                    }, 200);

                });
            });

        },


        updateFocusForm: function(el) {

            var form = $(el).closest('form');
            this.logDebug('updateFocusForm', form);

            if (form) {
                this.fieldsScope = form;
                this.currentStreetElement = $(form).find("[name='street[0]']").get(0);
                this.currentCountryElement = $(form).find("[name='country_id']").get(0);
            }
        },


        initNlPostcodeWatcher: function() {

            this.logDebug('initNlPostcodeWatcher');

            if (this.fieldsScope.find('.flekto_nl_zip').length == 0) {

                var currentTimestamp = $.now();
                var that = this;
                var lookupTimeout = 0;




           




                this.fieldsScope.find('div[name$=".postcode"]')
                    .clone()
                    .removeAttr('data-bind')
                    .prop('id', 'flekto_nl_zip_'+currentTimestamp)
                    .prop('name', 'flekto_nl_zip_'+currentTimestamp)
                    .removeClass('_error')
                    .addClass('flekto_nl_zip')
                    .insertAfter(this.fieldsScope.find('div[name$=".country_id"]'));

                this.fieldsScope.find('.flekto_nl_zip').find('.warning').remove();
                this.fieldsScope.find('.flekto_nl_zip').find('.field-error').remove();
                this.fieldsScope.find('.flekto_nl_zip').find('span').text(this.getTranslations().flekto_nl_zip_label);

                var inputEl = this.fieldsScope.find('#flekto_nl_zip_'+currentTimestamp)
                    .find('input')
                    .attr('id', 'flekto_nl_zip_input_'+currentTimestamp)
                    .attr('name', 'flekto_nl_zip_input')
                    .attr('placeholder', this.getTranslations().flekto_nl_zip_placeholder)
                    .removeAttr('data-bind')
                    .prop('disabled', false)
                    .addClass('flekto_nl_zip_input')
                    .val('');

                $(inputEl).on('keyup', {scope: this}, this.delayGetNlPostcodeAddressZip);
                $(inputEl).on('blur', {scope: this}, this.getNlPostcodeAddressZip);
                $(inputEl).on('focus', function() {
                    that.updateFocusForm(inputEl);
                });



console.log("I am here14");
                    this.fieldsScope.find('div[name$=".city"]')
                    .clone()
                    .removeAttr('data-bind')
                    .prop('id', 'flekto_nl_house_'+currentTimestamp)
                    .prop('name', 'flekto_nl_house_'+currentTimestamp)
                    .removeClass('_error')
                    .addClass('flekto_nl_house')
                    .insertBefore(this.fieldsScope.find('div[name$=".city"]'));

                this.fieldsScope.find('.flekto_nl_house').find('.warning').remove();
                this.fieldsScope.find('.flekto_nl_house').find('.field-error').remove();
                this.fieldsScope.find('.flekto_nl_house').find('span').text(this.getTranslations().flekto_nl_house_label);


                var inputEl = this.fieldsScope.find('#flekto_nl_house_'+currentTimestamp)
                    .find('input')
                    .attr('id', 'flekto_nl_house_input_'+currentTimestamp)
                    .attr('name', 'flekto_nl_house_input')
                    .attr('placeholder', this.getTranslations().flekto_nl_house_placeholder)
                    .removeAttr('data-bind')
                    .prop('disabled', false)
                    .addClass('flekto_nl_house_input')
                    .val('');

                $(inputEl).on('keyup', {scope: this}, this.delayGetNlPostcodeAddress);
                $(inputEl).on('blur', {scope: this}, this.getNlPostcodeAddress);
                $(inputEl).on('focus', function() {
                    that.updateFocusForm(inputEl);
                });


            }
        },


        disableNlPostcodeWatcher: function() {
            this.fieldsScope.find('.flekto_nl_zip').remove();
            this.logDebug('disableNlPostcodeWatcher');

            this.enableDisableFields('show');
        },


        delayGetNlPostcodeAddress: function (event) {

            var that = event.data.scope;

            that.logDebug('delayGetNlPostcodeAddress');

            clearTimeout(that.lookupTimeout);
            that.lookupTimeout = setTimeout(function() {
                that.getNlPostcodeAddress(event);
            }, 750, event);
        },

        delayGetNlPostcodeAddressZip: function (event) {

            var that = event.data.scope;

            that.logDebug('delayGetNlPostcodeAddress');

            clearTimeout(that.lookupTimeout);
            that.lookupTimeout = setTimeout(function() {
                that.getNlPostcodeAddressZip(event);
            }, 750, event);
        },


        getNlPostcodeAddressZip: function(event) {

            var that = event.data.scope;

            that.logDebug('getNlPostcodeAddress', event);

            var input = jQuery(event.target);
            var addressContainer = that.fieldsScope;
            var query = input.val();

            if (query.length < 6 || query.length > 6) {

                // No postcode and house number found
                if (!input.is(':focus')) {
                    $(addressContainer).find('.postcodenl-address-autocomplete-warning').remove();
                    input.after('<span class="postcodenl-address-autocomplete-warning">' + that.getTranslations().flekto_nl_zip_warning + '</span>');
                }
                return;
            }
            if (query.length == 6) {

                // No postcode and house number found
                if (!input.is(':focus')) {
                    $(addressContainer).find('.postcodenl-address-autocomplete-warning').remove();
                }
                return;
            }

        },

        getNlPostcodeAddress: function(event) {

            var that = event.data.scope;

            that.logDebug('getNlPostcodeAddress', event);

            var input = jQuery(event.target);
            var addressContainer = that.fieldsScope;



            /*var query = input.val();
            var regex = /([1-9][0-9]{3}\s?[a-z]{2})\s?(\d+.*)/i;
            var addressData = query.match(regex);*/

            /*if (!addressData || addressData.length < 3) {

                // No postcode and house number found
                if (query.length > 7 || !input.is(':focus')) {
                    $(addressContainer).find('.postcodenl-address-autocomplete-warning').remove();
                    input.after('<span class="postcodenl-address-autocomplete-warning">' + that.getTranslations().flekto_nl_house_warning + '</span>');
                }
                return;
            }*/

            input.addClass('postcodenl-address-autocomplete-loading');

            //var postcode = addressData[1];
            //var houseNumber = addressData[2];

            var postcode = $("input[name=flekto_nl_zip_input]").val();

            var houseNumber = $("input[name=flekto_nl_house_input]").val();


            jQuery.get(that.getSettings().base_url+'rest/V1/flekto/postcode-international/nlzipcode/' + postcode + '/' + houseNumber, function(response) {

                response = response[0];

                $('.postcodenl-address-autocomplete-warning').remove();

                if (response.error && response.message_details) {
                    $(that.fieldsScope).find('.flekt_nl_zip_houseNumberAdditions').remove();
                    input.after('<span class="postcodenl-address-autocomplete-warning">' + response.message_details + '</span>');
                    return;
                }

                var responseData = response.response;
                that.logDebug(responseData);

                $(addressContainer).find('[name="city"]').val(responseData.city).change();
                $(addressContainer).find('[name="postcode"]').val(responseData.postcode).change();
                $(addressContainer).find('[name="region"]').val(responseData.province).change();

                var addressString = responseData.street + ' ' + responseData.houseNumber + (' ' + (responseData.houseNumberAddition ? responseData.houseNumberAddition : ''));
                $(that.currentStreetElement).val(addressString).change();

                if (responseData.houseNumberAdditions.length > 1) {

                    that.logDebug(responseData.houseNumberAdditions);

                    $(that.fieldsScope).find('.flekt_nl_zip_houseNumberAdditions').remove();
                    var appendHouseNumberAdditions = '<select name="flekt_nl_zip_houseNumberAdditions" class="flekt_nl_zip_houseNumberAdditions">';

                    jQuery.each(responseData.houseNumberAdditions, function(i, obj) {
                        appendHouseNumberAdditions += '<option value="' + obj + '">' + obj + '</option>';
                    });

                    appendHouseNumberAdditions += '</select>';
                    input.after(appendHouseNumberAdditions);

                    $(that.fieldsScope).find('.flekt_nl_zip_houseNumberAdditions').on('change', function() {
                        $(that.currentStreetElement).val(addressString+' '+this.value).change();
                    });

                } else {
                    $(that.fieldsScope).find('.flekt_nl_zip_houseNumberAdditions').remove();
                }

                that.enableDisableFields('show');

            }).always(function() {

                input.removeClass('postcodenl-address-autocomplete-loading');
                that.enableDisableFields('show');

            });

        },


        initFreeInputWatcher: function() {

            this.logDebug('initFreeInputWatcher');

            var that = this;
            $(this.fieldsScope).on('focus', "[name='street[0]']", function() {

                that.updateFocusForm(this);

                if ($(that.fieldsScope).data('int-autocomplete') != '1') {
                    that.disableInternationalAutocomplete();
                    return;
                }

                that.initPostcodeAutocompleteLibrary();
            });
        },


        initPostcodeAutocompleteLibrary: function () {

            this.logDebug('initPostcodeAutocompleteLibrary');

            var that = this;
            this.enableInternationalAutocomplete();

            $(that.streetFieldSelector).each(function(i, obj) {

                if (!$(this).hasClass('postcodenl-autocomplete-address-input')) {

                    that.autocomplete = new PostcodeNl.AutocompleteAddress($(this).get(0), {
                        autocompleteUrl: that.getSettings().base_url+'rest/V1/flekto/postcode-international/autocomplete',
                        addressDetailsUrl: that.getSettings().base_url+'rest/V1/flekto/postcode-international/getdetails',
                        context: $(that.currentCountryElement).children('option:selected').val()
                    });


                    $(this).get(0).addEventListener('autocomplete-select', function (e) {

                        if (e.detail.precision === 'Address') {

                            that.autocomplete.getDetails(e.detail.context, function (result) {
                                result = result[0].response;
                                $(that.fieldsScope).find('[name="city"]').val(result.address['locality']).change();
                                $(that.fieldsScope).find('[name="postcode"]').val(result.address['postcode']).change();
                                $(that.currentStreetElement).val(result.address['street']+" "+result.address['building']).change();
                            });

                            that.enableDisableFields('show');
                        }
                    });

                } else {

                    if (that.autocomplete.options.context != $(that.currentCountryElement).children('option:selected').val().toLowerCase()) {
                        that.autocomplete.setCountry($(that.currentCountryElement).children('option:selected').val());
                    }
                }
            });
        },


        preventDefaultFunc: function (event) {
            event = event || null;
            if (event !== null) {
                event.preventDefault();
            }
        },


        enableInternationalAutocomplete: function () {

            this.logDebug('enableInternationalAutocomplete');
            this.currentStreetElement.removeEventListener('autocomplete-menubeforeopen', this.preventDefaultFunc);
            this.currentStreetElement.removeEventListener('autocomplete-search', this.preventDefaultFunc);
            $(this.fieldsScope).data('int-autocomplete', '1');
        },


        disableInternationalAutocomplete: function () {

            this.logDebug('disableInternationalAutocomplete');
            this.currentStreetElement.addEventListener('autocomplete-menubeforeopen', this.preventDefaultFunc, false);
            this.currentStreetElement.addEventListener('autocomplete-search', this.preventDefaultFunc, false);
            $(this.fieldsScope).data('int-autocomplete', '0');
        },


        enableDisableFields: function(endis) {

            if (this.getSettings().show_hide_address_fields != 'show') {

                var fields = this.enableDisableFieldsInt;
                if (this.fieldsScope.find('.flekto_nl_zip').length || endis == 'show') {
                    fields = this.enableDisableFieldsNl;
                }

                if (endis == 'show') {
                    this.logDebug('Show input fields', fields.toString());
                } else {
                    this.logDebug('Hide input fields', fields.toString());
                }

                var that = this;
                jQuery.each(fields, function(index, selector) {

                    if (that.getSettings().show_hide_address_fields == 'disable') {
                        $(that.fieldsScope).find(selector).prop("disabled", ((endis == 'show') ? false : true));

                    } else if (that.getSettings().show_hide_address_fields == 'hide') {

                        if (endis == 'show') {
                            $(that.fieldsScope).find(selector).closest("div.field").show();
                            $(that.fieldsScope).find(selector).closest("fieldset.field").show();

                        } else {

                            $(that.fieldsScope).find(selector).closest("div.field").hide();
                            if (that.fieldsScope.find('.flekto_nl_zip').length) {
                                $(that.fieldsScope).find(selector).closest("fieldset.field").hide();
                            }
                        }
                    }


                });

            }
        },


        getSettings: function () {
            var settings = window.checkoutConfig.flekto_postcode.settings;
            return settings;
        },


        getTranslations: function () {
            return this.getSettings().translations;
        },


        logDebug: function(...params) {
            if (this.getSettings().debug) {
                console.log(...params);
            }
        }

    });

});