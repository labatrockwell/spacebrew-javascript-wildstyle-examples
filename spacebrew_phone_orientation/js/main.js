/*!
 *  Phone Events :: Main  *
 * 
 *  Initializes the main variables that are used in this webapp, opens and configures the SpaceBrew connection,
 *  checks if device is an iphone to customize css as appropriate, registers all listeners for iphone movement
 *  and orientation events.
 *  
 *  <br />Copyright (C) 2012 LAB at Rockwell Group http://lab.rockwellgroup.com
 *
 * @filename    main.js
 * @author      Julio Terra, LAB at Rockwell Group
 * @modified    10/25/2012
 * @version     1.0.0
 * 
 */

var outletOutletDefault = '5';  // the default number of outlets and inlets, if not defined via query string
var contentTimer
	, random_id = "000" + Math.floor(Math.random() * 1000)
	;

var qs = {};
    qs.href = window.location.href;
    qs.name = "Phone Orientation" + ' ' + random_id.substring(random_id.length-3);	// name of app in spacebrew
    qs.server = window.getQueryString('server') || 'localhost';					    // name of spacebrew server
    qs.description = window.getQueryString('description') || "Control stuff by moving your phone.";
    qs.debug = (window.getQueryString('debug') == "true") ? true : false;		// debug flag

var sb = {};
    sb.connection = new Spacebrew.Client(qs.server, qs.name, qs.description);     // spacebrew connection
    sb.connected = false;
    sb.msgIn = "";          // latest incoming messages
    sb.msgs = [];           // array with most recent incoming messages
    sb.msgsLen = 5;         // number of incoming messages to save in arrray
    sb.publish = [];        // list with names of the publish routes (outlets)
    sb.subscribe = [];      // list with names of the subscribe routes (inlets)
    sb.selects = spacebrewDropDownGenerator( {"sb": sb.connection} );


var state = {};
    state.available = false;
    state.gyro = { alpha: 0, beta: 0, gamma: 0 };
    state.txtVisible = true;
    state.elements = ["alpha", "beta", "gamma"];
    state.bounds = {               // values to map the gyrometer values to range values (from iphone 4)
      low: { alpha: 0, beta: -90, gamma: -180 },
      high: { alpha: 360, beta: 90, gamma: 180 }
    };
    state.names = { "alpha": "rotate flat", "beta": "portrait tilt", "gamma": "landscape tilt" };

var debug = debug || qs.debug || false; // flag to identify if debug messages should be output

// customize UI based on whether page is loaded on a mobile device
$(document).live("pagebeforecreate", function () { sb.selects.initDropdown() });

$(window).bind("load", function() {
  if (debug) console.log("[main.js] DEBUGGING IS ON")
  setTimeout(function() { window.scrollTo(0, 1) }, 100);
  setInterval(function() { displayStatusMsg() }, 50);

  setupSpacebrew();
  registerMotionEventListeners();
});

/**
 * Sets up the SpaceBrew connection, configures subscribe and publish configurations, and 
 *    links the onString callback method. Also builds the input forms once connections has been 
 *    established.
 * @return {none} 
 */
function setupSpacebrew (){
	// setupSpacebrew spacebrew
	if (debug) console.log("[setupSpacebrew] setting up connection to Spacebrew");
	sb.connection = new Spacebrew.Client(qs.server, qs.name, qs.description);
	sb.connection.extend(Spacebrew.Admin);

	var new_string = "Attempting to connect to the spacebrew server at '" + qs.server + "'";
	$("#statusMsgDiv span.message").text(new_string);

	for (var j in state.elements) {
		sb.connection.addPublish( state.names[state.elements[j]], "range" );
	}

	sb.selects.registerSB(sb.connection);
	// Override Spacebrew events
	sb.connection.onStringMessage = onString.bind(this);
	sb.connection.onRangeMessage = onRange.bind(this);
	sb.connection.onOpen = onOpen.bind(this);
	sb.connection.onClose = onClose.bind(this);
	sb.connection.onNewClient = onNewClient;
	sb.connection.onUpdateClient = onNewClient;
	sb.connection.onRemoveClient = onRemoveClient;
	sb.connection.onUpdateRoute = onUpdateRoute;

	sb.connection.connect();

	$("#appName span").text(qs.name);

	if (debug) console.log( "[setupSpacebrew] attempted to connect to spacebrew" ); 
}

/**
 * registerMotionEventListeners Register callback methods for accelerometer and gyrometer events.
 *   If connected to Spacebrew, messages are sent when a new event is received.
 * @return {none} 
 */
