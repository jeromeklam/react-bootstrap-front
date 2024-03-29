import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";
import { ResponsiveButton } from "../basic";
import { sizeGreater } from "../helpers";
import { Portal, WidthObserver } from ".";
import { SmLoading9x9 } from "../spinner";

let zIndex = 1200;

const duration = 300;

const defaultStyle = {
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
  exiting: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
  exited: { opacity: 0 },
};

const backStyle = {
  position: "fixed",
  left: "0px",
  right: "0px",
  top: "0px",
  bottom: "0px",
};

const modalStyle = {
  display: "block",
  position: "fixed",
  left: "0px",
  right: "0px",
  top: "0px",
  bottom: "0px",
};

const closeStyle = {
  position: "absolute",
  right: "20px",
  top: "5px",
  padding: "5px",
  fontSize: "2rem",
  fontWeight: "200",
};

const titleStyle = {
  position: "absolute",
  right: "50px",
  top: "0px",
};

const inlineStyle = {
  maxHeight: "650px",
  padding: "10px",
};

export default class ResponsiveModalCamera extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    buttons: PropTypes.element,
    size: PropTypes.string.isRequired,
    title: PropTypes.string,
    height: PropTypes.string,
    loader: PropTypes.bool,
    modalClassName: PropTypes.string,
    closeClassName: PropTypes.string,
    header: PropTypes.element,
    zoom: PropTypes.number,
  };

  static defaultProps = {
    children: null,
    buttons: [],
    title: "",
    height: "",
    loader: false,
    modalClassName: "bg-secondary text-light",
    closeClassName: "text-light",
    header: null,
    zoom: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      opacity: "0",
      show: false,
    };
  }

  componentDidMount() {
    const list = document.getElementsByClassName("modal-opacity");
    if (list.length <= 1) {
      this.setState({ opacity: "0.8", show: true });
    } else {
      this.setState({ show: true });
    }
  }

  render() {
    const bStyles = { ...backStyle, opacity: this.state.opacity };
    let iStyles = { overflowX: "hidden", overflowY: "auto" };
    let scrollStyles = { ...inlineStyle };
    if (this.props.height && this.props.height !== "") {
      iStyles.height = this.props.height;
      iStyles.minHeight = this.props.height;
      inlineStyle.maxHeight = this.props.height;
    } else {
      switch (this.props.size) {
        case "xl":
          iStyles.height = "580px";
          iStyles.minHeight = "580px";
          scrollStyles.maxHeight = "580px";
          break;
        case "lg":
          iStyles.height = "480px";
          iStyles.minHeight = "480px";
          scrollStyles.maxHeight = "480px";
          break;
        case "md":
          iStyles.height = "450px";
          iStyles.minHeight = "450px";
          scrollStyles.maxHeight = "450px";
          break;
        default:
          iStyles.height = "350px";
          iStyles.minHeight = "350px";
          scrollStyles.maxHeight = "350px";
          break;
      }
    }
    return (
      <Portal className="backdrop-style" zIndex={zIndex++}>
        <div
          className="modal-style modal-opacity"
          style={{ ...bStyles, zIndex: zIndex++ }}
        />
        <Transition in={this.state.show} timeout={100}>
          {(state) => (
            <div
              className={classnames("modal", state)}
              style={{
                ...modalStyle,
                zIndex: zIndex++,
                ...defaultStyle,
                ...transitionStyles[state],
              }}
            >
              <WidthObserver zoom={this.props.zoom}>
                {({ mediaSize }) => (
                  <div
                    className={classnames(
                      "modal-dialog d-flex flex-column justify-content-center",
                      sizeGreater(this.props.size, mediaSize)
                        ? "modal-fullscreen"
                        : `h-100 modal-${this.props.size}`,
                      state
                    )}
                  >
                    <div className="modal-content modal-shadow">
                      <div
                        className={classnames(
                          "modal-header pb-2",
                          this.props.modalClassName
                        )}
                        style={{ display: "initial", minHeight: "10vh" }}
                      >
                        <div className="row">
                          <div className="col-xs-w36">
                            <h5
                              className="modal-title"
                              id="exampleModalLabel"
                              style={titleStyle}
                            >
                              {(sizeGreater(mediaSize, "xs") ||
                                !this.props.tabs ||
                                (this.props.tabs &&
                                  this.props.tabs.length <= 0)) &&
                                this.props.title}
                            </h5>
                            {this.props.loader ? (
                              <div className="text-light modal-header-loader">
                                <SmLoading9x9 />
                              </div>
                            ) : (
                              <button
                                type="button"
                                style={closeStyle}
                                className={classnames(
                                  "close",
                                  this.props.closeClassName
                                )}
                                onClick={(ev) => {
                                  if (ev) {
                                    ev.stopPropagation();
                                  }
                                  this.props.onClose();
                                }}
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="modal-body bg-secondary p-0"
                        style={iStyles}
                      >
                        {this.props.children}
                      </div>
                    </div>
                  </div>
                )}
              </WidthObserver>
            </div>
          )}
        </Transition>
      </Portal>
    );
  }
}
