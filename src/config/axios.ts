import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default AxiosInstance;
