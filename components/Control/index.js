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

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var didWarnFocusChangedFocused = false;

var Control = function (_Component) {
    (0, _inherits3.default)(Control, _Component);

    function Control(props) {
        (0, _classCallCheck3.default)(this, Control);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.state = {
            focused: !props.disabled && props.focused
        };

        _this._mousePressed = false;

        _this.onMouseDown = _this.onMouseDown.bind(_this);
        _this.onMouseUp = _this.onMouseUp.bind(_this);
        _this.onMouseEnter = _this.onMouseEnter.bind(_this);
        _this.onMouseLeave = _this.onMouseLeave.bind(_this);
        _this.onFocus = _this.onFocus.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        return _this;
    }

    Control.prototype.componentDidMount = function componentDidMount() {
        if (!didWarnFocusChangedFocused && this.props.focused !== undefined && this.props.onFocusChange === undefined) {
            process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'A Control has `focused` prop, but doesn\'t have `onFocusChange` listener. ' + 'This may lead to unwanted behaviour, when component kept being focused after ' + 're-rendering of the top component.') : void 0;
            didWarnFocusChangedFocused = true;
        }
        if (this.state.focused) {
            this.componentWillGainFocus();
        }
    };

    Control.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.disabled === true) {
            this.setState({ focused: false });
        } else if (nextProps.focused !== this.state.focused && nextProps.focused === true) {
            this.setState({ focused: nextProps.focused });
        }
    };

    Control.prototype.componentDidUpdate = function componentDidUpdate() {
        if (this.state.focused) {
            this.componentWillGainFocus();
        }
    };

    Control.prototype.componentWillGainFocus = function componentWillGainFocus() {
        if (this.refs.control) {
            this.refs.control.focus();
        }
    };

    Control.prototype.getControlHandlers = function getControlHandlers() {
        return {
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave
        };
    };

    Control.prototype.dispatchFocusChange = function dispatchFocusChange(focused) {
        if (typeof this.props.onFocusChange === 'function') {
            this.props.onFocusChange(focused, this.props);
        }
    };

    Control.prototype.dispatchHoverChange = function dispatchHoverChange(hovered) {
        if (typeof this.props.onHoverChange === 'function') {
            this.props.onHoverChange(hovered, this.props);
        }
    };

    Control.prototype.onMouseEnter = function onMouseEnter() {
        if (!this.props.disabled) {
            this.setState({ hovered: true });
            this.dispatchHoverChange(true);
        }
    };

    Control.prototype.onMouseLeave = function onMouseLeave() {
        this.setState({ hovered: false });
        this.dispatchHoverChange(false);
    };

    Control.prototype.onMouseDown = function onMouseDown() {
        this._mousePressed = true;
    };

    Control.prototype.onMouseUp = function onMouseUp() {
        this._mousePressed = false;
    };

    Control.prototype.onFocus = function onFocus() {
        if (!this.props.disabled) {
            var focused = void 0;
            // if focus wasn't set by mouse set focused state to "hard"
            if (!this._mousePressed) {
                focused = 'hard';
            } else {
                focused = true;
            }
            this.setState({ focused: focused });
            this.dispatchFocusChange(focused);
        }
    };

    Control.prototype.onBlur = function onBlur() {
        this.setState({ focused: false });
        this.dispatchFocusChange(false);
    };

    return Control;
}(_Component3.default);

exports.default = Control;
module.exports = exports['default'];