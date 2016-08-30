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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _Popup = require('../Popup');

var _Popup2 = _interopRequireDefault(_Popup);

var _Menu = require('../Menu');

var _Menu2 = _interopRequireDefault(_Menu);

var _Icon = require('../Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _Group = require('../Group');

var _Group2 = _interopRequireDefault(_Group);

var _Item = require('../Item');

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = _react2.default.createElement(_Icon2.default, { className: 'select__tick' });

var Select = function (_Component) {
    (0, _inherits3.default)(Select, _Component);

    function Select(props) {
        (0, _classCallCheck3.default)(this, Select);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.state = {
            menuHeight: null,
            menuFocused: false,
            popupVisible: false
        };

        _this._wasPopupVisible = false;
        _this._shouldRestoreButtonFocus = false;
        _this._preventTrapMenuFocus = false;
        _this._cachedChildren = null;

        _this.onButtonClick = _this.onButtonClick.bind(_this);
        _this.onButtonKeyDown = _this.onButtonKeyDown.bind(_this);
        _this.onMenuChange = _this.onMenuChange.bind(_this);
        _this.onMenuFocusChange = _this.onMenuFocusChange.bind(_this);
        _this.onMenuItemClick = _this.onMenuItemClick.bind(_this);
        _this.onMenuKeyDown = _this.onMenuKeyDown.bind(_this);
        _this.onPopupRequestHide = _this.onPopupRequestHide.bind(_this);
        _this.onPopupLayout = _this.onPopupLayout.bind(_this);
        return _this;
    }

    Select.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.children !== this.props.children) {
            this._cachedChildren = null;
        }
    };

    Select.prototype.componentWillUpdate = function componentWillUpdate(_, nextState) {
        if (nextState.popupVisible !== this.state.popupVisible && !nextState.popupVisible) {
            this._wasPopupVisible = false;
            this.setState({ menuFocused: false });
        }
    };

    Select.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var _this2 = this;

        this._shouldRestoreButtonFocus = false;
        this._preventTrapMenuFocus = false;

        // FIXME(narqo@): an ugly trick to prevent DOM-focus from jumping to the bottom of the page on first open
        // @see https://github.com/narqo/react-islands/issues/41
        if (!this._wasPopupVisible && this.state.popupVisible) {
            this._wasPopupVisible = true;
            this.updateMenuWidth();
            process.nextTick(function () {
                _this2.setState({ menuFocused: true });
                _this2.trapMenuFocus();
            });
        } else if (this.props.value !== prevProps.value) {
            this.updateMenuWidth();
        }
    };

    Select.prototype.componentWillUnmount = function componentWillUnmount() {
        this.setState({ popupVisible: false });
        this._cachedChildren = null;
    };

    Select.prototype.render = function render() {
        return _react2.default.createElement(
            'div',
            { className: this.className() },
            this.renderInputs(),
            this.renderButton(),
            _react2.default.createElement(
                _Popup2.default,
                { theme: this.props.theme, size: this.props.size,
                    anchor: this.refs.button,
                    directions: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
                    visible: this.state.popupVisible,
                    onLayout: this.onPopupLayout,
                    onRequestHide: this.onPopupRequestHide
                },
                this.renderMenu()
            )
        );
    };

    Select.prototype.renderButtonText = function renderButtonText() {
        var value = this.props.value;

        return this.getItems().reduce(function (res, item) {
            if (value.indexOf(item.props.value) !== -1) {
                if (value.length === 1) {
                    res.push(item.props.children);
                } else {
                    res.push(item.props.checkedText || item.props.children);
                }
            }
            return res;
        }, []);
    };

    Select.prototype.renderButton = function renderButton() {
        var _props = this.props;
        var theme = _props.theme;
        var size = _props.size;
        var disabled = _props.disabled;
        var mode = _props.mode;
        var value = _props.value;

        var focused = !disabled && this._shouldRestoreButtonFocus ? true : undefined;
        var checked = (mode === 'check' || mode === 'radio-check') && Array.isArray(value) && value.length > 0;

        return _react2.default.createElement(
            _Button2.default,
            { ref: 'button', theme: theme, size: size, className: 'select__button',
                type: 'button',
                disabled: disabled,
                checked: checked,
                focused: focused,
                onClick: this.onButtonClick,
                onKeyDown: this.onButtonKeyDown
            },
            this.renderButtonText() || this.props.placeholder,
            _ref
        );
    };

    Select.prototype.renderMenu = function renderMenu() {
        var _props2 = this.props;
        var theme = _props2.theme;
        var size = _props2.size;
        var disabled = _props2.disabled;
        var mode = _props2.mode;
        var value = _props2.value;
        var _state = this.state;
        var menuHeight = _state.menuHeight;
        var menuFocused = _state.menuFocused;
        var popupVisible = _state.popupVisible;

        var focused = popupVisible && menuFocused;
        var tabIndex = -1;

        return _react2.default.createElement(
            _Menu2.default,
            { ref: 'menu', theme: theme, size: size, className: 'select__menu',
                mode: mode,
                value: value,
                tabIndex: tabIndex,
                disabled: disabled,
                focused: focused,
                maxHeight: menuHeight,
                onItemClick: this.onMenuItemClick,
                onKeyDown: this.onMenuKeyDown,
                onChange: this.onMenuChange,
                onFocusChange: this.onMenuFocusChange
            },
            this.props.children
        );
    };

    Select.prototype.renderInputs = function renderInputs() {
        if (this.props.disabled) {
            return null;
        }

        var name = this.props.name;

        return this.props.value.map(function (value, i) {
            return _react2.default.createElement('input', { type: 'hidden', key: 'input' + i, name: name, value: value });
        });
    };

    Select.prototype.className = function className() {
        // NOTE: see narqo/react-islands#98 for notes about `_js_inited`
        var className = 'select select_js_inited';

        var theme = this.props.theme || this.context.theme;
        if (theme) {
            className += ' select_theme_' + theme;
        }
        if (this.props.size) {
            className += ' select_size_' + this.props.size;
        }
        if (this.props.mode) {
            className += ' select_mode_' + this.props.mode;
        }
        if (this.props.disabled) {
            className += ' select_disabled';
        }
        if (this.state.popupVisible) {
            className += ' select_opened';
        }

        if (this.props.className) {
            className += ' ' + this.props.className;
        }
        return className;
    };

    Select.prototype.getItems = function getItems() {
        var _this3 = this;

        if (!this._cachedChildren) {
            (function () {
                var items = [];

                _react2.default.Children.forEach(_this3.props.children, function (child) {
                    if (_Component3.default.is(child, _Item2.default)) {
                        items.push(child);
                    } else if (_Component3.default.is(child, _Group2.default)) {
                        //  Предполагаем, что ничего, кроме Item внутри Group уже нет.
                        items = items.concat(_react2.default.Children.toArray(child.props.children));
                    }
                });

                _this3._cachedChildren = items;
            })();
        }

        return this._cachedChildren;
    };

    Select.prototype.getButton = function getButton() {
        return this.refs.button;
    };

    Select.prototype.getMenu = function getMenu() {
        return this.refs.menu;
    };

    Select.prototype.trapMenuFocus = function trapMenuFocus() {
        if (!this._preventTrapMenuFocus) {
            this.getMenu().componentWillGainFocus();
        }
    };

    Select.prototype.updateMenuWidth = function updateMenuWidth() {
        var buttonWidth = _reactDom2.default.findDOMNode(this.getButton()).offsetWidth;
        _reactDom2.default.findDOMNode(this.getMenu()).style['min-width'] = buttonWidth + 'px';
    };

    Select.prototype.onButtonClick = function onButtonClick() {
        this.setState({ popupVisible: !this.state.popupVisible });
    };

    Select.prototype.onButtonKeyDown = function onButtonKeyDown(e) {
        if (!this.state.popupVisible && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && !e.shiftKey) {
            this.setState({ popupVisible: true });
        }
    };

    Select.prototype.onMenuItemClick = function onMenuItemClick() {
        if (this.props.mode === 'radio' || this.props.mode === 'radio-check') {
            this._shouldRestoreButtonFocus = true;
            // NOTE(narqo@): select with mode radio* must be closed on click within <Menu>
            this.setState({ popupVisible: false });
        }
    };

    Select.prototype.onMenuKeyDown = function onMenuKeyDown(e) {
        // NOTE(narqo@): allow to move focus to another focusable using <Tab>
        // @see https://www.w3.org/TR/wai-aria-practices-1.1/#menu
        if (this.state.popupVisible && e.key === 'Tab') {
            this._preventTrapMenuFocus = true;
            this._shouldRestoreButtonFocus = true;
            this.setState({ popupVisible: false });
        }
    };

    Select.prototype.onMenuChange = function onMenuChange(value) {
        this.props.onChange(value, this.props);
    };

    Select.prototype.onMenuFocusChange = function onMenuFocusChange(focused) {
        if (!focused && this.state.popupVisible) {
            // NOTE(narqo@): restore DOM focus to the Menu if still opened
            this.trapMenuFocus();
        }
    };

    Select.prototype.onPopupLayout = function onPopupLayout(_ref2, popupProps) {
        var layout = _ref2.layout;
        var maxHeight = this.props.maxHeight;
        var viewportOffset = popupProps.viewportOffset;
        var _window = window;
        var pageYOffset = _window.pageYOffset;


        if (layout.direction.indexOf('top-') > -1) {
            var newTop = maxHeight ? layout.bottom - maxHeight : layout.top;
            layout.top = Math.max(newTop, pageYOffset + viewportOffset);
        } else {
            var newBottom = maxHeight ? layout.top + maxHeight : layout.bottom;
            layout.bottom = Math.min(newBottom, pageYOffset + window.innerHeight - viewportOffset);
        }

        var menuHeight = layout.bottom - layout.top;

        this.setState({ menuHeight: menuHeight });
    };

    Select.prototype.onPopupRequestHide = function onPopupRequestHide(_, reason) {
        this._shouldRestoreButtonFocus = reason === 'escapeKeyPress';
        this.setState({ popupVisible: false });
    };

    return Select;
}(_Component3.default);

Select.contextTypes = {
    theme: _react2.default.PropTypes.string
};

Select.defaultProps = {
    placeholder: '—',
    maxHeight: 0,
    onChange: function onChange() {}
};

exports.default = Select;
module.exports = exports['default'];