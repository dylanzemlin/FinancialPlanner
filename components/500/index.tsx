import Container from "@/modules/container";

export default function ServerError() {
    return (
        <Container title="1411P2 - 500 Internal Server Error" className="flex column centered" >

            <h1 style={{ marginBottom: "1.13rem" }}> 500 | Internal Server Error </h1>
            <p>There seems to have be some sort of internal error, please try again later! </p>

        </Container>
    )
}
