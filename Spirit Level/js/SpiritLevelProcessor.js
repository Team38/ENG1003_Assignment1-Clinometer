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
        accuracy = 0.5,
        transValues = {
            x: 0,
            y: 0,
        },
        storedTransValues = {
            x: {
                lowerBound: 0,
                upperBound: 0,
            },
            y: {
                lowerBound: 0,
                upperBound: 0,
            },
        },
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
        window.onload = swapButton; //Runs swapButton function on page load.

    }

    function handleMotion(event) {
        // This function handles the new incoming values from the accelerometer.
        
        //Input:
        //      event
        //      The data from the devicemotion event listener API.
        var aX = event.accelerationIncludingGravity.x,
            aY = event.accelerationIncludingGravity.y,
            aZ = event.accelerationIncludingGravity.z

        //Taking gravity into account and filtering its effects out.
        var gX = aX / 9.8,
            gY = aY / 9.8,
            gZ = aZ / 9.8;

        //Declaring variables used in the buffer and alignment steps. Assigning the newly generated accelerometer values to one of these.
        var rawMotionData = [gX, gY, gZ],
            filteredValuesStore;

        //Selecting whether the app should use movingAverage or movingMedian buffering depending on button click status determined from user input of swapButton.
        //Assigns the returned filtered values for use below.
        if (swapClick % 2 === 0) {
            filteredValuesStore = movingAverage(bufferRecord, rawMotionData);
        } else {
            filteredValuesStore = movingMedian(bufferRecord, rawMotionData);
        }
        //Calling for the dimensions of the screen of the device using app. 
        var dimensions = uiController.bodyDimensions();

        //Determining the translation values for moving the dark and pale bubbles. Also used by the alignment indicator. 
        transValues = {
            x: Number(filteredValuesStore.x) * (dimensions.width / 2 - 10), //the 10px is to account for the size of the bubble (which is 20*20 px , then divide it by 2 so 10px CHECKED CSS FOR BUBBLE SIZE).
            y: -Number(filteredValuesStore.y) * (dimensions.height / 2),
        };
        
        //Translating the dark bubble to determined translation position.
        uiController.bubbleTranslate(transValues.x, transValues.y, "dark-bubble");

        //If the freeze button is not toggled on, this moves the pale bubble to the same position of the dark bubble at current time, so as to hide it behind the dark bubble.
        //Also sets the lower and upper bounds for alignment indication around the center point as the pale bubble is not in use.
        if (numClick % 2 === 0) {

            uiController.bubbleTranslate(transValues.x, transValues.y, "pale-bubble");
            storedTransValues.x.lowerBound = -accuracy;
            storedTransValues.x.upperBound = accuracy;
            storedTransValues.y.lowerBound = -accuracy;
            storedTransValues.y.upperBound = accuracy;
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
        //      This function returns the result of the moving average filter

        //Declaring variables to be used. Including sums for the x,y and z axis accelerometer valuse and assiging the new incoming accelerometer values to variables. 
        var filteredValues,
            sumX = 0,
            sumY = 0,
            sumZ = 0,
            newX = newValue[0],
            newY = newValue[1],
            newZ = newValue[2];

        //Adding the new incoming accelerometer values to the last array position of the existing buffers, one for each accelerometer axis.
        buffer.x[buffer.x.length] = newX;
        buffer.y[buffer.y.length] = newY;
        buffer.z[buffer.z.length] = newZ;

        //The next 3 if statements restrict the length of each of the axis buffers to 25 values by deleting the oldest value when the buffer exeeds this limit. 
        if (buffer.x.length > 25) {
            buffer.x.shift()
        }
        if (buffer.y.length > 25) {
            buffer.y.shift()
        }
        if (buffer.z.length > 25) {
            buffer.z.shift()
        }

        //The next 3 for statements sum all the values of each of the 3 buffer arrays and stores the result in the sum variables.
        for (var i = 0; i < buffer.x.length; i++) {
            sumX += buffer.x[i];
        }
        for (var j = 0; j < buffer.y.length; j++) {
            sumY += buffer.y[j];
        }
        for (var k = 0; k < buffer.z.length; k++) {
            sumZ += buffer.z[k];
        }

        //Averaging the values of each buffer array using the sums computed above and storing them in an object.
        filteredValues = {
            x: sumX / buffer.x.length,
            y: sumY / buffer.y.length,
            z: sumZ / buffer.z.length
        };

        //Calling for the displayAngle function using the newly averaged values.
        displayAngle(filteredValues.x, filteredValues.y, filteredValues.z);

        return filteredValues;
    }

    function displayAngle(x, y, z) {
        // This function will handle the calculation of the angle from the z-axis and
        // display it on the screen inside a "div" tag with the id of "message-area"

        // Input: x,y,z
        //      These values should be the filtered values after the Moving Average for
        //      each of the axes respectively
        //Creating a DOM reference for the text display area and calculating the angle from the z-axis the phone is tilted at.
        //Using maths for the angle between two vectors, one vector being the z spacial axis and the other being the phones tilted z axis. 
        var returnStringRef = document.getElementById("message-area"),
            finalAngle = Math.acos(z / (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)))) * 180 / Math.PI;

        //Alignment indicator: Compares the calculated translationValues to stored translation values of pale bubbble or the center if freeze isnt toggled on.
        //If the dark bubble moves to within the bounds of the pale bubble/center, an "ALIGNED" message will be displayed over the angle display, otherwise just the angle is displayed.
        if (transValues.x >= storedTransValues.x.lowerBound && transValues.x <= storedTransValues.x.upperBound &&
            transValues.y >= storedTransValues.y.lowerBound && transValues.y <= storedTransValues.y.upperBound) {
            returnStringRef.innerHTML = "ALIGNED" + "<br/>" + finalAngle.toFixed(1) + "&deg from the positive z-axis";
        } else {
            returnStringRef.innerHTML = finalAngle.toFixed(1) + "&deg from the positive z-axis";
        }

    }

    self.freezeClick = function () {
        //The freezeclick function works by incrementing a stored value by one everytime it is pressed. If the store is an even number then the pale bubble will not be displayed.
        //If the number is an odd value then the pale bubble is translated to the curent dark bubble position and the upper and lower bounds for alignment are stored. 
        numClick++;

        //Detection of odd incremement value, setting of the pale bubbles position to the dark bubbles current position, freezing it, and the assingment of lower and upper bounds for alignment at this point. 
        if (numClick % 2 !== 0) {
            uiController.bubbleTranslate(transValues.x, transValues.y, "pale-bubble");
            storedTransValues.x.lowerBound = transValues.x - accuracy;
            storedTransValues.x.upperBound = transValues.x + accuracy;
            storedTransValues.y.lowerBound = transValues.y - accuracy;
            storedTransValues.y.upperBound = transValues.y + accuracy;
        }
    }

    function movingMedian(buffer, newValue) {
        
        // This function handles the Moving Median Filter

        // Input:
        //      buffer
        //      The buffer in which the function will apply the moving to.

        //      newValue
        //      This should be the newest value that will be pushed into the buffer

        // Output: filteredValue
        //      This function returns the result of the moving median filter

        //Declaring variables to be used. Including sums for the x,y and z axis accelerometer valuse and assiging the new incoming accelerometer values to variables. 
        
        
        var newX = newValue[0],
            newY = newValue[1],
            newZ = newValue[2],
            filteredValues = {
                x: 0,
                y: 0,
                z: 0
            },
            bufferSort = {
                x: [],
                y: [],
                z: []
            },
            mid = 0,
            medianX = 0,
            medianY = 0,
            medianZ = 0;
        dimensions = uiController.bodyDimensions();

        //x block
        //This statement restricts the length of the axis buffer to 25 values by deleting the oldest value when the buffer exeeds this limit. 
        if (buffer.x.length > 25) {
            buffer.x.shift();
        }
        //Adding the new incoming accelerometer values to the last array position of the existing buffers, one for each accelerometer axis.
        buffer.x[buffer.x.length] = newX;
        
        //Cloning the buffer values into another array called bufferSort, so that bufferSort may be altered without affecting the oder of the incoming values
        bufferSort.x = buffer.x.slice();
        
        //Sorting the values in bufferSort
        bufferSort.x.sort(function (a, b) {
            return a - b
        });

        //y block
        //This statement restricts the length of the axis buffer to 25 values by deleting the oldest value when the buffer exeeds this limit. 
        if (buffer.y.length > 25) {
            buffer.y.shift();
        }
        buffer.y[buffer.y.length] = newY;
        
        //Cloning the buffer values into another array called bufferSort, so that bufferSort may be altered without affecting the oder of the incoming values
        bufferSort.y = buffer.y.slice();
        
        //Sorting the values in bufferSort
        bufferSort.y.sort(function (a, b) {
            return a - b
        });

        //z block
        //This statement restricts the length of the axis buffer to 25 values by deleting the oldest value when the buffer exeeds this limit. 
         if (buffer.z.length > 25) {
            buffer.z.shift();
        }
        buffer.z[buffer.z.length] = newZ;
        
        //Cloning the buffer values into another array called bufferSort, so that bufferSort may be altered without affecting the oder of the incoming values
        bufferSort.z = buffer.z.slice();
        
        //Sorting the values in bufferSort
        bufferSort.z.sort(function (a, b) {
            return a - b
        });
        
        
        //Calculates how far into the array the middle value is (for arrays the size of 25 this will be constant but it is useful for the times preceding this). Only needs one calculation as all incoming arrays will be the         same length 
        mid = Math.floor(buffer.x.length / 2);

        //If the array is an odd numbered length (ie. 5 or 7) the middle value can be taken as the median
        if (mid % 2) {
            medianX = (bufferSort.x[mid])
            medianY = (bufferSort.y[mid])
            medianZ = (bufferSort.z[mid])

        } else 
        //If the array is an even numbered length(ie. 8 or 20) the median is calculated by taking the number halfway between the two middle values
        {
            medianX = ((bufferSort.x[mid - 1] + bufferSort.x[mid]) / 2);
            medianY = ((bufferSort.y[mid - 1] + bufferSort.y[mid]) / 2);
            medianZ = ((bufferSort.z[mid - 1] + bufferSort.z[mid]) / 2);

        }

        //Storing the values in an object to be used for the displayAngle function
        filteredValues = {
            x: medianX,
            y: medianY,
            z: medianZ
        };

        //Calling for the displayAngle function using the new median values.
        displayAngle(filteredValues.x, filteredValues.y, filteredValues.z); //calls the function displayAngle and give it the 3 inputs based on the calculated averages.

        return filteredValues;
    }

    self.swap = function () {
        //A function that increments a stored value for swapButton. If this value is even then the moving average is used, if odd moving median is used.
        //Setting DOM reference for the button.
        var swapButtonRef = document.getElementById("swapButton");
        //Incrementing stored value. 
        swapClick++;
        //Detecting the state of the button store and changing the text of the button to reflect this state. 
        if (swapClick % 2 === 0)
            swapButtonRef.innerHTML = "Use Moving Median";
        else
            swapButtonRef.innerHTML = "Use Moving Average";
    }

    function swapButton() {
        //Function that creates the swapButton on the web app. Including assigning initial text and function trigger.
        
        //Creating DOM reference for the bottom div where buttons are located and creates a temporary HTML button DOM node that will be appended here.
        var bottomDivNode = document.getElementById("bottom-div"),
            tempNode = document.createElement("button");
        //Setting the created buttons ID, Class, activation of the swapButton function on click and its initial display text.
        tempNode.setAttribute("id", "swapButton");
        tempNode.setAttribute("class", "ui-btn ui-corner-all");
        tempNode.setAttribute("onClick", "spiritLevelProcessor.swap()");
        tempNode.innerHTML = ("Use Moving Median");
        //Appending the created button DOM node to the bottomDiv DOM node. 
        bottomDivNode.appendChild(tempNode);


    }
}