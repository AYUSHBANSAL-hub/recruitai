export default function Home() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Recruitment Platform</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Admin Portal</h2>
            <p className="text-gray-600 mb-4">
              Create and manage job forms, review applications, and track candidates.
            </p>
            <a
              href="/admin"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Access Admin Dashboard
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Candidate Portal</h2>
            <p className="text-gray-600 mb-4">
              View open positions and submit your application.
            </p>
            <a
              href="/jobs"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    );
  }