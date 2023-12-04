import { useQuery } from "@tanstack/react-query";
import styles from "./App.module.css";
import { useState } from "react";

interface Cat {
  id: string;
  url: string;
}

interface CatDetails {
  categories?: [
    {
      name: string;
    }
  ];
}

function App() {
  const [catId, setCatId] = useState("");

  const {
    isPending: catIsPending,
    error: catError,
    data: catData,
    refetch,
  } = useQuery<[Cat]>({
    queryKey: ["cats"],
    queryFn: () =>
      fetch(
        "https://api.thecatapi.com/v1/images/search?size=small&page=0&limit=10&&api_key=live_wT6xIe4PE5ig5PtVUQed7K4UM2421u2Fg5YWJnNxWMWElzHj5qAsdxH6qDEr9d0e"
      ).then((res) => res.json()),
  });

  const { isPending: isDetailsPending, data: detailsData } = useQuery<CatDetails>({
    queryKey: [catId],
    queryFn: () => fetch(`https://api.thecatapi.com/v1/images/${catId}`).then((res) => res.json()),
    enabled: !!catId,
  });

  const onMore = () => {
    setCatId("");
    refetch();
  };

  console.log(catIsPending, catData)

  return (
    <div className={styles.main}>
      <h3>
        Random cat images from Cat API -{" "}
        <a href="https://thecatapi.com/" target="_blank">
          https://thecatapi.com/
        </a>
      </h3>
      {catIsPending && <div>Loading...</div>}
      {catError && <div>{JSON.stringify(catError)}</div>}
      {catData && (
        <>
          <button onClick={() => onMore()}>Click for more!</button>
          <div className={styles.catsContainer}>
            <ul className={styles.catsList}>
              {catData.map((cat: Cat, index: number) => (
                <li className={styles.catItem} key={cat.id} onClick={() => setCatId(cat.id)}>
                  <img
                    className={`${styles.catImage} ${catId === cat.id ? styles.catImageSelected : ""}`}
                    src={cat.url}
                    alt={`cat${index}`}
                    title={`cat${index}`}
                  />
                </li>
              ))}
            </ul>
            {detailsData && (
              <div className={styles.catDetails}>
                <h4>Cat information</h4>
                <div className="">
                  Name: {detailsData.categories ? detailsData.categories[0].name : isDetailsPending ? "" : "Unknown"}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
