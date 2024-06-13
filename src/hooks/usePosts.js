import { useState, useEffect } from 'react';

const usePosts = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulando la obtención de datos desde una API o servicio externo
        const response = {
          "docs": [
            {
              "imagePost": {
                "publicId": "blogs/w2knqvb9zkljllndzrfv",
                "secureUrl": "https://res.cloudinary.com/duobgkpxw/image/upload/v1718247999/blogs/w2knqvb9zkljllndzrfv.png"
              },
              "_id": "666a623e43d77d926c721d84",
              "idUser": "666899ebc2ef7ee4af490547",
              "title": "mi primer post",
              "content": "este es mi primer post y quiero que salga bien",
              "comments": [],
              "createdAt": "2024-06-13T03:06:39.161Z",
              "updatedAt": "2024-06-13T03:06:39.161Z"
            },
            {
              "_id": "6669eb06e45a736d9cfebf3d",
              "idUser": "666899ebc2ef7ee4af490547",
              "title": "lalo2",
              "content": "prueba de un post nuevo de lalo2",
              "comments": [],
              "createdAt": "2024-06-12T18:37:58.165Z",
              "updatedAt": "2024-06-12T18:37:58.165Z"
            },
            {
              "_id": "6669e4f3e45a736d9cfebf36",
              "idUser": "666899ebc2ef7ee4af490547",
              "title": "lalo2",
              "content": "prueba de un post nuevo de lalo2",
              "comments": [],
              "createdAt": "2024-06-12T18:12:03.071Z",
              "updatedAt": "2024-06-12T18:12:03.071Z"
            }
          ],
          "totalDocs": 3,
          "limit": 10,
          "totalPages": 1,
          "page": 1,
          "pagingCounter": 1,
          "hasPrevPage": false,
          "hasNextPage": false,
          "prevPage": null,
          "nextPage": null
        };

        // Simulando la asignación de datos al estado
        setDataList(response.docs);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []); // La dependencia vacía asegura que se ejecute solo una vez al montar el componente

  return dataList;
};

export default usePosts;
