
const SourceBar = ({
    sources,
    size,
    handleClick,
    moveCount,
    dir,
    side,
    cls
}: {
    sources:  Array<[number, number, number] | null>,
    size: number,
    dir: "row" | "col",
    side: "top" | "bottom" | "left" | "right"
    handleClick: (i: number, dir: "row" | "col", side: "top" | "bottom" | "left" | "right") => void,
    moveCount: number,
    cls: string[]
}) => {
  return (
    <div className={`${cls && cls.join(' ')}`}>
    {sources.length === size &&
      sources.map((color, i) => {
        return (
          <div
            key={`top-source-${i}`}
            onClick={() => handleClick(i, dir, side)}
            style={{
              cursor: moveCount >= 3 || color ? "not-allowed" : "pointer",
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