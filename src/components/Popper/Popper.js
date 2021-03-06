import classNames from 'classnames';
import Popper from 'popper.js';
import PropTypes from 'prop-types';
import React from 'react';
import './Popper.css';

class Popover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popperJS: null,
      visible: props.isVisible,
      showPopper: props.isVisible
    };

    this.popoverWrapperRef = React.createRef();
    this.referenceElm = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { showPopper } = this.state;
    const { isVisible, onChange } = this.props;

    this.setPopperJS();

    if (
      prevProps.isVisible !== isVisible &&
      isVisible !== showPopper &&
      showPopper !== prevProps.showPopper
    )
      this.setState({ showPopper: isVisible });

    if (onChange && showPopper !== prevState.showPopper) onChange(showPopper);

    if (showPopper && prevState.showPopper !== showPopper) this.createPopper();
  }

  componentDidMount() {
    this.timer = setInterval(() => this.setPopperJS(), 3);

    document.addEventListener('click', this.handleClick);
  }

  setPopperJS = () => {
    if (this.state.showPopper) {
      this.state.popperJS
        ? this.state.popperJS.scheduleUpdate()
        : this.createPopper();
      setTimeout(() => clearInterval(this.timer), 1000);
    }
  };

  createPopper = () => {
    if (this.referenceElm && this.popoverWrapperRef)
      this.setState({
        popperJS: new Popper(
          this.referenceElm,
          this.popoverWrapperRef,
          {
            placement: this.props.placement,
            ...this.props.modifiers
          },
          () =>
            setTimeout(() => {
              this.state.popperJS.scheduleUpdate();
            }, 10)
        )
      });
  };

  doToggle = toggler => {
    this.setState(
      {
        showPopper: toggler && true
      },
      () => {
        if (this.state.showPopper)
          this.setState(
            {
              visible:
                typeof toggler !== 'undefined' ? toggler : !this.state.visible
            },
            () => {
              this.createPopper();
              this.state.popperJS.scheduleUpdate();
            }
          );
      }
    );
  };

  handleClick = e => {
    const { target } = e;
    if (this.popoverWrapperRef && this.state.showPopper) {
      if (
        this.popoverWrapperRef.contains(target) ||
        this.referenceElm.contains(target) ||
        target === this.referenceElm
      )
        return;

      this.doToggle(false);
    }
  };

  render() {
    const {
      children,
      className,
      clickable,
      domElement,
      modifiers,
      id,
      isVisible,
      onChange,
      placement,
      popover,
      style,
      tag: Tag,
      ...attributes
    } = this.props;

    const { visible, showPopper } = this.state;

    const popper = children[1];
    const Wrapper = children[0];
    return (
      <>
        {!domElement ? (
          <Wrapper.type
            {...Wrapper.props}
            onMouseEnter={() => !clickable && this.doToggle(true)}
            onMouseLeave={() =>
              !clickable &&
              !popover &&
              setTimeout(() => this.doToggle(false), 0)
            }
            onTouchStart={() => !clickable && this.doToggle(true)}
            onTouchEnd={() => !clickable && !popover && this.doToggle(false)}
            onMouseDown={() => {
              clickable && this.doToggle(!showPopper);
              setTimeout(() => this.setPopperJS(), 100);
            }}
            onMouseUp={() => setTimeout(() => this.setPopperJS(), 0)}
            innerRef={ref => (this.referenceElm = ref)}
            data-popper={id}
          />
        ) : (
          <Wrapper.type
            {...Wrapper.props}
            onMouseEnter={() => !clickable && this.doToggle(true)}
            onMouseLeave={() =>
              !clickable &&
              !popover &&
              setTimeout(() => this.doToggle(false), 0)
            }
            onTouchStart={() => !clickable && this.doToggle(true)}
            onTouchEnd={() => !clickable && !popover && this.doToggle(false)}
            onMouseDown={() => clickable && this.doToggle(!showPopper)}
            onMouseUp={() => setTimeout(() => this.setPopperJS(), 0)}
            ref={ref => (this.referenceElm = ref)}
            data-popper={id}
          />
        )}
        {showPopper && (
          <Tag
            ref={ref => (this.popoverWrapperRef = ref)}
            className={classNames(
              visible && 'show',
              popover ? 'popover' : 'tooltip px-2',
              className
            )}
            data-popper={id}
            {...attributes}
          >
            {popper}
            <span x-arrow='' className='popover_arrow'></span>
          </Tag>
        )}
      </>
    );
  }
}

Popover.propTypes = {
  children: PropTypes.node,
  clickable: PropTypes.bool,
  domElement: PropTypes.bool,
  modifiers: PropTypes.object,
  id: PropTypes.string,
  isVisible: PropTypes.bool,
  placement: PropTypes.string,
  popover: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.string),
  tag: PropTypes.string
};

Popover.defaultProps = {
  clickable: false,
  domElement: false,
  id: 'popper',
  isVisible: false,
  placement: 'top',
  popover: false,
  style: { display: 'inline-block' },
  tag: 'div'
};

export default Popover;
export { Popover as MDBPopper };
export { Popover as MDBTooltip };
export { Popover as Tooltip };
export { Popover as MDBPopover };
