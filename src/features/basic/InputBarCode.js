import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { ResponsiveModalInner } from "../advanced";
import { InputGroup, InputGroupAppend, Scanner } from ".";
import { hasUserMedia } from "../helpers";

export default function InputBarCode(props) {
  const [showVideo, setShowVideo] = useState(false);
  const [scanned, setScanned] = useState("");

  const handleCordovaScan = () => {
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        if (!result.cancelled) {
          setScanned(result.text);
        }
      },
      function (error) {}
    );
  };

  const handleShowVideo = () => {
    setScanned(null);
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  const onInputChange = (ev) => {
    setScanned(ev.target.value);
    props.onChange(ev);
  };

  const handleClear = () => setScanned(null);

  const onDetected = (result) => {
    setScanned(result);
  };
  let buttons = [];
  return (
    <div>
      <div>
        {!showVideo ? (
          <InputGroup {...props}>
            <input
              type="text"
              className={classnames(
                "border-secondary form-control",
                props.size && `form-control-${props.size}`
              )}
              name={props.name}
              value={scanned || ""}
              onChange={onInputChange}
              placeholder={props.placeholder}
            />
            <InputGroupAppend>
              {(!!window.cordova || hasUserMedia()) && (
                <button
                  type="button"
                  className="btn text-success btn-input btn-outline-secondary bg-light"
                  onClick={
                    !!window.cordova ? handleCordovaScan : handleShowVideo
                  }
                >
                  {props.barCodeIcon}
                </button>
              )}
              <button
                type="button"
                className="btn btn-input text-warning btn-outline-secondary bg-light"
                onClick={handleClear}
              >
                {props.delOneIcon}
              </button>
            </InputGroupAppend>
          </InputGroup>
        ) : (
          <ResponsiveModalInner
            onClose={handleCloseVideo}
            modalClassName="bg-dark text-light"
            modalBackgroundColor="bg-light"
            {...props}
          >
            <div className="barcode-container">
              {!scanned ? (
                <>
                  <Scanner onClose={handleCloseVideo} onDetected={onDetected} />
                </>
              ) : (
                handleCloseVideo()
              )}
            </div>
          </ResponsiveModalInner>
        )}
      </div>
    </div>
  );
}

InputBarCode.propTypes = {
  onChange: PropTypes.func,
  size: PropTypes.string,
};

InputBarCode.defaultProps = {
  onChange: () => {},
  size: null,
};
