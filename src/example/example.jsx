/**
 * @jsx React.DOM
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactVideoJsComponent from '../video.jsx'

var markers = [
	{seconds:0, duration:32}, 
	{seconds:9.2, duration:32}, 
	{seconds:13.5, duration:32},
	{seconds:25.5, duration:32},
	{seconds:32, duration:32}
];

ReactDOM.render(
    <ReactVideoJsComponent src="./big-buck-bunny_trailer.webm" markers={markers} startWithControlBar={true} />,
    document.getElementById('component-container')
);