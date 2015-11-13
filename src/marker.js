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
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */

  createEl() {
    return super.createEl('div', {
      className: 'vjs-marker'
    });
  }

  handleClick() {
   
  }

}

Marker.prototype.controlText_ = 'Play Video';

vjs.registerComponent('Marker', Marker);
export default Marker;