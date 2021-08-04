import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { ResponsiveModalInner } from "../advanced";
import SignaturePad from "signature_pad";

export default function InputSignature(props) {
  const [signURL, setSignURL] = useState(null);
  const [data, setData] = useState(null);
  const [showC, setShowC] = useState(false);
  const canvasEl = useRef(null);
  const wrapper = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState("500");
  const [canvasWidth, setCanvasWidth] = useState("600");
  let signaturePad;

  const handleShow = () => {
    setShowC(true);
  };

  useEffect(() => {
    if (showC) {
      setCanvasHeight(wrapper.current.offsetHeight);
      setCanvasWidth(wrapper.current.offsetWidth);
    }
  }, [showC]);

  useEffect(() => {
    if (props.signature) {
      setSignURL(props.signature);
    }
    if (showC) {
      signaturePad = new SignaturePad(canvasEl.current);
      if (data) {
        signaturePad.fromData(data);
      }
    }
  });

  const handleSave = () => {
    setSignURL(signaturePad.toDataURL());
    setData(signaturePad.toData());
    setShowC(false);
  };

  const handleChange = (ev) => {
    props.onChange(ev);
  };

  const handleClear = () => {
    signaturePad.clear();
    setData(null);
    setSignURL(null);
    setShowC(false);
  };

  const handleClose = () => {
    setShowC(false);
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
      {!showC ? (
        <button
          type="button"
          className="btn text-success btn-input btn-outline-secondary bg-light"
          onClick={handleShow}
        >
          <span className="text-secondary">Signature</span>
          <br />
          <img onCHange={handleChange} src={signURL} className="img-canvas" />
        </button>
      ) : (
        <ResponsiveModalInner
          onClose={handleClose}
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
