Spacebrew Slideshow
===================

This simple app functions like a collaborative picture slideshow that can be controlled via spacebrew. It accepts strings containing links to images via one inlet, called img_urls; next, prev, and play_pause boolean commands via inlets with those same names; and an integer value for slideshow speed via the speed inlet.

To start and stop the slideshow from the web app itself, just click your the browser window. 

The app automatically saves the slideshow to local storage on a browser. The slideshow is saved using the app name as a key, so whenever you load the app with the same name it will load the saved slideshow. This allows you to save multiple different slideshows on your computer. To clear a slideshow you can press shift-c, or C.

App: 		spacebrew_slideshow
Team: 		Julio Terra from LAB at Rockwell Group
Date: 		November 2, 2012

System Requirements:
* Mac iOS and OSX (not tested on any other platform)
* Web browser (Safari on iOS, iPhone 3GS plus for gyrometer)


How to Use
============================

Setting Up Slideshow App on Your Local Computer:  
------------------------------------------------  
  
To run the slideshow app locally you will need to create web server on your local computer. The good news is that this is a lot easier than it sounds, just follow the four steps outlined below.

**1) Create a Simple HTTP Server:** To load the spacebrew_slideshow app on your local computer you will need to start a webserver from the spacebrew_slideshow folder. The simplest way to do this on a Mac is using a python script called SimpleHTTPServer. Here is how to use this script:
	1. Navigate to the spacebrew_slideshow directory in the Terminal app  
	2. Type the command `python -m SimpleHTTPServer 8000` and press return  
   
**2) Test App on Local Browser:** Open a web browser on your computer and navigate to the spacebrew_slideshow app at the URL below, to make sure that it is loading properly. 
  
```
http://localhost:8000/
``` 
  
**3) Configure the Spacbrew Client via Query String:** If you are using a Spacebrew server that is running on your local computer, then the app should connect to the server with the app name `ColoredScreen`. To connect to another server you need to add `server=SERVER_NAME` to the query string. For example, if you were trying to connect to a Spacebrew server at `sandbox.spacebrew.cc` you would go to: 
    
```
http://localhost:8000/index.html?server=sandbox.spacebrew.cc
```
  
You can also change the app name and define a description for the app using the query string. Just use the query keys `name` and `description`, as demonstrated below:
  
```
http://localhost:8000/index.html?server=sandbox.spacebrew.cc&name=jSlideshow&description=add an image to slideshow by sending a URL to img_urls subscription channel.
```

Query String Options:
----------------------------

The following option flags (true/false) can be set via the query string to change behavior of this chrome extension:

  	* debug: this is a boolean value that determines when debug logging is activated on the application. By default debug logging is set to false.
  			
  	* name: this is a string value that is used to set the spacebrew app name, and to set the local storage key as well. This means that you can set-up several different web browser tabs running the text transform app with different names to save multiple different sets of transform maps.
  			
  	* server: this is a string value that is used to set location of  spacebrew server to which app will connect. If no value is provided then the web app will default to "localhost", and will attempt to connect to a local spacebrew server.

  	* description: this is a string value that is used to set app description that will be registered with the spacebrew server. It defaults to "".

  	* speed: the refresh interval in seconds for the slideshow. By default it is set to 5 seconds.
