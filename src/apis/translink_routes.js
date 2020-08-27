import axios from "axios";

export default axios.create({
  baseURL: `${process.env.REACT_APP_TRANSLINK_BUSES_API_URL}`,
});
