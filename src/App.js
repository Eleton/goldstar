import { Fragment, useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import "./App.css";

const Container = styled.div`
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const StarContainer = styled.div`
  padding: 10px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 20px;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.5);
`;

const TableHead = styled.div`
  font-weight: bold;
`;

const StarButtonStyle = styled.button`
  border: 2px solid ${({ color }) => color};
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: ivory;
  color: ${({ selected, color }) => (selected ? color : "ivory")};
  font-weight: ${({ selected }) => selected && "bold"};
`;

const SubmitButton = styled.button`
  width: 100px;
  background-color: #209f97;
  border: 2px solid black;
  border-radius: 4px;
  color: ivory;
  font-weight: bold;
`;

const url =
  "https://sheet.best/api/sheets/a5375619-9fe9-45c9-ae14-4fede1d2b22f";

const StarButton = ({ children, id, selected, select, star, color }) => (
  <StarButtonStyle
    onClick={() =>
      selected.id === id && selected.star === star
        ? select(null, "")
        : select(id, star)
    }
    selected={selected.id === id && selected.star === star}
    color={color}
  >
    {children}
  </StarButtonStyle>
);

const App = () => {
  const [state, setState] = useState([]);
  const [selected, setSelected] = useState({ id: null, star: "" });
  const [updates, setUpdates] = useState(0);

  useEffect(() => {
    axios.get(url).then((res) => {
      const parsedState = res.data.map((s) => ({
        id: parseInt(s.id),
        name: s.name,
        gold_stars: parseInt(s.gold_stars),
        silver_stars: parseInt(s.silver_stars),
        bronze_stars: parseInt(s.bronze_stars),
        black_stars: parseInt(s.black_stars),
      }));
      setSelected({ id: null, star: "" });
      setState(parsedState);
    });
  }, [updates]);

  const select = (id, star) => setSelected({ id: id, star });

  const submit = () => {
    const currentValue = state.find((s) => s.id === selected.id)[
      `${selected.star}_stars`
    ];
    axios
      .patch(`${url}/${selected.id}`, {
        [`${selected.star}_stars`]: currentValue + 1,
      })
      .then(() => {
        setUpdates(updates + 1);
      });
  };

  return (
    <Container className="App">
      <h1>Gold Star</h1>
      <StarContainer>
        <TableHead>Name</TableHead>
        <TableHead>Gold</TableHead>
        <TableHead>Silver</TableHead>
        <TableHead>Bronze</TableHead>
        <TableHead>Dark</TableHead>
        {state.map((s) => (
          <Fragment key={s.id}>
            <div>{s.name}</div>
            <StarButton
              id={s.id}
              select={select}
              selected={selected}
              star="gold"
              color="gold"
            >
              {s.gold_stars}
            </StarButton>
            <StarButton
              id={s.id}
              select={select}
              selected={selected}
              star="silver"
              color="silver"
            >
              {s.silver_stars}
            </StarButton>
            <StarButton
              id={s.id}
              select={select}
              selected={selected}
              star="bronze"
              color="#cd7f32"
            >
              {s.bronze_stars}
            </StarButton>
            <StarButton
              id={s.id}
              select={select}
              selected={selected}
              star="black"
              color="black"
            >
              {s.black_stars}
            </StarButton>
          </Fragment>
        ))}
      </StarContainer>
      <SubmitButton onClick={submit}>Reward!</SubmitButton>
    </Container>
  );
};

export default App;
