'use strict';

exports.__esModule = true;

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

var _Control2 = require('../Control');

var _Control3 = _interopRequireDefault(_Control2);

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Radio = function (_Control) {
    (0, _inherits3.default)(Radio, _Control);

    function Radio(props) {
        (0, _classCallCheck3.default)(this, Radio);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Control.call(this, props));

        _this.onButtonClick = _this.onButtonClick.bind(_this);
        _this.onButtonFocusChange = _this.onButtonFocusChange.bind(_this);
        _this.onButtonHoverChange = _this.onButtonHoverChange.bind(_this);
        _this.onControlChange = _this.onControlChange.bind(_this);
        return _this;
    }

    Radio.prototype.render = function render() {
        var _props = this.props;
        var name = _props.name;
        var theme = _props.theme;
        var size = _props.size;
        var type = _props.type;
        var checked = _props.checked;
        var disabled = _props.disabled;
        var value = _props.value;
        var focused = this.state.focused;


        if (type === 'button') {
            return _react2.default.createElement(
                'label',
                { className: this.className() },
                checked && _react2.default.createElement('input', { type: 'hidden', name: name, value: value, disabled: disabled }),
                _react2.default.createElement(
                    _Button2.default,
                    { theme: theme, size: size, type: type,
                        disabled: disabled,
                        checked: checked,
                        focused: focused,
                        onFocusChange: this.onButtonFocusChange,
                        onHoverChange: this.onButtonHoverChange,
                        onClick: this.onButtonClick
                    },
                    this.props.children
                )
            );
        } else {
            return _react2.default.createElement(
                'label',
                (0, _extends3.default)({ className: this.className() }, this.getControlHandlers()),
                _react2.default.createElement(
                    'span',
                    { className: 'radio__box' },
                    _react2.default.createElement('input', { ref: 'control', className: 'radio__control', type: 'radio', autoComplete: 'off',
                        name: name,
                        disabled: disabled,
                        value: value,
                        checked: checked,
                        onChange: this.onControlChange
                    })
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'radio__text', role: 'presentation' },
                    this.props.children
                )
            );
        }
    };

    Radio.prototype.className = function className() {
        // NOTE: see narqo/react-islands#98 for notes about `_js_inited`
        var className = 'radio radio_js_inited';

        var theme = this.props.theme || this.context.theme;
        if (theme) {
            className += ' radio_theme_' + theme;
        }
        if (this.props.size) {
            className += ' radio_size_' + this.props.size;
        }
        if (this.props.type) {
            className += ' radio_type_' + this.props.type;
        }
        if (this.props.disabled) {
            className += ' radio_disabled';
        }
        if (this.props.checked) {
            className += ' radio_checked';
        }
        if (this.state.hovered) {
            className += ' radio_hovered';
        }
        if (this.state.focused) {
            className += ' radio_focused';
        }

        if (this.props.className) {
            className += ' ' + this.props.className;
        }

        return className;
    };

    Radio.prototype.onControlChange = function onControlChange() {
        if (this.props.disabled || this.props.checked) {
            return;
        }
        this.props.onCheck(true, this.props);
    };

    Radio.prototype.onButtonFocusChange = function onButtonFocusChange(focused) {
        this.setState({ focused: focused });
    };

    Radio.prototype.onButtonHoverChange = function onButtonHoverChange(hovered) {
        this.setState({ hovered: hovered });
    };

    Radio.prototype.onButtonClick = function onButtonClick(e) {
        if (this.props.onClick) {
            this.props.onClick(e, this.props);
        }
        if (!e.isDefaultPrevented()) {
            this.onControlChange();
        }
    };

    return Radio;
}(_Control3.default);

Radio.propTypes = {
    theme: _react2.default.PropTypes.string,
    size: _react2.default.PropTypes.oneOf(['s', 'm', 'l', 'xl']),
    type: _react2.default.PropTypes.string,
    disabled: _react2.default.PropTypes.bool,
    checked: _react2.default.PropTypes.bool,
    value: _react2.default.PropTypes.any,
    onClick: _react2.default.PropTypes.func,
    onCheck: _react2.default.PropTypes.func
};

Radio.defaultProps = {
    onCheck: function onCheck() {}
};

Radio.contextTypes = {
    theme: _react2.default.PropTypes.string
};

exports.default = Radio;
module.exports = exports['default'];