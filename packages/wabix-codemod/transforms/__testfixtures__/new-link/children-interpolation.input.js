import Link from 'wabix/link'

function Comp({children}) {
    return children
} 

const c = <Comp />

export default function Page() {
    return (
        <Link href="/about" legacyBehavior>
            {c}
        </Link>
    );
}

