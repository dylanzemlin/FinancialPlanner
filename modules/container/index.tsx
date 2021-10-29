// pages/index.js
import { NextPage } from 'next';
import Head from 'next/head';

const Container: NextPage<{
    title?: string,
    class?: string
}> = (props) => {
    return (
        <div style={{ width: "100%", height: "100vh" }} className={props.class}>
            <Head>
                <title> { props.title ?? "Project 2 | ENGR 1411" } </title>
            </Head>
            
            { props.children }
        </div>
    )
}
export default Container;