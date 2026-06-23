import "../css/PageButtons.css"

export default function PageButtons({handlePageChange, currentPageNum, maxPageNum} : {handlePageChange: (toPage: number) => void, currentPageNum: number, maxPageNum: number}) {
    const prePrevPage = currentPageNum <= 2 ? currentPageNum : currentPageNum -2;
    const prevPage = currentPageNum == 1 ? currentPageNum : currentPageNum -1;
    const nextPage = currentPageNum >= maxPageNum ? currentPageNum : currentPageNum +1;
    const nexNextPage = currentPageNum >= maxPageNum - 2 ? currentPageNum : currentPageNum +2;
    
    return (
    <div className="PageButtons">
        { currentPageNum > 3 ? <button id="first-page-btn" onClick={() => handlePageChange(1)}>{1}</button> : ""}
        { prePrevPage !== currentPageNum ? <button id="double-previous-btn" onClick={() => handlePageChange(prePrevPage)}>{prePrevPage}</button> : ""}
        { prevPage !== currentPageNum ? <button id="previous-btn" onClick={() => handlePageChange(prevPage)}>{prevPage}</button> : ""}
        <p>{currentPageNum}</p>
        { nextPage !== currentPageNum && nextPage !== maxPageNum ? <button id="next-btn" onClick={() => handlePageChange(nextPage)}>{nextPage}</button>: ""}
        { nexNextPage !== currentPageNum ? <button id="double-next-btn" onClick={() => handlePageChange(nexNextPage)}>{nexNextPage}</button>: ""}
        { currentPageNum !== maxPageNum ? <button id="last-page-btn" onClick={() => handlePageChange(maxPageNum)}>{maxPageNum}</button>: ""}

        <form onSubmit={() => handlePageChange(150)}>
            <label htmlFor="toPageNum">Enter page number:</label>
            <input name="toPageNum" type="number" maxLength={maxPageNum} minLength={1} />
            <button type="submit" />
        </form>
    </div>)
}