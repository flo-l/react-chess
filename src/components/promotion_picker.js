import React from 'react';

export default function PromotionPicker(props) {
  const playerColor = props.playerColor;
  return (
    <div className="promotion-picker">
      {
        Object.values(props.playerColor)
          .filter(piece => piece !== playerColor.PAWN && piece !== playerColor.KING)
          .map(piece => (
            <div onClick={() => props.promotionChosen(piece)}>
              {piece}
            </div>
          ))
        }
    </div>
  );
}
