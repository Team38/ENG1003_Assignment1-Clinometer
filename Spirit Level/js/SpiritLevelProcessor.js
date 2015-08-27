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
    ID of text area at the bottom of the screen, just on top on the "Feeze" button

freeze-button
    ID of the "Freeze" button
****************************************************************************************/

function SpiritLevelProcessor() {
    var self = this,
        rawMotionData,
        outputAngle = document.getElementById("message-area")
        bufferRecord = {
            x: [],
            y: [],
            z: [];
        };

    var uiController = null;

    self.initialise = function (controller) {
        uiController = controller;

        //phone window. This code will run handleMotion when it detect device's motion.
        window.addEventListener("devicemotion", handleMotion);
        
       var getXYZ = {
            x: filteredValues.x,
            y: filteredValues.y,
            z: filteredValues.z;
    }
        
        uiController.bubbleTranslate(getXYZ.x,getXYZ.y, dark-bubble);
        
        displayAngle(getXYZ.x,getXYZ.y,getXYZ.z);
    }

    function handleMotion(event) {
        // This function handles the new incoming values from the accelerometer
        var aX = event.accelerationIncludingGravity.x,
            aY = event.accelerationIncludingGravity.y,
            aZ = event.accelerationIncludingGravity.z;

        var gX = aX / 9.8,
            gY = aY / 9.8,
            gZ = aZ / 9.8;

        rawMotionData = [gX, gY, gZ];
        
        movingAverage(bufferRecord, rawMotionData);
        
        return movingAverage;
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

        if (buffer.x.length > 100) {
            buffer.x.shift()
        }

        if (buffer.y.length > 100) {
            buffer.y.shift()
        }

        if (buffer.z.length > 100) {
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
            z: sumZ / buffer.z.length;
        };

        displayAngle(filteredValues.x,filteredValues.y,filteredValues.z);
        
        return filteredValues
    }

    function displayAngle(x, y, z) {
        // This function will handle the calculation of the angle from the z-axis and
        // display it on the screen inside a "div" tag with the id of "message-area"

        // Input: x,y,z
        //      These values should be the filtered values after the Moving Average for
        //      each of the axes respectively
        var retVal = document.getElementById("message-area");   
        
        var finalAngle,
            pitchAngle,
            rollAngle;
        
        //This calculates the angle to which the phone is pitched. It describes the angle of the phone with respect to the y- and z-axis.
        pitchAngle = (Math.atan(filteredValues.z/filteredValues.y)*180)/Math.PI;
        
        
        //This calculates the angle to which the phone is rolled. It describes the angle of the phone with respoect to the x- and z-xias.
        rollAngle = (Math.atan(x / Math.sqrt(Math.pow(filteredValues.y,2) + Math.pow(filteredValues.z,2))) * 180) / Math.PI;
        
        
        //The final angle is calculated to be the "Pythagoras" of the pitch and roll angles.
        finalAngle = Math.sqrt(Math.pow(pitchAngle,2) + Math.pow(rollAngle,2));
        
        retVal.innerHTML = finalAngle;
        
    }

    self.freezeClick = function () {
        
      var getXYZ = {
            x: filteredValues.x,
            y: filteredValues.y,
            z: filteredValues.z;
    }

      uiController.bubbleTranslate(getXYZ.x,getXYZ.y, pale-bubble);
      
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
}
