Text Transform App
==================

This simple form-based web app enables users to create message transformation maps. These
maps tell the app which outgoing messages should be triggered in response to which incoming 
messages. They also stipulate what input channels (inlets) should be listend to, and which 
output channels (outlets) should be used when sending outgoing messages. Incoming and 
outgoing messages are received from and sent to Spacebrew in string format. 
  
App: 		spacebrew_text_transform  
Team: 		Julio Terra from LAB at Rockwell Group  
Date: 		October 23, 2012  
  
System Requirements:  
* Mac OSX (not tested on any other platform)  
* Web browser (tested on Chrome 21.0 and Safari 6.0 on OSX)  
  
HOW TO USE  
==========  
  
Setting Up Text Transform App on Your Local Computer:  
-----------------------------------------------------  
  
To run the text transform app locally you will need to create web server on your local computer. The good news is that this is a lot easier than it sounds, just follow the four steps outlined below.  
  
**1) Create a Simple HTTP Server:** To load the spacebrew_text_transform app on your local computer you will need to start a webserver from the spacebrew_text_transform folder. The simplest way to do this on a Mac is using a python script called SimpleHTTPServer. Here is how to use this script:  
	1. Navigate to the spacebrew_text_transform directory in the Terminal app  
	2. Type the command `python -m SimpleHTTPServer 8000` and press return  
   
**2) Test App on Local Browser:** Open a web browser on your computer and navigate to the spacebrew_text_transform app at the URL below, to make sure that it is loading properly. 
  
```
http://localhost:8000/
``` 
  
**3) Configure the Spacbrew Client via Query String:** If you are using a Spacebrew server that is running on your local computer, then the app should connect to the server with the app name `SpaceTxtTransform`. To connect to another server you need to add `server=SERVER_NAME` to the query string. For example, if you were trying to connect to a Spacebrew server at `sandbox.spacebrew.cc` you would go to: 
    
```
http://localhost:8000/index.html?server=sandbox.spacebrew.cc
```
  
You can also change the app name and define a description for the app using the query string. Just use the query keys `name` and `description`, as demonstrated below:
  
```
http://localhost:8000/index.html?server=sandbox.spacebrew.cc&name=jTextTransform&description=web app that can transform text messages, they listen for specific messages and .
```


Query String Options:
----------------------------

The following options can be set via the query string to change behavior of this chrome extension:

  	* debug: this is a boolean value that determines when debug logging is activated on the application. By default debug logging is set to false.
  			
  	* name: this is a string value that is used to set the spacebrew app name, and to set the local storage key as well. This means that you can set-up several different web browser tabs running the text transform app with different names to save multiple different sets of transform maps.
  			
  	* server: this is a string value that is used to set location of  spacebrew server to which app will connect. If no value is provided then the web app will default to "localhost", and will attempt to connect to a local spacebrew server.

  	* description: this is a string value that is used to set app description that will be registered with the spacebrew server. It defaults to "".
  			
  	* inlets: this is an int value that determines the number of inlets / subscription channels that will be set-up in spacebrew.
  			
  	* outlets: this is an int value that determines the number of outlets / publish channels that will be set-up in spacebrew.


Loading Data Models:
----------------------------

The state of the application is always kept up to date in the app's data model. This model can be saved to, and 
loaded from a json file. Here is the structure of the json object that is used to save and the data model for the
text transform app.

	{
		incoming: {
			msgs: [],
			maxLength: {int},
		},
		transforms: {
			maps: {
				"id_0" {String}: {
					inlet: {String},
					incoming: {String},
					outlet: {String},
					outgoing: {String}
				}
			},
			curId: {int}
		},
		channels: {
			publish: [],
			subscribe: []
		}
	}

Please Note: to save the data model in the local storage it is converted to a string. All data models have a 
stringify method, which creates a string version of this json file.
