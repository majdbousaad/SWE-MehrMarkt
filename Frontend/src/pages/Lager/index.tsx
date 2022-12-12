import LagerPage from './LagerPage'


import { SnackbarProvider } from "notistack";

export default function(){

    return (
        <SnackbarProvider maxSnack={1} preventDuplicate>
            <LagerPage/>
        </SnackbarProvider>
    )
}

