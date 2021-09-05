import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { ResponsiveModalInner } from "../advanced";
import SignaturePad from "signature_pad";

export default function InputSignature(props) {
  const [signURL, setSignURL] = useState(null);
  const [data, setData] = useState(null);
  const [showSignPad, setShowSignPad] = useState(false);
  const canvasEl = useRef(null);
  const wrapper = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState("500");
  const [canvasWidth, setCanvasWidth] = useState("400");
  const willSign = !["ABSEN", "REFUS"].includes(props.enum_esign);
  let signaturePad;

  useEffect(() => {
    if (showSignPad) {
      setCanvasHeight(wrapper.current.offsetHeight * 0.9);
      setCanvasWidth(wrapper.current.offsetWidth * 0.9);
      signaturePad = new SignaturePad(canvasEl.current);
      if (data) {
        signaturePad.fromData(data);
      }
    }
  });

  useEffect(() => {
    if (signURL) {
      handleChange(signURL);
    }
  }, [signURL]);

  useEffect(() => {
    if (props.value) {
      setSignURL("data:image/png;base64," + props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (!willSign) {
      setSignURL(null);
      sendChangeValue(null);
    }
  }, [props.enum_esign]);

  const handleChange = (data) => {
    const str = data.split(",")[1];
    sendChangeValue(str);
  };

  const handleSave = () => {
    setSignURL(signaturePad.toDataURL());
    setData(signaturePad.toData());
    setShowSignPad(false);
  };

  const handleClear = () => {
    signaturePad.clear();
    setData(null);
    setSignURL(null);
    setShowSignPad(false);
    sendChangeValue(null);
  };

  const sendChangeValue = (data) =>
    props.onChange({
      target: {
        name: props.name,
        value: data,
      },
    });

  const handleClose = () => {
    setShowSignPad(false);
    signaturePad = false;
  };

  const buttons = [
    {
      function: handleSave,
      icon: "Valider",
      theme: "success",
    },
    {
      function: handleClear,
      icon: "Effacer",
      theme: "warning",
    },
  ];

  return (
    <>
      {showSignPad ? (
        <ResponsiveModalInner
          onClose={handleClose}
          onChange={handleChange}
          buttons={buttons}
          height="100%"
          {...props}
        >
          <div ref={wrapper} className="wrapper">
            <canvas
              ref={canvasEl}
              height={canvasHeight}
              width={canvasWidth}
            ></canvas>
          </div>
        </ResponsiveModalInner>
      ) : (
        <>
          {willSign && (
            <button
              type="button"
              className="sign-btn btn text-success btn-input btn-outline-secondary bg-light"
              onClick={() => setShowSignPad(true)}
            >
              <img src={signURL} className="img-canvas" />
            </button>
          )}
        </>
      )}
    </>
  );
}

InputSignature.propTypes = {
  onChange: PropTypes.func,
  size: PropTypes.string,
};

InputSignature.defaultProps = {
  onChange: () => {},
  size: null,
};
