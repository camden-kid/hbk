import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

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

  const onCatClick = (id: string) => {
    queryClient.refetchQueries({ queryKey: [catId] });
    setCatId(id);
  };

  return (
    <div className={styles.main}>
      <header>
        <h3>Random cats</h3>
      </header>
      {catIsPending && <p>Loading...</p>}
      {catError && <p>{JSON.stringify(catError)}</p>}
      {catData && (
        <main>
          <button onClick={() => onMore()}>Click for more!</button>
          <div className={styles.catsContainer}>
            <section className={styles.catsListSection}>
              <ul className={styles.catsList}>
                {catData.map((cat: Cat, index: number) => (
                  <li className={styles.catItem} key={cat.id}>
                    <button className={styles.catButton} onClick={() => onCatClick(cat.id)}>
                      <img
                        className={`${styles.catImage} ${catId === cat.id ? styles.catImageSelected : ""}`}
                        src={cat.url}
                        alt={`Cat ${index + 1}`}
                        title={`Cat ${index + 1}`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            {detailsData && (
              <section className={styles.catDetails}>
                <p>Cat information</p>
                <div>
                  Name: {detailsData.categories ? detailsData.categories[0].name : isDetailsPending ? "" : "Unknown"}
                </div>
              </section>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
