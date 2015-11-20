/**
 * @file markerjs
 */
import vjs from 'video.js';
var Component = vjs.getComponent('Component');

/**
 * Progress Bar - Marker
 *
 * @param {Object} player  Main Player
 * @param {Object=} options Object of option names and values
 * @extends Component
 * @class Marker
 */
class Marker extends Component {

  constructor(player, options) {
    super(player, options);

    this.on('click', this.handleClick);

    var duration = player.duration();
    var offset = (options.seconds/options.duration)
    this.offset = offset*100;

    player.on('ready', function(){this.setOffset(this.offset);}.bind(this));

    
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */
  createEl() {

    return super.createEl('div', {
      className: 'vjs-marker',
      innerHTML: '<span class="vjs-control-marker"><span class="vj-control-marker-inner">+</span></span>'
    });
  }

  setOffset(position) {
    var el = this.el()
    el.style.left = position + '%';
    el.style.position = 'absolute';
  }

  handleClick() {
   
  }

}

Marker.prototype.controlText_ = 'Play Video';

vjs.registerComponent('Marker', Marker);
export default Marker;