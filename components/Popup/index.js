'use strict';

exports.__esModule = true;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _Overlay = require('../Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FIXME(narqo@): this is only valid for theme islands
var MAIN_OFFSET = 5;
var VIEWPORT_OFFSET = 10;
var VIEWPORT_ACCURACY_FACTOR = 0.99;
var DEFAULT_DIRECTIONS = ['bottom-left', 'bottom-center', 'bottom-right', 'top-left', 'top-center', 'top-right', 'right-top', 'right-center', 'right-bottom', 'left-top', 'left-center', 'left-bottom'];

var Popup = function (_Component) {
    (0, _inherits3.default)(Popup, _Component);

    function Popup(props) {
        (0, _classCallCheck3.default)(this, Popup);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.state = {
            direction: undefined,
            left: undefined,
            top: undefined,
            zIndex: 0
        };

        _this.shouldRenderToOverlay = false;

        _this.onLayerOrderChange = _this.onLayerOrderChange.bind(_this);
        _this.onLayerRequestHide = _this.onLayerRequestHide.bind(_this);
        _this.onViewportResize = _this.onViewportResize.bind(_this);
        _this.onViewportScroll = _this.onViewportScroll.bind(_this);
        return _this;
    }

    Popup.prototype.componentWillUpdate = function componentWillUpdate(nextProps) {
        if (!this.shouldRenderToOverlay && nextProps.visible) {
            this.shouldRenderToOverlay = true;
        }
    };

    Popup.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        if (this.shouldRenderToOverlay && this.props.visible !== prevProps.visible) {
            this.reposition();
            this.handleVisibleChange(this.props.visible);
        }
    };

    Popup.prototype.componentWillUnmount = function componentWillUnmount() {
        this.handleVisibleChange(false);
    };

    Popup.prototype.render = function render() {
        if (this.shouldRenderToOverlay) {
            var style = {
                left: this.state.left,
                top: this.state.top,
                zIndex: this.state.zIndex
            };

            return _react2.default.createElement(
                _Overlay2.default,
                {
                    visible: this.props.visible,
                    onRequestHide: this.onLayerRequestHide,
                    onOrderChange: this.onLayerOrderChange
                },
                _react2.default.createElement(
                    'div',
                    { ref: 'popup', className: this.className(), style: style },
                    this.props.children
                )
            );
        } else {
            return _react2.default.createElement(
                'div',
                { className: this.className() },
                this.props.children
            );
        }
    };

    Popup.prototype.className = function className() {
        var className = 'popup';

        var theme = this.props.theme || this.context.theme;
        if (theme) {
            className += ' popup_theme_' + theme;
        }
        if (this.props.size) {
            className += ' popup_size_' + this.props.size;
        }
        if (this.state.direction) {
            className += ' popup_direction_' + this.state.direction;
        }
        if (this.props.visible) {
            className += ' popup_visible';
        }
        if (this.shouldRenderToOverlay) {
            // FIXME(@narqo): `popup_js_inited` must be set for CSS of bem-components
            className += ' popup_js_inited';
        }

        if (this.props.className) {
            className += ' ' + this.props.className;
        }

        return className;
    };

    Popup.prototype.handleVisibleChange = function handleVisibleChange(visible) {
        // NOTE(@narqo): subscribe to resize/scroll only if popup can be repositioned within `directions`
        if (visible && this.props.directions.length > 1) {
            window.addEventListener('resize', this.onViewportResize);
            window.addEventListener('scroll', this.onViewportScroll);
        } else {
            window.removeEventListener('resize', this.onViewportResize);
            window.removeEventListener('scroll', this.onViewportScroll);
        }
    };

    Popup.prototype.onLayerRequestHide = function onLayerRequestHide(e, reason) {
        if (this.props.visible && this.props.onRequestHide) {
            if (reason === 'clickOutside') {
                var anchor = this.getAnchor();
                if (anchor instanceof Element && anchor.contains(e.target)) {
                    return;
                }
            }
            this.props.onRequestHide(e, reason, this.props);
        }
    };

    Popup.prototype.onLayerOrderChange = function onLayerOrderChange(zIndex) {
        this.setState({ zIndex: zIndex });
    };

    Popup.prototype.onViewportResize = function onViewportResize() {
        this.reposition();
    };

    Popup.prototype.onViewportScroll = function onViewportScroll() {
        this.reposition();
    };

    Popup.prototype.reposition = function reposition() {
        if (this.props.visible) {
            // TODO(@narqo): don't call DOMNode measurements in case nothing has changed
            var layout = this.calcBestLayoutParams();

            if (this.props.onLayout) {
                this.props.onLayout({ layout: layout }, this.props);
            }

            var direction = layout.direction;
            var left = layout.left;
            var top = layout.top;


            this.setState({ direction: direction, left: left, top: top });
        }
    };

    Popup.prototype.getPopup = function getPopup() {
        return _reactDom2.default.findDOMNode(this.refs.popup);
    };

    Popup.prototype.getAnchor = function getAnchor() {
        if (!this.props.anchor) {
            return null;
        }

        var anchor = void 0;
        if (typeof this.props.anchor === 'function') {
            anchor = this.props.anchor();
        } else {
            anchor = this.props.anchor;
        }

        if (anchor instanceof _Component3.default) {
            return _reactDom2.default.findDOMNode(anchor);
        } else {
            return anchor || null;
        }
    };

    Popup.prototype.calcBestLayoutParams = function calcBestLayoutParams() {
        var viewport = this.calcViewportDimensions();
        var popup = this.calcPopupDimensions();
        var anchor = this.calcAnchorDimensions();

        var i = 0,
            bestViewportFactor = 0,
            bestDirection = void 0,
            bestPos = void 0,
            direction = void 0;

        while (direction = this.props.directions[i++]) {
            // eslint-disable-line no-cond-assign
            var position = this.calcPopupPosition(direction, anchor, popup);
            var viewportFactor = this.calcViewportFactor(position, viewport, popup);

            if (i === 1 || viewportFactor > bestViewportFactor || !bestViewportFactor && this.state.direction === direction) {
                bestDirection = direction;
                bestViewportFactor = viewportFactor;
                bestPos = position;
            }
            if (bestViewportFactor > VIEWPORT_ACCURACY_FACTOR) break;
        }

        return (0, _extends3.default)({
            direction: bestDirection
        }, bestPos);
    };

    Popup.prototype.calcAnchorDimensions = function calcAnchorDimensions() {
        var anchor = this.getAnchor();
        var left = void 0,
            top = void 0,
            width = void 0,
            height = void 0;

        if (anchor instanceof Element) {
            var anchorRect = anchor.getBoundingClientRect();
            var viewportRect = document.documentElement.getBoundingClientRect();
            left = anchorRect.left - viewportRect.left;
            top = anchorRect.top - viewportRect.top;
            width = anchorRect.width;
            height = anchorRect.height;
        } else if (anchor === null) {
            left = top = height = width = 0;
        } else if ((typeof anchor === 'undefined' ? 'undefined' : (0, _typeof3.default)(anchor)) === 'object') {
            left = anchor.left;
            top = anchor.top;
            width = height = 0;
        }

        return {
            left: left,
            top: top,
            width: width,
            height: height
        };
    };

    Popup.prototype.calcViewportDimensions = function calcViewportDimensions() {
        var top = window.pageYOffset;
        var left = window.pageXOffset;
        var height = window.innerHeight;
        var width = window.innerWidth;

        return {
            top: top,
            left: left,
            bottom: top + height,
            right: left + width
        };
    };

    Popup.prototype.calcViewportFactor = function calcViewportFactor(pos, viewport, popup) {
        var viewportOffset = this.props.viewportOffset;

        var intersectionLeft = Math.max(pos.left, viewport.left + viewportOffset);
        var intersectionRight = Math.min(pos.left + popup.width, viewport.right - viewportOffset);
        var intersectionTop = Math.max(pos.top, viewport.top + viewportOffset);
        var intersectionBottom = Math.min(pos.top + popup.height, viewport.bottom - viewportOffset);

        if (intersectionLeft < intersectionRight && intersectionTop < intersectionBottom) {
            // has intersection
            return (intersectionRight - intersectionLeft) * (intersectionBottom - intersectionTop) / popup.area;
        } else {
            return 0;
        }
    };

    Popup.prototype.calcPopupDimensions = function calcPopupDimensions() {
        var popup = this.getPopup();
        var width = 0,
            height = 0;

        if (popup) {
            width = popup.offsetWidth;
            height = popup.offsetHeight;
        }

        return {
            width: width,
            height: height,
            area: width * height
        };
    };

    Popup.prototype.calcPopupPosition = function calcPopupPosition(direction, anchor, popup) {
        var _props = this.props;
        var mainOffset = _props.mainOffset;
        var secondaryOffset = _props.secondaryOffset;

        var top = void 0,
            left = void 0;

        if (checkMainDirection(direction, 'bottom')) {
            top = anchor.top + anchor.height + mainOffset;
        } else if (checkMainDirection(direction, 'top')) {
            top = anchor.top - popup.height - mainOffset;
        } else if (checkMainDirection(direction, 'left')) {
            left = anchor.left - popup.width - mainOffset;
        } else if (checkMainDirection(direction, 'right')) {
            left = anchor.left + anchor.width + mainOffset;
        }

        if (checkSecondaryDirection(direction, 'right')) {
            left = anchor.left + anchor.width - popup.width - secondaryOffset;
        } else if (checkSecondaryDirection(direction, 'left')) {
            left = anchor.left + secondaryOffset;
        } else if (checkSecondaryDirection(direction, 'bottom')) {
            top = anchor.top + anchor.height - popup.height - secondaryOffset;
        } else if (checkSecondaryDirection(direction, 'top')) {
            top = anchor.top + secondaryOffset;
        } else if (checkSecondaryDirection(direction, 'center')) {
            if (checkMainDirection(direction, 'top', 'bottom')) {
                left = anchor.left + anchor.width / 2 - popup.width / 2;
            } else if (checkMainDirection(direction, 'left', 'right')) {
                top = anchor.top + anchor.height / 2 - popup.height / 2;
            }
        }

        var bottom = top + popup.height;
        var right = left + popup.width;

        return { top: top, left: left, bottom: bottom, right: right };
    };

    return Popup;
}(_Component3.default);

