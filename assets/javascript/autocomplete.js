// Autocomplete object must be a global variable
var autocomplete;

/**
 * Fill in address components with auto-completed values.
 */
function fillInAddress() {
    let place = autocomplete.getPlace();
    let streetAddress = "";

    for (let component of place.address_components) {
        let componentType = component.types[0];
        switch (componentType) {
            case "street_number": {
                streetAddress = `${component.long_name} ${streetAddress}`;
                break;
            }
            case "route": {
                streetAddress += component.short_name;
                break;
            }
            case "postal_code": {
                document.getElementById("input-zip").value = component.long_name;
                break;
            }
            case "locality": {
                document.getElementById("input-city").value = component.long_name;
                break;
            }
            case "administrative_area_level_1": {
                // Not actually selecting the option - tried doing so, but doesn't work.
                // Workaround: updates the text and then sends selected value to next page.
                document.getElementById("input-state").value = component.long_name;
                document.getElementById(component.short_name).selected = true;
                break;
            }
        }
    }

    document.getElementById("input-street").value = streetAddress;
}

/**
 * If there is an error with accessing the Google Places Autocomplete API,
 * replace the autocomplete object with a regular input field. Checks every 10s.
 */
 function checkForAutocompleteErrors(inputField) {
    let secondsCounter = 0;

    let googleErrorCheckinterval = setInterval(function () {
        if (inputField.classList.contains("gm-err-autocomplete")) {
            inputField.outerHTML = 
                "<input class='usa-input' id='input-street' aria-labelledby='myStreetAddress' \
                name='input-street' type='text' onkeypress='return event.keyCode != 13;' \
                oninvalid='this.setCustomValidity(\x22Please fill out the street address field.\x22)' \
                oninput='this.setCustomValidity(\x22\x22)' required/>";
            clearInterval(googleErrorCheckinterval);
        }

        secondsCounter++;
        if (secondsCounter === 10){
            clearInterval(googleErrorCheckinterval);
        }
    }, 1000);
}

/**
 * Set up the Google Places Autocomplete feature.
 */
function load() {
    let inputStreet = document.getElementById("input-street");
    let options = {
        componentRestrictions: {country: "us"},
        fields: ["address_components"],
        types: ["address"],
    };

    autocomplete = new google.maps.places.Autocomplete(inputStreet, options);
    autocomplete.addListener("place_changed", fillInAddress);

    checkForAutocompleteErrors(inputStreet);
}
