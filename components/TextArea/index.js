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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextArea = function (_Control) {
    (0, _inherits3.default)(TextArea, _Control);

    function TextArea(props) {
        (0, _classCallCheck3.default)(this, TextArea);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Control.call(this, props));

        _this.onInputChange = _this.onInputChange.bind(_this);
        return _this;
    }

    TextArea.prototype.render = function render() {
        return _react2.default.createElement('textarea', (0, _extends3.default)({}, this.getControlHandlers(), { ref: 'control', className: this.className(),
            name: this.props.name,
            disabled: this.props.disabled,
            placeholder: this.props.placeholder,
            value: this.props.value,
            onChange: this.onInputChange
        }));
    };

    TextArea.prototype.className = function className() {
        // NOTE: see narqo/react-islands#98 for notes about `_js_inited`
        var className = 'textarea textarea_js_inited';

        var theme = this.props.theme || this.context.theme;
        if (theme) {
            className += ' textarea_theme_' + theme;
        }
        if (this.props.size) {
            className += ' textarea_size_' + this.props.size;
        }
        if (this.props.disabled) {
            className += ' textarea_disabled';
        }
        if (this.state.hovered) {
            className += ' textarea_hovered';
        }
        if (this.state.focused) {
            className += ' textarea_focused';
        }

        if (this.props.className) {
            className += ' ' + this.props.className;
        }

        return className;
    };

    TextArea.prototype.onInputChange = function onInputChange(e) {
        if (this.props.disabled) {
            return;
        }
        this.props.onChange(e.target.value, this.props);
    };

    return TextArea;
}(_Control3.default);

TextArea.contextTypes = {
    theme: _react2.default.PropTypes.string
};

TextArea.propTypes = {
    theme: _react2.default.PropTypes.string,
    size: _react2.default.PropTypes.oneOf(['s', 'm', 'l', 'xl']),
    name: _react2.default.PropTypes.string,
    value: _react2.default.PropTypes.string,
    placeholder: _react2.default.PropTypes.string,
    disabled: _react2.default.PropTypes.bool,
    onChange: _react2.default.PropTypes.func
};

TextArea.defaultProps = {
    onChange: function onChange() {}
};

exports.default = TextArea;
module.exports = exports['default'];