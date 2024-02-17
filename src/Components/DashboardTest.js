// App.js
import React from 'react';


const data = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  age: Math.floor(Math.random() * 30) + 20,
  email: `user${index + 1}@example.com`,
}));

const Table = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 border-b border-gray-300 z-10">ID</th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 border-b border-gray-300 z-10">Name</th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 border-b border-gray-300 z-10">Age</th>
            <th className="sticky top-0 bg-gray-100 px-6 py-3 border-b border-gray-300 z-10">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 border-b border-gray-300">{user.id}</td>
              <td className="px-6 py-4 border-b border-gray-300">{user.name}</td>
              <td className="px-6 py-4 border-b border-gray-300">{user.age}</td>
              <td className="px-6 py-4 border-b border-gray-300">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Table />
    </div>
  );
}

export default App;
