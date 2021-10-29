// pages/index.js
import { NextPage } from 'next';
import Head from 'next/head';
import Loading from '../loading/loading';

const Container: NextPage<{
    title?: string,
    class?: string,
    loading?: boolean
}> = (props) => {
    if(props.loading == true) {
        return <Loading />
    }

    return (
        <div style={{ width: "100%", height: "100vh", backgroundColor: "#121212" }} className={props.class}>
            <Head>
                <title> { props.title ?? "Project 2 | ENGR 1411" } </title>
            </Head>
            
            { props.children }
        </div>
    )
}
export default Container;