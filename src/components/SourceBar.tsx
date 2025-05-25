
const SourceBar = ({
    sources,
    size,
    handleClick,
    moveCount,
    dir,
    side,
    cls,
    handleDrop,
    draggingColor,
    setDraggingColor
}: {
    sources:  Array<[number, number, number] | null>,
    size: number,
    dir: "row" | "col",
    side: "top" | "bottom" | "left" | "right"
    handleClick: (i: number, dir: "row" | "col", side: "top" | "bottom" | "left" | "right") => void,
    moveCount: number,
    cls: string[],
    availableMove: number,
    handleDrop: (i: number,  draggingColor: [number, number, number],  dir: "row" | "col", side: "top" | "bottom" | "left" | "right") => void,
    draggingColor: [number, number, number] | null,
    setDraggingColor: (_: [number, number, number] | null) => void
}) => {
  return (
    <div className={`${cls && cls.join(' ')}`}>
    {sources.length === size &&
      sources.map((color, i) => {
        return (
          <div
          onDragOver={e => {
           
                e.preventDefault()
            
          }}
        onDrop={() => {
            if(moveCount >= 3 && draggingColor){
                handleDrop(i, draggingColor, dir, side)
            }
            setDraggingColor(null);
            
        }}
            key={`top-source-${i}`}
            onClick={() => handleClick(i, dir, side)}
            style={{
              cursor: moveCount >= 3 || color ? "not-allowed" : "pointer",
              flex: "0 0 auto",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: color
                ? `rgb(${color?.join(",")})`
                : "rgb(0,0,0)",
              margin: "1px",
            }}
          />
        );
      })}
  </div>
  )
}

export default SourceBar