function checkMainDirection(direction, mainDirection1, mainDirection2) {
    return !direction.indexOf(mainDirection1) || mainDirection2 && !direction.indexOf(mainDirection2);
}

function checkSecondaryDirection(direction, secondaryDirection) {
    return ~direction.indexOf('-' + secondaryDirection);
}

Popup.propsTypes = {
    theme: _react2.default.PropTypes.string,
    size: _react2.default.PropTypes.string,
    visible: _react2.default.PropTypes.bool.isRequired,
    anchor: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.shape({ left: _react2.default.PropTypes.number, top: _react2.default.PropTypes.number }), _react2.default.PropTypes.func]),
    directions: _react2.default.PropTypes.oneOf(DEFAULT_DIRECTIONS),
    mainOffset: _react2.default.PropTypes.number,
    secondaryOffset: _react2.default.PropTypes.number,
    onRequestHide: _react2.default.PropTypes.func,
    onLayout: _react2.default.PropTypes.func
};

Popup.defaultProps = {
    directions: DEFAULT_DIRECTIONS,
    visible: false,
    mainOffset: MAIN_OFFSET,
    secondaryOffset: 0,
    viewportOffset: VIEWPORT_OFFSET,
    onRequestHide: function onRequestHide() {}
};

Popup.contextTypes = {
    theme: _react2.default.PropTypes.string
};

exports.default = Popup;
module.exports = exports['default'];