var registerMotionEventListeners = function () {
  console.log("[registerMotionEventListeners] window object ", window );

  // check if device has an gyrometer, and if so, then register an event handler
  if (window.DeviceOrientationEvent) {
    if (debug) console.log("[registerMotionEventListeners] gyro device orientation event available " );
    window.addEventListener("deviceorientation", function() {
      processEvent(event);
    }, true);    
    state.available = true;
  } else {
    $("#deviceMsggyro h1").html(htmlForTextWithEmbeddedNewlines("gyro"));    
    $("#deviceMsggyro p").html(htmlForTextWithEmbeddedNewlines("Data not available."));    
    state.available = false;
  }
}

/**
 * processEvent Processes new movement events and in response updates the data on the UI, and sends
 *   the appropriate Spacebrew messages.
 * @param  {String} name The name of the sensor associated to this event
 * @param  {Object} data An object that includes data about all sources associated to the sensor
 *                       named in the previous paramter. This object needs to feature the appropriate
 *                       attribute names in order for the method to process them.
 * @return {none}      
 */
var processEvent = function (data) {
	var debug = true;
	var sensor = "gyro";
	var new_data = false;

    // loop through each source associated to the current sensor
    for (var p in state.elements) {
		var part = state.elements[p];
		if (!data[part]) continue; // if data[part] doesn't exist then skip to next part
		var new_state = mapVal( data[part], state.bounds["low"][part], 
								state.bounds["high"][part], 0, 1024 );

		// if the new state is different from state[sensor][part] then update state[sensor][part]
		if (state[sensor][part] != new_state) {
			state[sensor][part] = new_state;
			// if (debug) console.log("[processEvent] new value for " + sensor + " part " + part + " val " + state[sensor][part] );

			// if connected to spacebrew then send messages
			if (sb.connected) {
				var outlet_name = sensor + "_" + part;
				sb.connection.send(state.names[part], "range", state[sensor][part]); 
				new_data = true;
			}
		}
    }
}

/**
 * displayStatusMsg Displays the current readings from the sensors, and outputs on the browser
 *   window.
 * @return {none} 
 */
var displayStatusMsg = function () {
	var new_string = "";
	if (state.available) {
		if (debug) console.log("[displayStatusMsg] parts ", state.elements );
		for (var p in state.elements) {
			var part = state.elements[p];
			new_string = new_string + state.names[part] + ": " + state["gyro"][part] + "<br>";
		}    
	} else {
		new_string = "data<br> not<br> available<br>";  
	} 
	$("#deviceMsggyro span").html(new_string);
}

/**
 * mapVal Maps a value in a similar way to the Arduino and Processing map method. It takes a value, along
 *   with source min and max values, and target min and max values. Then it converts the value from the 
 *   source to the target range.
 * @param  {Integer} value      The value that will be mapped.
 * @param  {Integer} source_min The minimum value for the source range.
 * @param  {Integer} source_max The maximum value for the source range.
 * @param  {Integer} target_min The minimum value for the target/outgoing range.
 * @param  {Integer} target_max The maximum value for the target/outgoing range.
 * @return {Integer}            The mapped value.
 */
var mapVal = function(value, source_min, source_max, target_min, target_max) {
  if (!(value && source_min && source_max && target_min  && target_max)) "missing parameter";
  if (isNaN(value) || isNaN(source_min) || isNaN(source_max) || isNaN(target_min) || isNaN(target_max)) "not a number";
  if (value > source_max) value = source_max;
  if (value < source_min) value = source_min;
  var source_delta = source_max - source_min;
  var target_delta = target_max - target_min;
  var value_abs = value - source_min;
  var mapped_abs = value_abs * (target_delta / source_delta);
  var mapped_final = target_min + mapped_abs;

  return Math.round(mapped_final);
}

/**
 * htmlForTextWithEmbeddedNewLines Converts all '\n' in a string to '<br>' in preparation for
 *    the string to be injected into an html page.
 * @param  {String} text The incoming string that will be processed (with '\n's)
 * @return {String}      The processed string (with '<br>'s)
 */
function htmlForTextWithEmbeddedNewlines(text) {
    var htmls = [];
    var lines = text.split(/\n/);
    for (var i = 0 ; i < lines.length ; i++) {
        htmls.push(
            $(document.createElement('div')).text(lines[i]).html()
        );
    }
    return htmls.join("<br>");
}




