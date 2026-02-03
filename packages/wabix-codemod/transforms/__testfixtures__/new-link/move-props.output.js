import Link from 'wabix/link'
export default function Page() {
    return (
        (<Link
            href="/about"
            onClick={() => {
                console.log('clicked')
            }}
            download>
            Link
        </Link>)
    );
}