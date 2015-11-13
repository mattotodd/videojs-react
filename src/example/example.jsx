/**
 * @jsx React.DOM
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactVideoJsComponent from '../video.jsx'


ReactDOM.render(
    <ReactVideoJsComponent src="./big-buck-bunny_trailer.webm" />,
    document.getElementById('component-container')
);