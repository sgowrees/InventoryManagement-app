import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UpdateName: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${BACKEND_URL}/api/users/updateuser`,
        name,
        { withCredentials: true }
      );
      navigate('/setting');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Update Name</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new name"
          required
        />
        <button type="submit">Update</button>
      </form>
      <button type="button" onClick={() => navigate('/setting')}>
        Back to Settings
      </button>
    </div>
  );
};

export default UpdateName;
