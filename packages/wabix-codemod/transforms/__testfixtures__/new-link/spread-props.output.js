import Link from 'wabix/link'

const linkProps = {}

export default function Page() {
    return <Link href="/about" className="link" {...linkProps}>about</Link>;
}
