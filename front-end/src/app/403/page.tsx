export default function ForbiddenPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500">403</h1>
                <p className="mt-4 text-lg text-gray-600">Access Denied</p>
                <p className="mt-2 text-gray-500">
                    You do not have the required permissions to access this page.
                </p>
                <a
                    href="/"
                    className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-500"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
}
