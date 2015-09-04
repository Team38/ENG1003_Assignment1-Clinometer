/****************************************************************************************
Avaiable functions for usage in the uiController object
================================================================
uiController.bubbleTranslate(x,y, id)
    This function will translate the bubble from the middle of the screen.
    The center of the screen is considered (0,0).
    Inputs:
        x,y
        Translates the bubble x px right and y px up. Negative values are accepted
        and translate the bubble in the opposite direction.
        id
        ID of bubble that needs to be moved
uiController.bodyDimensions()
    Returns the width and height of the body (without the toolbar)
    Return:
        Returns an object with the following fields
        {
            width:      [Returns the width of the body],
            height:     [Returns the width of the body]
        }
ID of HTML elements that are of interest
==============================================================
dark-bubble
    ID of the dark green bubble
pale-bubble
    ID of the pale green bubble
message-area
    ID of text area at the bottom of the screen, just on top on the "Freeze" button
freeze-button
    ID of the "Freeze" button
****************************************************************************************/

function SpiritLevelProcessor() {
    var self = this,
        rawMotionData,
        filteredValuesStore,
        transValues,
        outputAngle = document.getElementById("message-area"),
        numClick = 0,
        swapClick = 0,
        bufferRecord = {
            x: [],
            y: [],
            z: []
        };


    var uiController = null;

    self.initialise = function (controller) {
        uiController = controller;

        //phone window. This code will run handleMotion when it detect device's motion.
        (window.addEventListener("devicemotion", handleMotion));
        window.onload = swapButton;

    }

    function handleMotion(event) {
        // This function handles the new incoming values from the accelerometer
        var aX = event.accelerationIncludingGravity.x,
            aY = event.accelerationIncludingGravity.y,
            aZ = event.accelerationIncludingGravity.z

        var gX = aX / 9.8,
            gY = aY / 9.8,
            gZ = aZ / 9.8;

        var rawMotionData = [gX, gY, gZ];


        if (swapClick % 2 === 0) {
            filteredValuesStore = movingAverage(bufferRecord, rawMotionData);
        } else {
            filteredValuesStore = movingMedian(bufferRecord, rawMotionData);
        }

        var dimensions = uiController.bodyDimensions();

        transValues = {
            x: Number(filteredValuesStore.x) * (dimensions.width / 2 - 10), //the 10px is to account for the size of the bubble (which is 20*20 px , then divide it by 2 so 10px CHECKED CSS FOR BUBBLE SIZE).
            y: -Number(filteredValuesStore.y) * (dimensions.height / 2),
        };

        uiController.bubbleTranslate(transValues.x, transValues.y, "dark-bubble");

        if (numClick % 2 === 0) {

            uiController.bubbleTranslate(transValues.x, transValues.y, "pale-bubble");
        }

    }

    function movingAverage(buffer, newValue) {
        // This function handles the Moving Average Filter

        // Input:
        //      buffer
        //      The buffer in which the function will apply the moving to.

        //      newValue
        //      This should be the newest value that will be pushed into the buffer

        // Output: filteredValue
        //      This function should return the result of the moving average filter

        var filteredValues,
            sumX = 0,
            sumY = 0,
            sumZ = 0,
            newX = newValue[0],
            newY = newValue[1],
            newZ = newValue[2];

        buffer.x[buffer.x.length] = newX;
        buffer.y[buffer.y.length] = newY;
        buffer.z[buffer.z.length] = newZ;

        if (buffer.x.length > 25) {
            buffer.x.shift()
        }

        if (buffer.y.length > 25) {
            buffer.y.shift()
        }

        if (buffer.z.length > 25) {
            buffer.z.shift()
        }

        for (var i = 0; i < buffer.x.length; i++) {
            sumX += buffer.x[i];
        }

        for (var j = 0; j < buffer.y.length; j++) {
            sumY += buffer.y[j];
        }

        for (var k = 0; k < buffer.z.length; k++) {
            sumZ += buffer.z[k];
        }

        filteredValues = {
            x: sumX / buffer.x.length,
            y: sumY / buffer.y.length,
            z: sumZ / buffer.z.length
        };

        displayAngle(filteredValues.x, filteredValues.y, filteredValues.z);

        return filteredValues;
    }

    function displayAngle(x, y, z) {
        // This function will handle the calculation of the angle from the z-axis and
        // display it on the screen inside a "div" tag with the id of "message-area"

        // Input: x,y,z
        //      These values should be the filtered values after the Moving Average for
        //      each of the axes respectively
        var returnStringRef = document.getElementById("message-area"),
            finalAngle = Math.acos(z / (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)))) * 180 / Math.PI;

        returnStringRef.innerHTML = finalAngle.toFixed(1) + "&deg from the z-axis";

    }

    self.freezeClick = function () {

        numClick++;

        if (numClick % 2 !== 0) {
            uiController.bubbleTranslate(transValues.x, transValues.y, "pale-bubble");
        }
    }

    function movingMedian(buffer, newValue) {
        // ADVANCED FUNCTIONALITY
        // =================================================================
        // This function handles the Moving Median Filter
        // Input:
        //      buffer
        //      The buffer in which the function will apply the moving to.

        //      newValue
        //      This should be the newest value that will be pushed into the buffer

        // Output: filteredValue
        //      This function should return the result of the moving average filter
    }

    self.swap = function () {
        var swapButtonRef = document.getElementById("swapButton");
        swapClick++;
        if (swapClick % 2 === 0)
            swapButtonRef.innerHTML = "Use Moving Median";
        else
            swapButtonRef.innerHTML = "Use Moving Average";
    }

    function swapButton() {
        var bottomDivNode = document.getElementById("bottom-div"),
            tempNode = document.createElement("button");
        tempNode.setAttribute("id", "swapButton");
        tempNode.setAttribute("class", "ui-btn ui-corner-all");
        tempNode.setAttribute("onClick", "spiritLevelProcessor.swap()");
        tempNode.innerHTML = ("Use Moving Median");
        bottomDivNode.appendChild(tempNode);


    }
}