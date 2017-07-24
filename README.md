# Arduino CS:GO Lightshow
This Node.JS module connects to Arduino through sockets to switch RGB Led colors based on CSGO Game State Integration.

## Requirements
* A server with the latest stabile version of Node.JS installed and running.
* node-csgo-gsi package (https://www.npmjs.com/package/node-csgo-gsi) from NPM.
* ReadASCIIString (https://www.arduino.cc/en/Tutorial/ReadASCIIString) uploaded to the Arduino board.
* RGB Led Strip connected to the designated analog I/Os (See the tutorial above for details).

## Reminder
Do not forget to edit the line 17 of run.js with your own serial port id.
