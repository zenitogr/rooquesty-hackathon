import React from 'react';

const ReactionInput = () => {
  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Add a reaction..."
        className="w-full p-2 border rounded"
      />
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </div>
  );
};

export default ReactionInput;