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

function SpiritLevelProcessor()
{
    var self = this;

    var uiController = null;

    self.initialise = function(controller)
    {
        uiController = controller;

        window.addEventListener("devicemotion", handleMotion);
    }

    function handleMotion(event)
    {
        // This function handles the new incoming values from the accelerometer
    }

    function movingAverage(buffer, newValue) {
        var newX = newValue[0],
            newY = newValue[1],
            newZ = newValue[2];
        var sumX = 0,
            sumY = 0,
            sumZ = 0;
        var avgX = 0,
            avgY = 0,
            avgZ = 0;
        buffer.x[buffer.x.length] = newX;
        buffer.y[buffer.y.length] = newY;
        buffer.z[buffer.z.length] = newZ;

        if (buffer.x.length >= 100) {
            buffer.x.shift()
            else if (buffer.x.length > 0 && buffer.x.length <100)
                for (i=0; i < buffer.x.length; i++){
                sumX = sumX + buffer.x[i];   
        }
            avgX = sumX / buffer.x.length;
        else
        }
        if (buffer.y.length >= 100) {
            buffer.y.shift()
            else if (buffer.y.length > 0 && buffer.y.length <100)
                for (j=0; j < buffer.y.length; j++){
                sumY = sumY + buffer.y[j];   
        }
            avgY = sumY / buffer.y.length;
        else
        }
        if (buffer.z.length >= 100) {
            buffer.z.shift()
            else if (buffer.z.length > 0 && buffer.z.length <100)
                for (k=0; k < buffer.z.length; k++){
                sumZ = sumZ + buffer.z[k];   
        }
            avgZ= sumZ / buffer.z.length;
        else
        }
      
        
        // This function handles the Moving Average Filter

        // Input:
        //      buffer
        //      The buffer in which the function will apply the moving to.

        //      newValue
        //      This should be the newest value that will be pushed into the buffer

        // Output: filteredValue
        //      This function should return the result of the moving average filter
    }

    function displayAngle(x,y,z)
    {
        // This function will handle the calculation of the angle from the z-axis and
        // display it on the screen inside a "div" tag with the id of "message-area"

        // Input: x,y,z
        //      These values should be the filtered values after the Moving Average for
        //      each of the axes respectively
    }

    self.freezeClick = function()
    {
        // ADVANCED FUNCTIONALITY
        // ================================================================
        // This function will trigger when the "Freeze" button is pressed
        // The ID of the button is "freeze-button"
    }

    function movingMedian(buffer, newValue)
    {
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
