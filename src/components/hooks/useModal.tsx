import { useEffect, useState, type ReactNode } from "react"
import useScrollLock from "./scrollLock"

const Modal: React.FC<{ children: ReactNode; onClose: () => void }> = ({ children, onClose }) => {
    useScrollLock(true)

    // Close on Escape for keyboard accessibility.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onClose])

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => {
                // Only close when the backdrop itself is clicked, not the content.
                if (e.target === e.currentTarget) onClose()
            }}
        >
            {children}
        </div>
    )
}

export function useModal() {
    const [child, setChild] = useState<ReactNode>(null)

    const modal = (child: ReactNode) => {
        setChild(child)
    }

    const DisplayModal = () => (child ? <Modal onClose={() => setChild(null)}>{child}</Modal> : null)

    return { modal, DisplayModal }
}