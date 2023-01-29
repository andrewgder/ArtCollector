import React, { useEffect, useState } from "react";

/**
 * Don't touch these imports!
 */
import {
  fetchAllCenturies,
  fetchAllClassifications,
  fetchQueryResults,
} from "../api";

const Search = (props) => {
  // Make sure to destructure setIsLoading and setSearchResults from the props
  const { setIsLoading, setSearchResults } = props;
  /**
   * We are at the Search component, a child of app. This has a form, so we need to use useState for
   * our controlled inputs:
   *
   * centuryList, setCenturyList (default should be an empty array, [])
   * classificationList, setClassificationList (default should be an empty array, [])
   * queryString, setQueryString (default should be an empty string, '')
   * century, setCentury (default should be the string 'any')
   * classification, setClassification (default should be the string 'any')
   */
  const [centuryList, setCenturyList] = useState([]);
  const [classificationList, setClassificationList] = useState([]);
  const [queryString, setQueryString] = useState("");
  const [century, setCentury] = useState("any");
  const [classification, setClassification] = useState("any");

  /**
   * Inside of useEffect, use Promise.all([]) with fetchAllCenturies and fetchAllClassifications
   *
   * In the .then() callback pass the returned lists to setCenturyList and setClassificationList
   *
   * Make sure to console.error on caught errors from the API methods.
   */

  useEffect(() => {
    const getCenturiesAndClassifications = async () => {
      const centuries = await fetchAllCenturies();
      console.log("centuries", centuries);
      const classifications = await fetchAllClassifications();
      console.log("classifciations", centuries);
      const test = setCenturyList(centuries);
      setClassificationList(classifications);
    };
    getCenturiesAndClassifications();
  }, []);

  /**
   * This is a form element, so we need to bind an onSubmit handler to it which:
   *
   * calls event.preventDefault()
   * calls setIsLoading, set it to true
   *
   * then, in a try/catch/finally block:
   *
   * try to:
   * - get the results from fetchQueryResults({ century, classification, queryString })
   * - pass them to setSearchResults
   *
   * catch: error to console.error
   *
   * finally: call setIsLoading, set it to false
   */
  return (
    <form
      id="search"
      onSubmit={async (event) => {
        // write code here
        event.preventDefault();
        console.log("classfication:", classification);
        console.log("century:", century);
        setIsLoading(true);
        try {
          const searchResults = await fetchQueryResults({
            century,
            classification,
            queryString,
          });
          setSearchResults(searchResults);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <fieldset>
        <label htmlFor="keywords">Query</label>
        <input
          id="keywords"
          type="text"
          placeholder="enter keywords..."
          value={
            (queryString, console.log(queryString))
          } /* this should be the query string */
          onChange={(event) =>
            setQueryString(event.target.value)
          } /* this should update the value of the query string */
        />
      </fieldset>
      <fieldset>
        <label htmlFor="select-classification">
          Classification{" "}
          <span className="classification-count">
            ({classificationList.length})
          </span>
        </label>
        <select
          name="classification"
          id="select-classification"
          value={classification}
          onChange={(event) =>
            setClassification(event.target.value)
          } /* this should update the value of the classification */
        >
          <option value="any">Any</option>
          {
            classificationList.map((value) => (
              <option key={value.id}>{value.name}</option>
            )) /* map over the classificationList, return an <option /> */
          }
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor="select-century">
          Century <span className="century-count">({centuryList.length})</span>
        </label>
        <select
          name="century"
          id="select-century"
          value={century /* this should be the century */}
          onChange={
            (event) =>
              setCentury(
                event.target.value
              ) /* this should update the value of the century */
          }
        >
          <option value="any">Any</option>
          {
            centuryList.map((value) => (
              <option key={value.id}>{value.name}</option>
            )) /* map over the centuryList, return an <option /> */
          }
        </select>
      </fieldset>
      <button>SEARCH</button>
    </form>
  );
};

export default Search;
