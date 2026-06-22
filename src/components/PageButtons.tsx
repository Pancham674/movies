// <-, firstPage, currentPage -1, currentPage, currentPage +1, lastPage, ->
// where to add useState? 
// only use one func to handle all interaction, 
// this component needs a ref to the page number and pass it as a prob to the func

export default function PageButtons(handleForwardsBtn: () => {}, handleBackwardsBtn: () => {}, ) {
    return (<>
        <button id="backwards-btn" onClick={handleBackwardsBtn}></button>

        {/* <button id="firstPage-btn" onClick={handleForwardsBtn}></button>
        <button id="currentPageNegOne-btn" onClick={handleForwardsBtn}></button>
        <button id="currentPage-btn" onClick={handleForwardsBtn}></button>
        <button id="currentPagePosOne-btn" onClick={handleForwardsBtn}></button> */}
        
        <button id="forwards-btn" onClick={handleForwardsBtn}></button>
    </>)
}