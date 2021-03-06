'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function (_Component) {
    (0, _inherits3.default)(App, _Component);

    function App() {
        (0, _classCallCheck3.default)(this, App);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    App.prototype.render = function render() {
        return _react2.default.createElement(
            'div',
            null,
            this.props.children
        );
    };

    App.prototype.getChildContext = function getChildContext() {
        return {
            theme: this.props.theme
        };
    };

    return App;
}(_Component3.default);

App.childContextTypes = {
    theme: _react2.default.PropTypes.string
};

exports.default = App;
module.exports = exports['default'];