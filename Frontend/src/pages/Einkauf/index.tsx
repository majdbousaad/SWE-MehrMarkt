import EinkaufPage from './EinkaufPage'

import { SnackbarProvider } from "notistack";

export default function(){

    return (
        <SnackbarProvider maxSnack={1} preventDuplicate>
            <EinkaufPage/>
        </SnackbarProvider>
    )
}


