import { ROUTING_DETAILS } from '../urls';
import { postRequest } from '../API';

export async function fetchRoutingDetails(data) {
  try {
    const response = await postRequest(ROUTING_DETAILS, data);
    if (response?.statusCode === '200') {
      return response.data;
    }
    throw Error(response?.data.message || 'Not Found');
  } catch (error) {
    throw error.message;
  }
}
