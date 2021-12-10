import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Card from "react-bootstrap/Card";

import { ReactComponent as Logo } from "./search_icon.svg";

function App() {
  const [searchText, setSearchText] = React.useState("");
  const [movies, setMovies] = React.useState([]);
  const handleMovieSearch = async () => {
    try {
      let res = await fetch(
        `https://young-frog-81.loca.lt/?movie=${searchText}`
      );

      const json = await res.json();
      if (
        typeof json?.matches[0] === "string" &&
        json?.matches[0]?.includes("No results")
      ) {
        setMovies([{ title: "No matches found." }]);
        return;
      }
      fetchData(json.matches);
    } catch (error) {
      console.error(error);
    }
  };

  async function fetchData(matches) {
    try {
      const results = await Promise.all(
        matches.map((match) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${match.movie_id}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US`
          )
        )
      );

      const images = await Promise.all(
        results.map((element) => element.json())
      );

      const imgMatches = images.map((element, idx) => {
        matches[
          idx
        ].imgURL = `https://image.tmdb.org/t/p/w500/${element["poster_path"]}`;
        return matches[idx];
      });
      setMovies(imgMatches);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App d-flex justify-content-center align-items-center flex-column">
      <Form
        onSubmit={(evt) => {
          evt.preventDefault();
        }}
      >
        <Row className="align-items-center">
          <Col xs="auto">
            <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
              Movie name
            </Form.Label>
            <InputGroup className="mb-2">
              <FormControl
                id="inlineFormInputGroup"
                placeholder="Movie name..."
                onChange={(evt) => setSearchText(evt.target.value)}
                onKeyPress={(evt) => {
                  if (evt.charCode === 13) {
                    handleMovieSearch();
                  }
                }}
                autoComplete="false"
                autoFocus={true}
              />
              <Button
                variant="outline-secondary"
                id="button-addon1"
                onClick={handleMovieSearch}
              >
                <Logo />
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>
      <Row xs={8} md={10} className="g-4 mt-2 d-flex justify-content-center">
        {movies.map((match) => (
          <Col>
            <Card>
              {match.imgURL && (
                <Card.Img
                  variant="top"
                  src={match.imgURL}
                  height={250}
                  width={250}
                />
              )}
              <Card.Body>
                <Card.Title>{match.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default App;
