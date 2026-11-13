import { Navigate, useLocation } from "react-router-dom"

/**
 * Permanently redirects a retired route to its replacement, keeping the query string
 * (e.g. ?redirect=...) so old links and bookmarks keep working.
 */
export const LegacyRedirect:React.FC<{to:string}> = ({to})=>{
    const {search} = useLocation()
    return <Navigate to={{pathname: to, search}} replace/>
}
