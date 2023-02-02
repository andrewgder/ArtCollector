import React, { Fragment } from "react";

// Don't touch this import
import { fetchQueryResultsFromTermAndValue } from "../api";

/**
 * We need a new component called Searchable which:
 *
 * Has a template like this:
 *
 * <span className="content">
 *  <a href="#" onClick={async (event) => {}}>SOME SEARCH TERM</a>
 * </span>
 *
 * You'll need to read searchTerm, searchValue, setIsLoading, and setSearchResults off of the props.
 *
 * When someone clicks the anchor tag, you should:
 *
 * - preventDefault on the event
 * - call setIsLoading, set it to true
 *
 * Then start a try/catch/finally block:
 *
 * try:
 *  - await the result of fetchQueryResultsFromTermAndValue, passing in searchTerm and searchValue
 *  - send the result to setSearchResults (which will update the Preview component)
 * catch:
 *  - console.error the error
 * finally:
 *  - call setIsLoading, set it to false
 */
const Searchable = (props) => {
  const { searchTerm, searchValue, setIsLoading, setSearchResults } = props;
  return (
    <span className="content">
      <a
        href="#"
        onClick={async (event) => {
          event.preventDefault();
          setIsLoading(true);
          try {
            const result = await fetchQueryResultsFromTermAndValue({
              searchTerm,
              searchValue,
            });
            setSearchResults(result);
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {searchValue}
      </a>
    </span>
  );
};

/**
 * We need a new component called Feature which looks like this when no featuredResult is passed in as a prop:
 *
 * <main id="feature"></main>
 *
 * And like this when one is:
 *
 * <main id="feature">
 *   <div className="object-feature">
 *     <header>
 *       <h3>OBJECT TITLE</h3>
 *       <h4>WHEN IT IS DATED</h4>
 *     </header>
 *     <section className="facts">
 *       <span className="title">FACT NAME</span>
 *       <span className="content">FACT VALUE</span>
 *       <span className="title">NEXT FACT NAME</span>
 *       <span className="content">NEXT FACT VALUE</span>
 *     </section>
 *     <section className="photos">
 *       <img src=IMAGE_URL alt=SOMETHING_WORTHWHILE />
 *     </section>
 *   </div>
 * </main>
 *
 * The different facts look like this: title, dated, images, primaryimageurl, description, culture, style,
 * technique, medium, dimensions, people, department, division, contact, creditline
 *
 * The <Searchable /> ones are: culture, technique, medium (first toLowerCase it), and person.displayname (one for each PEOPLE)
 *
 * NOTE: people and images are likely to be arrays, and will need to be mapped over if they exist
 *
 * This component should be exported as default.
 */
const Feature = (props) => {
  const { featuredResult, setIsLoading, setSearchResults } = props;
  //destructuring the featured result
  const {
    title,
    dated,
    culture,
    technique,
    medium,
    people,
    dimensions,
    department,
    division,
    contact,
    creditline,
    images,
  } = featuredResult || {};

  const person = (people && people[0]) || {};
  console.log("the featured result", featuredResult);
  return (
    <main id="feature">
      {featuredResult && (
        <div className="object-feature">
          <header>
            <h3>{title}</h3>
            <h4>{dated}</h4>
          </header>
          <section className="facts">
            <span className="title">Culture</span>
            <span className="content">
              <Searchable
                searchTerm={"culture"}
                searchValue={culture}
                setIsLoading={setIsLoading}
                setSearchResults={setSearchResults}
              />
            </span>
            {technique && (
              <>
                <span className="title">Technique</span>
                <span className="content">
                  <Searchable
                    searchTerm={"technique"}
                    searchValue={technique}
                    setIsLoading={setIsLoading}
                    setSearchResults={setSearchResults}
                  />
                </span>
              </>
            )}
            <span className="title">Medium</span>
            <span className="content">
              <Searchable
                searchTerm={"medium"}
                searchValue={medium}
                setIsLoading={setIsLoading}
                setSearchResults={setSearchResults}
              />
            </span>
            <span className="title">Dimensions</span>
            <span className="content">{dimensions}</span>

            <span className="title">Person</span>
            <span className="content">
              <Searchable
                searchTerm={"person"}
                searchValue={person.displayname}
                setIsLoading={setIsLoading}
                setSearchResults={setSearchResults}
              />
            </span>

            <span className="title">Department</span>
            <span className="content">{department}</span>
            <span className="title">Division</span>
            <span className="content">{division}</span>
            <span className="title">Contact</span>

            <a className="content" href={`mailto:${contact}`}>
              <span className="content">{contact}</span>
            </a>

            <span className="title">Credit</span>
            <span className="content">{creditline}</span>
          </section>
          <section className="photos">
            {images.map(
              ({ idsid, baseimageurl, alttext }) =>
                baseimageurl && (
                  <img key={idsid} src={baseimageurl} alt={alttext} />
                )
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default Feature;
