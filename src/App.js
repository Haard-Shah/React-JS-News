import React, { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_KEY;

function getHeadline() {
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

  return fetch(url)
    .then((res) => res.json())
    .then((res) =>
      res.articles.map((x) => {
        return {
          url: x.url,
          title: x.title,
          image: x.urlToImage,
        };
      })
    );
}

function useHeadlines(search) {
  // NO LONGDER NEED THIS AS WE ARE USING FETCH
  // const fake_headlines = [
  //   {
  //     title: "Donald Trump recommendes shooting corono with AK-15's",
  //     url: "https://news.com/header1"
  //   },
  //   {
  //     title: "France surrenders to Coronavirus",
  //     url: "https://news.com/header2"
  //   },
  //   {
  //     title: "Betoota advocate has too many satire headlines",
  //     url: "https://news.com/header3"
  //   },
  //   {
  //     title: "Check Norris infected with Viru, virus now in quarantine",
  //     url: "https://news.com/header4"
  //   }
  // ];

  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(
    //This is the 'Effect', or funciton that runs
    () => {
      // //Set a timeout to fake network load
      // setTimeout(() => {
      //   setHeadlines(fake_headlines);
      //   setLoading(false);
      // }, 2000); //setheadline and loading to false after 2000ms

      //Do the real thing
      getHeadline()
        .then((headlines) => {
          setHeadlines(headlines);
          setLoading(false);
        })
        // if the fetching doesn't work due to some errors inform the user
        .catch((e) => {
          setError(e);
          setLoading(false);
        });
    },

    //These are the dependecies.
    []
  );

  return {
    headlines,
    loading,
    error,
  };
}

function Headline({ title, url, img }) {
  return (
    <div>
      <a
        href={url}
        className="mb-2 flex flex-col md:flex-row rounded border border-blue-600 text-blue-700 hover:bg-gray-700 hover:border-gray-900 hover:text-gray-100"
        target="_blank"
      >
        <div
          className={
            "w-auto h-32 md:h-auto md:w-32 md:flex-none bg-cover bg-center"
          }
          style={{ backgroundImage: `url(${img})` }}
        ></div>
        <h1 className="py-4 px-6 block font-semibold text-xl">{title}</h1>
      </a>
    </div>
  );
}

function SearchBar(props) {
  const [innerSearch, setinnerSearch] = useState("");
  return (
    <div>
      <form>
        <input
          aria-labelledby="search-button"
          type="text"
          name="search"
          id="search"
          value={innerSearch}
          onChange={(e) => {
            setinnerSearch(e.target.value);
          }}
        />
        <button onClick={(e) => props.onSearch(innerSearch)}>Search</button>
      </form>
    </div>
  );
}

function App() {
  const [search, setSearch] = useState("");
  const { headlines, loading, error } = useHeadlines();

  if (loading) {
    return (
      <div className="loading">
        <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading">
        <h1>There was a problem loading the headlines.</h1>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-900">
      <div className="pt-4 pb-10 mx-auto text-center">
        <h1 className="text-white text-5xl">World News</h1>
        <h2 className="text-gray-600 text-2xl">
          Built with React and Tailwind CSS
        </h2>
      </div>

      {/* <SearchBar onSearch={(value) => setSearch(value)} /> */}

      <div className="p-4 mx-auto max-w-3xl bg-gray-100 rounded">
        {headlines
          //fun addition to remove publich name
          .map((x) => {
            return {
              ...x,
              title: x.title.substring(0, x.title.lastIndexOf("-")),
            };
          })
          //parse the necessary object elements
          .map((headline) => (
            <Headline
              title={headline.title}
              url={headline.url}
              img={headline.image}
              key={headline.url}
            />
          ))}
      </div>
    </div>
  );
}

export default App;

// mitchell-johnson-pracs
