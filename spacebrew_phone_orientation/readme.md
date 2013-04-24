Spacebrew Phone Gyro
=====================
  
This simple app forwards gyrometer data from a phone to Spacebrew. It provides each dimension of the data separately as ranges (alpha, beta, and gamma), and together as a stringified json object. 

Author:		Julio Terra from LAB at Rockwell Group  
Date: 		April 21, 2013  
Version:	0.0.1
   
System Requirements:  
* Mac iOS and OSX (not tested on any other platform)  
* Web browser (Safari on iOS, iPhone 3GS plus for gyrometer)  
  
HOW TO USE  
============================  
  
Setting Up Phone Gyro App on Your Local Computer:  
-------------------------------------------------------------  
  
To run the phone gyro app locally, you will need a computer, a phone and a shared wifi network. The reason being, you need to create web server on your local computer to serve the app via the wifi network, so that you can load it on your phone's browser. The good news is that this is a lot easier than it sounds, just follow the four steps outlined below.

**1) Create a Simple HTTP Server:** To load the spacebrew_phone app on your local computer you will need to start a webserver from the spacebrew_phone folder. The simplest way to do this on a Mac is using a python script called SimpleHTTPServer. Here is how to use this script:
	1. Navigate to the spacebrew_phone directory in the Terminal app  
	2. Type the command `python -m SimpleHTTPServer 8000` and press return  
   
**2) Test App on Local Browser:** Open a web browser on your computer and navigate to the spacebrew_phone app at the URL below. It is important to confirm that the app is running before trying to load it on your phone. 
  
```
http://localhost:8000/
``` 
  
**3) Configure the Spacbrew Client via Query String:** If you are using a Spacebrew server that is running on your local computer, then the app should connect to the server with the app name `ColoredScreen`. To connect to another server you need to add `server=SERVER_NAME` to the query string. For example, if you were trying to connect to a Spacebrew server at `sandbox.spacebrew.cc` you would go to: 
    
```
http://localhost:8000/index.html?server=sandbox.spacebrew.cc
```
  
You can also change the app name and define a description for the app using the query string. Just use the query keys `name` and `description`, as demonstrated below:
  
```
http://localhost:8000/index.html?server=sandbox.spacebrew.cc&name=jMobile&description=iphone motion events
```
    

**4) Load App On Your Phone: To load this web app on a phone that is connected to the same network as the computer from which the web app is being served, you will need to find your computer's ip address. On OSX you can get your computer's IP address by going to `System Preferences` -> select `Network` -> make sure `Wifi` is selected from list on left side of window -> click on the `Advanced` button -> select the `TCP/IP` tab -> look for `IPv4 Address`.   
  
Once you have the ip address just switch out `localhost` for the ip address in the url mentioned above. When you run this app on your phone you will always need to specify the location of the server. If the ip address for both this app and the Spacebrew server was `10.0.1.14`, then the url I would use on my phone would be:  

```
http://10.0.1.14:8000/index.html?server=sandbox.spacebrew.cc&name=jMobile&description=iphone motion events
```
  
Query String Options for Setting up Spacebrew:  
----------------------------------------------  
  
The following query string options are used by the Spacebrew library to configure the connection to the Spacebrew server:
* server: holds the hostname of the spacebrew server to which this application should connect. Defaults to "localhost". To connect to the cloud server add `server=sandbox.spacebrew.cc` to the query string.  
* name: holds the name for this application that will show up on the spacebrew admin interface. Defaults to "ColoredScreen".  
* description: holds the description for this application that will show up on the spacebrew admin interface. Defaults to "Phone motion events forwarding app.".  
  