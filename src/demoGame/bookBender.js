


function getBend(angleP, maxBend = 0.2) {
  const angle = angleP * Math.PI;
  const bendF = 0.5 - 0.5 * Math.cos(2 * angle);
  const bend = maxBend * bendF;
  const x1 = 0, y1 = 0;
  const x2 = Math.cos(angle), y2 = Math.sin(angle);
  const bendX = bend * (y2 - y1), bendY = bend * (x1 - x2);
  return (p) => {
    // const offset = Math.sqrt(1 - (2 * p - 1) ** 2);
    const offset = 1 - 4 * (p ** 1.5 - 0.5) ** 2;
    return [ p * x2 + offset * bendX, p * y2 + offset * bendY ];
  }
}

function drawBentImage(ctx, img1, sx1, sy1, sw1, sh1, img2, sx2, sy2, sw2, sh2, dx, dy, dw, dh, bendProgress, maxBend, segments = 8) {
  const bendFunc = getBend(bendProgress, maxBend);
  let currentBend = [0, 0], lastBend;
  ctx.save();
  ctx.translate(dx, dy);
  let offX1, offY1, offX2, offY2;
  const segmentWidth1 = sw1 / segments;
  const segmentWidth2 = sw2 / segments;
  const renderedSegmentWidth = Math.ceil(dw / segments) + 1;
  for (let s = 0; s < segments; s++) {
    // Get coordinates
    lastBend = currentBend;
    currentBend = bendFunc((s + 1) / segments);
    offX1 = dw * lastBend[0], offY1 = -dw * lastBend[1] * 0.2, offX2 = dw * currentBend[0], offY2 = -dw * currentBend[1] * 0.2;
    if (offX2 > offX1) {
      // Front side
      ctx.drawImage(img1, sx1 + segmentWidth1 * s, sy1, segmentWidth1, sh1, offX1, offY1, offX2 - offX1 + 1, dh);
    } else {
      // Back side
      ctx.drawImage(img2, sx2 + sw2 - segmentWidth2 * (s + 1), sy2, segmentWidth2, sh2, offX1, offY1, offX2 - offX1 - 1, dh);
    }
    ctx.save();
    // offset this segment
    ctx.restore();
  }
  ctx.restore();
}