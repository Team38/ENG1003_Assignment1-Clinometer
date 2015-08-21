/**********************************************
EXAMPLE CODE
By Moses Wan (Team Awesome)

This code is for a unit conversion app in which there 3 cards:
- Distance
- Weight
- Result

The "Distance" and "Weight" card is where the amount and the units
are entered in for conversion. They each have a "Calculate" button in which is
pressed to begin conversion. The result of the calculation will appear in the freshly
appearing "Result" card.
***********************************************/

/*
    function dismissResult()
    This function is triggered when the "X" icon is clicked. Used for hiding
    the result card.
*/
function dismissResult()
{
    // Removes the result card's layout from the page completely
    document.getElementById("result-card").style.display = "none";
}

/*
    function calculate_distance()
    This function is triggered when the "Calculate" button is clicked when the "Distance"
    card is showing. Starts the conversion of distance.
*/
function calculate_distance()
{
    // Initialising some local variables
    var distance_in_meters = 0;
    var output;
    var number = document.getElementById("distance-number").value;

    // If the input is not a number, don't do anything
    if(isNaN(number))
    {
        return;
    }

    // Step 1: Convert to a common SI unit (in this case, meters)
    switch(document.getElementById("distance-input").value)
    {
        case "m":
            distance_in_meters = number;
            break;
        case "km":
            distance_in_meters = number * 1000;
            break;
        case "cm":
            distance_in_meters = number / 100;
            break;
        case "mm":
            distance_in_meters = number / 1000;
            break;
        case "ft":
            distance_in_meters = number * 0.3048;
            break;
        case "yd":
            distance_in_meters = number * 0.9144;
            break;
        case "inchs":
            distance_in_meters = number * 0.0254;
            break;
    }

    // Step 2: Convert from meters to the desired unit
    switch(document.getElementById("distance-output").value)
    {
        case "m":
            output = distance_in_meters + " m";
            break;
        case "km":
            output = (distance_in_meters / 1000) + " km";
            break;
        case "cm":
            output = (distance_in_meters * 100) + " cm";
            break;
        case "mm":
            output = (distance_in_meters * 1000) + " mm";
            break;
        case "ft":
            output = (distance_in_meters * 3.2808399).toFixed(3) + " ft";
            break;
        case "yd":
            output = (distance_in_meters * 1.0936133).toFixed(3) + " yd";
            break;
        case "inchs":
            output = (distance_in_meters * 39.3700787).toFixed(3) + " inches";
            break;
    }

    // Write the solution into the result card then show it.
    document.getElementById("result").innerHTML = output;
    document.getElementById("result-card").style.display = "block";
}

/*
    function calculate_weight()
    This function is triggered when the "Calculate" button is clicked when the "Weight"
    card is showing. Starts the conversion of weight.
*/
function calculate_weight()
{
    // Initialising some local variables
    var weight_in_gram = 0;
    var output;
    var number = document.getElementById("weight-number").value;

    // If the input is not a number, don't do anything
    if(isNaN(number))
    {
        return;
    }

    // Step 1: Convert to a common SI unit (in this case, grams)
    switch(document.getElementById("weight-input").value)
    {
        case "g":
            weight_in_gram = number;
            break;
        case "kg":
            weight_in_gram = number * 1000;
            break;
        case "oz":
            weight_in_gram = number / 0.035274;
            break;
        case "lb":
            weight_in_gram = number / 0.00220462;
            break;
        case "st":
            weight_in_gram = number / 0.000157473;
            break;
    }

    // Step 2: Convert from grams to the desired unit
    switch(document.getElementById("weight-output").value)
    {
        case "g":
            output = weight_in_gram + " g";
            break;
        case "kg":
            output = (weight_in_gram / 1000) + " kg";
            break;
        case "oz":
            output = (weight_in_gram * 0.035274).toFixed(3) + " oz";
            break;
        case "lb":
            output = (weight_in_gram * 0.00220462).toFixed(3) + " lb";
            break;
        case "st":
            output = (weight_in_gram * 0.000157473).toFixed(3) + " stone";
            break;
    }

    // Write the solution into the result card then show it.
    document.getElementById("result").innerHTML = output;
    document.getElementById("result-card").style.display = "block";
}
