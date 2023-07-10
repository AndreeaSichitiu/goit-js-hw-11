import axios from 'axios';


  export async function fetchImages(q, page, perPage) {
    const URL = "https://pixabay.com/api/";
    const KEY = "38046505-5b9e748b87046ce765cd21b85";
  
    const url = `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;          
};

 