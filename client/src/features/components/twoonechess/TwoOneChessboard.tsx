// types
import { BoardOrientation, MoveWithAssignment } from "features/engine/chessEngine";
import { Square } from "chess.js";

// components
import PreviewConfirmButton from "features/components/twoonechess/PreviewConfirmButton";
import { Chessboard } from "react-chessboard";

// material ui
import { ButtonGroup, Divider } from "@mui/material";

// hooks
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";

interface TwoOneChessboardInterface {
  boardOrientation: BoardOrientation,
  position: string | undefined,
  customArrows: string[][],
  onDropHandler: ((sourceSquare: Square, targetSquare: Square) => boolean) | undefined,
  bottomButtonsActive: boolean,
  handleMove: Function,
  setPreview: Function,
  bottomButtonMoves: {
    fBotMove: MoveWithAssignment,
    sBotMove: MoveWithAssignment,
    tBotMove: MoveWithAssignment,
  }

}

const TwoOneChessboard: React.FC<TwoOneChessboardInterface> = ({
  boardOrientation,
  position,
  customArrows,
  onDropHandler,
  bottomButtonsActive,
  handleMove,
  setPreview,
  bottomButtonMoves
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const { width, height } = useWindowDimensions();
  const [desktopBoardWidth, setDesktopBoardWidth] = useState(560);

  useEffect(() => {
    if (width > 768 && width <= 850) {
      setDesktopBoardWidth(560 - (850 - width))
    }
    if (width > 850 && 1050 >= width) {
      setDesktopBoardWidth(560)
    }
    if (width > height && width > 1050) {
      setDesktopBoardWidth(560 + (width - 1050) * (2/Math.log(width - 1049)));
    }
  }, [height, width]);

  return (
          <>
            <Chessboard
              boardWidth             = { isMobile ? width : desktopBoardWidth }
              customArrows           = { customArrows }
              boardOrientation       = { boardOrientation }
              customDropSquareStyle  = { {boxShadow: 'inset 0 0 1px 6px rgba(0,255,255,0.75)'} }
              customArrowColor       = { "rgb(255,170,0)" } 
              customDarkSquareStyle  = { { backgroundColor: '#B58863' } }
              customLightSquareStyle = { { backgroundColor: '#F0D9B5' } }
              position               = { position} 
              onPieceDrop            = { onDropHandler }
            />
          {bottomButtonsActive &&
            <ButtonGroup
              style={{marginTop: "1rem", height: "4rem"}}
              fullWidth={true}>
              <PreviewConfirmButton
                botMove={bottomButtonMoves.fBotMove}
                handleMove={handleMove}
                setBotMovePreviews={setPreview}/>
              <Divider sx={{ borderRightWidth: 1, minHeight: "4rem" }} orientation="vertical" flexItem={true}/>
              <PreviewConfirmButton
                botMove={bottomButtonMoves.sBotMove}
                handleMove={handleMove}
                setBotMovePreviews={setPreview}/>
              <Divider sx={{ borderRightWidth: 1, minHeight: "4rem" }} orientation="vertical" flexItem={true}/>
              <PreviewConfirmButton
                botMove={bottomButtonMoves.tBotMove}
                handleMove={handleMove}
                setBotMovePreviews={setPreview}/>
            </ButtonGroup>
          }
          </>
  );
}

export default TwoOneChessboard;
