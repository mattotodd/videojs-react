/**
 * @jsx React.DOM
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactVideoJsComponent from '../video.jsx'


ReactDOM.render(
    <ReactVideoJsComponent src="http://jmrehashdev-env.elasticbeanstalk.com/crdr/_8ada1215f3934cc8895eb75eaaebd3e1/recording.webm" />,
    document.getElementById('component-container')
);