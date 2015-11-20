/**
 * @jsx React.DOM
 */
'use strict';

import React from 'react';
import  ReactDOM from 'react-dom';
import cx from 'classnames';
import vjs from 'video.js';
import lodash from 'lodash';
var _forEach = lodash.forEach;
var _debounce = lodash.debounce;
var _defaults = lodash.defaults;

import MarkerBar from './markerBar';
import Marker from './marker';

const DEFAULT_HEIGHT = 540;
const DEFAULT_WIDTH = 960;
const DEFAULT_ASPECT_RATIO = (9 / 16);
const DEFAULT_ADJUSTED_SIZE = 0;
const DEFAULT_RESIZE_DEBOUNCE_TIME = 500;
const DEFAULT_VIDEO_OPTIONS = {
  preload: 'auto',
  autoplay: true,
  controls: true
};


function noop() {}


export default class ReactVideoJsComponent extends React.Component {

  constructor() {
    super();
    //initial state
    this.state = {
       
    };
  }

  componentDidMount() {
    this.mountVideoPlayer();
  }

  componentWillReceiveProps(nextProps) {
    var isEndless = this.props.endlessMode;
    var willBeEndless = nextProps.endlessMode;

    if (isEndless !== willBeEndless) {
      if (willBeEndless) {
        this.addEndlessMode();
      } else {
        this.removeEndlessMode();
      }
    }

    var isResizable = this.props.resize;
    var willBeResizeable = nextProps.resize;

    if (isResizable !== willBeResizeable) {
      if (willBeResizeable) {
        this.addResizeEventListener();
      } else {
        this.removeResizeEventListener();
      }
    }

    var currentSrc = this.props.src;
    var newSrc = nextProps.src;

    if (currentSrc !== newSrc) {
      this.setVideoPlayerSrc(newSrc);
    } else if (isEndless === willBeEndless) {
      this.restartVideo();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.unmountVideoPlayer();
  }

  drawMarker(markerOptions) {
    if(!this._markerBar){
      this._markerBar = this._player.controlBar.progressControl.addChild(new MarkerBar());
    }

    var marker = new Marker(this._player, markerOptions);
    this._markerBar.addChild(marker);
  }

  getVideoPlayer() {
    return this._player;
  }

  getVideoPlayerEl() {
    return ReactDOM.findDOMNode(this.refs.videoPlayer);
  }

  getVideoPlayerOptions() {
    return _defaults(
      {}, this.props.options, {
      height: this.props.resize ? 'auto' : (this.props.height || DEFAULT_HEIGHT),
      width: this.props.resize ? 'auto' : (this.props.width || DEFAULT_WIDTH)
    }, DEFAULT_VIDEO_OPTIONS);
  }

  getVideoResizeOptions() {
    return _defaults({}, this.props.resizeOptions, {
      aspectRatio: DEFAULT_ASPECT_RATIO,
      shortWindowVideoHeightAdjustment: DEFAULT_ADJUSTED_SIZE,
      defaultVideoWidthAdjustment: DEFAULT_ADJUSTED_SIZE,
      debounceTime: DEFAULT_RESIZE_DEBOUNCE_TIME
    });
  }

  getResizedVideoPlayerMeasurements() {
    var resizeOptions = this.getVideoResizeOptions();
    var aspectRatio = resizeOptions.aspectRatio;
    var defaultVideoWidthAdjustment = resizeOptions.defaultVideoWidthAdjustment;

    var winHeight = this._windowHeight();

    var baseWidth = this._videoElementWidth();

    var vidWidth = baseWidth - defaultVideoWidthAdjustment;
    var vidHeight = vidWidth * aspectRatio;

    if (winHeight < vidHeight) {
      var shortWindowVideoHeightAdjustment = resizeOptions.shortWindowVideoHeightAdjustment;
      vidHeight = winHeight - shortWindowVideoHeightAdjustment;
    }

    return {
      width: vidWidth,
      height: vidHeight
    };
  }

  setVideoPlayerSrc(src) {
    this._player.src(src);
  }

  mountVideoPlayer() {
    var src = this.props.src;
    var options = this.getVideoPlayerOptions();

    var playerEl =this.getVideoPlayerEl()
    playerEl.removeAttribute('data-reactid');

    this._player = vjs(playerEl, options);

    var player = this._player;

    _forEach(this.props.markers, this.drawMarker.bind(this));

    player.ready(this.handleVideoPlayerReady.bind(this));

    _forEach(this.props.eventListeners, function(val, key) {
      player.on(key, val);
    });

    player.src(src);

    if (this.props.endlessMode) {
      this.addEndlessMode();
    }
  }

  unmountVideoPlayer() {
    this.removeResizeEventListener();
    this._player.dispose();
  }

  addEndlessMode() {
    var player = this._player;

    player.on('ended', this.handleNextVideo);

    if (player.ended()) {
      this.handleNextVideo();
    }
  }

  addResizeEventListener() {
    var debounceTime = this.getVideoResizeOptions().debounceTime;

    this._handleVideoPlayerResize = _debounce(this.handleVideoPlayerResize, debounceTime);
    window.addEventListener('resize', this._handleVideoPlayerResize);
  }

  removeEndlessMode() {
    var player = this._player;

    player.off('ended', this.handleNextVideo);
  }

  removeResizeEventListener() {
    window.removeEventListener('resize', this._handleVideoPlayerResize);
  }

  pauseVideo() {
    this._player.pause();
  }

  playVideo() {
    this._player.play();
  }

  setCurrentTime(time) {
    this._player.currentTime(time);
  }

  restartVideo() {
    this._player.currentTime(0).play();
  }

  togglePauseVideo() {
    if (this._player.paused()) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  }

  handleVideoPlayerReady() {

    if (this.props.resize) {
      this.handleVideoPlayerResize();
      this.addResizeEventListener();
    }

    if(this.props.startWithControlBar){
      this._player.bigPlayButton.hide();
      this._player.controlBar.show();
      this._player.userActive(true);
      this._player.play();
      this._player.pause();
    }

    this.props.onReady();
  }

  handleVideoPlayerResize() {
    var player = this._player;
    var videoMeasurements = this.getResizedVideoPlayerMeasurements();

    player.dimensions(videoMeasurements.width, videoMeasurements.height);
  }

  handleNextVideo() {
    this.props.onNextVideo();
  }

  renderDefaultWarning() {
    return (
      <p>test</p>
    );
  }

  _windowHeight() {
    return window.innerHeight;
  }

  _videoElementWidth() {
    return this.getVideoPlayerEl().parentElement.parentElement.offsetWidth;
  }

  render() {
    var videoPlayerClasses = cx({
      'video-js': true,
      'vjs-default-skin': this.props.vjsDefaultSkin,
      'vjs-big-play-centered': this.props.vjsBigPlayCentered
    });

    return (
      <video ref="videoPlayer" className={videoPlayerClasses}>
        {this.props.children || this.renderDefaultWarning()}
      </video>
    );
  }
}

ReactVideoJsComponent.propTypes = {
    src: React.PropTypes.string.isRequired,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    endlessMode: React.PropTypes.bool,
    options: React.PropTypes.object,
    onReady: React.PropTypes.func,
    eventListeners: React.PropTypes.object,
    resize: React.PropTypes.bool,
    resizeOptions: React.PropTypes.shape({
      aspectRatio: React.PropTypes.number,
      shortWindowVideoHeightAdjustment: React.PropTypes.number,
      defaultVideoWidthAdjustment: React.PropTypes.number,
      debounceTime: React.PropTypes.number
    }),
    vjsDefaultSkin: React.PropTypes.bool,
    vjsBigPlayCentered: React.PropTypes.bool,
    startWithControlBar: React.PropTypes.bool,
    markers: React.PropTypes.arrayOf(React.PropTypes.object),
    children: React.PropTypes.element,
    dispose: React.PropTypes.bool,
    onNextVideo: React.PropTypes.func
};

ReactVideoJsComponent.defaultProps = {
    endlessMode: false,
    options: DEFAULT_VIDEO_OPTIONS,
    onReady: noop,
    eventListeners: {},
    resize: false,
    resizeOptions: {},
    vjsDefaultSkin: true,
    vjsBigPlayCentered: true,
    startWithControlBar: false,
    markers: [],
    onNextVideo: noop
};

ReactVideoJsComponent.displayName = ReactVideoJsComponent.constructor.name;
