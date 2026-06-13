import { useEffect } from "react";
import { HomeApiHelper } from "../../api/helpers/home-api/home-api.helper"
const homeApiHelper = new HomeApiHelper();

function HomePage() {

    useEffect(() => {
        async function get() {
            const users = await homeApiHelper.getAllUsers();
            console.log(users);

        }
        get()
    }, [])
    return (
        <div>HomePage</div>
    )
}

export default HomePage