/**
 * @file markerjs
 */
import vjs from 'video.js';
var Component = vjs.getComponent('Component');

/**
 * Progress Bar - MarkerBar
 *
 * @param {Object} player  Main Player
 * @param {Object=} options Object of option names and values
 * @extends Component
 * @class Marker
 */
class MarkerBar extends Component {

  constructor(player, options) {
    super(player, options);
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */

  createEl() {
    return super.createEl('div', {
      className: 'vjs-marker-bar',
    });
  }

}


vjs.registerComponent('MarkerBar', MarkerBar);
export default MarkerBar;