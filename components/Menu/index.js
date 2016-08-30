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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _Item = require('../Item');

var _Item2 = _interopRequireDefault(_Item);

var _Group = require('../Group');

var _Group2 = _interopRequireDefault(_Group);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function appendItemToCache(item, cache) {
    if (_Component3.default.is(item, _Item2.default)) {
        cache.push(item);
    }
}

var Menu = function (_Component) {
    (0, _inherits3.default)(Menu, _Component);

    function Menu(props) {
        (0, _classCallCheck3.default)(this, Menu);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.state = (0, _extends3.default)({}, _this.state, {
            value: _this._validateValue(_this.props.value),
            hoveredIndex: null
        });

        _this._cachedChildren = null;
        _this._hoveredItemIndex = null;
        _this._shouldScrollToItem = false;

        _this.onMouseUp = _this.onMouseUp.bind(_this);
        _this.onMouseDown = _this.onMouseDown.bind(_this);
        _this.onFocus = _this.onFocus.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.onItemClick = _this.onItemClick.bind(_this);
        _this.onItemHover = _this.onItemHover.bind(_this);
        return _this;
    }

    Menu.prototype.componentWillMount = function componentWillMount() {
        //  Если мы как-то поменяли value (внутри _validValue),
        //  то нужно сообщить про это наверх.
        if (this.props.value !== this.state.value) {
            this.props.onChange(this.state.value, this.props);
        }
    };

    Menu.prototype.componentDidMount = function componentDidMount() {
        if (this.props.focused) {
            this.componentWillGainFocus();
        }
        this._scrollToMenuItem();
    };

    Menu.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: this._validateValue(nextProps.value) });
        }
    };

    Menu.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        if (this.props.children !== prevProps.children) {
            this._cachedChildren = null;
        }

        if (prevProps.focused && !this.props.focused) {
            this.componentWillLostFocus();
        } else if (!prevProps.focused && this.props.focused) {
            this.componentWillGainFocus();
        }

        if (this._shouldScrollToItem) {
            this._shouldScrollToItem = false;
            this._scrollToMenuItem();
        }
    };

    Menu.prototype.componentWillUnmount = function componentWillUnmount() {
        this._cachedChildren = null;
    };

    Menu.prototype.componentWillGainFocus = function componentWillGainFocus() {
        if (this.refs.control) {
            this.refs.control.focus();
        }
    };

    Menu.prototype.componentWillLostFocus = function componentWillLostFocus() {
        if (this.refs.control) {
            this.refs.control.blur();
        }
    };

    Menu.prototype._getChildren = function _getChildren() {
        var _this2 = this;

        if (!this._cachedChildren) {
            this._cachedChildren = [];

            _react2.default.Children.forEach(this.props.children, function (child) {
                if (_Component3.default.is(child, _Group2.default)) {
                    _react2.default.Children.forEach(child.props.children, function (item) {
                        return appendItemToCache(item, _this2._cachedChildren);
                    });
                } else {
                    appendItemToCache(child, _this2._cachedChildren);
                }
            });
        }

        return this._cachedChildren;
    };

    Menu.prototype._getFirstEnabledChild = function _getFirstEnabledChild() {
        if (this.props.disabled) return null;

        var children = this._getChildren();

        for (var i = 0; i < children.length; i++) {
            var item = children[i];
            if (!item.props.disabled) {
                return item;
            }
        }

        return null;
    };

    Menu.prototype._getFirstEnabledChildIndex = function _getFirstEnabledChildIndex() {
        return this._getChildren().indexOf(this._getFirstEnabledChild());
    };

    Menu.prototype._validateValue = function _validateValue(value) {
        var newValue = void 0;

        if (value == null) {
            newValue = [];
        } else if (Array.isArray(value)) {
            newValue = value;
        } else {
            newValue = [value];
        }

        var filteredValue = this._getChildren().reduce(function (res, item) {
            var itemValue = item.props.value;

            if (newValue.indexOf(itemValue) !== -1) {
                res.push(itemValue);
            }

            return res;
        }, []);

        if (filteredValue.length !== newValue.length) {
            newValue = filteredValue;
        }

        if (this.props.mode === 'radio') {
            if (newValue.length === 0) {
                var firstChild = this._getFirstEnabledChild();

                newValue = firstChild === null ? [] : [firstChild.props.value];
            } else if (newValue.length > 1) {
                newValue = [newValue[0]];
            }
        } else if (this.props.mode === 'radio-check' && newValue.length > 1) {
            newValue = [newValue[0]];
        }

        //  Раз уж начал упарываться, то остановиться уже сложно.
        //  Теперь в newValue:
        //
        //    * Массив;
        //    * В котором значения из переданного value (массива или просто значения);
        //    * И которые при этом есть в values самого меню.
        //    * При этом, если в value был массив, в котором были только валидные значения,
        //      подходящие к данному mode, то вернется именно этот массив.
        //      Что позволит сравнить исходное value с вот этим новым.
        //
        //  Но, увы, это сравнение все равно даст неверный результат,
        //  если в value передать не массив или ничего не передать :(
        //  Но так уже заморачиваться не хочется. Проще эксепшен кинуть на невалидный value.
        //
        return newValue;
    };

    Menu.prototype._scrollToMenuItem = function _scrollToMenuItem() {
        if (this.refs.control && this.refs.focusedMenuItem) {
            var menuDOMNode = _reactDom2.default.findDOMNode(this.refs.control);
            var focusedItemDOMNode = _reactDom2.default.findDOMNode(this.refs.focusedMenuItem);
            var menuRect = menuDOMNode.getBoundingClientRect();
            var focusedRect = focusedItemDOMNode.getBoundingClientRect();

            if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
                menuDOMNode.scrollTop = focusedItemDOMNode.offsetTop + focusedItemDOMNode.clientHeight - menuDOMNode.offsetTop - menuDOMNode.offsetHeight;
            }
        }
    };

    Menu.prototype.render = function render() {
        var _props = this.props;
        var disabled = _props.disabled;
        var maxHeight = _props.maxHeight;

        var tabIndex = disabled ? -1 : this.props.tabIndex;
        var menu = this._renderMenu();

        var style = void 0;
        if (maxHeight) {
            style = {
                maxHeight: maxHeight
            };
        }

        return _react2.default.createElement(
            'div',
            { ref: 'control', className: this.className(),
                style: style,
                tabIndex: tabIndex,
                onKeyDown: this.onKeyDown,
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
                onFocus: this.onFocus,
                onBlur: this.onBlur
            },
            menu
        );
    };

    Menu.prototype._renderMenu = function _renderMenu() {
        var _this3 = this;

        var index = 0;

        return _react2.default.Children.map(this.props.children, function (child) {
            if (_Component3.default.is(child, _Item2.default)) {
                return _this3._renderMenuItem(child.props, index++);
            } else if (_Component3.default.is(child, _Group2.default)) {
                var groupedItems = _react2.default.Children.map(child.props.children, function (groupChild) {
                    return _this3._renderMenuItem(groupChild.props, index++);
                });

                return _this3._renderMenuGroup(child.props, groupedItems);
            } else {
                //  FIXME: Или тут бросать ошибку?
                return child;
            }
        });
    };

    Menu.prototype._renderMenuItem = function _renderMenuItem(props, index) {
        var _props2 = this.props;
        var theme = _props2.theme;
        var size = _props2.size;
        var disabled = _props2.disabled;
        var mode = _props2.mode;
        var _state = this.state;
        var value = _state.value;
        var hoveredIndex = _state.hoveredIndex;

        var checkable = Boolean(mode);
        var hovered = index === hoveredIndex;
        var key = 'menuitem' + (props.id || index);

        return _react2.default.createElement(_MenuItem2.default, (0, _extends3.default)({
            theme: theme,
            size: size,
            disabled: disabled,
            hovered: hovered,
            checked: checkable && value.indexOf(props.value) !== -1,
            ref: hovered ? 'focusedMenuItem' : null,
            key: key,
            index: index
        }, props, {
            onClick: this.onItemClick,
            onHover: this.onItemHover
        }));
    };

    Menu.prototype._renderMenuGroup = function _renderMenuGroup(props, children) {
        var title = void 0;
        if (props.title) {
            title = _react2.default.createElement(
                'div',
                { className: 'menu__group-title' },
                props.title
            );
        }

        return _react2.default.createElement(
            'div',
            { className: 'menu__group' },
            title,
            children
        );
    };

    Menu.prototype.className = function className() {
        // NOTE: see narqo/react-islands#98 for notes about `_js_inited`
        var className = 'menu menu_js_inited';

        var theme = this.props.theme || this.context.theme;
        if (theme) {
            className += ' menu_theme_' + theme;
        }
        if (this.props.size) {
            className += ' menu_size_' + this.props.size;
        }
        if (this.props.mode) {
            className += ' menu_mode_' + this.props.mode;
        }
        if (this.props.disabled) {
            className += ' menu_disabled';
        }
        if (this.state.focused) {
            className += ' menu_focused';
        }

        if (this.props.className) {
            className += ' ' + this.props.className;
        }

        return className;
    };

    Menu.prototype.dispatchFocusChange = function dispatchFocusChange(focused) {
        this.props.onFocusChange(focused);
    };

    Menu.prototype.dispatchItemClick = function dispatchItemClick(e, itemProps) {
        var item = this._getChildren()[itemProps.index];
        if (typeof item.props.onClick === 'function') {
            item.props.onClick(e, item.props, this.props);
        }
        this.props.onItemClick(e, itemProps);
    };

    Menu.prototype.onItemHover = function onItemHover(hovered, itemProps) {
        this.setState({
            hoveredIndex: hovered ? itemProps.index : null
        });
    };

    Menu.prototype.onItemClick = function onItemClick(e, itemProps) {
        var index = itemProps.index;

        this._hoveredItemIndex = index;
        this.dispatchItemClick(e, itemProps);
        this.onItemCheck(index);
    };

    Menu.prototype.onMouseDown = function onMouseDown() {
        this._mousePressed = true;
    };

    Menu.prototype.onMouseUp = function onMouseUp() {
        this._mousePressed = false;
    };

    Menu.prototype.onFocus = function onFocus() {
        if (this.props.disabled) {
            return;
        }

        this.setState({ focused: true });

        if (!this._mousePressed) {
            var hoveredIndex = this._hoveredItemIndex;
            if (hoveredIndex === null) {
                hoveredIndex = this._getFirstEnabledChildIndex();
            }
            if (hoveredIndex !== this.state.hoveredIndex) {
                this._hoveredItemIndex = hoveredIndex;
                this.setState({ hoveredIndex: hoveredIndex });
            }
        }

        this.dispatchFocusChange(true);
    };

    Menu.prototype.onBlur = function onBlur() {
        this.setState({
            focused: false,
            hoveredIndex: null
        });

        this.dispatchFocusChange(false);
    };

    Menu.prototype.onKeyDown = function onKeyDown(e) {
        if (this.props.disabled || !this.state.focused) {
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();

            var children = this._getChildren();
            var len = children.length;
            if (!len) {
                return;
            }

            var dir = e.key === 'ArrowDown' ? 1 : -1;
            var nextIndex = this.state.hoveredIndex;
            do {
                nextIndex = (nextIndex + len + dir) % len;
                if (nextIndex === this.state.hoveredIndex) {
                    return;
                }
            } while (children[nextIndex].props.disabled);

            if (nextIndex !== null) {
                this._hoveredItemIndex = nextIndex;
                this._shouldScrollToItem = true;
                this.setState({ hoveredIndex: nextIndex });
            }
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();

            if (this.state.hoveredIndex !== null) {
                this.onItemClick(e, { index: this.state.hoveredIndex });
            }
        }

        if (this.props.onKeyDown) {
            this.props.onKeyDown(e, this.props);
        }
    };

    Menu.prototype.onItemCheck = function onItemCheck(index) {
        var mode = this.props.mode;

        if (!mode) {
            return;
        }

        var item = this._getChildren()[index];
        var itemValue = item.props.value;
        var menuValue = this.state.value;
        var checked = menuValue.indexOf(itemValue) !== -1;

        var newMenuValue = void 0;
        if (mode === 'radio') {
            if (checked) {
                return;
            }

            newMenuValue = [itemValue];
        } else if (mode === 'radio-check') {
            newMenuValue = checked ? [] : [itemValue];
        } else {
            newMenuValue = checked ? menuValue.filter(function (value) {
                return value !== itemValue;
            }) : menuValue.concat(itemValue);
        }

        if (newMenuValue) {
            this.setState({ value: newMenuValue });
            this.props.onChange(newMenuValue, this.props);
        }
    };

    return Menu;
}(_Component3.default);

Menu.contextTypes = {
    theme: _react2.default.PropTypes.string
};

Menu.defaultProps = {
    maxHeight: null,
    tabIndex: 0,
    onChange: function onChange() {},
    onFocusChange: function onFocusChange() {},
    onItemClick: function onItemClick() {}
};

exports.default = Menu;
module.exports = exports['default'];