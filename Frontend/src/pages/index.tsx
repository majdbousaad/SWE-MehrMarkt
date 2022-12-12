import { SnackbarProvider } from "notistack";
import Dashboard from "./Dashboard";

export default function index(){

    return (
        <SnackbarProvider maxSnack={1} preventDuplicate>
            <Dashboard/>
        </SnackbarProvider>
    )
}
