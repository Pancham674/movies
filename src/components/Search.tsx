import "../css/Search.css"

export default function Search({searchMoviesFunc, setSearchTermFunc, currentSearchTerm}: {searchMoviesFunc: (e: any) => void, setSearchTermFunc: any, currentSearchTerm: string}) {

    return (
        <form onSubmit={(e) => searchMoviesFunc(e)} className="search-form">
            <input type="text"
                   className="search-input"
                   placeholder="Search for movies..."
                   value={currentSearchTerm} 
                   onChange={(e) => setSearchTermFunc(e.target.value)}
            />
            
            <button type="submit"
                    className="search-button">
                    Search
            </button>
        </form>
    );
}