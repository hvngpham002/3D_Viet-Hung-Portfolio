interface VersionMarkProps {
    version: string
}


const VersionMark = ({ version }: VersionMarkProps) => {
    return (
    <div className="fixed bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs sm:text-sm text-gray-500 z-50">
        v{version}
    </div>
    )
}

export default VersionMark;