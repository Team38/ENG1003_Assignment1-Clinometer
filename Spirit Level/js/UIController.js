function UIController()
{
    var self = this;
    
    self.listener = null;
    
    self.initialise = function()
    {
        self.listener.initialise(self);
    }

    self.bubbleTranslate = function(x,y,id)
    {
        var bubble = document.getElementById(id);
        bubble.style.transform = "translate("+x+"px,"+y+"px)";
        bubble.style.webkitTransform = "translate("+x+"px,"+y+"px)";
        bubble.style.mozTransform = "translate("+x+"px,"+y+"px)";
        bubble.style.msTransform = "translate("+x+"px,"+y+"px)";
        bubble.style.oTransform = "translate("+x+"px,"+y+"px)";
    }
    
    self.bodyDimensions = function ()
    {
        return {width: document.querySelector('.ui-page').offsetWidth,
                height: document.querySelector('.ui-page').offsetHeight};
    }
}
