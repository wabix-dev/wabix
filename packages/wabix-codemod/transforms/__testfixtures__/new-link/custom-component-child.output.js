import Link from 'wabix/link'

function Comp({children}) {
    return children
} 

export default function Page() {
    return (
        <Link href="/">
            <Comp>Home</Comp>
        </Link>
    );
}