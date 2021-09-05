import React, { useEffect } from "react";
import Quagga from "@ericblade/quagga2";
import { beep } from "../helpers";

export default function Scanner({ onClose, onDetected }) {
  const config = {
    inputStream: {
      type: "LiveStream",
      constraints: {
        width: { min: 450 },
        height: { min: 300 },
        facingMode: "environment",
        aspectRatio: { min: 1, max: 2 },
      },
    },
    locator: {
      patchSize: "medium",
      halfSample: true,
    },
    numOfWorkers: 2,
    frequency: 10,
    decoder: {
      readers: [
        "ean_reader",
        "ean_8_reader",
        "code_128_reader" /* 
        "code_39_reader",
        "code_39_vin_reader",
        "codabar_reader", */,
      ],
      debug: {
        drawBoundingBox: false,
        showFrequency: false,
        drawScanline: false,
        showPattern: false,
      },
      multiple: false,
    },
    locate: true,
  };

  useEffect(() => {
    Quagga.init(config, (err) => {
      if (err) {
        onClose()
        console.log(err, "error msg");
        return
      }
      Quagga.start();
    });
    Quagga.onProcessed((result) => {
      let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;
      drawingCanvas.style.display = "none";
    });
    Quagga.onDetected(detected);
    return () => {
      Quagga.offDetected();
      Quagga.offProcessed();
      Quagga.stop();
    };
  }, []);

  const detected = (result) => {
    console.log("detect");
    beep(new AudioContext());
    onDetected(result.codeResult.code);
    Quagga.stop();
  };

  return <div id="interactive" className="viewport" />;
}
