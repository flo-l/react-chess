import React from 'react';

import '../css/promotion_picker.css'

export default function PromotionPicker(props) {
  const playerColor = props.playerColor;
  return (
    <div className="promotion-picker">
      {
        Object.values(props.playerColor)
          .filter(piece => piece !== playerColor.PAWN && piece !== playerColor.KING)
          .map(piece => (
            <div
              className="promotion-option"
              onClick={() => props.promotionChosen(piece)}
              key={piece}>
              {piece}
            </div>
          ))
        }
    </div>
  );
}
