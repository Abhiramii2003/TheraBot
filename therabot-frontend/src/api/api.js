import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth',
});

export const registerUser = async (formData) => {
  try {
    const res = await API.post('/register', formData);
    return res.data;
  } catch (err) {
    return err.response?.data || { msg: 'Registration failed' };
  }
};

export const loginUser = async (formData) => {
  try {
    const res = await API.post('/login', formData);
    return res.data;
  } catch (err) {
    return err.response?.data || { msg: 'Login failed' };
  }
};

export const submitMood = async (data, token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/mood/submit`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { msg: 'Submission failed' };
  }
};

export const updateGameStreak = async (token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/games/streak`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error('Failed to update game streak:', error);
    return null;
  }
};

export const fetchGameStreak = async (token) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/streak`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.streak;
  } catch (error) {
    console.error('Failed to fetch game streak:', error);
    return 0;
  }
};

export const saveDiaryEntry = async (entry, token) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/diary/save`, entry, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Save error:", err);
    return null;
  }
};

export const fetchDiaryEntries = async (token) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/diary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
};

export const deleteDiaryEntry = async (entryId, token) => {
  try {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/diary/${entryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Delete error:", err);
    return null;
  }
};

export const updateDiaryEntry = async (entryId, updatedData, token) => {
  try {
    const res = await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/diary/${entryId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Update error:", err);
    return null;
  }
};
