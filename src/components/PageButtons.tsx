// <-, firstPage, currentPage -1, currentPage, currentPage +1, lastPage, ->
// where to add useState? 
// only use one func to handle all interaction, 
// this component needs a ref to the page number and pass it as a prob to the func

export default function PageButtons(handlePageChange: () => {}, currentPageNum: number, maxPageNum : number) {
    const previousPage = currentPageNum == 0 ? currentPageNum : currentPageNum--;
    const nextPage = currentPageNum > maxPageNum ? currentPageNum : currentPageNum++;
    
    return (<>
        <button id="backwards-btn" onClick={handlePageChange}></button>

        {/* <button id="firstPage-btn" onClick={handleForwardsBtn}></button>
        <button id="currentPageNegOne-btn" onClick={handleForwardsBtn}></button>
        <button id="currentPage-btn" onClick={handleForwardsBtn}></button>
        <button id="currentPagePosOne-btn" onClick={handleForwardsBtn}></button> */}
        
        <button id="forwards-btn" onClick={handlePageChange}></button>
    </>)
}